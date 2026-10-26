"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { DatePicker } from "@/components/common/date-picker";

export default function PendaftaranPage() {
  const router = useRouter();

  // Stepper State (1: Gelombang, 2: Calon Santri, 3: Orang Tua, 4: Selesai/Kirim)
  const [step, setStep] = React.useState(1);

  // Form Fields State
  const [gelombang, setGelombang] = React.useState("GEL-2");
  const [namaLengkap, setNamaLengkap] = React.useState("");
  const [nik, setNik] = React.useState("");
  const [jenisKelamin, setJenisKelamin] = React.useState("L");
  const [tempatLahir, setTempatLahir] = React.useState("");
  const [tanggalLahir, setTanggalLahir] = React.useState("");
  const [alamat, setAlamat] = React.useState("");

  const [namaAyah, setNamaAyah] = React.useState("");
  const [noWaAyah, setNoWaAyah] = React.useState("");
  const [pekerjaanAyah, setPekerjaanAyah] = React.useState("");
  const [namaIbu, setNamaIbu] = React.useState("");
  const [noWaIbu, setNoWaIbu] = React.useState("");

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate registration generation and redirect to success page
    setTimeout(() => {
      const generatedRegNumber = `REG-${new Date().getFullYear()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;
      router.push(`/pendaftaran/sukses/${generatedRegNumber}`);
    }, 600);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      
      <PageHeader
        title="Pendaftaran Peserta Didik Baru (PPDB)"
        badge="Tahun Pelajaran 2026/2027"
        description="Portal pendaftaran daring santri baru SDIT Fajar. Kuota penerimaan dibatasi 100 santri baru (4 rombel) demi efektivitas pembinaan talaqqi Al-Qur'an."
      >
        <Button asChild variant="outline" size="sm" className="text-xs">
          <Link href="/pendaftaran/status" className="flex items-center gap-1.5">
            <Search className="h-3.5 w-3.5" />
            <span>Cek Status Pendaftaran</span>
          </Link>
        </Button>
      </PageHeader>

      {/* Tracker Kuota 100 Santri & Gelombang Status */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Kuota Ringkasan */}
        <div className="rounded-xl border border-border/80 bg-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Kuota Santri Baru
            </span>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold font-mono text-foreground">
            100 Santri
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-muted-foreground">Terisi: 68</span>
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

        {/* Info Gelombang 2 (Aktif) */}
        <div className="rounded-xl border-2 border-primary/40 bg-card p-5 space-y-3 relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Gelombang Saat Ini
            </span>
            <StatusBadge status="Buka (Aktif)" variant="info" dot />
          </div>
          <div className="text-lg font-bold text-foreground">
            Gelombang 2 (Reguler)
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            Periode: 01 Okt – 30 Nov 2026
          </p>
          <div className="text-[11px] text-muted-foreground border-t border-border/60 pt-2">
            Infaq Pendaftaran: <strong className="text-foreground font-mono">Rp 350.000</strong>
          </div>
        </div>

        {/* Info Gelombang 3 */}
        <div className="rounded-xl border border-border/80 bg-card p-5 space-y-3 opacity-80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Gelombang Berikutnya
            </span>
            <StatusBadge status="Segera" variant="neutral" />
          </div>
          <div className="text-lg font-bold text-foreground">
            Gelombang 3 (Sisa Kuota)
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            Periode: 01 Des – 15 Jan 2027
          </p>
          <div className="text-[11px] text-muted-foreground border-t border-border/60 pt-2">
            *Hanya dibuka jika sisa kursi masih tersedia.
          </div>
        </div>

      </section>

      {/* Stepper Header Navigation */}
      <div className="rounded-xl border border-border/80 bg-card p-3 sm:p-4">
        <div className="grid grid-cols-3 text-center text-xs font-semibold">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              step === 1
                ? "bg-primary text-primary-foreground font-bold"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <span className="font-mono">1.</span>
            <span>Pilih Gelombang</span>
          </button>
          
          <button
            type="button"
            onClick={() => setStep(2)}
            className={`py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              step === 2
                ? "bg-primary text-primary-foreground font-bold"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <span className="font-mono">2.</span>
            <span>Data Calon Santri</span>
          </button>

          <button
            type="button"
            onClick={() => setStep(3)}
            className={`py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              step === 3
                ? "bg-primary text-primary-foreground font-bold"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <span className="font-mono">3.</span>
            <span>Data Orang Tua</span>
          </button>
        </div>
      </div>

      {/* Formulir Pendaftaran Multi-Step */}
      <form onSubmit={handleSubmit} className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-6">
        
        {/* STEP 1: PILIHAN GELOMBANG */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">
                Langkah 1: Pilih Gelombang Pendaftaran
              </h3>
              <p className="text-xs text-muted-foreground">
                Pastikan Anda memilih gelombang yang masih aktif untuk melanjutkan pengisian biodata.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`rounded-xl border p-4 cursor-pointer transition-all flex flex-col justify-between ${
                  gelombang === "GEL-2"
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:bg-muted/40"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-foreground">Gelombang 2 (Reguler)</span>
                    <input
                      type="radio"
                      name="gelombang"
                      value="GEL-2"
                      checked={gelombang === "GEL-2"}
                      onChange={(e) => setGelombang(e.target.value)}
                      className="text-primary"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Dibuka untuk calon santri umum. Termasuk tes observasi kesiapan belajar dan wawancara orang tua.
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-border/60 text-xs font-mono font-semibold text-primary">
                  Infaq: Rp 350.000 (Sisa 32 Kursi)
                </div>
              </label>

              <label
                className={`rounded-xl border p-4 cursor-pointer transition-all flex flex-col justify-between opacity-60 ${
                  gelombang === "GEL-3"
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-foreground">Gelombang 3 (Pelengkap)</span>
                    <input
                      type="radio"
                      name="gelombang"
                      value="GEL-3"
                      checked={gelombang === "GEL-3"}
                      onChange={(e) => setGelombang(e.target.value)}
                      className="text-primary"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Dibuka mulai 01 Desember 2026 jika kuota gelombang 2 belum terpenuhi 100%.
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-border/60 text-xs font-mono text-muted-foreground">
                  Infaq: Rp 450.000
                </div>
              </label>
            </div>

            <div className="flex justify-end pt-4 border-t border-border/60">
              <Button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs font-semibold bg-primary text-primary-foreground h-9 px-5 flex items-center gap-1.5"
              >
                <span>Lanjut ke Data Santri</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: DATA CALON SANTRI */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">
                Langkah 2: Biodata Calon Santri
              </h3>
              <p className="text-xs text-muted-foreground">
                Isi data calon siswa sesuai dengan Akta Kelahiran dan Kartu Keluarga (KK).
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Nama Lengkap Santri *
                </label>
                <input
                  type="text"
                  required
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                  placeholder="Contoh: Muhammad Azzam Al-Fath"
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    NIK Calon Santri (16 Digit) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    placeholder="327601xxxxxxxxxx"
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs font-mono shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Jenis Kelamin *
                  </label>
                  <select
                    value={jenisKelamin}
                    onChange={(e) => setJenisKelamin(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="L">Laki-laki (Ikhwan)</option>
                    <option value="P">Perempuan (Akhwat)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Tempat Lahir *
                  </label>
                  <input
                    type="text"
                    required
                    value={tempatLahir}
                    onChange={(e) => setTempatLahir(e.target.value)}
                    placeholder="Contoh: Depok"
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                <DatePicker
                  label="Tanggal Lahir *"
                  value={tanggalLahir}
                  onChange={(val) => setTanggalLahir(val)}
                  helperText="Format: tanggal/bulan/tahun (sesuai Akta)"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Alamat Lengkap Tempat Tinggal *
                </label>
                <textarea
                  rows={2}
                  required
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  placeholder="Jl. / RT / RW / Kelurahan / Kecamatan / Kota"
                  className="w-full rounded-md border border-input bg-background p-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="text-xs h-9 px-4"
              >
                Kembali
              </Button>
              <Button
                type="button"
                onClick={() => setStep(3)}
                className="text-xs font-semibold bg-primary text-primary-foreground h-9 px-5 flex items-center gap-1.5"
              >
                <span>Lanjut ke Data Orang Tua</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: DATA ORANG TUA / WALI */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">
                Langkah 3: Data Orang Tua / Wali Santri
              </h3>
              <p className="text-xs text-muted-foreground">
                Nomor WhatsApp aktif digunakan untuk notifikasi jadwal observasi dan hasil seleksi berkas.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Nama Lengkap Ayah Kandung *
                  </label>
                  <input
                    type="text"
                    required
                    value={namaAyah}
                    onChange={(e) => setNamaAyah(e.target.value)}
                    placeholder="Contoh: Bpk. Ahmad Fauzi"
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Nomor WhatsApp Ayah *
                  </label>
                  <input
                    type="tel"
                    required
                    value={noWaAyah}
                    onChange={(e) => setNoWaAyah(e.target.value)}
                    placeholder="0812xxxxxxxx"
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs font-mono shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Pekerjaan Ayah
                </label>
                <input
                  type="text"
                  value={pekerjaanAyah}
                  onChange={(e) => setPekerjaanAyah(e.target.value)}
                  placeholder="Contoh: Karyawan Swasta / Wiraswasta / ASN"
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Nama Lengkap Ibu Kandung *
                  </label>
                  <input
                    type="text"
                    required
                    value={namaIbu}
                    onChange={(e) => setNamaIbu(e.target.value)}
                    placeholder="Contoh: Ibu Siti Rahmah"
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Nomor WhatsApp Ibu
                  </label>
                  <input
                    type="tel"
                    value={noWaIbu}
                    onChange={(e) => setNoWaIbu(e.target.value)}
                    placeholder="0813xxxxxxxx"
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs font-mono shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
              </div>

              {/* Ketentuan Berkas */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <ShieldAlert className="h-4 w-4 text-primary" />
                  <span>Kelengkapan Berkas Fisik Saat Observasi:</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 leading-relaxed">
                  <li>Fotokopi Akta Kelahiran santri (2 lembar)</li>
                  <li>Fotokopi Kartu Keluarga dan KTP kedua orang tua (2 lembar)</li>
                  <li>Pas foto santri ukuran 3x4 berwarna (3 lembar)</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(2)}
                className="text-xs h-9 px-4"
              >
                Kembali
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="text-xs font-bold bg-primary text-primary-foreground h-10 px-6 shadow-sm"
              >
                {isSubmitting ? "Memproses Data..." : "Kirim Formulir Pendaftaran"}
              </Button>
            </div>
          </div>
        )}

      </form>

    </div>
  );
}
