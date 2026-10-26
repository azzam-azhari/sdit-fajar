import * as React from "react";
import Link from "next/link";
import { GraduationCap, Award, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";

export const metadata = {
  title: "Manajemen & Dewan Asatidz — SDIT Fajar",
  description:
    "Susunan pimpinan sekolah, dewan pembina yayasan, dan jajaran dewan asatidz SDIT Fajar.",
};

const LEADERS = [
  {
    name: "Ustadz H. Muhammad Ridwan, Lc., M.Pd.",
    role: "Kepala Sekolah",
    edu: "S1 Universitas Al-Azhar Kairo (Syariah) • S2 Manajemen Pendidikan Islam",
    desc: "Berpengalaman lebih dari 15 tahun dalam manajemen pendidikan Islam terpadu dan pembinaan generasi muda.",
  },
  {
    name: "Ustadzah Fatimah Azzahra, S.Pd., M.Si.",
    role: "Wakil Kepala Sekolah Bidang Kurikulum",
    edu: "S1 Pendidikan Guru SD (UPI) • S2 Evaluasi Pendidikan (UNJ)",
    desc: "Mendesain integrasi Kurikulum Merdeka berwawasan tauhid dan modul ajar terpadu tingkat sekolah dasar.",
  },
  {
    name: "Ustadz Ahmad Fauzan, S.Sos.I.",
    role: "Wakil Kepala Sekolah Bidang Kesiswaan",
    edu: "S1 Komunikasi Penyiaran Islam (UIN Syarif Hidayatullah Jakarta)",
    desc: "Memimpin pembinaan karakter santri, kepanduan Pramuka SIT, dan kegiatan ekstrakurikuler sekolah.",
  },
  {
    name: "Ustadz Hafizh Al-Bantani, Al-Hafizh",
    role: "Koordinator Tahfidz Al-Qur'an",
    edu: "Kulliyatul Qur'an • Sanad Hafalan Qira'at 'Ashim riwayat Hafsh",
    desc: "Membimbing dan mengawal standarisasi bacaan tahsin serta target hafalan 3 Juz santri SDIT Fajar.",
  },
];

const TEACHERS = [
  { name: "Ustadzah Nurul Hidayah, S.Pd.", role: "Wali Kelas 1 & Guru Tematik" },
  { name: "Ustadz Dedi Kurniawan, S.Si.", role: "Guru Sains & Pembina Robotic" },
  { name: "Ustadzah Siti Aisyah, S.Hum.", role: "Guru Bahasa Arab & Tahsin" },
  { name: "Ustadz Zulfikar, S.Pd.", role: "Guru Pendidikan Jasmani & Pembina Panahan" },
  { name: "Ustadzah Rina Maryana, S.Pd.", role: "Wali Kelas 3 & Guru Matematika" },
  { name: "Ustadz Salman Al-Farisi, S.Kom.", role: "Laboratorium Komputer & Operator Sistem" },
];

export default function ManajemenPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      
      <PageHeader
        title="Manajemen & Dewan Asatidz"
        badge="Struktur Organisasi"
        description="Mengenal figur-figur pendidik profesional, amanah, dan berdedikasi yang membimbing santri SDIT Fajar setiap hari."
      >
        <Button asChild variant="outline" size="sm" className="text-xs">
          <Link href="/profil">Profil & Visi Misi</Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="text-xs">
          <Link href="/profil/sejarah">Sejarah Sekolah</Link>
        </Button>
      </PageHeader>

      {/* Pimpinan Inti */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Jajaran Pimpinan
          </span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground mt-1">
            Pimpinan Sekolah & Koordinator
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {LEADERS.map((leader, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border/80 bg-card p-6 space-y-3 transition-all hover:border-foreground/20 hover:shadow-xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-semibold text-primary uppercase tracking-wider bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                    {leader.role}
                  </span>
                  <h3 className="text-base font-bold text-foreground mt-2">
                    {leader.name}
                  </h3>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
                  <GraduationCap className="h-5 w-5" />
                </div>
              </div>

              <div className="text-xs text-muted-foreground font-mono bg-muted/30 p-2 rounded border border-border/50">
                {leader.edu}
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {leader.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Dewan Pengajar */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Pendidik & Tenaga Kependidikan
          </span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground mt-1">
            Dewan Asatidz & Wali Kelas
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Didukung oleh 34 guru berkompeten dengan dedikasi tinggi pada pendidikan islami.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEACHERS.map((teacher, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border/80 bg-card p-4 space-y-1.5 transition-all hover:border-foreground/20"
            >
              <div className="font-semibold text-xs text-foreground">
                {teacher.name}
              </div>
              <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>{teacher.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Komitmen Pendidik */}
      <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8 space-y-3">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Standar Kualifikasi Tenaga Pendidik
        </h3>
        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
          Seluruh asatidz di SDIT Fajar wajib melalui proses seleksi ketat meliputi: kelancaran membaca Al-Qur&apos;an bertajwid, komitmen aqidah shahihah, kompetensi pedagogik sarjana pendidikan linier, serta sertifikasi berkala pembinaan karakter Islam terpadu.
        </p>
      </section>

    </div>
  );
}
