"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { DatePicker } from "@/components/common/date-picker";

export default function CekStatusPage() {
  const [regNumber, setRegNumber] = React.useState("");
  const [birthDate, setBirthDate] = React.useState("");
  const [hasSearched, setHasSearched] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Mock result state
  const [result, setResult] = React.useState<{
    regNumber: string;
    nama: string;
    gelombang: string;
    status: "Terverifikasi" | "Menunggu Berkas" | "Diterima";
    jadwalObservasi: string;
    catatan: string;
  } | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setHasSearched(true);

      // Return a realistic mock result for testing
      setResult({
        regNumber: regNumber.toUpperCase() || "REG-2026-1042",
        nama: "Ahmad Azzam Fauzi",
        gelombang: "Gelombang 2 (Reguler)",
        status: "Terverifikasi",
        jadwalObservasi: "Sabtu, 06 Desember 2026 • Pukul 08.30 WIB",
        catatan:
          "Berkas administratif telah diverifikasi panitia. Mohon hadir 15 menit sebelum jadwal observasi kesiapan belajar.",
      });
    }, 400);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      <div>
        <Button asChild variant="ghost" size="sm" className="text-xs -ml-2 text-muted-foreground hover:text-foreground">
          <Link href="/pendaftaran" className="flex items-center gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Informasi PPDB</span>
          </Link>
        </Button>
      </div>

      <PageHeader
        title="Cek Status Pendaftaran Mandiri"
        badge="Pelacak PPDB"
        description="Masukkan Nomor Registrasi (didapat saat pendaftaran) dan Tanggal Lahir calon santri untuk melihat progres verifikasi berkas dan jadwal tes observasi."
      />

      {/* Formulir Pencarian */}
      <form onSubmit={handleSearch} className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Nomor Registrasi PPDB *
            </label>
            <input
              type="text"
              required
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
              placeholder="Contoh: REG-2026-1042"
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs font-mono uppercase shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <DatePicker
            label="Tanggal Lahir Calon Santri *"
            value={birthDate}
            onChange={(val) => setBirthDate(val)}
            required
          />
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            className="text-xs font-semibold h-9 px-5 bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
          >
            <Search className="h-3.5 w-3.5" />
            <span>{isLoading ? "Memeriksa..." : "Cari Data Pendaftaran"}</span>
          </Button>
        </div>
      </form>

      {/* Hasil Pencarian */}
      {hasSearched && result && (
        <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/80 gap-3">
            <div>
              <span className="text-xs font-mono text-muted-foreground">
                No. Registrasi:
              </span>
              <div className="text-lg font-bold font-mono text-foreground">
                {result.regNumber}
              </div>
            </div>
            <StatusBadge
              status={result.status}
              variant={result.status === "Terverifikasi" ? "success" : "info"}
              size="md"
              dot
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <span className="text-muted-foreground">Nama Calon Santri:</span>
              <div className="font-bold text-sm text-foreground mt-0.5">
                {result.nama}
              </div>
            </div>

            <div>
              <span className="text-muted-foreground">Gelombang Pendaftaran:</span>
              <div className="font-semibold text-foreground mt-0.5">
                {result.gelombang}
              </div>
            </div>

            <div className="sm:col-span-2 rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>Jadwal Observasi & Wawancara Orang Tua:</span>
              </span>
              <div className="text-sm font-bold text-foreground font-mono">
                {result.jadwalObservasi}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                {result.catatan}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">
              Simpan bukti pendaftaran ini untuk dibawa saat observasi sekolah.
            </span>
            <Button asChild size="sm" className="text-xs bg-primary text-primary-foreground">
              <Link href={`/pendaftaran/sukses/${result.regNumber}`}>
                Cetak Lembar Bukti Pendaftaran
              </Link>
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
