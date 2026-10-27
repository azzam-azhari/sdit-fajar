import { requireRole } from '@/lib/supabase/auth-helpers';
import { createClient } from '@/lib/supabase/server';
import { ZebraDataTable, ZebraColumn } from '@/components/common/zebra-data-table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';

interface TeacherItem {
  id: string;
  nip: string | null;
  nuptk: string | null;
  bio: string | null;
  is_active: boolean;
  profiles?: {
    name: string;
    email: string | null;
    phone: string | null;
  };
  teacher_positions?: {
    positions?: {
      name: string;
    };
  }[];
}

export const instant = false;

export default async function AdminGuruPage() {
  await requireRole(['admin', 'super_admin']);
  const supabase = await createClient();

  const { data: teachers } = await supabase
    .from('teachers')
    .select(`
      id,
      nip,
      nuptk,
      bio,
      is_active,
      profiles (
        name,
        email,
        phone
      ),
      teacher_positions (
        positions (
          name
        )
      )
    `)
    .order('created_at', { ascending: false });

  const columns: ZebraColumn<TeacherItem>[] = [
    {
      header: 'Nama Pendidik (Guru)',
      cell: (item) => (
        <div>
          <span className="font-semibold text-xs text-foreground block">
            {item.profiles?.name || 'Tanpa Nama'}
          </span>
          <span className="text-[11px] text-muted-foreground font-mono">
            {item.profiles?.email || '-'}
          </span>
        </div>
      ),
    },
    {
      header: 'NIP / NUPTK',
      isMono: true,
      cell: (item) => (
        <div>
          <span className="font-mono text-xs text-foreground block">
            {item.nip || 'NIP: -'}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            {item.nuptk ? `NUPTK: ${item.nuptk}` : '-'}
          </span>
        </div>
      ),
    },
    {
      header: 'No. WhatsApp / HP',
      isMono: true,
      cell: (item) => (
        <span className="font-mono text-xs text-muted-foreground">
          {item.profiles?.phone || '-'}
        </span>
      ),
    },
    {
      header: 'Jabatan Struktural',
      cell: (item) => {
        const positions = item.teacher_positions?.map((tp) => tp.positions?.name).filter(Boolean);
        return positions && positions.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {positions.map((p, idx) => (
              <Badge key={idx} variant="outline" className="border-primary/40 text-primary font-mono text-[10px]">
                {p}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground italic">Guru Pengampu</span>
        );
      },
    },
    {
      header: 'Status',
      cell: (item) => (
        <div className="flex items-center gap-1.5">
          {item.is_active ? (
            <>
              <CheckCircle2 className="size-3.5 text-emerald-600" />
              <span className="text-xs text-emerald-600 font-medium">Aktif Mengajar</span>
            </>
          ) : (
            <>
              <XCircle className="size-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">Cuti / Nonaktif</span>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Data Tenaga Pendidik & Guru
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Daftar seluruh asatidz dan pendidik kurikulum Islam terpadu SDIT Fajar.
        </p>
      </div>

      <ZebraDataTable
        data={(teachers as unknown as TeacherItem[]) || []}
        columns={columns}
        emptyText="Belum ada data tenaga pendidik."
      />
    </div>
  );
}
