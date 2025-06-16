export interface Purchase {
  id: number;
  itemName: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  purchaseDate: string;
  supplier?: string;
  category?: string;
  invoiceNumber?: string;
}