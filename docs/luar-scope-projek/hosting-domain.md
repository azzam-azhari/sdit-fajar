# Informasi Domain, Hosting & Identitas Lembaga

## 1. Identitas Yayasan & Sekolah
- **Nama Yayasan**: Yayasan Karimatul Hasanah Al-Mubarak
- **Alamat**: Jl. Jati 3, Kelurahan Jatijajar, Kecamatan Tapos, Kota Depok, Jawa Barat
- **Email Resmi Yayasan**: `info@fajar.sch.id` / `yayasan@fajar.sch.id`

---

## 2. Struktur Domain Jaringan Sekolah

Yayasan mengelola beberapa unit pendidikan dengan skema domain `.sch.id` resmi:

| Entitas | Nama Unit | Domain / URL | Status Web |
|---|---|---|---|
| **Portal Yayasan** | Yayasan Fajar Harapan Indonesia | `https://fajar.sch.id` | Domain Utama / Holding |
| **SDIT (Proyek ini)** | **SDIT Fajar** | `https://sdit-fajar.sch.id` | **Web Utama & LMS (Production)** |
| **TKIT** | TKIT Fajar | `https://tk-fajar.sch.id` | Profil Unit TK |
| **SMPIT** | SMPIT Fajar | `https://smpit-fajar.sch.id` | Profil Unit SMP |

---

## 3. Infrastruktur & Hosting SDIT Fajar

Sesuai standar arsitektur LMS modern tanpa beban server lokal:

| Layanan | Provider | Akun / Identifier | Catatan |
|---|---|---|---|
| **Repository** | GitHub | `azzam-azhari/sdit-fajar` | Source code & CI/CD workflow |
| **Frontend & API Hosting** | Vercel | Project: `sditfajar` | Next.js App Router, Edge/Serverless Runtime |
| **Database & Auth** | Supabase | Project: `sditfajar` | PostgreSQL, Auth, Realtime, Storage |
| **DNS Management** | Cloudflare / Registrar .id | - | Kelola DNS A/CNAME record domain `sdit-fajar.sch.id` |

---

## 4. Konfigurasi URL Environment (SDIT Fajar)

### A. Production Environment
- **Web Publik & LMS**: `https://sdit-fajar.sch.id`
- **Dashboard URL**: `https://sdit-fajar.sch.id/dashboard/*`
- **Midtrans Payment Notification Webhook**:  
  `https://sdit-fajar.sch.id/api/webhooks/midtrans`
- **Supabase Auth Redirect URL**:  
  `https://sdit-fajar.sch.id/auth/callback`

### B. Development & Staging
- **Staging / Preview Vercel**: `https://sditfajar.vercel.app`
- **Local Development**: `http://localhost:3000`
- **Local Auth Callback**: `http://localhost:3000/auth/callback`

---

## 5. Standar Alamat Email Unit SDIT Fajar
- **Kontak Resmi Sekolah**: `info@sdit-fajar.sch.id`
- **Layanan Administrasi / TU**: `admin@sdit-fajar.sch.id`
- **Format Email Akun Demo Guru / Staf**: `[nama]@sditfajar.sch.id` (lihat `docs/PRD/18-seed-data.md`)
