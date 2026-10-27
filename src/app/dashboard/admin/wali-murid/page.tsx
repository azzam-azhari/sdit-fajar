import { requireRole } from '@/lib/supabase/auth-helpers';
import { createClient } from '@/lib/supabase/server';
import { ZebraDataTable, ZebraColumn } from '@/components/common/zebra-data-table';
import { Badge } from '@/components/ui/badge';

interface ParentItem {
  id: string;
  occupation: string | null;
  address: string | null;
  created_at: string;
  profiles?: {
    name: string;
    phone: string | null;
    email: string | null;
    login_identifier: string;
  };
  parent_students?: {
    relationship: string;
    students?: {
      nis: string;
      profiles?: {
        name: string;
      };
    };
  }[];
}

export const instant = false;

export default async function AdminWaliMuridPage() {
  await requireRole(['admin', 'super_admin']);
  const supabase = await createClient();

  const { data: parents } = await supabase
    .from('parents')
    .select(`
      id,
      occupation,
      address,
      created_at,
      profiles (
        name,
        phone,
        email,
        login_identifier
      ),
      parent_students (
        relationship,
        students (
          nis,
          profiles (
            name
          )
        )
      )
    `)
    .order('created_at', { ascending: false });

  const columns: ZebraColumn<ParentItem>[] = [
    {
      header: 'Nama Orang Tua / Wali',
      cell: (item) => (
        <div>
          <span className="font-semibold text-xs text-foreground block">
            {item.profiles?.name || 'Tanpa Nama'}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">
            {item.occupation ? `Pekerjaan: ${item.occupation}` : '-'}
          </span>
        </div>
      ),
    },
    {
      header: 'No. WhatsApp (Login ID)',
      isMono: true,
      cell: (item) => (
        <span className="font-mono text-xs font-semibold text-emerald-600">
          {item.profiles?.phone || item.profiles?.login_identifier}
        </span>
      ),
    },
    {
      header: 'Anak / Murid Terhubung',
      cell: (item) => {
        const relations = item.parent_students;
        return relations && relations.length > 0 ? (
          <div className="space-y-1">
            {relations.map((rel, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-xs">
                <Badge variant="outline" className="border-primary/40 text-primary font-mono text-[10px]">
                  {rel.relationship}
                </Badge>
                <span className="font-medium text-foreground">
                  {rel.students?.profiles?.name}
                </span>
                <span className="text-[11px] text-muted-foreground font-mono">
                  ({rel.students?.nis})
                </span>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground italic">Belum ada anak terhubung</span>
        );
      },
    },
    {
      header: 'Alamat Domisili',
      cell: (item) => (
        <span className="text-xs text-muted-foreground truncate max-w-xs block">
          {item.address || '-'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Data Wali Murid & Relasi Siswa
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Daftar seluruh wali murid terdaftar yang memiliki hak akses terhadap pemantauan akademik dan pembayaran tagihan anak.
        </p>
      </div>

      <ZebraDataTable
        data={(parents as unknown as ParentItem[]) || []}
        columns={columns}
        emptyText="Belum ada data wali murid terdaftar."
      />
    </div>
  );
}
