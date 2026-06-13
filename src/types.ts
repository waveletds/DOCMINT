export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  verified: boolean;
  createdAt: string;
}

export interface FormInputField {
  key: string;
  label: string;
  placeholder: string;
  type: 'text' | 'textarea' | 'date' | 'select';
  options?: string[];
  required?: boolean;
}

export interface DocumentCategory {
  id: string;
  name: string;
  description: string;
  priceNGN: number; // prices in Nigerian Naira (standard for Nigerian SaaS payment systems)
  requiredFields: FormInputField[];
  samplePreview: string;
  aiPromptTemplate: string;
  templateStyle?: 'classic' | 'modern' | 'minimal' | 'executive';
}

export interface GeneratedDocument {
  id: string;
  userId: string;
  userName: string;
  categoryId: string;
  categoryName: string;
  inputs: Record<string, string>;
  title: string;
  content: string; // The generated letter body
  letterheadName?: string;
  letterheadAddress?: string;
  addWatermark: boolean;
  addQrCode: boolean;
  addSignatureLine: boolean;
  signerName?: string;
  signerTitle?: string;
  paid: boolean;
  paymentGateway?: 'paystack' | 'monnify' | 'flutterwave';
  paymentRef?: string;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  userName: string;
  categoryId: string;
  categoryName: string;
  amount: number;
  gateway: 'paystack' | 'monnify' | 'flutterwave';
  reference: string;
  status: 'pending' | 'success' | 'failed';
  createdAt: string;
}

export interface SampleResearchTemplate {
  id: string;
  categoryId: string;
  title: string;
  organization: string;
  rawText: string;
  structureAnalysis: string;
  createdAt: string;
}
