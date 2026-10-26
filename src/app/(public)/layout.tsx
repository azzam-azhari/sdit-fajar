import * as React from "react";
import { PublicNavbar } from "@/components/common/public-navbar";
import { PublicFooter } from "@/components/common/public-footer";
import { FloatingWhatsapp } from "@/components/common/floating-whatsapp";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      <PublicFooter />
      <FloatingWhatsapp />
    </div>
  );
}
