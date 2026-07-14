"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileCheck2, FileUp, Info, ShieldCheck, X } from "lucide-react";
import { type ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";

const registrationSchema = z.object({
  studentName: z.string().min(3, "Nama calon murid minimal 3 karakter."),
  birthPlace: z.string().min(2, "Tempat lahir wajib diisi."),
  birthDate: z.string().min(1, "Tanggal lahir wajib diisi."),
  gender: z.enum(["male", "female"], { message: "Pilih jenis kelamin." }),
  parentName: z.string().min(3, "Nama orang tua/wali minimal 3 karakter."),
  parentPhone: z.string().regex(/^[0-9+\-\s]{9,20}$/, "Nomor telepon belum valid."),
  parentEmail: z.email("Masukkan alamat email yang valid."),
  address: z.string().min(10, "Alamat minimal 10 karakter.").max(500, "Alamat maksimal 500 karakter."),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;
type DocumentType = "Kartu Keluarga" | "Akta Kelahiran";
type SelectedDocument = { type: DocumentType; file: File };

const inputClassName =
  "mt-2 w-full rounded-2xl border border-sky-100 bg-white px-4 py-3.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100";

const allowedExtensions = ["pdf", "jpg", "jpeg", "png", "webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function RegistrationForm() {
  const [documents, setDocuments] = useState<SelectedDocument[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      studentName: "",
      birthPlace: "",
      birthDate: "",
      gender: undefined,
      parentName: "",
      parentPhone: "",
      parentEmail: "",
      address: "",
    },
  });

  function selectDocument(type: DocumentType, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!allowedExtensions.includes(extension)) {
      toast.error("Format file tidak didukung. Gunakan PDF, JPG, PNG, atau WebP.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Ukuran file terlalu besar. Maksimal 5 MB.");
      event.target.value = "";
      return;
    }

    setDocuments((current) => [...current.filter((item) => item.type !== type), { type, file }]);
    toast.success(`${type} siap dilampirkan.`);
  }

  function removeDocument(type: DocumentType) {
    setDocuments((current) => current.filter((item) => item.type !== type));
  }

  const onSubmit = () => {
    const requiredDocuments: DocumentType[] = ["Kartu Keluarga", "Akta Kelahiran"];
    const missing = requiredDocuments.filter((type) => !documents.some((document) => document.type === type));
    if (missing.length > 0) {
      toast.error(`Lengkapi dokumen: ${missing.join(" dan ")}.`);
      return;
    }

    toast.info("Data sudah tervalidasi. Pengiriman online akan tersedia setelah layanan pendaftaran sekolah diaktifkan.", {
      duration: 6000,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="clay-card p-6 sm:p-8 lg:p-10" noValidate>
      <div className="mb-8 rounded-2xl border border-sky-100 bg-sky-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 size-5 shrink-0 text-sky-600" />
          <div>
            <p className="font-extrabold text-sky-900">Formulir tahap frontend</p>
            <p className="mt-1 text-sm leading-6 text-sky-800">Validasi dan preview dokumen sudah aktif. Data belum dikirim atau disimpan sebelum layanan Supabase, storage private, dan validasi server diaktifkan.</p>
          </div>
        </div>
      </div>

      <fieldset>
        <legend className="text-xl font-extrabold text-slate-950">Data calon murid</legend>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-extrabold text-slate-700 sm:col-span-2">Nama lengkap<input {...register("studentName")} className={inputClassName} placeholder="Sesuai dokumen resmi" autoComplete="name" />{errors.studentName && <span className="mt-2 block text-xs font-bold text-red-600">{errors.studentName.message}</span>}</label>
          <label className="text-sm font-extrabold text-slate-700">Tempat lahir<input {...register("birthPlace")} className={inputClassName} placeholder="Kota kelahiran" />{errors.birthPlace && <span className="mt-2 block text-xs font-bold text-red-600">{errors.birthPlace.message}</span>}</label>
          <label className="text-sm font-extrabold text-slate-700">Tanggal lahir<input {...register("birthDate")} className={inputClassName} type="date" />{errors.birthDate && <span className="mt-2 block text-xs font-bold text-red-600">{errors.birthDate.message}</span>}</label>
          <label className="text-sm font-extrabold text-slate-700 sm:col-span-2">Jenis kelamin<select {...register("gender")} className={inputClassName} defaultValue=""><option value="" disabled>Pilih jenis kelamin</option><option value="male">Laki-laki</option><option value="female">Perempuan</option></select>{errors.gender && <span className="mt-2 block text-xs font-bold text-red-600">{errors.gender.message}</span>}</label>
        </div>
      </fieldset>

      <div className="my-8 h-px bg-sky-100" />

      <fieldset>
        <legend className="text-xl font-extrabold text-slate-950">Data orang tua / wali</legend>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-extrabold text-slate-700">Nama lengkap<input {...register("parentName")} className={inputClassName} placeholder="Nama orang tua atau wali" autoComplete="name" />{errors.parentName && <span className="mt-2 block text-xs font-bold text-red-600">{errors.parentName.message}</span>}</label>
          <label className="text-sm font-extrabold text-slate-700">Nomor WhatsApp<input {...register("parentPhone")} className={inputClassName} placeholder="08xxxxxxxxxx" inputMode="tel" autoComplete="tel" />{errors.parentPhone && <span className="mt-2 block text-xs font-bold text-red-600">{errors.parentPhone.message}</span>}</label>
          <label className="text-sm font-extrabold text-slate-700 sm:col-span-2">Email<input {...register("parentEmail")} className={inputClassName} placeholder="nama@email.com" type="email" autoComplete="email" />{errors.parentEmail && <span className="mt-2 block text-xs font-bold text-red-600">{errors.parentEmail.message}</span>}</label>
          <label className="text-sm font-extrabold text-slate-700 sm:col-span-2">Alamat<textarea {...register("address")} className={`${inputClassName} min-h-28 resize-y`} placeholder="Alamat tempat tinggal lengkap" autoComplete="street-address" />{errors.address && <span className="mt-2 block text-xs font-bold text-red-600">{errors.address.message}</span>}</label>
        </div>
      </fieldset>

      <div className="my-8 h-px bg-sky-100" />

      <fieldset>
        <legend className="text-xl font-extrabold text-slate-950">Dokumen pendaftaran</legend>
        <p className="mt-2 text-sm leading-6 text-slate-600">Format PDF, JPG, PNG, atau WebP. Maksimal 5 MB per file.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {(["Kartu Keluarga", "Akta Kelahiran"] as DocumentType[]).map((type) => {
            const selected = documents.find((document) => document.type === type);
            return (
              <div key={type} className="rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/60 p-5">
                {selected ? (
                  <div className="flex items-start gap-3">
                    <FileCheck2 className="mt-0.5 size-6 shrink-0 text-emerald-500" />
                    <div className="min-w-0 flex-1"><p className="text-sm font-extrabold text-slate-800">{type}</p><p className="mt-1 truncate text-xs text-slate-500">{selected.file.name}</p><p className="mt-1 text-xs text-slate-500">{(selected.file.size / 1024 / 1024).toFixed(2)} MB</p></div>
                    <button type="button" onClick={() => removeDocument(type)} className="grid size-8 place-items-center rounded-lg bg-white text-slate-500 hover:text-red-600" aria-label={`Hapus ${type}`}><X className="size-4" /></button>
                  </div>
                ) : (
                  <label className="block cursor-pointer text-center">
                    <FileUp className="mx-auto size-7 text-sky-500" />
                    <span className="mt-3 block text-sm font-extrabold text-slate-800">Unggah {type}</span>
                    <span className="mt-1 block text-xs text-slate-500">Klik untuk memilih file</span>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="sr-only" onChange={(event) => selectDocument(type, event)} />
                  </label>
                )}
              </div>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-8 flex flex-col gap-4 border-t border-sky-100 pt-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex max-w-md items-start gap-2 text-xs leading-5 text-slate-500"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-sky-500" />Dokumen akan disimpan secara private dan hanya dapat diakses petugas berwenang setelah backend aktif.</p>
        <Button type="submit" size="lg" disabled={isSubmitting} className="shrink-0">{isSubmitting ? "Memeriksa..." : "Periksa Data Pendaftaran"}</Button>
      </div>
    </form>
  );
}
