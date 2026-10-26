import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Award,
  Users,
  Sparkles,
  CheckCircle2,
  Calendar,
  ChevronRight,
  ShoppingBag,
  HelpCircle,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/common/stat-card";
import { StatusBadge } from "@/components/common/status-badge";

export const metadata = {
  title: "Beranda — SDIT Fajar",
  description:
    "Portal resmi SDIT Fajar. Sekolah Islam Terpadu berakreditasi A yang mendidik santri berakhlak mulia, cerdas, dan penghafal Al-Qur'an.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-20">

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-8 border-b border-border/60 bg-gradient-to-b from-primary/5 via-transparent to-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">

            {/* PPDB Alert Pill */}
            <Link
              href="/pendaftaran"
              className="group inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary transition-all hover:bg-primary/15"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span>PPDB TP 2026/2027 Telah Dibuka</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-foreground/80 group-hover:text-foreground">
                Kuota Terbatas 100 Santri
              </span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>

            {/* Main Title */}
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.15]">
              Mendidik Generasi{" "}
              <span className="text-primary underline decoration-primary/30 underline-offset-8">
                Qur’ani
              </span>
              , Cerdas & Berakhlak Mulia
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Sekolah dasar Islam terpadu yang memadukan keunggulan akademik
              Kurikulum Nasional dengan pembinaan tahfidz Al-Qur’an terstruktur dan penanaman adab islami sejak dini.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full sm:w-auto">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto h-11 px-6 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
              >
                <Link href="/pendaftaran" className="flex items-center gap-2">
                  <span>Daftar PPDB Online</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-11 px-6 text-sm font-medium border-border hover:bg-muted"
              >
                <Link href="/kurikulum">Pelajari Kurikulum Kami</Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-muted-foreground border-t border-border/80 w-full max-w-xl">
              <div className="flex items-center justify-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Terakreditasi A (Unggul)</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Target Min. 3 Juz</span>
              </div>
              <div className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Rasio Guru 1:15</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            title="Santri Aktif"
            value="428"
            description="Tingkat 1 sampai dengan Kelas 6"
            isMono
            icon={<Users className="h-5 w-5" />}
          />
          <StatCard
            title="Dewan Asatidz"
            value="34"
            description="Pendidik bersertifikasi & hafizh"
            isMono
            icon={<Award className="h-5 w-5" />}
          />
          <StatCard
            title="Target Hafalan"
            value="3 Juz"
            description="Juz 30, 29, dan 28 terstandar"
            isMono
            icon={<BookOpen className="h-5 w-5" />}
          />
          <StatCard
            title="Sisa Kuota PPDB"
            value="32 Kursi"
            description="Dari total 100 kursi gelombang 1-3"
            isMono
            trend={{ value: "68% Terisi", isPositive: true }}
            icon={<Sparkles className="h-5 w-5" />}
          />
        </div>
      </section>

      {/* 3. PROGRAM UNGGULAN */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Keunggulan Sekolah
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl mt-1">
              Program Unggulan Terpadu
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
              Dirancang sistematis untuk menyeimbangkan kecerdasan intelektual, kemandirian karakter, dan kedalaman spiritual santri.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs">
            <Link href="/kurikulum" className="flex items-center gap-1 text-primary">
              <span>Detail Semua Program</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="rounded-xl border border-border/80 bg-card p-6 space-y-3 transition-all hover:border-primary/50 hover:shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              Tahfidz & Tahsin Qur’an
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Bimbingan intensif talaqqi harian dengan target hafalan Juz 30, 29, dan 28, dilengkapi mutabaah digital orang tua.
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-6 space-y-3 transition-all hover:border-primary/50 hover:shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              Kurikulum Merdeka SIT
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Integrasi kurikulum Kementerian Pendidikan dengan nilai-nilai tauhid dan pembelajaran berbasis proyek islami.
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-6 space-y-3 transition-all hover:border-primary/50 hover:shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              Bina Pribadi Islami (BPI)
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Halaqah pekanan pendampingan adab makan, shalat dhuha/dhuhur berjamaah, kejujuran, dan pembiasaan dzikir ma&apos;tsurat.
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-6 space-y-3 transition-all hover:border-primary/50 hover:shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              Bilingual & Sains Modern
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Pengayaan kosa kata tematik Bahasa Arab dan Bahasa Inggris serta eksplorasi laboratorium sains dan robotic dasar.
            </p>
          </div>

        </div>
      </section>

      {/* 4. PPDB BANNER & SISA KURSI */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">

            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <StatusBadge status="Gelombang 2 Aktif" variant="info" dot />
                <span className="text-xs text-muted-foreground font-mono">
                  Batas Akhir: 30 November 2026
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Penerimaan Peserta Didik Baru (PPDB) 2026/2027
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
                Kuota siswa baru dibatasi ketat <strong>100 murid (4 rombel)</strong> untuk menjaga rasio pendampingan guru maksimal. Pendaftaran dilakukan secara daring dan verifikasi berkas langsung oleh panitia.
              </p>

              {/* Progress Bar Kuota */}
              <div className="space-y-1.5 max-w-md">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-muted-foreground">Kursi Terisi: 68</span>
                  <span className="font-semibold text-primary">Sisa: 32 Kursi</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: "68%" }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <Button
                asChild
                size="lg"
                className="w-full text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-11"
              >
                <Link href="/pendaftaran" className="flex items-center justify-center gap-2">
                  <span>Isi Formulir Pendaftaran</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full text-xs font-medium h-11"
              >
                <Link href="/pendaftaran/status">Cek Status Pendaftaran</Link>
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* 5. BERITA & PENGUMUMAN TERBARU */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Kabar Sekolah
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl mt-1">
              Berita & Agenda Terkini
            </h2>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs">
            <Link href="/berita" className="flex items-center gap-1 text-primary">
              <span>Lihat Semua Berita</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <article className="group rounded-xl border border-border/80 bg-card p-5 space-y-3 transition-all hover:border-foreground/20 hover:shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="text-primary font-semibold">Prestasi</span>
                <span>•</span>
                <span className="font-mono flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> 24 Okt 2026
                </span>
              </div>
              <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                Santri SDIT Fajar Raih Juara 1 MHQ Tingkat Kota Depok
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                Ananda Rayyan Al-Ghifari santri kelas 5 berhasil menyabet medali emas pada ajang Musabaqah Hifdzil Qur&apos;an kategori 2 Juz antar SD/MI.
              </p>
            </div>
            <Link
              href="/berita/santri-raih-juara-1-mhq-depok"
              className="text-xs font-semibold text-primary inline-flex items-center gap-1 pt-2"
            >
              <span>Baca Selengkapnya</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </article>

          <article className="group rounded-xl border border-border/80 bg-card p-5 space-y-3 transition-all hover:border-foreground/20 hover:shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="text-emerald-600 font-semibold">Kegiatan</span>
                <span>•</span>
                <span className="font-mono flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> 18 Okt 2026
                </span>
              </div>
              <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                Market Day Edukasi: Menumbuhkan Jiwa Wirausaha Islami
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                Santri kelas 4 dan 5 mempraktikkan muamalah jual beli syar&apos;i secara langsung dalam kegiatan Market Day sekolah yang meriah.
              </p>
            </div>
            <Link
              href="/berita/market-day-edukasi-wirausaha-islami"
              className="text-xs font-semibold text-primary inline-flex items-center gap-1 pt-2"
            >
              <span>Baca Selengkapnya</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </article>

          <article className="group rounded-xl border border-border/80 bg-card p-5 space-y-3 transition-all hover:border-foreground/20 hover:shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="text-amber-600 font-semibold">Pengumuman</span>
                <span>•</span>
                <span className="font-mono flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> 10 Okt 2026
                </span>
              </div>
              <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                Sosialisasi Program Pembiasaan Adab & Shalat Dhuha
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                Pertemuan rutin komite dan wali murid membahas evaluasi mutabaah ibadah harian santri di rumah dan di sekolah.
              </p>
            </div>
            <Link
              href="/berita/sosialisasi-program-adab-ibadah"
              className="text-xs font-semibold text-primary inline-flex items-center gap-1 pt-2"
            >
              <span>Baca Selengkapnya</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </article>

        </div>
      </section>

      {/* 6. TESTIMONI WALI MURID */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Kata Mereka
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl mt-1">
            Testimoni Wali Murid
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Pengalaman nyata orang tua mempercayakan putra-putrinya di SDIT Fajar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="rounded-xl border border-border/80 bg-card p-6 space-y-4">
            <Quote className="h-6 w-6 text-primary/40" />
            <p className="text-xs text-muted-foreground italic leading-relaxed">
              &ldquo;Alhamdulillah, perkembangan adab dan hafalan anak saya meningkat sangat pesat. Di rumah dia sekarang terbiasa shalat tepat waktu dan rajin murajaah sendiri tanpa disuruh.&rdquo;
            </p>
            <div className="pt-2 border-t border-border/60">
              <div className="font-semibold text-xs text-foreground">Ibu Kurniawati, S.Pd.</div>
              <div className="text-[11px] text-muted-foreground">Wali dari Faris (Kelas 4)</div>
            </div>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-6 space-y-4">
            <Quote className="h-6 w-6 text-primary/40" />
            <p className="text-xs text-muted-foreground italic leading-relaxed">
              &ldquo;Guru-gurunya sangat sabar dan komunikatif. Adanya dashboard pemantauan nilai dan mutabaah hafalan memudahkan kami memantau perkembangan harian dari kantor.&rdquo;
            </p>
            <div className="pt-2 border-t border-border/60">
              <div className="font-semibold text-xs text-foreground">Bpk. Hendra Wijaya, M.T.</div>
              <div className="text-[11px] text-muted-foreground">Wali dari Aisyah (Kelas 2)</div>
            </div>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-6 space-y-4">
            <Quote className="h-6 w-6 text-primary/40" />
            <p className="text-xs text-muted-foreground italic leading-relaxed">
              &ldquo;Kurikulumnya sangat seimbang antara sains akademik dan nilai Qur&apos;ani. Anak saya tidak merasa terbebani dan selalu antusias pergi ke sekolah setiap pagi.&rdquo;
            </p>
            <div className="pt-2 border-t border-border/60">
              <div className="font-semibold text-xs text-foreground">Ibu dr. Rahmawati</div>
              <div className="text-[11px] text-muted-foreground">Wali dari Zaidan (Kelas 1)</div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. MARKETPLACE TEASER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border/80 bg-card p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Marketplace & Buku Terbitan Sekolah
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Dapatkan mushaf tahfidz resmi, buku mutabaah harian, panduan doa, dan seragam sekolah langsung di etalase resmi SDIT Fajar.
              </p>
            </div>
          </div>
          <Button asChild size="sm" variant="outline" className="shrink-0 text-xs font-semibold">
            <Link href="/marketplace" className="flex items-center gap-1.5">
              <span>Buka Marketplace</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Tanya Jawab
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl mt-1">
            Pertanyaan yang Sering Diajukan
          </h2>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border/80 bg-card p-5 space-y-2">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-primary shrink-0" />
              Berapa kuota penerimaan murid baru setiap tahunnya?
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed pl-6">
              SDIT Fajar membatasi kuota tepat 100 santri baru setiap tahun ajaran (terbagi ke dalam 4 rombel kelas, masing-masing 25 santri) demi menjaga efektivitas pembelajaran talaqqi dan pendampingan personal guru.
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-5 space-y-2">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-primary shrink-0" />
              Apakah calon siswa harus sudah hafal huruf hijaiyah saat mendaftar?
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed pl-6">
              Tidak wajib. Tim asatidz akan melakukan tes pemetaan kesiapan belajar dan penempatan kelas tahsin yang ramah anak saat observasi, sehingga santri akan dibimbing bertahap dari tingkat dasar.
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-5 space-y-2">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-primary shrink-0" />
              Bagaimana alur pembayaran SPP dan biaya pendidikan?
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed pl-6">
              Seluruh tagihan SPP dan daftar ulang dikelola transparan melalui portal resmi orang tua terhubung dengan payment gateway Midtrans (Snap Modal) yang mendukung Virtual Account bank dan QRIS.
            </p>
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-primary/30 bg-primary/5 dark:bg-primary/10 p-8 sm:p-12 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Wujudkan Pendidikan Terbaik untuk Buah Hati Anda
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Bergabunglah bersama keluarga besar SDIT Fajar dan saksikan tumbuh kembang buah hati menjadi generasi Qur’ani yang membanggakan.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="w-full sm:w-auto text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6">
              <Link href="/pendaftaran">Daftar Sekarang (PPDB 2026/2027)</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-xs font-medium h-11 px-6">
              <Link href="/kontak">Hubungi Kami & Kunjungan Sekolah</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
