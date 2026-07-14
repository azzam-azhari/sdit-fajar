import { FloatingWhatsapp } from "@/components/common/floating-whatsapp";
import { PublicFooter } from "@/components/common/public-footer";
import { PublicNavbar } from "@/components/common/public-navbar";

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen overflow-x-clip">
      <PublicNavbar />
      <main>{children}</main>
      <PublicFooter />
      <FloatingWhatsapp />
    </div>
  );
}
