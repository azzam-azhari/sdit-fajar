# State Management & Data Flow — SDIT Fajar

## 1. Strategi State Tiga Lapis (Three-Layer State)
Aplikasi SDIT Fajar membagi penyimpanan state menjadi 3 kategori terpisah agar aplikasi tetap ringan, responsif, dan mudah di-*maintain*:

1. **Server State (TanStack React Query v5)**: Seluruh data yang berasal dari Supabase (daftar murid, mutabaah tahfidz, invoice SPP, riwayat absensi).
2. **URL State (`useSearchParams` / `nuqs`)**: Seluruh filter tabel, nomor halaman (*pagination*), dan tab aktif yang perlu dapat dibagikan (*shareable* via URL).
3. **Client UI State (Zustand)**: State sementara antarmuka murni (status buka/tutup sidebar, modal dialog aktif, preview file sementara).

---

## 2. Server State: TanStack React Query

### A. Factory Query Keys Terpusat
Untuk mencegah invalidasi query yang salah sasaran, selalu gunakan factory pattern di `@/configs/query-keys.ts`:

```typescript
// src/configs/query-keys.ts
export const queryKeys = {
  students: {
    all: ['students'] as const,
    list: (filters: Record<string, any>) => ['students', 'list', filters] as const,
    detail: (id: string) => ['students', 'detail', id] as const,
  },
  attendance: {
    byClass: (classId: string, date: string) => ['attendance', classId, date] as const,
  },
  tahfidz: {
    byStudent: (studentId: string) => ['tahfidz', 'student', studentId] as const,
  },
  invoices: {
    byGuardian: (guardianId: string) => ['invoices', 'guardian', guardianId] as const,
  },
};
```

### B. Siklus Mutasi & Invalidation
Setiap mutasi Server Action yang dijalankan di client wajib memicu invalidasi query:
```typescript
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: createStudentAction,
  onSuccess: (res) => {
    if (res.success) {
      toast.success(res.message || 'Data berhasil disimpan.');
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all });
    } else {
      toast.error(res.error);
    }
  },
  onError: () => {
    toast.error('Terjadi kesalahan jaringan.');
  }
});
```

---

## 3. Client UI State: Zustand Stores

### Store Minimalis & Terisolasi:
Simpan store di folder `src/stores/`. Jangan menyimpan data database ke dalam Zustand.

```typescript
// src/stores/ui.store.ts
import { create } from 'zustand';

interface UIStore {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  selectedStudentIdForModal: string | null;
  setSelectedStudentIdForModal: (id: string | null) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  selectedStudentIdForModal: null,
  setSelectedStudentIdForModal: (id) => set({ selectedStudentIdForModal: id }),
}));
```

---

## 4. URL State: Filter & Pagination Tabel
Semua tabel data (Zebra Cross Tables) menggunakan URL search params agar saat halaman di-refresh, posisi halaman dan filter pencarian tidak hilang:
- `?page=1&limit=10&search=ahmad&class=1a`
- Saat berganti halaman atau mengetik kata kunci pencarian, perbarui parameter URL dengan `router.push` atau hook `nuqs`.

---

## 5. Standar Penanganan Loading & Error UI
1. **Loading State pada Tabel**:
   - Dilarang menggunakan spinner layar penuh.
   - Gunakan **Skeleton Baris Zebra**: Render baris tabel semu bergaris belang-selang dengan animasi `animate-pulse` halus selama data diambil.
2. **Empty State**:
   - Jika data kosong (`data.length === 0`), tampilkan kotak pesan minimalis: ikon netral Lucide, judul ringkas, dan teks bantuan (contoh: *"Belum ada data siswa untuk kelas ini"*).
3. **Notifikasi Toast**:
   - Gunakan **Sonner** (`toast.success`, `toast.error`, `toast.info`).
   - Jangan menggunakan alert bawaan browser (`window.alert`).
