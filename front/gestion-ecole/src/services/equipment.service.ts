import api from './api.service';
import type { Equipment } from '../types/equipment.types';

export const equipmentService = {
  getAllEquipment: async (): Promise<Equipment[]> => {
    try {
      const response = await api.get('/equipment');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la récupération des équipements';
      throw new Error(message);
    }
  },

  getEquipmentById: async (id: number): Promise<Equipment> => {
    try {
      const response = await api.get(`/equipment/${id}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la récupération de l\'équipement';
      throw new Error(message);
    }
  },

  getEquipmentBySerialNumber: async (serialNumber: string): Promise<Equipment> => {
    try {
      const response = await api.get(`/equipment/serial/${serialNumber}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la récupération par numéro de série';
      throw new Error(message);
    }
  },

  getEquipmentByCategory: async (category: string): Promise<Equipment[]> => {
    try {
      const response = await api.get(`/equipment/category/${category}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la récupération par catégorie';
      throw new Error(message);
    }
  },

  getEquipmentByLocation: async (location: string): Promise<Equipment[]> => {
    try {
      const response = await api.get(`/equipment/location/${location}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la récupération par emplacement';
      throw new Error(message);
    }
  },

  getEquipmentByStatus: async (status: string): Promise<Equipment[]> => {
    try {
      const response = await api.get(`/equipment/status/${status}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la récupération par état';
      throw new Error(message);
    }
  },

  getEquipmentByAssignedTo: async (assignedTo: string): Promise<Equipment[]> => {
    try {
      const response = await api.get(`/equipment/assigned-to/${assignedTo}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la récupération par assignation';
      throw new Error(message);
    }
  },

  getEquipmentNeedingMaintenance: async (): Promise<Equipment[]> => {
    try {
      const response = await api.get('/equipment/maintenance-due');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la récupération des équipements à maintenir';
      throw new Error(message);
    }
  },

  getEquipmentUnderWarranty: async (): Promise<Equipment[]> => {
    try {
      const response = await api.get('/equipment/under-warranty');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la récupération des équipements sous garantie';
      throw new Error(message);
    }
  },

  createEquipment: async (equipment: Partial<Equipment>): Promise<Equipment> => {
    try {
      const response = await api.post('/equipment', equipment);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la création de l\'équipement';
      throw new Error(message);
    }
  },

  updateEquipment: async (id: number, equipment: Partial<Equipment>): Promise<Equipment> => {
    try {
      const response = await api.put(`/equipment/${id}`, equipment);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la mise à jour de l\'équipement';
      throw new Error(message);
    }
  },

  deleteEquipment: async (id: number): Promise<void> => {
    try {
      await api.delete(`/equipment/${id}`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la suppression de l\'équipement';
      throw new Error(message);
    }
  },
};