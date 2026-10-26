import { requireRole } from '@/lib/supabase/auth-helpers';
import { createClient } from '@/lib/supabase/server';
import { ImportCsvClient, BatchHistoryItem } from './_components/import-csv-client';

export default async function SuperAdminImportPage() {
  await requireRole(['super_admin']);
  const supabase = await createClient();

  const { data: batches } = await supabase
    .from('import_batches')
    .select(`
      id,
      entity_type,
      total_rows,
      success_rows,
      failed_rows,
      created_at,
      profiles (
        name
      )
    `)
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Modul Batch Import Data Massal (CSV)
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Impor data massal siswa, guru, dan wali murid dengan validasi presisi per baris serta pembatalan otomatis (*rollback*) bila ditemukan baris korup.
        </p>
      </div>

      <ImportCsvClient initialBatches={(batches as unknown as BatchHistoryItem[]) || []} />
    </div>
  );
}
