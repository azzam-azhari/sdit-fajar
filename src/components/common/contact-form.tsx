"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/constants/public-data";

const contactSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter."),
  email: z.email("Masukkan alamat email yang valid."),
  subject: z.string().min(5, "Subjek minimal 5 karakter."),
  message: z.string().min(15, "Pesan minimal 15 karakter.").max(1000, "Pesan maksimal 1.000 karakter."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const inputClassName =
  "mt-2 w-full rounded-2xl border border-sky-100 bg-white px-4 py-3.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = (values: ContactFormValues) => {
    const body = `Nama: ${values.name}\nEmail: ${values.email}\n\n${values.message}`;
    const mailto = `mailto:${siteConfig.email}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(body)}`;
    toast.success("Pesan siap dikirim melalui aplikasi email Anda.");
    window.location.assign(mailto);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="clay-card p-6 sm:p-8" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-extrabold text-slate-700">
          Nama lengkap
          <input {...register("name")} className={inputClassName} placeholder="Nama Anda" autoComplete="name" />
          {errors.name && <span className="mt-2 block text-xs font-bold text-red-600">{errors.name.message}</span>}
        </label>
        <label className="text-sm font-extrabold text-slate-700">
          Email
          <input {...register("email")} className={inputClassName} placeholder="nama@email.com" type="email" autoComplete="email" />
          {errors.email && <span className="mt-2 block text-xs font-bold text-red-600">{errors.email.message}</span>}
        </label>
      </div>
      <label className="mt-5 block text-sm font-extrabold text-slate-700">
        Subjek
        <input {...register("subject")} className={inputClassName} placeholder="Informasi yang ingin ditanyakan" />
        {errors.subject && <span className="mt-2 block text-xs font-bold text-red-600">{errors.subject.message}</span>}
      </label>
      <label className="mt-5 block text-sm font-extrabold text-slate-700">
        Pesan
        <textarea {...register("message")} className={`${inputClassName} min-h-36 resize-y`} placeholder="Tuliskan pertanyaan Anda dengan jelas." />
        {errors.message && <span className="mt-2 block text-xs font-bold text-red-600">{errors.message.message}</span>}
      </label>
      <Button type="submit" size="lg" className="mt-6 w-full sm:w-auto" disabled={isSubmitting}>
        <Send className="size-4" /> {isSubmitting ? "Menyiapkan..." : "Siapkan Email"}
      </Button>
      <p className="mt-4 text-xs leading-5 text-slate-500">Tombol akan membuka aplikasi email pada perangkat Anda. Data tidak disimpan oleh halaman ini.</p>
    </form>
  );
}
