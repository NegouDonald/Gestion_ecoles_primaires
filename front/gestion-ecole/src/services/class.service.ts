import api from './api.service';

export interface ClassCreateRequest {
  name: string;
  level: string;
  section: string;
  language: string;
  academicYear: string;
  maxCapacity: number | null;
}

export interface ClassResponse {
  id: number;
  name: string;
  level: string;
  section: string;
  language: string;
  academicYear: string;
  maxCapacity: number | null;
}

export interface StudentResponse {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  section: string;
  language: string;
  academicYear: string;
  parentName: string | null;
  parentPhone: string | null;
  parentEmail: string | null;
  address: string | null;
  registrationDate: string;
}

export interface ClassStatistics {
  studentCount: number;
  maxCapacity: number | null;
  availableSpots: number | null;
}

export const classService = {
  // Récupérer toutes les classes
  getAllClasses: async (): Promise<{ id: number; name: string }[]> => {
    try {
      const response = await api.get('/classes');
      return response.data.map((cls: ClassResponse) => ({ id: cls.id, name: cls.name }));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la récupération des classes';
      throw new Error(message);
    }
  },

  // Récupérer une classe par ID
  getClassById: async (id: number): Promise<ClassResponse> => {
    try {
      const response = await api.get(`/classes/${id}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la récupération de la classe';
      throw new Error(message);
    }
  },

  // Récupérer les étudiants d'une classe
  getClassStudents: async (id: number): Promise<StudentResponse[]> => {
    try {
      const response = await api.get(`/classes/${id}/students`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la récupération des étudiants';
      throw new Error(message);
    }
  },

  // Récupérer les statistiques d'une classe
  getClassStatistics: async (id: number): Promise<ClassStatistics> => {
    try {
      const response = await api.get(`/classes/${id}/statistics`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la récupération des statistiques';
      throw new Error(message);
    }
  },

  // Créer une classe
  createClass: async (classData: ClassCreateRequest): Promise<ClassResponse> => {
    try {
      const response = await api.post('/classes', classData);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la création de la classe';
      throw new Error(message);
    }
  },

  // Mettre à jour une classe
  updateClass: async (id: number, classData: ClassCreateRequest): Promise<ClassResponse> => {
    try {
      const response = await api.put(`/classes/${id}`, classData);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la mise à jour de la classe';
      throw new Error(message);
    }
  },

  // Supprimer une classe
  deleteClass: async (id: number): Promise<void> => {
    try {
      await api.delete(`/classes/${id}`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Échec de la suppression de la classe';
      throw new Error(message);
    }
  },

  // Assigner un enseignant à une classe
  assignTeacher: async (classId: number, teacherId: number): Promise<ClassResponse> => {
    try {
      const response = await api.put(`/classes/${classId}/assign-teacher/${teacherId}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Échec de l'association de l'enseignant";
      throw new Error(message);
    }
  },
};