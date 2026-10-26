export const USER_ROLES = [
  'super_admin',
  'admin',
  'guru',
  'murid',
  'wali_murid',
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const ROLE_DASHBOARD_PATH: Record<UserRole, string> = {
  super_admin: '/dashboard/super-admin',
  admin: '/dashboard/admin',
  guru: '/dashboard/guru',
  murid: '/dashboard/murid',
  wali_murid: '/dashboard/wali-murid',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Administrator',
  guru: 'Tenaga Pendidik / Guru',
  murid: 'Murid',
  wali_murid: 'Wali Murid',
};
