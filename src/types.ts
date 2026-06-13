export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  verified: boolean;
  walletBalance?: number;
  createdAt: string;
  institution?: string;
  department?: string;
  matricNo?: string;
  userType?: 'student' | 'faculty' | 'organization' | 'general';
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
  letterheadLogo?: string;
  watermarkLogo?: string;
  letterheadLogoAlign?: 'left' | 'right' | 'center' | 'align-text';
  watermarkLogoAlign?: 'left' | 'right' | 'center' | 'diagonal';
  letterheadTitleColor?: string;
  letterheadLineColor?: string;
  letterheadLineStyle?: 'solid' | 'double' | 'dotted' | 'dashed' | 'none';
  designPatternStyle?: 'standard-formal' | 'modern-side' | 'classic-academy' | 'executive-tech' | 'minimalist';
  letterheadTitleSize?: 'sm' | 'md' | 'lg' | 'xl';
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
