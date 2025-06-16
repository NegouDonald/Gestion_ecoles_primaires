export interface Equipment {
  id: number;
  name: string;
  description?: string;
  serialNumber: string;
  category?: string;
  brand?: string;
  model?: string;
  purchasePrice?: number;
  purchaseDate?: string;
  warrantyExpiryDate?: string;
  maintenanceDate?: string;
  status: string;
  location?: string;
  assignedTo?: string;
}