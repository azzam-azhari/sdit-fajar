"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Clock, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { checkRegistrationStatusAction } from "@/actions/ppdb.actions";

export default function CekStatusPage() {
  const [regNumber, setRegNumber] = React.useState("");
  const [parentPhone, setParentPhone] = React.useState("");
  const [hasSearched, setHasSearched] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const [result, setResult] = React.useState<{
    regNumber: string;
    studentName: string;
    waveTitle: string;
    status: string;
    submittedAt: string;
    adminNotes: string | null;
  } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setHasSearched(true);

    try {
      const res = await checkRegistrationStatusAction(regNumber, parentPhone);
      if (res.success) {
        setResult({
          regNumber: res.data.registrationNumber,
          studentName: res.data.studentName,
          waveTitle: res.data.waveTitle,
          status: res.data.status,
          submittedAt: res.data.submittedAt,
          adminNotes: res.data.adminNotes,
        });
      } else {
        setResult(null);
        toast.error(res.error);
      }
    } catch (err: unknown) {
      setResult(null);
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat memeriksa data.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "approved":
        return {
          label: "Diterima / Lulus Observasi",
          color: "border-emerald-500/40 text-emerald-600 bg-emerald-500/5",
          icon: CheckCircle2,
          desc: "Selamat! Berkas dan calon murid telah dinyatakan diterima sebagai siswa baru SDIT Fajar.",
        };
      case "under_review":
        return {
          label: "Sedang Diverifikasi Panitia",
          color: "border-amber-500/40 text-amber-600 bg-amber-500/5",
          icon: Clock,
          desc: "Berkas Anda sedang dalam proses verifikasi administratif dan peninjauan jadwal observasi.",
        };
      case "rejected":
        return {
          label: "Belum Memenuhi Syarat",
          color: "border-rose-500/40 text-rose-600 bg-rose-500/5",
          icon: XCircle,
          desc: "Mohon maaf, pendaftaran belum dapat diproses atau kuota telah terpenuhi.",
        };
      default:
        return {
          label: "Formulir Diajukan",
          color: "border-blue-500/40 text-blue-600 bg-blue-500/5",
          icon: Clock,
          desc: "Formulir telah diterima sistem dan menunggu giliran verifikasi oleh panitia PPDB.",
        };
    }
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
        description="Masukkan Nomor Registrasi (PPDB-YYYY-XXXX) dan Nomor WhatsApp Orang Tua yang didaftarkan untuk memeriksa status verifikasi secara aman."
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
              placeholder="Contoh: PPDB-2026-1042"
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs font-mono uppercase shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Nomor WhatsApp Orang Tua *
            </label>
            <input
              type="text"
              required
              value={parentPhone}
              onChange={(e) => setParentPhone(e.target.value)}
              placeholder="0812xxxxxxxx"
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs font-mono shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
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
              <div className="text-lg font-bold font-mono text-primary">
                {result.regNumber}
              </div>
            </div>
            {(() => {
              const info = getStatusDisplay(result.status);
              const Icon = info.icon;
              return (
                <Badge variant="outline" className={`font-mono text-xs py-1 px-3 gap-1.5 ${info.color}`}>
                  <Icon className="size-3.5" />
                  {info.label}
                </Badge>
              );
            })()}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-muted-foreground block">Nama Calon Murid:</span>
              <span className="font-semibold text-foreground text-sm">{result.studentName}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Jalur Gelombang:</span>
              <span className="font-medium text-foreground">{result.waveTitle}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Waktu Pengajuan:</span>
              <span className="font-mono text-foreground">
                {new Date(result.submittedAt).toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" })}
              </span>
            </div>
            {result.adminNotes && (
              <div>
                <span className="text-muted-foreground block">Catatan Panitia:</span>
                <span className="font-medium text-foreground bg-muted/40 p-1.5 rounded block mt-0.5">
                  {result.adminNotes}
                </span>
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground italic border-t border-border/60 pt-3">
            {getStatusDisplay(result.status).desc}
          </p>
        </div>
      )}
    </div>
  );
}
