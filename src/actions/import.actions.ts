'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { requireRole } from '@/lib/supabase/auth-helpers';
import { ActionResult } from '@/types/action.types';
import { revalidatePath } from 'next/cache';
import {
  studentCsvRowSchema,
  teacherCsvRowSchema,
  parentCsvRowSchema,
  StudentCsvRow,
  TeacherCsvRow,
  ParentCsvRow,
} from '@/validations/import.schema';

export interface CsvValidationError {
  rowNumber: number;
  field?: string;
  message: string;
}

export interface CsvValidationResult<T> {
  isValid: boolean;
  totalRows: number;
  validRows: T[];
  errors: CsvValidationError[];
}

function parseCsvString(csvText: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) {
    return { headers: [], rows: [] };
  }

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim());
    const rowObj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      rowObj[h] = values[idx] || '';
    });
    rows.push(rowObj);
  }

  return { headers, rows };
}

export type ImportCsvRow = StudentCsvRow | TeacherCsvRow | ParentCsvRow;

/**
 * 1. PARSE & VALIDASI BARIS DEMI BARIS CSV
 */
export async function validateCsvDataAction(
  type: 'siswa' | 'guru' | 'wali_murid',
  csvText: string
): Promise<ActionResult<CsvValidationResult<ImportCsvRow>>> {
  await requireRole(['super_admin']);

  const { rows } = parseCsvString(csvText);

  if (rows.length === 0) {
    return {
      success: false,
      error: 'Berkas CSV kosong atau tidak memiliki baris data.',
      code: 'VALIDATION_ERROR',
    };
  }

  const errors: CsvValidationError[] = [];
  const validRows: ImportCsvRow[] = [];
  const adminClient = createAdminClient();

  if (type === 'siswa') {
    const seenNis = new Set<string>();

    for (let i = 0; i < rows.length; i++) {
      const rowNum = i + 2; // header baris 1
      const row = rows[i];

      const parsed = studentCsvRowSchema.safeParse(row);
      if (!parsed.success) {
        parsed.error.issues.forEach((issue) => {
          errors.push({
            rowNumber: rowNum,
            field: issue.path.join('.'),
            message: issue.message,
          });
        });
        continue;
      }

      if (seenNis.has(parsed.data.nis)) {
        errors.push({
          rowNumber: rowNum,
          field: 'nis',
          message: `Duplikasi NIS '${parsed.data.nis}' terdeteksi di dalam berkas CSV.`,
        });
        continue;
      }
      seenNis.add(parsed.data.nis);

      // Cek apakah NIS sudah ada di database
      const { data: existing } = await adminClient
        .from('students')
        .select('id')
        .eq('nis', parsed.data.nis)
        .maybeSingle();

      if (existing) {
        errors.push({
          rowNumber: rowNum,
          field: 'nis',
          message: `NIS '${parsed.data.nis}' sudah terdaftar pada database sistem.`,
        });
        continue;
      }

      validRows.push(parsed.data);
    }
  } else if (type === 'guru') {
    const seenNip = new Set<string>();
    const seenEmail = new Set<string>();

    for (let i = 0; i < rows.length; i++) {
      const rowNum = i + 2;
      const row = rows[i];

      const parsed = teacherCsvRowSchema.safeParse(row);
      if (!parsed.success) {
        parsed.error.issues.forEach((issue) => {
          errors.push({
            rowNumber: rowNum,
            field: issue.path.join('.'),
            message: issue.message,
          });
        });
        continue;
      }

      if (seenNip.has(parsed.data.nip)) {
        errors.push({
          rowNumber: rowNum,
          field: 'nip',
          message: `Duplikasi NIP '${parsed.data.nip}' terdeteksi di dalam berkas CSV.`,
        });
        continue;
      }
      seenNip.add(parsed.data.nip);

      if (seenEmail.has(parsed.data.email.toLowerCase())) {
        errors.push({
          rowNumber: rowNum,
          field: 'email',
          message: `Duplikasi Email '${parsed.data.email}' terdeteksi di dalam berkas CSV.`,
        });
        continue;
      }
      seenEmail.add(parsed.data.email.toLowerCase());

      // Cek apakah email sudah terdaftar
      const { data: existingProfile } = await adminClient
        .from('profiles')
        .select('id')
        .eq('email', parsed.data.email.toLowerCase())
        .maybeSingle();

      if (existingProfile) {
        errors.push({
          rowNumber: rowNum,
          field: 'email',
          message: `Email '${parsed.data.email}' sudah terdaftar pada sistem.`,
        });
        continue;
      }

      validRows.push(parsed.data);
    }
  } else if (type === 'wali_murid') {
    for (let i = 0; i < rows.length; i++) {
      const rowNum = i + 2;
      const row = rows[i];

      const parsed = parentCsvRowSchema.safeParse(row);
      if (!parsed.success) {
        parsed.error.issues.forEach((issue) => {
          errors.push({
            rowNumber: rowNum,
            field: issue.path.join('.'),
            message: issue.message,
          });
        });
        continue;
      }

      // Verifikasi foreign key: pastikan NIS siswa yang ditautkan ada di database
      const { data: student } = await adminClient
        .from('students')
        .select('id')
        .eq('nis', parsed.data.student_nis)
        .maybeSingle();

      if (!student) {
        errors.push({
          rowNumber: rowNum,
          field: 'student_nis',
          message: `Siswa dengan NIS '${parsed.data.student_nis}' tidak ditemukan di database.`,
        });
        continue;
      }

      validRows.push(parsed.data);
    }
  }

  const isValid = errors.length === 0;

  return {
    success: true,
    data: {
      isValid,
      totalRows: rows.length,
      validRows,
      errors,
    },
  };
}

/**
 * 2. COMMIT IMPORT ATOMIK
 * Tolak komit parsial bila ada baris korup demi integritas data!
 */
export async function commitCsvBatchAction(
  type: 'siswa' | 'guru' | 'wali_murid',
  rows: ImportCsvRow[]
): Promise<ActionResult<{ batchId: string; successCount: number }>> {
  const { user: currentUser } = await requireRole(['super_admin']);

  if (!rows || rows.length === 0) {
    return {
      success: false,
      error: 'Tidak ada data valid yang dapat dieksekusi.',
      code: 'VALIDATION_ERROR',
    };
  }

  const adminClient = createAdminClient();
  let successCount = 0;
  const createdUserIds: string[] = [];

  try {
    if (type === 'siswa') {
      // Ambil daftar kelas untuk pencocokan nama rombel
      const { data: classrooms } = await adminClient.from('classrooms').select('id, name');
      const classroomMap = new Map(classrooms?.map((c) => [c.name.toLowerCase().trim(), c.id]) || []);

      for (const row of rows as StudentCsvRow[]) {
        const cleanBirthPlace = row.birth_place.toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanBirthDate = row.birth_date.replace(/-/g, '');
        const defaultPassword = `${cleanBirthPlace}${cleanBirthDate}`;
        const syntheticEmail = `${row.nis}@siswa.sdit-fajar.sch.id`;

        // Buat user auth Supabase
        const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
          email: syntheticEmail,
          password: defaultPassword,
          email_confirm: true,
          user_metadata: {
            name: row.name,
            role: 'murid',
            login_identifier: row.nis,
          },
        });

        if (authError || !authData.user) {
          throw new Error(`Gagal membuat akun Auth untuk NIS ${row.nis}: ${authError?.message}`);
        }

        const studentUserId = authData.user.id;
        createdUserIds.push(studentUserId);

        // Buat profil
        await adminClient.from('profiles').insert({
          id: studentUserId,
          name: row.name,
          email: syntheticEmail,
          login_identifier: row.nis,
          role: 'murid',
          is_active: true,
          must_change_password: true,
        });

        // Buat data students
        const { data: studentRecord, error: studentError } = await adminClient
          .from('students')
          .insert({
            profile_id: studentUserId,
            nis: row.nis,
            gender: row.gender,
            birth_place: row.birth_place,
            birth_date: row.birth_date,
            address: row.address || null,
            is_active: true,
          })
          .select('id')
          .single();

        if (studentError || !studentRecord) {
          throw new Error(`Gagal menyimpan data siswa NIS ${row.nis}: ${studentError?.message}`);
        }

        // Jika ada rombel cocok, masukkan ke class_students
        if (row.classroom_name) {
          const classId = classroomMap.get(row.classroom_name.toLowerCase().trim());
          if (classId) {
            await adminClient.from('class_students').insert({
              classroom_id: classId,
              student_id: studentRecord.id,
              status: 'active',
            });
          }
        }

        successCount++;
      }
    } else if (type === 'guru') {
      for (const row of rows as TeacherCsvRow[]) {
        const defaultPassword = `FajarGuru${Math.floor(1000 + Math.random() * 9000)}!`;

        const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
          email: row.email,
          password: defaultPassword,
          email_confirm: true,
          user_metadata: {
            name: row.name,
            role: 'guru',
            login_identifier: row.email,
          },
        });

        if (authError || !authData.user) {
          throw new Error(`Gagal membuat akun guru ${row.email}: ${authError?.message}`);
        }

        const teacherUserId = authData.user.id;
        createdUserIds.push(teacherUserId);

        await adminClient.from('profiles').insert({
          id: teacherUserId,
          name: row.name,
          email: row.email,
          login_identifier: row.email,
          role: 'guru',
          phone: row.phone,
          is_active: true,
          must_change_password: true,
        });

        await adminClient.from('teachers').insert({
          profile_id: teacherUserId,
          nip: row.nip,
          nuptk: row.nuptk || null,
          is_active: true,
        });

        successCount++;
      }
    } else if (type === 'wali_murid') {
      for (const row of rows as ParentCsvRow[]) {
        // Cek apakah akun wali murid dengan nomor HP ini sudah ada
        const { data: existingProfile } = await adminClient
          .from('profiles')
          .select('id')
          .eq('login_identifier', row.phone)
          .eq('role', 'wali_murid')
          .maybeSingle();

        let parentProfileId: string;

        if (existingProfile) {
          parentProfileId = existingProfile.id;
        } else {
          const defaultPassword = `WaliFajar${Math.floor(1000 + Math.random() * 9000)}!`;
          const syntheticEmail = row.email || `${row.phone}@wali.sdit-fajar.sch.id`;

          const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
            email: syntheticEmail,
            password: defaultPassword,
            email_confirm: true,
            user_metadata: {
              name: row.parent_name,
              role: 'wali_murid',
              login_identifier: row.phone,
            },
          });

          if (authError || !authData.user) {
            throw new Error(`Gagal membuat akun wali murid ${row.phone}: ${authError?.message}`);
          }

          parentProfileId = authData.user.id;
          createdUserIds.push(parentProfileId);

          await adminClient.from('profiles').insert({
            id: parentProfileId,
            name: row.parent_name,
            email: syntheticEmail,
            login_identifier: row.phone,
            role: 'wali_murid',
            phone: row.phone,
            is_active: true,
            must_change_password: true,
          });

          await adminClient.from('parents').insert({
            profile_id: parentProfileId,
          });
        }

        // Ambil ID tabel parents
        const { data: parentRecord } = await adminClient
          .from('parents')
          .select('id')
          .eq('profile_id', parentProfileId)
          .single();

        // Ambil student by NIS
        const { data: studentRecord } = await adminClient
          .from('students')
          .select('id')
          .eq('nis', row.student_nis)
          .single();

        if (parentRecord && studentRecord) {
          await adminClient.from('parent_students').insert({
            parent_id: parentRecord.id,
            student_id: studentRecord.id,
            relationship: row.relationship,
            is_primary: true,
          });
        }

        successCount++;
      }
    }

    // Catat ke import_batches
    const { data: batchData } = await adminClient
      .from('import_batches')
      .insert({
        imported_by: currentUser.id,
        entity_type: type,
        template_version: '1.0',
        total_rows: rows.length,
        success_rows: successCount,
        failed_rows: 0,
      })
      .select('id')
      .single();

    // Catat audit log
    await adminClient.from('audit_logs').insert({
      actor_id: currentUser.id,
      action: 'commit_csv_batch',
      entity_type: 'import_batches',
      entity_id: batchData?.id || null,
      metadata: { type, total_rows: rows.length, success_rows: successCount },
    });

    revalidatePath('/dashboard/super-admin/import');
    revalidatePath('/dashboard/admin/siswa');
    revalidatePath('/dashboard/admin/guru');
    revalidatePath('/dashboard/admin/wali-murid');

    return {
      success: true,
      data: { batchId: batchData?.id || 'done', successCount },
      message: `Berhasil mengimpor ${successCount} baris data ${type} tanpa kesalahan.`,
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Kesalahan server';
    // Rollback akun yang sempat dibuat jika terjadi kegagalan di tengah jalan
    for (const id of createdUserIds) {
      await adminClient.auth.admin.deleteUser(id).catch(() => {});
    }

    return {
      success: false,
      error: `Transaksi import digagalkan demi menjaga keutuhan data: ${errorMessage}`,
      code: 'SERVER_ERROR',
    };
  }
}
