import { UserRole } from '@/constants/auth';

export interface Profile {
  id: string;
  name: string;
  email: string;
  login_identifier: string;
  role: UserRole;
  avatar_url: string | null;
  phone: string | null;
  is_active: boolean;
  must_change_password: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthSessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url: string | null;
}
