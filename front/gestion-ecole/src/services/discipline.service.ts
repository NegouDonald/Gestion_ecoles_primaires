import api from './api.service';
import type { Discipline, DisciplineCreateRequest, DisciplineResponse } from '../types/discipline.types';
import type { Pageable, PaginatedResponse } from '../types/api.types';

export const disciplineService = {
  createDiscipline: async (discipline: DisciplineCreateRequest): Promise<DisciplineResponse> => {
    try {
      const response = await api.post<DisciplineResponse>('/disciplines', discipline);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la création de la mesure disciplinaire';
      throw new Error(message);
    }
  },

  getAllDisciplines: async (pageable: Pageable): Promise<PaginatedResponse<DisciplineResponse>> => {
    try {
      const response = await api.get<PaginatedResponse<DisciplineResponse>>('/disciplines', {
        params: { page: pageable.page, size: pageable.size, sort: pageable.sort },
      });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la récupération des mesures disciplinaires';
      throw new Error(message);
    }
  },

  getDisciplineById: async (id: number): Promise<DisciplineResponse> => {
    try {
      const response = await api.get<DisciplineResponse>(`/disciplines/${id}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la récupération de la mesure disciplinaire';
      throw new Error(message);
    }
  },

  getDisciplinesByStudent: async (studentId: number): Promise<DisciplineResponse[]> => {
    try {
      const response = await api.get<DisciplineResponse[]>(`/disciplines/student/${studentId}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la récupération des mesures par étudiant';
      throw new Error(message);
    }
  },

  updateDiscipline: async (id: number, discipline: DisciplineCreateRequest): Promise<DisciplineResponse> => {
    try {
      const response = await api.put<DisciplineResponse>(`/disciplines/${id}`, discipline);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la mise à jour de la mesure disciplinaire';
      throw new Error(message);
    }
  },

  deleteDiscipline: async (id: number): Promise<void> => {
    try {
      await api.delete(`/disciplines/${id}`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la suppression de la mesure disciplinaire';
      throw new Error(message);
    }
  },

  markAsResolved: async (id: number, action: string): Promise<DisciplineResponse> => {
    try {
      const response = await api.post<DisciplineResponse>(`/disciplines/${id}/resolve`, {}, { params: { action } });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la résolution de la mesure disciplinaire';
      throw new Error(message);
    }
  },
};