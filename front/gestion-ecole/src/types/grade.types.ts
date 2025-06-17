export interface Grade {
  id: number;
  studentId: number;
  studentName: string;
  subjectId: number;
  subjectName: string;
  score: number;
  term: string;
  academicYear: string;
  examType: string;
  gradeDate: string;
  comments?: string;
}

export interface GradeCreateRequest {
  studentId: number;
  subjectId: number;
  score: number;
  term: string;
  academicYear: string;
  examType: string;
  gradeDate: string;
  comments?: string;
}

export interface GradeUpdateRequest extends Partial<GradeCreateRequest> {
  id: number;
}