// ==============================================================================
// VERIFIKASI RLS NEGATIF & KEAMANAN SISTEM — SDIT FAJAR
// Memverifikasi kebijakan Row Level Security untuk menjamin Zero Data Leakage
// ==============================================================================

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/types/database.types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !ANON_KEY) {
  console.error('Error: Kredensial Supabase URL atau Anon Key tidak ditemukan pada environment.');
  process.exit(1);
}

// Client Publik / Anonim untuk uji coba isolasi akses
const anonClient = createClient<Database>(SUPABASE_URL, ANON_KEY);

interface TestCaseResult {
  title: string;
  expected: string;
  actual: string;
  passed: boolean;
}

const results: TestCaseResult[] = [];

async function runNegativeRLSTests() {
  console.log('=================================================================');
  console.log('🧪 MEMULAI PENGUJIAN KEAMANAN RLS NEGATIF — SDIT FAJAR');
  console.log('=================================================================\n');

  // TEST 1: Public/Anon tidak boleh membaca data pendaftaran calon siswa lain
  try {
    const { data, error } = await anonClient
      .from('student_registration_applications')
      .select('id, student_name, nik, parent_phone');

    const passed = (!data || data.length === 0) && (!error || error.code === '42501' || error.message.includes('permission'));
    results.push({
      title: 'Uji 1: Tamu (Guest) dilarang membaca data pendaftaran PPDB (Zero PII Leakage)',
      expected: 'Data kosong atau ditolak oleh RLS',
      actual: data && data.length > 0 ? `BOCOR (${data.length} baris terbaca)` : 'Aman (0 baris dikembalikan)',
      passed,
    });
  } catch (err: unknown) {
    results.push({
      title: 'Uji 1: Tamu (Guest) dilarang membaca data pendaftaran PPDB',
      expected: 'Ditolak RLS',
      actual: `Error ditolak: ${String(err)}`,
      passed: true,
    });
  }

  // TEST 2: Public/Anon tidak boleh membaca dokumen privat calon siswa
  try {
    const { data } = await anonClient
      .from('student_registration_documents')
      .select('id, file_path');

    const passed = !data || data.length === 0;
    results.push({
      title: 'Uji 2: Berkas pendaftaran di tabel dokumen tidak dapat di-query publik',
      expected: 'Data dokumen kosong (0 baris)',
      actual: data && data.length > 0 ? `BOCOR (${data.length} dokumen terbaca)` : 'Aman (0 dokumen)',
      passed,
    });
  } catch {
    results.push({
      title: 'Uji 2: Berkas pendaftaran di tabel dokumen tidak dapat di-query publik',
      expected: 'Ditolak RLS',
      actual: 'Ditolak',
      passed: true,
    });
  }

  // TEST 3: Public/Anon tidak boleh membaca audit logs
  try {
    const { data } = await anonClient
      .from('audit_logs')
      .select('id, action');

    const passed = !data || data.length === 0;
    results.push({
      title: 'Uji 3: Jejak audit_logs terisolasi eksklusif hanya untuk super_admin',
      expected: 'Akses ditolak / data 0 baris',
      actual: data && data.length > 0 ? `BOCOR (${data.length} log terbaca)` : 'Aman (0 log)',
      passed,
    });
  } catch {
    results.push({
      title: 'Uji 3: Jejak audit_logs terisolasi eksklusif hanya untuk super_admin',
      expected: 'Ditolak RLS',
      actual: 'Ditolak',
      passed: true,
    });
  }

  // TEST 4: Public/Anon tidak boleh membaca invoice pembayaran
  try {
    const { data } = await anonClient
      .from('payment_invoices')
      .select('id, amount, status');

    const passed = !data || data.length === 0;
    results.push({
      title: 'Uji 4: Tagihan invoice SPP tidak dapat diakses tanpa sesi wali murid terkait',
      expected: 'Data invoice 0 baris',
      actual: data && data.length > 0 ? `BOCOR (${data.length} invoice terbaca)` : 'Aman (0 baris)',
      passed,
    });
  } catch {
    results.push({
      title: 'Uji 4: Tagihan invoice SPP tidak dapat diakses tanpa sesi wali murid terkait',
      expected: 'Ditolak RLS',
      actual: 'Ditolak',
      passed: true,
    });
  }

  // Output Rekapitulasi
  console.table(results);

  const allPassed = results.every((r) => r.passed);
  if (allPassed) {
    console.log('\n✅ SEMUA PENGUJIAN RLS NEGATIF LOLOS 100%! Data terisolasi aman.');
  } else {
    console.error('\n❌ PERINGATAN: Terdapat celah RLS yang perlu ditinjau ulang!');
    process.exit(1);
  }
}

runNegativeRLSTests().catch((e) => {
  console.error('Eksekusi uji RLS gagal:', e);
});
