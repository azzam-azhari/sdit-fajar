# Standar Kode

## Bahasa & Framework
- Gunakan TypeScript.
- Gunakan Next.js App Router.
- Gunakan Tailwind CSS.
- Gunakan Shadcn UI untuk komponen dasar.
- Gunakan Supabase client sesuai konteks.

## Struktur Folder

```text
src/
├── actions/
├── app/
│   ├── (public)/
│   ├── (auth)/
│   ├── (dashboard)/
│   └── api/
├── components/
│   ├── common/
│   └── ui/
├── configs/
├── constants/
├── hooks/
├── lib/
├── providers/
├── stores/
├── types/
└── validations/
```

## Naming
- Component React: PascalCase.
- Hook: `useSomething`.
- Server Action: `createSomethingAction`.
- Type: PascalCase.
- Constant: UPPER_SNAKE_CASE atau camelCase sesuai konteks.
- Route folder: lowercase kebab-case.
- Database table/column: snake_case.

## Import
Gunakan alias:

```ts
import { Button } from '@/components/ui/button'
```

Hindari relative import terlalu panjang seperti:

```ts
import { Button } from '../../../../components/ui/button'
```

## TypeScript
- Hindari `any`.
- Gunakan type domain di `src/types`.
- Gunakan Zod schema untuk validasi input.
- Derive type dari schema jika memungkinkan.

```ts
type AssignmentInput = z.infer<typeof assignmentSchema>
```

## Form
- Gunakan React Hook Form.
- Gunakan Zod resolver.
- Tampilkan error per field.
- Disable tombol saat submit.
- Beri toast success/error.

## Data Fetching
- Server Component untuk data awal jika memungkinkan.
- React Query untuk data client-side yang interaktif.
- Jangan fetch data sensitif langsung dari client tanpa RLS.

## Mutasi Data
- Gunakan Server Action untuk form dashboard.
- Cek role di server.
- Validasi input dengan Zod.
- Return response typed.
- Revalidate path/tag jika diperlukan.

## UI Standard
- Gunakan claymorphism style dari `04-tampilan-frontend.md`.
- Gunakan primary biru cerah.
- Semua card dashboard mengikuti bento grid.
- Empty, loading, error state wajib.

## Git & Commit
Format commit disarankan:
- `feat: add assignment management`
- `fix: prevent student access to other class`
- `docs: update database schema`
- `refactor: simplify dashboard shell`

## Larangan
- Jangan hardcode credential.
- Jangan expose service role key.
- Jangan membuat role baru sembarangan.
- Jangan membuat route baru tanpa dokumentasi.
- Jangan membuat tabel baru tanpa dokumentasi.
- Jangan ignore TypeScript error.
