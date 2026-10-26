import * as React from "react";
import Link from "next/link";
import { connection } from "next/server";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";
import { RegistrationFormClient } from "./_components/registration-form-client";
import { getPublicAdmissionWaves } from "@/actions/ppdb.actions";

export const metadata = {
  title: "Pendaftaran PPDB Online — SDIT Fajar",
  description:
    "Formulir resmi pendaftaran peserta didik baru (PPDB) daring SDIT Fajar. Kuota penerimaan dibatasi 100 murid baru demi efektivitas pembinaan tahfidz Al-Qur'an.",
};

export default async function PendaftaranPage() {
  await connection();
  const waves = await getPublicAdmissionWaves();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      <PageHeader
        title="Pendaftaran Peserta Didik Baru (PPDB)"
        badge="Tahun Pelajaran 2026/2027"
        description="Portal pendaftaran daring murid baru SDIT Fajar. Kuota penerimaan dibatasi 100 murid baru (4 rombel) demi efektivitas pembinaan talaqqi Al-Qur'an dan penanaman adab islami."
      >
        <Button asChild variant="outline" size="sm" className="text-xs">
          <Link href="/pendaftaran/status" className="flex items-center gap-1.5">
            <Search className="h-3.5 w-3.5" />
            <span>Cek Status Pendaftaran</span>
          </Link>
        </Button>
      </PageHeader>

      <RegistrationFormClient waves={waves} />
    </div>
  );
}
