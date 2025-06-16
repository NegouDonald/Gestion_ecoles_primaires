import api from './api.service';
import type { Purchase } from '../types/purchase.types';

export const purchaseService = {
  createPurchase: async (purchase: Partial<Purchase>): Promise<Purchase> => {
    try {
      const response = await api.post('/purchases', purchase);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la création de l\'achat';
      throw new Error(message);
    }
  },

  getAllPurchases: async (): Promise<Purchase[]> => {
    try {
      const response = await api.get('/purchases');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la récupération des achats';
      throw new Error(message);
    }
  },

  getPurchaseById: async (id: number): Promise<Purchase> => {
    try {
      const response = await api.get(`/purchases/${id}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la récupération de l\'achat';
      throw new Error(message);
    }
  },

  getPurchaseByInvoiceNumber: async (invoiceNumber: string): Promise<Purchase> => {
    try {
      const response = await api.get(`/purchases/invoice/${invoiceNumber}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la récupération par numéro de facture';
      throw new Error(message);
    }
  },

  getPurchasesByDateRange: async (startDate: string, endDate: string): Promise<Purchase[]> => {
    try {
      const response = await api.get(`/purchases/date-range`, {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la récupération par plage de dates';
      throw new Error(message);
    }
  },

  getPurchasesBySupplier: async (supplier: string): Promise<Purchase[]> => {
    try {
      const response = await api.get(`/purchases/supplier/${supplier}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la récupération par fournisseur';
      throw new Error(message);
    }
  },

  getPurchasesByCategory: async (category: string): Promise<Purchase[]> => {
    try {
      const response = await api.get(`/purchases/category/${category}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la récupération par catégorie';
      throw new Error(message);
    }
  },

  updatePurchase: async (id: number, purchase: Partial<Purchase>): Promise<Purchase> => {
    try {
      const response = await api.put(`/purchases/${id}`, purchase);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la mise à jour de l\'achat';
      throw new Error(message);
    }
  },

  deletePurchase: async (id: number): Promise<void> => {
    try {
      await api.delete(`/purchases/${id}`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la suppression de l\'achat';
      throw new Error(message);
    }
  },
};