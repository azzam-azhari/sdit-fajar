import { z } from 'zod';

const uuid = z.string().uuid('Referensi data tidak valid.');

export const materialSchema = z.object({
  title: z.string().trim().min(3, 'Judul materi minimal 3 karakter.').max(160),
  description: z.string().trim().max(1000).nullable().optional(),
  content: z.string().trim().max(20000).nullable().optional(),
  external_url: z.url('Tautan materi tidak valid.').nullable().optional(),
  subject_id: uuid,
  classroom_id: uuid,
  semester_id: uuid,
  status: z.enum(['draft', 'published', 'archived']),
}).refine((value) => value.content || value.external_url, {
  message: 'Isi panduan atau tautan materi wajib diisi bila tidak ada berkas.',
});

export const assignmentSchema = z.object({
  title: z.string().trim().min(3, 'Judul tugas minimal 3 karakter.').max(160),
  description: z.string().trim().min(3, 'Deskripsi tugas wajib diisi.').max(5000),
  instructions: z.string().trim().max(20000).nullable().optional(),
  subject_id: uuid,
  classroom_id: uuid,
  semester_id: uuid,
  due_at: z.string().datetime({ offset: true }),
  status: z.enum(['draft', 'published', 'closed']),
  allow_late_submission: z.boolean().default(true),
  max_score: z.number().min(1).max(100).default(100),
});

export const submissionSchema = z.object({
  assignment_id: uuid,
  answer_text: z.string().trim().max(20000).nullable().optional(),
}).refine((value) => Boolean(value.answer_text), { message: 'Jawaban teks atau berkas wajib diisi.' });

export const gradeSubmissionSchema = z.object({
  submission_id: uuid,
  score: z.number().min(0).max(100),
  feedback: z.string().trim().max(4000).nullable().optional(),
});

export const finalGradeSchema = z.object({
  student_id: uuid,
  subject_id: uuid,
  classroom_id: uuid,
  semester_id: uuid,
  score: z.number().min(0).max(100),
  description: z.string().trim().max(2000).nullable().optional(),
});

export const scheduleSchema = z.object({
  classroom_id: uuid,
  subject_id: uuid,
  teacher_id: uuid,
  semester_id: uuid,
  day_of_week: z.number().int().min(1).max(5),
  start_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Format jam HH:MM.'),
  end_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Format jam HH:MM.'),
  room: z.string().trim().max(80).nullable().optional(),
}).refine((value) => value.end_time > value.start_time, { message: 'Jam selesai harus setelah jam mulai.' });

export const studentAttendanceSchema = z.object({
  schedule_id: uuid,
  classroom_id: uuid,
  records: z.array(z.object({
    student_id: uuid,
    status: z.enum(['present', 'excused', 'sick', 'absent']),
    notes: z.string().trim().max(500).nullable().optional(),
  })).min(1, 'Pilih minimal satu murid.'),
});

export type MaterialInput = z.infer<typeof materialSchema>;
export type AssignmentInput = z.infer<typeof assignmentSchema>;
export type SubmissionInput = z.infer<typeof submissionSchema>;
export type GradeSubmissionInput = z.infer<typeof gradeSubmissionSchema>;
export type FinalGradeInput = z.infer<typeof finalGradeSchema>;
export type ScheduleInput = z.infer<typeof scheduleSchema>;
export type StudentAttendanceInput = z.infer<typeof studentAttendanceSchema>;
