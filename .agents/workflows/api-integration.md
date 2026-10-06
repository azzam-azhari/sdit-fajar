---
description: SOP pola fetch data, pembuatan Server Actions, validasi skema, dan error handling terstandar
---

# Workflow: Integrasi API & Server Actions (`/api-integration`)

Gunakan panduan standar operasional (SOP) ini saat mengintegrasikan mutasi data, pemanggilan Supabase, atau pembuatan Server Actions.

---

## 1. Standar Format Respons (`ActionResult<T>`)

Semua Server Action di `src/actions/` wajib mengembalikan tipe baku dari `@/types/action.types`:

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

---

## 2. Template Baku Server Action

Setiap Server Action wajib mengikuti urutan 5 langkah berikut:

```typescript
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { ActionResult } from '@/types/action.types';
import { myFeatureSchema, MyFeatureInput } from '@/validations/my-feature.schema';

export async function createMyFeatureAction(input: MyFeatureInput): Promise<ActionResult<{ id: string }>> {
  // Langkah 1: Autentikasi & Verifikasi Sesi
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: 'Sesi berakhir. Silakan login kembali.', code: 'UNAUTHORIZED' };
  }

  // Langkah 2: Otorisasi Role (Server-Side Guard)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk aksi ini.', code: 'FORBIDDEN' };
  }

  // Langkah 3: Validasi Payload Skema Zod
  const validation = myFeatureSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: 'Data yang dikirimkan tidak valid.',
      fieldErrors: validation.error.flatten().fieldErrors,
      code: 'VALIDATION_ERROR',
    };
  }

  // Langkah 4: Eksekusi Query Database
  const { data, error: dbError } = await supabase
    .from('my_table')
    .insert([validation.data])
    .select('id')
    .single();

  if (dbError) {
    return { success: false, error: dbError.message, code: 'SERVER_ERROR' };
  }

  // Langkah 5: Revalidasi Cache Halaman & Kembalikan Respons Sukses
  revalidatePath('/dashboard/admin/my-feature');
  return {
    success: true,
    data: { id: data.id },
    message: 'Data berhasil disimpan.',
  };
}
```

---

## 3. Pola Konsumsi di Client Component (React Query & Form)

Ketika mengonsumsi Server Action di Client Component:
1. Gunakan `useTransition` atau TanStack React Query `useMutation`.
2. Saat submit, tombol submit wajib berstatus `disabled` dan menampilkan indikator loading.
3. Tangani respons error spesifik:
   - Jika ada `fieldErrors`: Teruskan ke `setError` di React Hook Form.
   - Jika error umum: Tampilkan `toast.error(result.error)` via Sonner.
   - Jika sukses: Tampilkan `toast.success(result.message)` via Sonner, reset form, dan tutup modal/drawer jika relevan.

```typescript
const [isPending, startTransition] = useTransition();

const onSubmit = (values: MyFeatureInput) => {
  startTransition(async () => {
    const result = await createMyFeatureAction(values);
    if (!result.success) {
      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, messages]) => {
          form.setError(field as any, { message: messages[0] });
        });
      }
      toast.error(result.error);
      return;
    }
    toast.success(result.message || 'Berhasil disimpan!');
    form.reset();
  });
};
```

---

## 4. Pola Fetching Data (Server Component vs React Query)

- **Initial / SSR Fetch**: Gunakan Server Component langsung memanggil `createClient()` dari `@/lib/supabase/server`.
- **Client Cache & Interaktivitas**: Gunakan `@tanstack/react-query`:
  ```typescript
  export function useStudentsQuery(filters: StudentFilter) {
    return useQuery({
      queryKey: ['students', filters],
      queryFn: async () => {
        // Ambil data dari action atau client supabase
      },
      staleTime: 1000 * 60 * 5, // 5 menit
    });
  }
  ```
