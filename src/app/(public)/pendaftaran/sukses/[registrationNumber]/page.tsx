"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Printer,
  CheckCircle2,
  GraduationCap,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PendaftaranSuksesPage() {
  const params = useParams();
  const regNumber = (params?.registrationNumber as string) || "REG-2026-1001";

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      
      {/* Action Bar (Hidden on Print) */}
      <div className="print:hidden flex items-center justify-between pb-4 border-b border-border/80">
        <Button asChild variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
          <Link href="/pendaftaran" className="flex items-center gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Beranda PPDB</span>
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Button
            onClick={handlePrint}
            className="text-xs font-semibold h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Cetak Bukti Pendaftaran (PDF / Print)</span>
          </Button>
        </div>
      </div>

      {/* Printable Sheet Container */}
      <div className="rounded-2xl border border-border/80 bg-card p-8 sm:p-12 space-y-8 shadow-xs print:border-none print:shadow-none print:p-0">
        
        {/* Letterhead (Kop Dokumen) */}
        <div className="flex items-center justify-between border-b-2 border-foreground/80 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground leading-none">
                SDIT FAJAR CILODONG
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Jl. Cempaka No. 12, Kel. Sukamaju, Kec. Cilodong, Kota Depok, Jawa Barat 16415
              </p>
              <p className="text-[11px] font-mono text-muted-foreground">
                NPSN: 10814529 • Telp: (021) 7788-9900 • Website: sditfajar.sch.id
              </p>
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              Dokumen Resmi PPDB
            </div>
            <div className="text-xs font-bold text-emerald-600 font-mono mt-0.5">
              TERVERIFIKASI
            </div>
          </div>
        </div>

        {/* Title & Registration Code */}
        <div className="text-center space-y-2 py-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            Bukti Tanda Terima Pendaftaran Santri Baru
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight pt-2">
            TAHUN PELAJARAN 2026 / 2027
          </h1>
          <div className="inline-block rounded-xl border border-border bg-muted/30 px-6 py-2 mt-2">
            <span className="text-[11px] text-muted-foreground block">
              NOMOR REGISTRASI RESMI:
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-foreground tracking-widest">
              {regNumber}
            </span>
          </div>
        </div>

        {/* Data Calon Santri Table */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground border-b border-border/60 pb-1">
            A. Data Calon Santri
          </h3>
          <table className="w-full text-xs border-collapse">
            <tbody className="divide-y divide-border/60">
              <tr>
                <td className="py-2 text-muted-foreground w-1/3">Nama Lengkap</td>
                <td className="py-2 font-bold text-foreground">Ahmad Azzam Fauzi</td>
              </tr>
              <tr>
                <td className="py-2 text-muted-foreground">Nomor Induk Kependudukan (NIK)</td>
                <td className="py-2 font-mono text-foreground">3276011405190002</td>
              </tr>
              <tr>
                <td className="py-2 text-muted-foreground">Tempat, Tanggal Lahir</td>
                <td className="py-2 text-foreground">Depok, 14 Mei 2020</td>
              </tr>
              <tr>
                <td className="py-2 text-muted-foreground">Jenis Kelamin</td>
                <td className="py-2 text-foreground">Laki-laki (Ikhwan)</td>
              </tr>
              <tr>
                <td className="py-2 text-muted-foreground">Gelombang Pendaftaran</td>
                <td className="py-2 font-semibold text-primary">Gelombang 2 (Reguler)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Data Orang Tua Table */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground border-b border-border/60 pb-1">
            B. Data Orang Tua / Wali
          </h3>
          <table className="w-full text-xs border-collapse">
            <tbody className="divide-y divide-border/60">
              <tr>
                <td className="py-2 text-muted-foreground w-1/3">Nama Ayah Kandung</td>
                <td className="py-2 font-semibold text-foreground">Bpk. Rahmat Fauzi, S.T.</td>
              </tr>
              <tr>
                <td className="py-2 text-muted-foreground">Nomor WhatsApp Ayah</td>
                <td className="py-2 font-mono text-foreground">0812-9876-5432</td>
              </tr>
              <tr>
                <td className="py-2 text-muted-foreground">Nama Ibu Kandung</td>
                <td className="py-2 font-semibold text-foreground">Ibu Kurniawati, S.Pd.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Panduan Langkah Selanjutnya */}
        <div className="rounded-xl border border-border/80 bg-muted/20 p-5 space-y-2.5 text-xs text-muted-foreground leading-relaxed">
          <div className="font-bold text-foreground flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Petunjuk Pelaksanaan Observasi:</span>
          </div>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Cetak lembar bukti pendaftaran ini sebanyak 1 lembar.</li>
            <li>Hadir ke kampus SDIT Fajar sesuai jadwal observasi (Sabtu, 06 Desember 2026, pukul 08.30 WIB).</li>
            <li>Bawa fotokopi Akta Kelahiran (2 lembar), fotokopi Kartu Keluarga (2 lembar), dan pas foto 3x4 berwarna (3 lembar).</li>
            <li>Wawancara kesiapan orang tua dilaksanakan bersamaan dengan observasi santri.</li>
          </ol>
        </div>

        {/* Tanda Tangan & Cap */}
        <div className="pt-6 flex justify-between items-end text-xs text-center">
          <div>
            <p className="text-muted-foreground">Orang Tua / Wali Santri,</p>
            <div className="h-16" />
            <p className="font-semibold text-foreground underline">( ............................................ )</p>
          </div>

          <div>
            <p className="text-muted-foreground">Depok, 26 Oktober 2026</p>
            <p className="text-muted-foreground font-semibold">Panitia PPDB SDIT Fajar,</p>
            <div className="h-16 flex items-center justify-center">
              <span className="font-mono text-[10px] text-emerald-600 border border-emerald-500/30 px-2 py-0.5 rounded">
                CAP DIGITAL RESMI
              </span>
            </div>
            <p className="font-semibold text-foreground underline">Ustadz Ahmad Fauzan, S.Sos.I.</p>
          </div>
        </div>

      </div>

    </div>
  );
}
