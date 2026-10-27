'use server';

import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/supabase/auth-helpers';
import { ActionResult } from '@/types/action.types';
import { revalidatePath, revalidateTag } from 'next/cache';
import { newsPostSchema, NewsPostInput } from '@/validations/news.schema';

export async function createNewsAction(
  input: NewsPostInput
): Promise<ActionResult<{ id: string }>> {
  const { user } = await requireRole(['admin', 'super_admin']);
  const parsed = newsPostSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Data artikel berita tidak valid.',
      fieldErrors: parsed.error.flatten().fieldErrors,
      code: 'VALIDATION_ERROR',
    };
  }

  const supabase = await createClient();

  const isPublished = parsed.data.status === 'published';
  const publishedAt = isPublished ? new Date().toISOString() : null;

  const { data, error } = await supabase
    .from('news_posts')
    .insert({
      title: parsed.data.title,
      slug: parsed.data.slug,
      excerpt: parsed.data.excerpt || null,
      content: parsed.data.content,
      cover_url: parsed.data.cover_url || null,
      cover_path: parsed.data.cover_path || null,
      status: parsed.data.status,
      author_id: user.id,
      published_at: publishedAt,
    })
    .select('id')
    .single();

  if (error || !data) {
    return {
      success: false,
      error: error?.message || 'Gagal menyimpan artikel berita.',
      code: 'SERVER_ERROR',
    };
  }

  await supabase.from('audit_logs').insert({
    actor_id: user.id,
    action: 'create_news_post',
    entity_type: 'news_posts',
    entity_id: data.id,
    metadata: { title: parsed.data.title, status: parsed.data.status },
  });

  revalidateTag('news', 'max');
  revalidatePath('/dashboard/admin/berita');
  revalidatePath('/berita');
  return { success: true, data: { id: data.id }, message: 'Artikel berita berhasil disimpan.' };
}

export async function updateNewsAction(
  id: string,
  input: NewsPostInput
): Promise<ActionResult<void>> {
  const { user } = await requireRole(['admin', 'super_admin']);
  const parsed = newsPostSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Data artikel berita tidak valid.',
      fieldErrors: parsed.error.flatten().fieldErrors,
      code: 'VALIDATION_ERROR',
    };
  }

  const supabase = await createClient();

  const isPublished = parsed.data.status === 'published';
  const publishedAt = isPublished ? new Date().toISOString() : null;

  const { error } = await supabase
    .from('news_posts')
    .update({
      title: parsed.data.title,
      slug: parsed.data.slug,
      excerpt: parsed.data.excerpt || null,
      content: parsed.data.content,
      cover_url: parsed.data.cover_url || null,
      cover_path: parsed.data.cover_path || null,
      status: parsed.data.status,
      published_at: publishedAt,
    })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message, code: 'SERVER_ERROR' };
  }

  await supabase.from('audit_logs').insert({
    actor_id: user.id,
    action: 'update_news_post',
    entity_type: 'news_posts',
    entity_id: id,
    metadata: { title: parsed.data.title, status: parsed.data.status },
  });

  revalidateTag('news', 'max');
  revalidateTag(`news:${parsed.data.slug}`, 'max');
  revalidatePath('/dashboard/admin/berita');
  revalidatePath('/berita');
  revalidatePath(`/berita/${parsed.data.slug}`);
  return { success: true, data: undefined, message: 'Artikel berita berhasil diperbarui.' };
}

export async function deleteNewsAction(id: string): Promise<ActionResult<void>> {
  const { user } = await requireRole(['admin', 'super_admin']);
  const supabase = await createClient();

  const { error } = await supabase.from('news_posts').delete().eq('id', id);
  if (error) {
    return { success: false, error: error.message, code: 'SERVER_ERROR' };
  }

  await supabase.from('audit_logs').insert({
    actor_id: user.id,
    action: 'delete_news_post',
    entity_type: 'news_posts',
    entity_id: id,
  });

  revalidateTag('news', 'max');
  revalidatePath('/dashboard/admin/berita');
  revalidatePath('/berita');
  return { success: true, data: undefined, message: 'Artikel berita berhasil dihapus.' };
}
