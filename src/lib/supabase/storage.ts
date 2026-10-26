import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import {
  StorageBucket,
  STORAGE_BUCKET_RULES,
  FORBIDDEN_FILE_EXTENSIONS,
} from '@/types/storage.types';

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validasi ekstensi, MIME type, dan batas ukuran file di sisi server
 */
export function validateFileServer(
  filename: string,
  mimeType: string,
  sizeBytes: number,
  bucket: StorageBucket
): FileValidationResult {
  const rule = STORAGE_BUCKET_RULES[bucket];
  if (!rule) {
    return { valid: false, error: 'Bucket penyimpanan tidak valid.' };
  }

  // 1. Ekstraksi ekstensi file
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return { valid: false, error: 'Berkas wajib memiliki ekstensi yang valid.' };
  }
  const extension = filename.slice(lastDotIndex).toLowerCase();

  // 2. Tolak file berbahaya (Security Guard)
  if (
    FORBIDDEN_FILE_EXTENSIONS.includes(
      extension as (typeof FORBIDDEN_FILE_EXTENSIONS)[number]
    )
  ) {
    return {
      valid: false,
      error: `Format berkas ${extension} dilarang demi keamanan sistem.`,
    };
  }

  // 3. Validasi ekstensi yang diizinkan untuk bucket
  if (!rule.allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: `Ekstensi ${extension} tidak didukung pada kategori ${bucket}. Format yang didukung: ${rule.allowedExtensions.join(', ')}.`,
    };
  }

  // 4. Validasi MIME type
  if (!rule.allowedMimeTypes.includes(mimeType)) {
    return {
      valid: false,
      error: `Tipe MIME ${mimeType} tidak didukung. Format yang diizinkan: ${rule.allowedExtensions.join(', ')}.`,
    };
  }

  // 5. Validasi batas ukuran file
  if (sizeBytes > rule.maxSizeBytes) {
    const maxMb = Math.round(rule.maxSizeBytes / (1024 * 1024));
    return {
      valid: false,
      error: `Ukuran berkas melebihi batas maksimum (${maxMb} MB).`,
    };
  }

  return { valid: true };
}

/**
 * Pembuatan Signed URL berumur pendek untuk akses file privat (default 5 menit / 300 detik)
 */
export async function createSignedUrl(
  bucket: StorageBucket,
  path: string,
  expiresInSeconds: number = 300
): Promise<string> {
  const serverSupabase = await createClient();
  const { data, error } = await serverSupabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresInSeconds);

  if (error || !data?.signedUrl) {
    throw new Error(
      `Gagal menghasilkan tautan aman untuk berkas: ${error?.message || 'Akses ditolak.'}`
    );
  }

  return data.signedUrl;
}

/**
 * Generator Signed URL menggunakan Admin Client untuk proses server latar belakang
 */
export async function createAdminSignedUrl(
  bucket: StorageBucket,
  path: string,
  expiresInSeconds: number = 300
): Promise<string> {
  const adminSupabase = createAdminClient();
  const { data, error } = await adminSupabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresInSeconds);

  if (error || !data?.signedUrl) {
    throw new Error(
      `Gagal menghasilkan tautan aman admin: ${error?.message || 'Akses ditolak.'}`
    );
  }

  return data.signedUrl;
}

/**
 * Unggah berkas ke Storage Bucket dengan validasi server
 */
export async function uploadStorageFile(
  bucket: StorageBucket,
  path: string,
  fileBody: ArrayBuffer | Buffer,
  filename: string,
  mimeType: string,
  sizeBytes: number
): Promise<{ path: string; publicUrl?: string }> {
  // 1. Validasi server
  const validation = validateFileServer(filename, mimeType, sizeBytes, bucket);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // 2. Eksekusi upload via admin client
  const adminSupabase = createAdminClient();
  const { error } = await adminSupabase.storage.from(bucket).upload(path, fileBody, {
    contentType: mimeType,
    upsert: true,
  });

  if (error) {
    throw new Error(`Gagal mengunggah berkas ke ${bucket}: ${error.message}`);
  }

  // 3. Jika bucket publik (images), dapatkan public URL
  if (bucket === 'images') {
    const { data } = adminSupabase.storage.from(bucket).getPublicUrl(path);
    return { path, publicUrl: data.publicUrl };
  }

  return { path };
}

/**
 * Hapus berkas dari Storage Bucket
 */
export async function deleteStorageFile(
  bucket: StorageBucket,
  path: string
): Promise<void> {
  const adminSupabase = createAdminClient();
  const { error } = await adminSupabase.storage.from(bucket).remove([path]);
  if (error) {
    throw new Error(`Gagal menghapus berkas dari ${bucket}: ${error.message}`);
  }
}
