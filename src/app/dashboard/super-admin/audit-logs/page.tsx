import { requireRole } from '@/lib/supabase/auth-helpers';
import { createClient } from '@/lib/supabase/server';
import { AuditLogsClient, AuditLogItem } from './_components/audit-logs-client';

export const instant = false;

export default async function SuperAdminAuditLogsPage() {
  await requireRole(['super_admin']);
  const supabase = await createClient();

  const { data: logs } = await supabase
    .from('audit_logs')
    .select(`
      id,
      action,
      entity_type,
      entity_id,
      metadata,
      created_at,
      profiles (
        name,
        role
      )
    `)
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Audit Log Sistem & Keamanan
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Rekam jejak mutasi data sensitif, perubahan status akun, dan eksekusi import massal oleh administrator.
        </p>
      </div>

      <AuditLogsClient initialLogs={(logs as unknown as AuditLogItem[]) || []} />
    </div>
  );
}
