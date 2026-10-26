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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { createNewsAction, updateNewsAction, deleteNewsAction } from '@/actions/news.actions';
import { Newspaper, Plus, Edit, Trash2, Globe } from 'lucide-react';
import Link from 'next/link';

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_url: string | null;
  cover_path: string | null;
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
  created_at: string;
  profiles?: {
    name: string;
  };
}

export function BeritaClient({ initialPosts }: { initialPosts: NewsItem[] }) {
  const [posts, setPosts] = React.useState<NewsItem[]>(initialPosts);
  const [isPending, startTransition] = React.useTransition();

  // Modal State
  const [isOpen, setIsOpen] = React.useState(false);
  const [editingPost, setEditingPost] = React.useState<NewsItem | null>(null);

  // Form State
  const [title, setTitle] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [excerpt, setExcerpt] = React.useState('');
  const [content, setContent] = React.useState('');
  const [coverUrl, setCoverUrl] = React.useState('');
  const [status, setStatus] = React.useState<'draft' | 'published'>('draft');

  const openCreateModal = () => {
    setEditingPost(null);
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setCoverUrl('');
    setStatus('draft');
    setIsOpen(true);
  };

  const openEditModal = (item: NewsItem) => {
    setEditingPost(item);
    setTitle(item.title);
    setSlug(item.slug);
    setExcerpt(item.excerpt || '');
    setContent(item.content);
    setCoverUrl(item.cover_url || '');
    setStatus(item.status === 'published' ? 'published' : 'draft');
    setIsOpen(true);
  };

  // Helper Auto Generate Slug dari Judul
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingPost) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .slice(0, 60);
      setSlug(generated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      if (editingPost) {
        const res = await updateNewsAction(editingPost.id, {
          title,
          slug,
          excerpt,
          content,
          cover_url: coverUrl || null,
          status,
        });

        if (res.success) {
          toast.success(res.message);
          setIsOpen(false);
          window.location.reload();
        } else {
          toast.error(res.error);
        }
      } else {
        const res = await createNewsAction({
          title,
          slug,
          excerpt,
          content,
          cover_url: coverUrl || null,
          status,
        });

        if (res.success) {
          toast.success(res.message);
          setIsOpen(false);
          window.location.reload();
        } else {
          toast.error(res.error);
        }
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus artikel berita ini?')) return;

    startTransition(async () => {
      const res = await deleteNewsAction(id);
      if (res.success) {
        toast.success(res.message);
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } else {
        toast.error(res.error);
      }
    });
  };

  const columns: ZebraColumn<NewsItem>[] = [
    {
      header: 'Judul Warta Berita',
      cell: (item) => (
        <div>
          <span className="font-semibold text-xs text-foreground block">
            {item.title}
          </span>
          <span className="text-[11px] text-muted-foreground font-mono">
            /{item.slug}
          </span>
        </div>
      ),
    },
    {
      header: 'Status Tayang',
      cell: (item) => (
        item.status === 'published' ? (
          <Badge variant="outline" className="text-emerald-600 border-emerald-400 font-mono text-[11px]">
            Terbit (Publik)
          </Badge>
        ) : (
          <Badge variant="outline" className="text-muted-foreground border-border font-mono text-[11px]">
            Konsep (Draft)
          </Badge>
        )
      ),
    },
    {
      header: 'Penulis & Tanggal',
      cell: (item) => (
        <div>
          <span className="text-xs text-foreground block font-medium">
            {item.profiles?.name || 'Humas SDIT Fajar'}
          </span>
          <span className="text-[11px] text-muted-foreground font-mono">
            {item.published_at
              ? new Date(item.published_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })
              : 'Belum Terbit'}
          </span>
        </div>
      ),
    },
    {
      header: 'Aksi',
      align: 'right',
      cell: (item) => (
        <div className="flex items-center justify-end gap-1.5">
          {item.status === 'published' && (
            <Button asChild variant="ghost" size="sm" className="h-7 text-[11px] px-2 text-primary">
              <Link href={`/berita/${item.slug}`} target="_blank">
                <Globe className="size-3 mr-1" />
                Lihat
              </Link>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            className="h-7 text-[11px] px-2"
            onClick={() => openEditModal(item)}
          >
            <Edit className="size-3 mr-1" />
            Edit
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-[11px] px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
            disabled={isPending}
            onClick={() => handleDelete(item.id)}
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          Total artikel tersimpan: <span className="font-semibold text-foreground">{posts.length}</span> berita.
        </p>
        <Button size="sm" className="text-xs h-9" onClick={openCreateModal}>
          <Plus className="size-3.5 mr-1.5" />
          Tulis Berita Baru
        </Button>
      </div>

      <ZebraDataTable data={posts} columns={columns} emptyText="Belum ada artikel berita yang dibuat." />

      {/* Modal Tulis / Edit Berita */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold flex items-center gap-2">
              <Newspaper className="size-4 text-primary" />
              {editingPost ? 'Edit Artikel Berita' : 'Tulis Berita Baru'}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Publikasikan kegiatan murid, artikel keagamaan, dan kabar prestasi sekolah.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3.5 py-2">
            <div className="space-y-1">
              <Label className="text-xs">Judul Artikel Berita</Label>
              <Input
                required
                placeholder="Contoh: Murid SDIT Fajar Raih Juara 1 MHQ Tingkat Kota Depok"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="text-xs h-8"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Slug URL</Label>
                <Input
                  required
                  placeholder="murid-raih-juara-1-mhq"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="text-xs h-8 font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Status Publikasi</Label>
                <Select
                  value={status}
                  onValueChange={(v: 'draft' | 'published') => setStatus(v)}
                >
                  <SelectTrigger className="text-xs h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Konsep (Draft - Belum Tayang)</SelectItem>
                    <SelectItem value="published">Terbit (Published - Tayang di Web)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Cuplikan Ringkas (Excerpt)</Label>
              <Input
                placeholder="Ringkasan 1-2 kalimat untuk kartu cuplikan..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="text-xs h-8"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">URL Gambar Cover (Opsional)</Label>
              <Input
                placeholder="https://images.unsplash.com/... atau path bucket images"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                className="text-xs h-8 font-mono"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Isi Lengkap Berita</Label>
              <textarea
                required
                rows={7}
                placeholder="Tuliskan isi berita selengkapnya di sini..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" className="text-xs" onClick={() => setIsOpen(false)}>
                Batal
              </Button>
              <Button type="submit" size="sm" className="text-xs" disabled={isPending}>
                {isPending ? 'Menyimpan...' : 'Simpan Artikel'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
