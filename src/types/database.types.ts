// ==============================================================================
// DATABASE TYPES — SDIT FAJAR
// Auto-aligned with Supabase PostgreSQL 15+ Schema (PRD 08 & Fase 3)
// Zero 'any' policy strictly enforced
// ==============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// 12 PostgreSQL Enums Resmi
export type AppRole = 'super_admin' | 'admin' | 'guru' | 'murid' | 'wali_murid';
export type PublishStatus = 'draft' | 'published' | 'archived';
export type AssignmentStatus = 'draft' | 'published' | 'closed';
export type SubmissionStatus = 'not_submitted' | 'submitted' | 'late' | 'graded';
export type PaymentStatus = 'draft' | 'unpaid' | 'pending' | 'paid' | 'expired' | 'failed' | 'cancelled';
export type PaymentType =
  | 'spp'
  | 'iuran_ekstrakurikuler'
  | 'pendaftaran_semester_ganjil'
  | 'pendaftaran_semester_genap'
  | 'marketplace'
  | 'lainnya';
export type RegistrationStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
export type AdmissionWaveStatus = 'draft' | 'open' | 'closed' | 'archived';
export type DocumentVerificationStatus = 'pending' | 'valid' | 'invalid';
export type AttendanceStatus = 'present' | 'late' | 'absent' | 'excused';
export type OrderStatus = 'draft' | 'pending_payment' | 'paid' | 'cancelled' | 'fulfilled';
export type TahfidzPredicate = 'mumtaz' | 'jayyid_jiddan' | 'jayyid' | 'maqbul';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          login_identifier: string;
          role: AppRole;
          avatar_url: string | null;
          phone: string | null;
          is_active: boolean;
          must_change_password: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email?: string | null;
          login_identifier: string;
          role: AppRole;
          avatar_url?: string | null;
          phone?: string | null;
          is_active?: boolean;
          must_change_password?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      school_settings: {
        Row: {
          id: string;
          school_name: string;
          logo_url: string | null;
          address: string | null;
          phone: string | null;
          whatsapp: string | null;
          email: string | null;
          maps_url: string | null;
          social_links: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_name?: string;
          logo_url?: string | null;
          address?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          email?: string | null;
          maps_url?: string | null;
          social_links?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['school_settings']['Insert']>;
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['audit_logs']['Insert']>;
      };
      academic_years: {
        Row: {
          id: string;
          name: string;
          start_date: string;
          end_date: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          start_date: string;
          end_date: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['academic_years']['Insert']>;
      };
      semesters: {
        Row: {
          id: string;
          academic_year_id: string;
          name: string;
          start_date: string;
          end_date: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          academic_year_id: string;
          name: string;
          start_date: string;
          end_date: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['semesters']['Insert']>;
      };
      school_period_settings: {
        Row: {
          id: string;
          academic_year_id: string;
          semester_id: string | null;
          active_month: number;
          active_year: number;
          teacher_weekend_attendance_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          academic_year_id: string;
          semester_id?: string | null;
          active_month: number;
          active_year: number;
          teacher_weekend_attendance_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['school_period_settings']['Insert']>;
      };
      classes: {
        Row: {
          id: string;
          name: string;
          grade_level: number;
          description: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          grade_level: number;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['classes']['Insert']>;
      };
      positions: {
        Row: {
          id: string;
          code: string;
          name: string;
          category: string;
          description: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          category: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['positions']['Insert']>;
      };
      teachers: {
        Row: {
          id: string;
          profile_id: string;
          nip: string | null;
          nuptk: string | null;
          bio: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          nip?: string | null;
          nuptk?: string | null;
          bio?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['teachers']['Insert']>;
      };
      students: {
        Row: {
          id: string;
          profile_id: string;
          nis: string;
          nisn: string | null;
          gender: string | null;
          birth_place: string | null;
          birth_date: string | null;
          address: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          nis: string;
          nisn?: string | null;
          gender?: string | null;
          birth_place?: string | null;
          birth_date?: string | null;
          address?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['students']['Insert']>;
      };
      parents: {
        Row: {
          id: string;
          profile_id: string;
          occupation: string | null;
          address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          occupation?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['parents']['Insert']>;
      };
      parent_students: {
        Row: {
          id: string;
          parent_id: string;
          student_id: string;
          relationship: string;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          parent_id: string;
          student_id: string;
          relationship?: string;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['parent_students']['Insert']>;
      };
      classrooms: {
        Row: {
          id: string;
          class_id: string;
          academic_year_id: string;
          name: string;
          homeroom_teacher_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          class_id: string;
          academic_year_id: string;
          name: string;
          homeroom_teacher_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['classrooms']['Insert']>;
      };
      teacher_positions: {
        Row: {
          id: string;
          teacher_id: string;
          position_id: string;
          classroom_id: string | null;
          academic_year_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          teacher_id: string;
          position_id: string;
          classroom_id?: string | null;
          academic_year_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['teacher_positions']['Insert']>;
      };
      class_students: {
        Row: {
          id: string;
          classroom_id: string;
          student_id: string;
          joined_at: string;
          left_at: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          classroom_id: string;
          student_id: string;
          joined_at?: string;
          left_at?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['class_students']['Insert']>;
      };
      subjects: {
        Row: {
          id: string;
          name: string;
          code: string | null;
          grade_level: number | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code?: string | null;
          grade_level?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['subjects']['Insert']>;
      };
      teaching_assignments: {
        Row: {
          id: string;
          teacher_id: string;
          subject_id: string;
          classroom_id: string;
          semester_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          teacher_id: string;
          subject_id: string;
          classroom_id: string;
          semester_id: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['teaching_assignments']['Insert']>;
      };
      schedules: {
        Row: {
          id: string;
          classroom_id: string;
          subject_id: string;
          teacher_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          room: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          classroom_id: string;
          subject_id: string;
          teacher_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          room?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['schedules']['Insert']>;
      };
      admission_waves: {
        Row: {
          id: string;
          academic_year_id: string;
          semester_id: string | null;
          wave_number: number;
          title: string;
          description: string | null;
          start_date: string;
          end_date: string;
          quota: number;
          registration_fee: number;
          observation_date: string | null;
          announcement_date: string | null;
          status: AdmissionWaveStatus;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          academic_year_id: string;
          semester_id?: string | null;
          wave_number: number;
          title: string;
          description?: string | null;
          start_date: string;
          end_date: string;
          quota?: number;
          registration_fee?: number;
          observation_date?: string | null;
          announcement_date?: string | null;
          status?: AdmissionWaveStatus;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['admission_waves']['Insert']>;
      };
      student_registration_applications: {
        Row: {
          id: string;
          admission_wave_id: string;
          registration_number: string;
          student_name: string;
          nik: string | null;
          nisn: string | null;
          gender: string | null;
          birth_place: string | null;
          birth_date: string | null;
          child_number: number | null;
          total_siblings: number | null;
          special_needs: string | null;
          previous_school: string | null;
          parent_name: string;
          father_name: string | null;
          father_nik: string | null;
          father_occupation: string | null;
          father_phone: string | null;
          mother_name: string | null;
          mother_nik: string | null;
          mother_occupation: string | null;
          mother_phone: string | null;
          parent_phone: string;
          parent_email: string | null;
          address: string | null;
          status: RegistrationStatus;
          observation_score: number | null;
          admin_notes: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          admission_wave_id: string;
          registration_number: string;
          student_name: string;
          nik?: string | null;
          nisn?: string | null;
          gender?: string | null;
          birth_place?: string | null;
          birth_date?: string | null;
          child_number?: number | null;
          total_siblings?: number | null;
          special_needs?: string | null;
          previous_school?: string | null;
          parent_name: string;
          father_name?: string | null;
          father_nik?: string | null;
          father_occupation?: string | null;
          father_phone?: string | null;
          mother_name?: string | null;
          mother_nik?: string | null;
          mother_occupation?: string | null;
          mother_phone?: string | null;
          parent_phone: string;
          parent_email?: string | null;
          address?: string | null;
          status?: RegistrationStatus;
          observation_score?: number | null;
          admin_notes?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['student_registration_applications']['Insert']>;
      };
      student_registration_documents: {
        Row: {
          id: string;
          application_id: string;
          document_type: string;
          file_url: string | null;
          file_path: string;
          original_filename: string | null;
          mime_type: string | null;
          file_size: number | null;
          verification_status: DocumentVerificationStatus;
          admin_feedback: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          document_type: string;
          file_url?: string | null;
          file_path: string;
          original_filename?: string | null;
          mime_type?: string | null;
          file_size?: number | null;
          verification_status?: DocumentVerificationStatus;
          admin_feedback?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['student_registration_documents']['Insert']>;
      };
      teacher_attendances: {
        Row: {
          id: string;
          teacher_id: string;
          attendance_date: string;
          session: 'check_in' | 'check_out';
          recorded_at: string;
          status: AttendanceStatus;
          recorded_by: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          teacher_id: string;
          attendance_date: string;
          session: 'check_in' | 'check_out';
          recorded_at?: string;
          status?: AttendanceStatus;
          recorded_by?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['teacher_attendances']['Insert']>;
      };
      student_attendances: {
        Row: {
          id: string;
          student_id: string;
          schedule_id: string;
          classroom_id: string;
          attendance_date: string;
          status: AttendanceStatus;
          recorded_by: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          schedule_id: string;
          classroom_id: string;
          attendance_date: string;
          status?: AttendanceStatus;
          recorded_by?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['student_attendances']['Insert']>;
      };
      materials: {
        Row: {
          id: string;
          title: string;
          slug: string | null;
          description: string | null;
          content: string | null;
          file_url: string | null;
          file_path: string | null;
          external_url: string | null;
          subject_id: string;
          classroom_id: string;
          teacher_id: string;
          semester_id: string;
          status: PublishStatus;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug?: string | null;
          description?: string | null;
          content?: string | null;
          file_url?: string | null;
          file_path?: string | null;
          external_url?: string | null;
          subject_id: string;
          classroom_id: string;
          teacher_id: string;
          semester_id: string;
          status?: PublishStatus;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['materials']['Insert']>;
      };
      assignments: {
        Row: {
          id: string;
          title: string;
          description: string;
          instructions: string | null;
          file_url: string | null;
          file_path: string | null;
          subject_id: string;
          classroom_id: string;
          teacher_id: string;
          semester_id: string;
          due_at: string | null;
          status: AssignmentStatus;
          allow_late_submission: boolean;
          max_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          instructions?: string | null;
          file_url?: string | null;
          file_path?: string | null;
          subject_id: string;
          classroom_id: string;
          teacher_id: string;
          semester_id: string;
          due_at?: string | null;
          status?: AssignmentStatus;
          allow_late_submission?: boolean;
          max_score?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['assignments']['Insert']>;
      };
      assignment_submissions: {
        Row: {
          id: string;
          assignment_id: string;
          student_id: string;
          answer_text: string | null;
          file_url: string | null;
          file_path: string | null;
          submitted_at: string | null;
          status: SubmissionStatus;
          score: number | null;
          feedback: string | null;
          graded_by: string | null;
          graded_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          assignment_id: string;
          student_id: string;
          answer_text?: string | null;
          file_url?: string | null;
          file_path?: string | null;
          submitted_at?: string | null;
          status?: SubmissionStatus;
          score?: number | null;
          feedback?: string | null;
          graded_by?: string | null;
          graded_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['assignment_submissions']['Insert']>;
      };
      grades: {
        Row: {
          id: string;
          student_id: string;
          subject_id: string;
          classroom_id: string;
          semester_id: string;
          teacher_id: string;
          score: number;
          grade_type: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          subject_id: string;
          classroom_id: string;
          semester_id: string;
          teacher_id: string;
          score: number;
          grade_type?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['grades']['Insert']>;
      };
      announcements: {
        Row: {
          id: string;
          title: string;
          content: string;
          target_type: 'all' | 'role' | 'class' | 'student';
          target_role: AppRole | null;
          classroom_id: string | null;
          student_id: string | null;
          created_by: string;
          status: PublishStatus;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          target_type?: 'all' | 'role' | 'class' | 'student';
          target_role?: AppRole | null;
          classroom_id?: string | null;
          student_id?: string | null;
          created_by: string;
          status?: PublishStatus;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['announcements']['Insert']>;
      };
      news_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          cover_url: string | null;
          cover_path: string | null;
          author_id: string;
          status: PublishStatus;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content: string;
          cover_url?: string | null;
          cover_path?: string | null;
          author_id: string;
          status?: PublishStatus;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['news_posts']['Insert']>;
      };
      tahfidz_records: {
        Row: {
          id: string;
          student_id: string;
          teacher_id: string;
          surah_number: number;
          ayat_start: number;
          ayat_end: number;
          predicate: TahfidzPredicate;
          record_date: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          teacher_id: string;
          surah_number: number;
          ayat_start: number;
          ayat_end: number;
          predicate?: TahfidzPredicate;
          record_date?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['tahfidz_records']['Insert']>;
      };
      import_batches: {
        Row: {
          id: string;
          imported_by: string;
          entity_type: string;
          template_version: string;
          source_file_url: string | null;
          total_rows: number;
          success_rows: number;
          failed_rows: number;
          errors: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          imported_by: string;
          entity_type: string;
          template_version?: string;
          source_file_url?: string | null;
          total_rows?: number;
          success_rows?: number;
          failed_rows?: number;
          errors?: Json | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['import_batches']['Insert']>;
      };
      payment_settings: {
        Row: {
          id: string;
          provider: string;
          environment: 'sandbox' | 'production';
          merchant_id: string | null;
          client_key: string | null;
          provider_logo_url: string | null;
          is_enabled: boolean;
          is_spp_enabled: boolean;
          is_iuran_enabled: boolean;
          is_pendaftaran_semester_enabled: boolean;
          is_marketplace_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          provider?: string;
          environment?: 'sandbox' | 'production';
          merchant_id?: string | null;
          client_key?: string | null;
          provider_logo_url?: string | null;
          is_enabled?: boolean;
          is_spp_enabled?: boolean;
          is_iuran_enabled?: boolean;
          is_pendaftaran_semester_enabled?: boolean;
          is_marketplace_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['payment_settings']['Insert']>;
      };
      marketplace_products: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          cover_url: string | null;
          file_url: string | null;
          file_path: string | null;
          price: number;
          is_published: boolean;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          cover_url?: string | null;
          file_url?: string | null;
          file_path?: string | null;
          price?: number;
          is_published?: boolean;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['marketplace_products']['Insert']>;
      };
      marketplace_orders: {
        Row: {
          id: string;
          parent_id: string;
          student_id: string | null;
          status: OrderStatus;
          total_amount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          parent_id: string;
          student_id?: string | null;
          status?: OrderStatus;
          total_amount?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['marketplace_orders']['Insert']>;
      };
      marketplace_order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity?: number;
          unit_price: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['marketplace_order_items']['Insert']>;
      };
      payment_invoices: {
        Row: {
          id: string;
          student_id: string | null;
          parent_id: string | null;
          marketplace_order_id: string | null;
          academic_year_id: string;
          type: PaymentType;
          billing_month: number | null;
          billing_year: number | null;
          title: string;
          amount: number;
          due_date: string | null;
          reminder_offsets: number[];
          status: PaymentStatus;
          notes: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id?: string | null;
          parent_id?: string | null;
          marketplace_order_id?: string | null;
          academic_year_id: string;
          type: PaymentType;
          billing_month?: number | null;
          billing_year?: number | null;
          title: string;
          amount: number;
          due_date?: string | null;
          reminder_offsets?: number[];
          status?: PaymentStatus;
          notes?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['payment_invoices']['Insert']>;
      };
      payment_transactions: {
        Row: {
          id: string;
          invoice_id: string;
          provider: string;
          order_id: string;
          transaction_id: string | null;
          snap_token: string | null;
          redirect_url: string | null;
          gross_amount: number;
          status: PaymentStatus;
          paid_at: string | null;
          payer_bank_name: string | null;
          payer_bank_account_number: string | null;
          payer_bank_account_name: string | null;
          destination_bank_name: string | null;
          destination_bank_account_number: string | null;
          destination_bank_account_name: string | null;
          raw_payload: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          provider?: string;
          order_id: string;
          transaction_id?: string | null;
          snap_token?: string | null;
          redirect_url?: string | null;
          gross_amount: number;
          status?: PaymentStatus;
          paid_at?: string | null;
          payer_bank_name?: string | null;
          payer_bank_account_number?: string | null;
          payer_bank_account_name?: string | null;
          destination_bank_name?: string | null;
          destination_bank_account_number?: string | null;
          destination_bank_account_name?: string | null;
          raw_payload?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['payment_transactions']['Insert']>;
      };
      payment_receipts: {
        Row: {
          id: string;
          invoice_id: string;
          transaction_id: string;
          student_id: string | null;
          class_name: string | null;
          school_logo_url: string | null;
          midtrans_logo_url: string | null;
          paid_at: string;
          invoice_number: string;
          student_name: string;
          amount: number;
          status: PaymentStatus;
          payer_bank_name: string | null;
          payer_bank_account_number: string | null;
          payer_bank_account_name: string | null;
          destination_bank_name: string | null;
          destination_bank_account_number: string | null;
          destination_bank_account_name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          transaction_id: string;
          student_id?: string | null;
          class_name?: string | null;
          school_logo_url?: string | null;
          midtrans_logo_url?: string | null;
          paid_at?: string;
          invoice_number: string;
          student_name: string;
          amount: number;
          status?: PaymentStatus;
          payer_bank_name?: string | null;
          payer_bank_account_number?: string | null;
          payer_bank_account_name?: string | null;
          destination_bank_name?: string | null;
          destination_bank_account_number?: string | null;
          destination_bank_account_name?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['payment_receipts']['Insert']>;
      };
    };
  };
}
