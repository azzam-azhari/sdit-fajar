# API & Server Actions Contract — SDIT Fajar

## 1. Arsitektur Komunikasi Data
Next.js App Router di proyek SDIT Fajar menggunakan 2 model komunikasi:
1. **Server Actions (`src/actions/`)**: Pola utama untuk seluruh mutasi data (Form submissions, update status, CRUD data internal).
2. **Route Handlers (`src/app/api/`)**: Dikhususkan untuk webhook pihak ketiga (Midtrans), sinkronisasi sistem, dan export PDF/CSV.

---

## 2. Format Respons Baku (Server Action Return Type)
Semua Server Action wajib mengembalikan objek TypeScript bertipe `ActionResult<T>`:

```typescript
// src/types/action.types.ts
export type ActionSuccess<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ActionError = {
  success: false;
  error: string;
  fieldErrors?: Record<string, string[]>;
  code?: 'UNAUTHORIZED' | 'FORBIDDEN' | 'VALIDATION_ERROR' | 'NOT_FOUND' | 'SERVER_ERROR';
};

export type ActionResult<T> = ActionSuccess<T> | ActionError;
```

### Template Penulisan Server Action yang Benar:
```typescript
'use server';

import { createClient } from '@/lib/supabase/server';
import { studentSchema, StudentInput } from '@/validations/student.schema';
import { ActionResult } from '@/types/action.types';
import { revalidatePath } from 'next/cache';

export async function createStudentAction(input: StudentInput): Promise<ActionResult<{ id: string }>> {
  // 1. Validasi Auth & Role
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Silakan login terlebih dahulu.', code: 'UNAUTHORIZED' };
  }

  // 2. Validasi Skema Zod
  const validation = studentSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: 'Data yang dimasukkan tidak valid.',
      fieldErrors: validation.error.flatten().fieldErrors,
      code: 'VALIDATION_ERROR',
    };
  }

  // 3. Eksekusi Query Database
  const { data, error } = await supabase
    .from('students')
    .insert([validation.data])
    .select('id')
    .single();

  if (error) {
    return { success: false, error: error.message, code: 'SERVER_ERROR' };
  }

  // 4. Revalidasi Cache
  revalidatePath('/dashboard/admin/siswa');
  return { success: true, data: { id: data.id }, message: 'Data siswa berhasil disimpan.' };
}
```

---

## 3. Integrasi Pembayaran Midtrans

### A. Server Action: Inisiasi Snap Token
- **Action:** `createPaymentSnapAction(invoiceId: string)`
- **Akses:** Khusus role `wali_murid`.
- **Alur:**
  1. Cek apakah invoice berstatus `unpaid` pada tabel `payment_invoices`.
  2. Verifikasi apakah anak terdaftar di `parent_students` akun wali terkait.
  3. Panggil Midtrans Snap API dengan payload:
     - `transaction_details: { order_id: string, gross_amount: number }`
     - `customer_details: { first_name: string, email: string, phone: string }`
  4. Simpan record di tabel `payment_transactions` dengan status `pending`.
  5. Kembalikan `snap_token` ke frontend.
- **Client Execution (Snap Popup Modal):**
  Frontend memanggil popup modal langsung di atas dashboard wali murid tanpa redirect tab:
  ```typescript
  window.snap.pay(snapToken, {
    onSuccess: (result) => { toast.success('Pembayaran berhasil!'); queryClient.invalidateQueries(); },
    onPending: (result) => { toast.info('Menunggu penyelesaian pembayaran.'); },
    onError: (result) => { toast.error('Pembayaran gagal atau dibatalkan.'); },
    onClose: () => { toast.warning('Jendela pembayaran ditutup.'); }
  });
  ```

### B. Route Handler: Webhook Midtrans
- **Endpoint:** `POST /api/webhooks/midtrans`
- **Keamanan:** Wajib memvalidasi Signature Key sebelum melakukan update database.
- **Formula Validasi Signature:**
  ```typescript
  import crypto from 'crypto';

  const signatureString = `${order_id}${status_code}${gross_amount}${process.env.MIDTRANS_SERVER_KEY}`;
  const computedSignature = crypto.createHash('sha512').update(signatureString).digest('hex');

  if (computedSignature !== signature_key) {
    return new Response('Invalid Signature', { status: 401 });
  }
  ```
- **Alur Pembaruan Status:**
  - `settlement` / `capture` (accept) -> Update `payment_transactions.status = 'paid'`, `payment_invoices.status = 'paid'`, buat record `payment_receipts`.
  - `expire` / `cancel` / `deny` -> Update `payment_transactions.status = 'failed'`, `payment_invoices.status = 'unpaid'`.

### C. Kuitansi Pembayaran (Web Print-Friendly)
- **Halaman:** `/dashboard/wali-murid/payment/[invoiceId]/receipt`
- **Format:** Halaman web kuitansi formal berstandar sekolah, dilengkapi tombol *Cetak / Simpan PDF* (`window.print()`).
- Menggunakan styling `@media print` murni untuk menyembunyikan navigasi/sidebar dan menyajikan tata letak kertas A4 kuitansi bersih.

---

## 4. Alur Autentikasi Khusus Murid
- **Endpoint / Action:** `loginStudentAction({ nis: string, password: string })`
- **Alur:**
  1. Cari `login_identifier = nis` pada tabel `profiles` dengan role `murid`.
  2. Autentikasi dengan Supabase Auth via email terdaftar internal.
  3. Cek flag `must_change_password`:
     - Jika `true`: Arahkan langsung ke halaman `/ganti-password` untuk penggantian password wajib sebelum membuka dashboard.
     - Jika `false`: Arahkan ke `/dashboard/murid`.
