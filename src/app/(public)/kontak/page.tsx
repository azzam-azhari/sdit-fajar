import * as React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";

export const metadata = {
  title: "Kontak & Lokasi — SDIT Fajar",
  description:
    "Hubungi panitia, kantor tata usaha, dan kunjungi lokasi kampus SDIT Fajar di Cilodong, Kota Depok.",
};

export default function KontakPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">

      <PageHeader
        title="Hubungi Kami & Peta Lokasi"
        badge="Layanan Informasi"
        description="Pintu komunikasi kami senantiasa terbuka untuk silaturahmi, konsultasi pendidikan, dan informasi pendaftaran murid baru."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Kolom 1 & 2: Formulir Kirim Pesan */}
        <div className="lg:col-span-2 rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground">
              Kirimkan Pesan atau Pertanyaan Anda
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tim sekretariat kami akan merespons pertanyaan Anda maksimal dalam 1x24 jam kerja melalui WhatsApp atau Email.
            </p>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bpk. Rahmat Fauzi"
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Nomor WhatsApp Aktif *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 081234567890"
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs font-mono shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Alamat Email (Opsional)
                </label>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Kategori Kepentingan
                </label>
                <select className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  <option value="ppdb">Informasi Pendaftaran (PPDB)</option>
                  <option value="akademik">Konsultasi Kurikulum & Tahfidz</option>
                  <option value="kunjungan">Rencana Kunjungan Sekolah</option>
                  <option value="umum">Informasi Umum Lainnya</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Pesan / Pertanyaan Lengkap *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Tuliskan pertanyaan atau hal yang ingin Anda konsultasikan kepada kami..."
                className="w-full rounded-md border border-input bg-background p-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              />
            </div>

            <div className="pt-2">
              <Button
                type="button"
                className="w-full sm:w-auto text-xs font-semibold h-10 px-6 bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Kirim Pesan Sekarang</span>
              </Button>
            </div>
          </form>
        </div>

        {/* Kolom 3: Informasi Kontak & Layanan Cepat */}
        <div className="space-y-6">

          <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
              Kantor Tata Usaha
            </h3>

            <ul className="space-y-3.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="leading-snug">
                  Jl. Jati III No.04 RT 07/07, Jatijajar, Kec. Tapos, Kota Depok, Jawa Barat 16466.
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span className="font-mono text-foreground font-semibold">(021) 7788-9900</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-mono text-foreground font-semibold">0812-3456-7890 (WA PPDB)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>info@sditfajar.sch.id</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-primary shrink-0" />
                <span>Senin – Jumat: 07.00 – 16.00 WIB</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-6 space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wide">
              <MessageCircle className="h-4 w-4" />
              <span>Respon Cepat WhatsApp</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Membutuhkan informasi cepat mengenai kuota PPDB atau jadwal tes pemetaan murid? Chat langsung dengan panitia.
            </p>
            <a
              href="https://wa.me/6287737860657?text=Assalamu'alaikum,%20saya%20ingin%20bertanya%20informasi%20PPDB%20SDIT%20Fajar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Chat Panitia PPDB Sekarang</span>
            </a>
          </div>

        </div>

      </div>

      {/* Peta Lokasi Embed / Display */}
      <section className="rounded-2xl border border-border/80 bg-card p-6 md:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">
              Petunjuk Akses & Peta Lokasi
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              SDIT FAJAR | Sekolah Dasar Islam Terpadu, Jl. Jati III No.04 RT 07/07, Jatijajar, Kec. Tapos, Kota Depok, Jawa Barat 16466.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="text-xs">
            <a
              href="https://maps.app.goo.gl/tuUfbeECwwGeoCpy5"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5"
            >
              <Navigation className="h-3.5 w-3.5 text-primary" />
              <span>Buka di Google Maps</span>
            </a>
          </Button>
        </div>

        <div className="h-64 sm:h-80 w-full rounded-xl border border-border/80 bg-muted/40 flex flex-col items-center justify-center text-center p-4">
          <MapPin className="h-10 w-10 text-primary/60 mb-2" />
          <div className="font-semibold text-xs sm:text-sm text-foreground">
            SDIT FAJAR | Sekolah Dasar Islam Terpadu
          </div>
          <div className="text-xs text-muted-foreground max-w-sm mt-1">
            Jl. Jati III No.04 RT 07/07, Jatijajar, Kec. Tapos, Kota Depok, Jawa Barat 16466.
          </div>
          <div className="mt-3 text-[11px] font-mono text-primary font-medium bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            Titik Koordinat: -6.414378235237263, 106.86558773787966
          </div>
        </div>
      </section>

    </div>
  );
}
