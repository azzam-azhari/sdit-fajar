"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Printer,
  GraduationCap,
  ArrowLeft,
  Calendar,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PendaftaranSuksesPage() {
  const params = useParams();
  const regNumber = (params?.registrationNumber as string) || "PPDB-2026-0000";

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
            <span>Kembali ke Halaman PPDB</span>
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
      <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-10 space-y-6 shadow-xs print:border-none print:shadow-none print:p-0">

        {/* Letterhead (Kop Dokumen) */}
        <div className="flex items-center justify-between border-b-2 border-foreground/80 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shrink-0">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground leading-none">
                SDIT FAJAR CILODONG
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Jl. Jati III No.04 RT 07/07, Jatijajar, Kec. Tapos, Kota Depok, Jawa Barat 16466.
              </p>
              <p className="text-[11px] font-mono text-muted-foreground">
                NPSN: 10814529 • Telp: (021) 7788-9900 • Website: sditfajar.sch.id
              </p>
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              Tanda Terima PPDB
            </div>
            <div className="text-xs font-bold text-emerald-600 font-mono mt-0.5">
              TERVERIFIKASI
            </div>
          </div>
        </div>

        {/* Title & Registration Code */}
        <div className="text-center space-y-3 py-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3.5 py-1 rounded-full border border-primary/20 inline-block">
            Bukti Tanda Terima Pendaftaran Daring
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
            TAHUN PELAJARAN 2026 / 2027
          </h1>
          <div className="inline-block rounded-xl border border-border bg-muted/40 px-6 py-3 mt-2">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider block font-semibold">
              NOMOR REGISTRASI PENDAFTARAN:
            </span>
            <span className="text-2xl sm:text-3xl font-bold font-mono text-primary tracking-widest block mt-1">
              {regNumber}
            </span>
          </div>
          <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
            Simpan nomor registrasi di atas dengan baik. Nomor ini digunakan untuk konfirmasi administrasi dan pengecekan status seleksi berkas.
          </p>
        </div>

        {/* Panduan Langkah Selanjutnya (Next Steps) */}
        <div className="rounded-xl border border-border/80 bg-muted/20 p-5 space-y-4 text-xs text-muted-foreground leading-relaxed">
          <div className="font-bold text-foreground text-sm flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-primary" />
            <span>Langkah Selanjutnya Pasca Pendaftaran:</span>
          </div>

          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <strong className="text-foreground">Cetak Lembar Tanda Terima:</strong> Cetak bukti tanda terima ini atau simpan sebagai dokumen PDF untuk ditunjukkan saat verifikasi fisik.
            </li>
            <li>
              <strong className="text-foreground">Konfirmasi via WhatsApp:</strong> Panitia PPDB akan menghubungi nomor WhatsApp terdaftar untuk mengonfirmasi jadwal observasi talaqqi dan wawancara pemetaan kesiapan belajar.
            </li>
            <li>
              <strong className="text-foreground">Kelengkapan Berkas Fisik:</strong> Siapkan fotokopi Akta Kelahiran (2 lembar), fotokopi Kartu Keluarga (2 lembar), dan pas foto berwarna calon murid ukuran 3x4 (3 lembar) saat hadir ke sekolah.
            </li>
            <li>
              <strong className="text-foreground">Cek Status Berkala:</strong> Anda dapat memantau status verifikasi dan hasil observasi secara berkala melalui menu <em>Cek Status Pendaftaran</em> dengan memasukkan nomor registrasi dan nomor WhatsApp.
            </li>
          </ol>
        </div>

        {/* Informasi Kontak Panitia */}
        <div className="rounded-xl border border-border/70 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs bg-card">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <Calendar className="h-4 w-4 text-primary shrink-0" />
            <span>Jadwal Observasi & Wawancara: Menunggu Konfirmasi Panitia</span>
          </div>
          <div className="text-muted-foreground font-mono">
            Bantuan: <span className="text-primary font-semibold">0812-3456-7890 (Panitia PPDB)</span>
          </div>
        </div>

        {/* Lembar Pengesahan */}
        <div className="pt-6 flex justify-between items-end text-xs text-center border-t border-border/60">
          <div>
            <p className="text-muted-foreground">Orang Tua / Wali Murid,</p>
            <div className="h-14" />
            <p className="font-semibold text-foreground underline">( ............................................ )</p>
          </div>

          <div>
            <p className="text-muted-foreground">Depok, Panitia PPDB SDIT Fajar</p>
            <div className="h-14 flex items-center justify-center">
              <span className="font-mono text-[10px] text-emerald-600 border border-emerald-500/30 px-2 py-0.5 rounded bg-emerald-500/5">
                TERVERIFIKASI RESMI
              </span>
            </div>
            <p className="font-semibold text-foreground underline">Panitia Penerimaan Murid Baru</p>
          </div>
        </div>

      </div>

    </div>
  );
}
