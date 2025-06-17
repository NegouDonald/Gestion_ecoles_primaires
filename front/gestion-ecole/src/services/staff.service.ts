import api from './api.service';
import type { Staff } from '../types/staff.types';
import type { Pageable } from '../types/api.types';

export const staffService = {
  createStaff: async (staff: Partial<Staff>): Promise<Staff> => {
    try {
      const response = await api.post('/staff', staff);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la création du personnel';
      throw new Error(message);
    }
  },

  getAllStaff: async (): Promise<Staff[]> => {
    try {
      const response = await api.get('/staff');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la récupération du personnel';
      throw new Error(message);
    }
  },

  getStaffById: async (id: number): Promise<Staff> => {
    try {
      const response = await api.get(`/staff/${id}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la récupération du personnel';
      throw new Error(message);
    }
  },

  getStaffByDepartment: async (department: string): Promise<Staff[]> => {
    try {
      const response = await api.get(`/staff/department/${department}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la récupération par département';
      throw new Error(message);
    }
  },

  getStaffByPosition: async (position: string): Promise<Staff[]> => {
    try {
      const response = await api.get(`/staff/position/${position}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la récupération par poste';
      throw new Error(message);
    }
  },

  getStaffByRole: async (role: string): Promise<Staff[]> => {
    try {
      const response = await api.get(`/staff/role/${role}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la récupération par rôle';
      throw new Error(message);
    }
  },

  getStaffByEmail: async (email: string): Promise<Staff> => {
    try {
      const response = await api.get(`/staff/email/${email}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la récupération par email';
      throw new Error(message);
    }
  },

  getStaffBySearch: async (search: string, pageable: Pageable): Promise<{ content: Staff[], totalPages: number, totalElements: number }> => {
    try {
      const response = await api.get('/staff/search', {
        params: { search, page: pageable.page, size: pageable.size, sort: pageable.sort },
      });
      return {
        content: response.data.content,
        totalPages: response.data.totalPages,
        totalElements: response.data.totalElements,
      };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la recherche du personnel';
      throw new Error(message);
    }
  },

  updateStaff: async (id: number, staff: Partial<Staff>): Promise<Staff> => {
    try {
      const response = await api.put(`/staff/${id}`, staff);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la mise à jour du personnel';
      throw new Error(message);
    }
  },

  deleteStaff: async (id: number): Promise<void> => {
    try {
      await api.delete(`/staff/${id}`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la suppression du personnel';
      throw new Error(message);
    }
  },
};