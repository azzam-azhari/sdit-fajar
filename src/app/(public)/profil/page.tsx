import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Target, Compass, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";

export const metadata = {
  title: "Profil & Visi Misi — SDIT Fajar",
  description:
    "Profil lengkap, visi, misi, dan falsafah pendidikan Islam terpadu SDIT Fajar.",
};

export default function ProfilPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      
      <PageHeader
        title="Profil & Visi Misi"
        badge="Tentang Sekolah"
        description="Mengenal lebih dekat landasan nilai, falsafah pendidikan, dan cita-cita luhur SDIT Fajar dalam membina santri generasi Qur'ani."
      >
        <Button asChild variant="outline" size="sm" className="text-xs">
          <Link href="/profil/sejarah">Sejarah Pendirian</Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="text-xs">
          <Link href="/profil/manajemen">Dewan Asatidz & Pimpinan</Link>
        </Button>
      </PageHeader>

      {/* Sambutan Kepala Sekolah */}
      <section className="rounded-2xl border border-border/80 bg-card p-6 md:p-8 space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          Sambutan Kepala Sekolah
        </span>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
          Assalamu’alaikum Warahmatullahi Wabarakatuh
        </h2>
        <div className="space-y-3 text-xs md:text-sm text-muted-foreground leading-relaxed">
          <p>
            Segala puji bagi Allah Subhanahu wa Ta&apos;ala yang telah melimpahkan rahmat dan hidayah-Nya kepada kita semua. Shalawat serta salam senantiasa tercurah kepada junjungan kita, Nabi Muhammad Shallallahu &apos;Alaihi wa Sallam.
          </p>
          <p>
            SDIT Fajar hadir di tengah masyarakat sebagai ikhtiar nyata menjawab tantangan zaman dalam mempersiapkan anak-anak kita menjadi generasi yang tidak hanya unggul secara akademis dan teknologi, tetapi juga kokoh aqidahnya, luhur akhlaknya, dan mencintai kitab suci Al-Qur&apos;an.
          </p>
          <p>
            Dengan semangat kebersamaan antara sekolah, santri, dan para orang tua yang terjalin erat, kami berkomitmen memberikan lingkungan belajar yang aman, ramah, dan penuh kasih sayang demi melahirkan pemimpin masa depan yang bertauhid.
          </p>
        </div>
        <div className="pt-2 border-t border-border/60">
          <div className="font-bold text-sm text-foreground">
            Ustadz H. Muhammad Ridwan, Lc., M.Pd.
          </div>
          <div className="text-xs text-muted-foreground">
            Kepala Sekolah SDIT Fajar
          </div>
        </div>
      </section>

      {/* Visi & Misi Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Visi */}
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 md:p-8 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Target className="h-5 w-5" />
              <h3 className="text-base font-bold uppercase tracking-wider">
                Visi Sekolah
              </h3>
            </div>
            <p className="text-base md:text-lg font-semibold text-foreground leading-snug">
              &ldquo;Menjadi Sekolah Dasar Islam Terpadu Unggulan yang Melahirkan Generasi Qur’ani, Berakhlak Mulia, Cerdas, dan Mandiri pada Tahun 2030.&rdquo;
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Visi ini menjadi kompas bagi seluruh program akademik, pembiasaan karakter, dan kurikulum tahfidz di SDIT Fajar.
          </p>
        </div>

        {/* Misi */}
        <div className="rounded-xl border border-border/80 bg-card p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <Compass className="h-5 w-5" />
            <h3 className="text-base font-bold uppercase tracking-wider text-foreground">
              Misi Sekolah
            </h3>
          </div>
          <ul className="space-y-3 text-xs md:text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Menanamkan aqidah Islam yang lurus dan pembiasaan ibadah shahihah sesuai tuntunan Rasulullah SAW.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Melaksanakan pembelajaran tahsin dan tahfidz Al-Qur&apos;an terstandar dengan target minimal 3 Juz.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Menyelenggarakan proses pembelajaran aktif, kreatif, dan inovatif berlandaskan Kurikulum Nasional.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Membangun sinergi harmonis antara sekolah, orang tua, dan masyarakat dalam pembentukan karakter santri.
              </span>
            </li>
          </ul>
        </div>

      </div>

      {/* Nilai-Nilai Dasar */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Pilar Nilai
          </span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground mt-1">
            Nilai-Nilai Dasar Pendidikan
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="rounded-xl border border-border/80 bg-card p-5 space-y-2">
            <div className="text-primary font-bold text-lg font-mono">01. ADAB</div>
            <h4 className="text-sm font-semibold text-foreground">
              Mendahulukan Adab Sebelum Ilmu
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Santri dibimbing untuk menghormati guru, berbakti kepada orang tua, menyayangi sesama, dan menjaga tutur kata yang santun.
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-5 space-y-2">
            <div className="text-primary font-bold text-lg font-mono">02. QUR&apos;ANI</div>
            <h4 className="text-sm font-semibold text-foreground">
              Cinta Al-Qur&apos;an Sepanjang Hayat
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Membaca, menghafal, memahami arti, dan membiasakan diri mengamalkan ayat-ayat suci dalam kehidupan sehari-hari.
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-5 space-y-2">
            <div className="text-primary font-bold text-lg font-mono">03. CERDAS</div>
            <h4 className="text-sm font-semibold text-foreground">
              Nalar Kritis & Berwawasan Global
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Mampu berpikir analitis, menguasai ilmu pengetahuan umum, terampil menggunakan teknologi, serta percaya diri.
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-5 space-y-2">
            <div className="text-primary font-bold text-lg font-mono">04. MANDIRI</div>
            <h4 className="text-sm font-semibold text-foreground">
              Tangguh & Bertanggung Jawab
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Mampu mengurus keperluan pribadi, disiplin menjaga kebersihan, dan memiliki daya juang yang gigih dalam meraih cita-cita.
            </p>
          </div>

        </div>
      </section>

      {/* Navigation CTA */}
      <div className="pt-6 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          Ingin mengetahui riwayat pendirian dan perjalanan sekolah?
        </p>
        <Button asChild size="sm" className="text-xs bg-primary text-primary-foreground">
          <Link href="/profil/sejarah" className="flex items-center gap-1.5">
            <span>Baca Sejarah Sekolah</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

    </div>
  );
}
