import * as React from "react";
import Link from "next/link";
import { BookOpen, Award, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";
import { ZebraDataTable, ZebraColumn } from "@/components/common/zebra-data-table";
import { StatusBadge } from "@/components/common/status-badge";

export const metadata = {
  title: "Kurikulum & Program Tahfidz — SDIT Fajar",
  description:
    "Struktur kurikulum terpadu nasional, target hafalan tahfidz Juz 30-28, dan metode pembelajaran SDIT Fajar.",
};

interface TahfidzTargetItem {
  tingkat: string;
  targetHafalan: string;
  cakupanSurat: string;
  metode: string;
  evaluasi: string;
}

const TAHFIDZ_TARGETS: TahfidzTargetItem[] = [
  {
    tingkat: "Kelas 1",
    targetHafalan: "Juz 30 (Bagian 1)",
    cakupanSurat: "QS. An-Naas s.d. QS. Adh-Dhuha (22 Surat Pendek)",
    metode: "Talaqqi Harian + Pembiasaan Makhorijul Huruf",
    evaluasi: "Munaqasyah Semester",
  },
  {
    tingkat: "Kelas 2",
    targetHafalan: "Juz 30 (Bagian 2)",
    cakupanSurat: "QS. Al-Lail s.d. QS. An-Naba' (Tuntas Juz 30)",
    metode: "Talaqqi + Pengenalan Kaidah Tajwid Dasar",
    evaluasi: "Ujian Tasmi' Juz 30",
  },
  {
    tingkat: "Kelas 3",
    targetHafalan: "Juz 29 (Bagian 1)",
    cakupanSurat: "QS. Al-Mursalat s.d. QS. Al-Jin",
    metode: "Talaqqi Berpasangan (Ziyadah & Murajaah)",
    evaluasi: "Munaqasyah Semester",
  },
  {
    tingkat: "Kelas 4",
    targetHafalan: "Juz 29 (Bagian 2)",
    cakupanSurat: "QS. Nuh s.d. QS. Al-Mulk (Tuntas Juz 29)",
    metode: "Talaqqi Mandiri + Tasmi' Berantai",
    evaluasi: "Ujian Tasmi' Juz 29",
  },
  {
    tingkat: "Kelas 5",
    targetHafalan: "Juz 28 (Bagian 1)",
    cakupanSurat: "QS. At-Tahrim s.d. QS. As-Saff",
    metode: "Ziyadah Terstruktur + Murajaah 2 Juz",
    evaluasi: "Munaqasyah Semester",
  },
  {
    tingkat: "Kelas 6",
    targetHafalan: "Juz 28 (Bagian 2) & Pemantapan",
    cakupanSurat: "QS. Al-Mumtahanah s.d. QS. Al-Mujadilah (Tuntas 3 Juz)",
    metode: "Penguatan Hafalan 3 Juz Bil-Ghoib",
    evaluasi: "Wisuda Tahfidz Terbuka",
  },
];

const COLUMNS: ZebraColumn<TahfidzTargetItem>[] = [
  {
    header: "Tingkat",
    accessorKey: "tingkat",
    isMono: true,
    className: "font-semibold text-primary",
  },
  {
    header: "Target Hafalan",
    accessorKey: "targetHafalan",
    className: "font-medium text-foreground",
  },
  {
    header: "Cakupan Surat",
    accessorKey: "cakupanSurat",
    className: "text-muted-foreground",
  },
  {
    header: "Metode Bimbingan",
    accessorKey: "metode",
    className: "text-muted-foreground",
  },
  {
    header: "Evaluasi Akhir",
    cell: (item) => (
      <StatusBadge
        status={item.evaluasi}
        variant={item.evaluasi.includes("Wisuda") ? "success" : "info"}
      />
    ),
  },
];

export default function KurikulumPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">

      <PageHeader
        title="Kurikulum Terpadu & Tahfidz"
        badge="Akademik"
        description="Mengintegrasikan keunggulan Kurikulum Nasional Merdeka dengan pendalaman ilmu-ilmu syar'i dan standarisasi hafalan Al-Qur'an 3 Juz."
      >
        <Button asChild size="sm" className="text-xs bg-primary text-primary-foreground">
          <Link href="/pendaftaran">Daftar Murid Baru</Link>
        </Button>
      </PageHeader>

      {/* 3 Pilar Kurikulum */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Fondasi Belajar
          </span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground mt-1">
            Tiga Pilar Kurikulum Terpadu
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="rounded-xl border border-border/80 bg-card p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              1. Kurikulum Merdeka Nasional
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Memenuhi seluruh capaian kompetensi dasar dari Kemendikbudristek: Bahasa Indonesia, Matematika, IPAS, PJOK, Seni Budaya, dan Pancasila dengan pendekatan kontekstual berbasis pemecahan masalah.
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              2. Kurikulum Diniyah & Adab
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Materi keislaman mendalam: Aqidah Akhlak, Fiqih Ibadah sehari-hari, Tarikh Islam (Sirah Nabawiyah), dan Bahasa Arab praktis tematik agar murid memahami pondasi agamanya sejak dini.
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              3. Program Tahsin & Tahfidz
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Bimbingan talaqqi setiap pagi (07.00 – 08.30) oleh guru bersanad dengan rasio halaqah 1:12 murid untuk menjamin ketepatan makhraj, tajwid, dan kelancaran hafalan.
            </p>
          </div>

        </div>
      </section>

      {/* Tabel Standarisasi Target Hafalan (Wajib Zebra Cross) */}
      <section className="space-y-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Standarisasi Mutabaah
          </span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground mt-1">
            Matriks Target Hafalan Murid (Kelas 1 s.d. 6)
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Tabel berformat Zebra Cross dengan capaian bertahap per semester yang dipantau harian melalui mutabaah digital.
          </p>
        </div>

        <ZebraDataTable
          data={TAHFIDZ_TARGETS}
          columns={COLUMNS}
          caption="Matriks Kurikulum Tahfidz Al-Qur'an SDIT Fajar — Standar Kelulusan Minimal 3 Juz"
        />
      </section>

      {/* Metode Pembelajaran */}
      <section className="rounded-2xl border border-border/80 bg-card p-6 md:p-8 space-y-4">
        <h3 className="text-base font-bold text-foreground">
          Siklus Pembelajaran Al-Qur&apos;an Harian
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">

          <div className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-2">
            <div className="text-xs font-bold text-primary uppercase font-mono">
              Langkah 1: Ziyadah (Hafalan Baru)
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Murid menyetorkan 3-5 baris ayat baru kepada guru halaqah setelah tahsin makhraj dipastikan benar.
            </p>
          </div>

          <div className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-2">
            <div className="text-xs font-bold text-primary uppercase font-mono">
              Langkah 2: Murajaah Dekat
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Mengulang hafalan yang disetorkan 1 pekan terakhir secara berpasangan sesama murid (tasmi&apos; teman sebangku).
            </p>
          </div>

          <div className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-2">
            <div className="text-xs font-bold text-primary uppercase font-mono">
              Langkah 3: Murajaah Jauh &amp; Tasmi&apos;
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Penyetoran satu surat penuh atau 1 juz utuh tanpa melihat mushaf dalam ujian tasmi&apos; semester.
            </p>
          </div>

        </div>
      </section>

      {/* Navigation CTA */}
      <div className="pt-6 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          Ingin melihat kegiatan minat bakat dan ekstrakurikuler murid?
        </p>
        <Button asChild size="sm" className="text-xs bg-primary text-primary-foreground">
          <Link href="/ekstrakurikuler" className="flex items-center gap-1.5">
            <span>Lihat Ekstrakurikuler Murid</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

    </div>
  );
}
