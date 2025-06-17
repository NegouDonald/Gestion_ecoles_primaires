import type { Student } from "./student.types";

export interface Discipline {
  id: number;
  student: Student;
  type: DisciplineType;
  incidentDate: string;
  description: string;
  action?: string;
  resolved: boolean;
  createdAt: string;
  reportedBy?: string;
}

export interface DisciplineResponse {
  id: number;
  studentName: string;
  type: DisciplineType;
  incidentDate: string;
  description: string;
  action?: string;
  resolved: boolean;
  createdAt: string;
  reportedBy?: string;
}

export interface DisciplineCreateRequest {
  studentId: number;
  type: DisciplineType;
  incidentDate: string;
  description: string;
  action?: string;
  reportedBy?: string;
  resolved?: boolean;
}

export const DisciplineTypes = {
  BLAME: 'BLAME',
  CONVOCATION: 'CONVOCATION',
} as const;

export type DisciplineType = keyof typeof DisciplineTypes;

export const DisciplineTypeDisplayNames: Record<DisciplineType, string> = {
  BLAME: 'Blâme',
  CONVOCATION: 'Convocation',
};