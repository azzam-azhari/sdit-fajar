import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { connection } from 'next/server';
import { getCurrentProfile } from '@/lib/supabase/auth-helpers';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';

export const instant = false;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  const profile = await getCurrentProfile();

  const user = profile
    ? {
        name: profile.name,
        email: profile.email || profile.login_identifier,
        role: profile.role,
        avatar: profile.avatar_url,
      }
    : {
        name: 'Pengguna',
        email: '',
        role: 'murid' as const,
        avatar: null,
      };

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" user={user} />
      <SidebarInset>
        <SiteHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-y-auto">
          <Suspense
            fallback={
              <div className="flex flex-1 items-center justify-center min-h-[300px]">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            }
          >
            {children}
          </Suspense>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
