import type { Grade, GradeCreateRequest, GradeUpdateRequest } from '../types/grade.types';
import { api } from './api.service';

export const gradeService = {
  async getAllGrades(): Promise<Grade[]> {
    const response = await api.get<Grade[]>('/grades');
    return response.data;
  },

  async getGradeById(id: number): Promise<Grade> {
    const response = await api.get<Grade>(`/grades/${id}`);
    return response.data;
  },

  async createGrade(data: GradeCreateRequest): Promise<Grade> {
    const response = await api.post<Grade>('/grades', data);
    return response.data;
  },

  async updateGrade(id: number, data: GradeUpdateRequest): Promise<Grade> {
    const response = await api.put<Grade>(`/grades/${id}`, data);
    return response.data;
  },

  async deleteGrade(id: number): Promise<void> {
    await api.delete(`/grades/${id}`);
  },

  async getGradesByStudent(studentId: number): Promise<Grade[]> {
    const response = await api.get<Grade[]>(`/grades/student/${studentId}`);
    return response.data;
  }
};