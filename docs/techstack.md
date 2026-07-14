# Tech Stack

## Core
- **Framework:** Next.js 16.2.7 (pastikan ada folder `/src`)
- **UI Library:** React 19.2.4 & React DOM 19.2.4
- **Language:** TypeScript (untuk type safety)

## Styling & UI Components
- **Styling:** Tailwind CSS 4
- **UI Components:** Shadcn UI, Radix UI
- **Icons:** Lucide React, Hugeicons React (`@hugeicons/react`)
- **Themes:** `next-themes`, `@teispace/next-themes` (untuk theme handling)

## State Management & Data Fetching
- **Global State:** Zustand (state management ringan)
- **Data Fetching:** TanStack React Query (`@tanstack/react-query` untuk fetching dan cache client-side)
- **Data Table:** TanStack React Table (`@tanstack/react-table` untuk tabel data admin)

## Backend & Database
- **Database / BaaS:** Supabase (`@supabase/ssr` dan `@supabase/supabase-js`)

## Form & Validation
- **Form Handling:** React Hook Form (`react-hook-form`)
- **Validation:** Zod (terintegrasi dengan `@hookform/resolvers`)

## Tambahan / Utilities
- **Charts:** Recharts (untuk chart dashboard)
- **Maps:** MapLibre GL (`maplibre-gl` untuk peta)
- **Notifications:** Sonner (untuk toast notification)


## 5. Struktur Folder Project
```text
.
├── docs/
├── note/
├── public/
│   ├── flag/
│   └── logo/
├── src/
│   ├── actions/
│   ├── app/
│   │   ├── (admin)/
│   │   ├── (auth)/
│   │   ├── (public)/
│   │   ├── _components/
│   │   └── api/
│   ├── components/
│   │   ├── common/
│   │   └── ui/
│   ├── configs/
│   ├── constants/
│   ├── hooks/
│   ├── lib/
│   │   └── supabase/
│   ├── migrations/
│   ├── providers/
│   ├── stores/
│   ├── types/
│   ├── validations/
│   └── proxy.ts
├── env.example
├── next.config.ts
├── package.json
└── tsconfig.json
```

Root file penting:
- `package.json`: script dan dependency.
- `next.config.ts`: konfigurasi Next.js.
- `tsconfig.json`: konfigurasi TypeScript dan alias `@/*`.
- `components.json`: konfigurasi Shadcn UI.
- `env.example`: contoh environment variable.
- `.env.local`: environment variable lokal, tidak boleh dibagikan.