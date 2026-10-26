import { requireRole } from '@/lib/supabase/auth-helpers';
import { createClient } from '@/lib/supabase/server';
import { BeritaClient, NewsItem } from './_components/berita-client';

export default async function AdminBeritaPage() {
  await requireRole(['admin', 'super_admin']);
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from('news_posts')
    .select(`
      id,
      title,
      slug,
      excerpt,
      content,
      cover_url,
      cover_path,
      status,
      published_at,
      created_at,
      profiles (
        name
      )
    `)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Manajemen Publikasi Berita Sekolah
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Tulis dan kelola warta kegiatan, prestasi murid, dan pengumuman resmi yang tayang pada portal publik SDIT Fajar.
        </p>
      </div>

      <BeritaClient initialPosts={(posts as unknown as NewsItem[]) || []} />
    </div>
  );
}
