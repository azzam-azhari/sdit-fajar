import type { Metadata } from "next";
import { Nunito, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";

import { schoolIdentity } from "@/constants/public-data";

import "./globals.css";

const headingFont = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const bodyFont = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: schoolIdentity.name,
    template: "%s | SDIT Fajar",
  },
  description: schoolIdentity.description,
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "SDIT Fajar",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className={`${headingFont.variable} ${bodyFont.variable}`}>
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
