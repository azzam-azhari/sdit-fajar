'use client';

import * as React from 'react';
import { ZebraDataTable, ZebraColumn } from '@/components/common/zebra-data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Search, Eye, History } from 'lucide-react';

export interface AuditLogItem {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  profiles?: {
    name: string;
    role: string;
  } | null;
}

export function AuditLogsClient({ initialLogs }: { initialLogs: AuditLogItem[] }) {
  const [logs] = React.useState<AuditLogItem[]>(initialLogs);
  const [search, setSearch] = React.useState('');
  const [selectedMeta, setSelectedMeta] = React.useState<AuditLogItem | null>(null);

  const filtered = React.useMemo(() => {
    return logs.filter((l) => {
      const matchAction = l.action.toLowerCase().includes(search.toLowerCase());
      const matchEntity = l.entity_type.toLowerCase().includes(search.toLowerCase());
      const matchActor = l.profiles?.name?.toLowerCase().includes(search.toLowerCase());
      return matchAction || matchEntity || matchActor;
    });
  }, [logs, search]);

  const columns: ZebraColumn<AuditLogItem>[] = [
    {
      header: 'Waktu Transaksi (WIB)',
      isMono: true,
      cell: (item) => (
        <span className="text-xs text-muted-foreground font-mono">
          {new Date(item.created_at).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </span>
      ),
    },
    {
      header: 'Aktor Pelaksana',
      cell: (item) => (
        <div>
          <span className="font-medium text-foreground text-xs block">
            {item.profiles?.name || 'Sistem / Super Admin'}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">
            {item.profiles?.role || 'service_role'}
          </span>
        </div>
      ),
    },
    {
      header: 'Aksi Sistem',
      cell: (item) => (
        <Badge variant="outline" className="border-primary/40 text-primary font-mono text-[11px]">
          {item.action}
        </Badge>
      ),
    },
    {
      header: 'Tabel Entitas',
      cell: (item) => (
        <span className="font-mono text-xs font-semibold text-foreground">
          {item.entity_type}
        </span>
      ),
    },
    {
      header: 'Target ID',
      isMono: true,
      cell: (item) => (
        <span className="text-[11px] text-muted-foreground font-mono">
          {item.entity_id ? `${item.entity_id.slice(0, 8)}...` : '-'}
        </span>
      ),
    },
    {
      header: 'Rincian',
      align: 'right',
      cell: (item) => (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-[11px] px-2 text-primary"
          onClick={() => setSelectedMeta(item)}
        >
          <Eye className="size-3 mr-1" />
          Lihat JSON
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Cari aksi, entitas, atau nama aktor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 text-xs h-9"
          />
        </div>
      </div>

      <ZebraDataTable
        data={filtered}
        columns={columns}
        emptyText="Belum ada rekam audit log sistem yang tercatat."
      />

      {/* Modal Detail JSON Metadata */}
      <Dialog open={!!selectedMeta} onOpenChange={() => setSelectedMeta(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold flex items-center gap-2">
              <History className="size-4 text-primary" />
              Detail Audit Log: {selectedMeta?.action}
            </DialogTitle>
            <DialogDescription className="text-xs font-mono">
              Entitas: {selectedMeta?.entity_type} • ID: {selectedMeta?.entity_id || '-'}
            </DialogDescription>
          </DialogHeader>

          {selectedMeta && (
            <div className="space-y-3 py-2 text-xs">
              <div className="rounded-lg border border-border bg-muted/40 p-3 overflow-x-auto">
                <pre className="text-[11px] font-mono text-foreground whitespace-pre-wrap">
                  {JSON.stringify(selectedMeta.metadata || {}, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button size="sm" className="text-xs" onClick={() => setSelectedMeta(null)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
