import api from './api.service';
import type { Notification } from '../types/staff.types';

export const notificationService = {
  getUnreadNotifications: async (): Promise<Notification[]> => {
    try {
      const response = await api.get('/notifications/unread');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la récupération des notifications';
      throw new Error(message);
    }
  },

  markAsRead: async (id: number): Promise<void> => {
    try {
      await api.put(`/notifications/${id}/read`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la mise à jour de la notification';
      throw new Error(message);
    }
  },
};