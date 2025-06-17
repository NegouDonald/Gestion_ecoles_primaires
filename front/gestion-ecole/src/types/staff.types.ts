export interface Staff {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  gender?: 'MALE' | 'FEMALE';
  role?: UserRole;
  birthDate?: string;
  hireDate?: string;
  position?: string;
  department?: string;
  salary?: number;
  user?: User;
}

export interface User {
  id?: number;
  username: string;
  password?: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  active?: boolean;
}

export interface Notification {
  id: number;
  message: string;
  read: boolean;
  createdAt: string;
  user: User;
}

export const UserRoles = {
  TEACHER: 'TEACHER',
  ADMIN_STAFF: 'ADMIN_STAFF',
  ACADEMIC_STAFF: 'ACADEMIC_STAFF',
  STUDY_DIRECTOR: 'STUDY_DIRECTOR',
} as const;

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];

export const Genders = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
} as const;

export type Gender = (typeof Genders)[keyof typeof Genders];
