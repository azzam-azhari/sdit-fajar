# AGENTS.md

Sebelum mengerjakan task apa pun, baca folder `docs/`.

## Urutan Baca Wajib
1. `docs/99-agent-instructions.md`
2. `docs/00-ringkasan-produk.md`
3. `docs/01-role-permission.md`
4. `docs/02-daftar-fitur-scope.md`
5. `docs/03-daftar-halaman.md`
6. `docs/04-tampilan-frontend.md`
7. `docs/08-skema-database-supabase.md`
8. `docs/10-backend.md`
9. `docs/19-testing-acceptance-criteria.md`

## Aturan Keras
- Jangan membuat role baru.
- Jangan membuat route baru tanpa update docs.
- Jangan membuat tabel/kolom baru tanpa update docs.
- Jangan mengubah tema visual tanpa instruksi eksplisit.
- Jangan mengaktifkan payment Midtrans; payment saat ini setup saja.
- Jangan expose secret ke client.
- Jangan mengandalkan frontend untuk security.

## Role Database Final
- `super_admin`
- `admin_sekolah`
- `kepala_sekolah`
- `guru`
- `wali_kelas`
- `siswa`
- `orang_tua`

## Tema UI Final
- Claymorphism.
- Bento grid.
- Primary biru cerah.
- Bahasa Indonesia.
