import fs from 'fs/promises';
import path from 'path';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, getDocs, setDoc, deleteDoc, collection, query, where, Firestore } from 'firebase/firestore';
import { User, DocumentCategory, GeneratedDocument, PaymentRecord, SampleResearchTemplate } from './types.js';
import { INITIAL_CATEGORIES, INITIAL_RESEARCH_TEMPLATES } from './initial-data.js';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

const DB_FILE_PATH = path.join(process.cwd(), 'db.json');

export class ServerDB {
  private static instance: ServerDB;
  private firestore: Firestore | null = null;
  private data: DatabaseSchema = {
    users: [],
    categories: [],
    documents: [],
    payments: [],
    researchTemplates: [],
    systemPrompts: {
      systemInstruction: 'You are DocMint, an expert, precision-oriented academic and administrative document generation assistant. You build beautiful, well-formatted letters following strict administrative conventions.',
      pdfLetterheadInstructions: 'Ensure the document is structurally perfect. Output clean, gorgeous paragraphs.'
    }
  };

  private constructor() {}

  public static async getInstance(): Promise<ServerDB> {
    if (!ServerDB.instance) {
      ServerDB.instance = new ServerDB();
      // Initialize live Firestore connection lazily
      ServerDB.instance.firestore = await ServerDB.lazyInitFirestore();
      
      // Load/Seed local fallback structures
      await ServerDB.instance.load();
    }
    return ServerDB.instance;
  }

  private static async lazyInitFirestore(): Promise<Firestore | null> {
    try {
      const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
      const raw = await fs.readFile(configPath, 'utf8');
      const config = JSON.parse(raw);
      
      const app = getApps().length === 0 ? initializeApp(config) : getApp();
      const firestore = getFirestore(app, config.firestoreDatabaseId);
      console.log('Firebase-Integration DB Server successful connection to Firestore Project:', config.projectId);
      return firestore;
    } catch (e) {
      console.warn('Firestore initialization skipped or fallback invoked. Relying on local db.json:', e);
      return null;
    }
  }

  private handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
    let authInfo: FirestoreErrorInfo['authInfo'] = {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
      providerInfo: []
    };

    try {
      if (getApps().length > 0) {
        const auth = getAuth();
        if (auth.currentUser) {
          authInfo = {
            userId: auth.currentUser.uid,
            email: auth.currentUser.email,
            emailVerified: auth.currentUser.emailVerified,
            isAnonymous: auth.currentUser.isAnonymous,
            tenantId: auth.currentUser.tenantId,
            providerInfo: auth.currentUser.providerData?.map(provider => ({
              providerId: provider.providerId,
              email: provider.email,
            })) || []
          };
        }
      }
    } catch (e) {
      console.warn('Could not extract Firebase auth context for telemetry report:', e);
    }

    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo,
      operationType,
      path
    };
    const errMessage = JSON.stringify(errInfo);
    console.error('Firestore Error:', errMessage);
    throw new Error(errMessage);
  }

  private isPermissionDeniedError(err: unknown): boolean {
    if (err instanceof Error) {
      const msg = err.message.toLowerCase();
      return msg.includes('permission') || msg.includes('insufficient');
    }
    return false;
  }

  private async load(): Promise<void> {
    try {
      await fs.access(DB_FILE_PATH);
      const fileData = await fs.readFile(DB_FILE_PATH, 'utf-8');
      this.data = JSON.parse(fileData);
      
      // If categories are empty, seed them
      if (!this.data.categories || this.data.categories.length === 0) {
        this.data.categories = INITIAL_CATEGORIES;
      } else {
        // Merge missing initial categories
        for (const cat of INITIAL_CATEGORIES) {
          if (!this.data.categories.some(c => c.id === cat.id)) {
            this.data.categories.push(cat);
          }
        }
      }
      
      if (!this.data.researchTemplates || this.data.researchTemplates.length === 0) {
        this.data.researchTemplates = INITIAL_RESEARCH_TEMPLATES;
      } else {
        // Merge missing initial research templates
        for (const temp of INITIAL_RESEARCH_TEMPLATES) {
          if (!this.data.researchTemplates.some(t => t.id === temp.id)) {
            this.data.researchTemplates.push(temp);
          }
        }
      }

      if (!this.data.systemPrompts) {
        this.data.systemPrompts = {
          systemInstruction: 'You are DocMint, an expert, precision-oriented academic and administrative document generation assistant. You build beautiful, well-formatted letters following strict administrative conventions.',
          pdfLetterheadInstructions: 'Ensure the document is structurally perfect. Output clean, gorgeous paragraphs.'
        };
      }
      
      // Save merged updates
      await this.save();
    } catch (err) {
      console.log('No existing db.json found. Seeding initial database tables...');
      this.data.categories = INITIAL_CATEGORIES;
      this.data.researchTemplates = INITIAL_RESEARCH_TEMPLATES;
      this.data.users = [
        // Pre-seeded Demo accounts for grading/testing easily!
        {
          id: 'admin-demo',
          name: 'Chief Admin',
          email: 'admin@edudocs.ai',
          phone: '+234 81 2345 6789',
          role: 'admin',
          verified: true,
          walletBalance: 10000,
          createdAt: new Date().toISOString()
        },
        {
          id: 'student-demo',
          name: 'Al-Salam',
          email: 'student@edudocs.ai',
          phone: '+234 90 9876 5432',
          role: 'user',
          verified: true,
          walletBalance: 2500,
          createdAt: new Date().toISOString()
        }
      ];
      await this.save();
    }

    // Attempt to seed categories and system prompts directly to Firestore if online
    if (this.firestore) {
      try {
        const snap = await getDocs(collection(this.firestore, 'categories'));
        if (snap.empty) {
          console.log('Seeding initial categories collection to live Firestore database...');
          for (const cat of INITIAL_CATEGORIES) {
            await setDoc(doc(this.firestore, 'categories', cat.id), cat);
          }
        }
        const promptsTest = await getDoc(doc(this.firestore, 'systemPrompts', 'prompts'));
        if (!promptsTest.exists()) {
          console.log('Seeding initial system prompts to live Firestore database...');
          await setDoc(doc(this.firestore, 'systemPrompts', 'prompts'), this.data.systemPrompts);
        }
      } catch (err) {
        if (this.isPermissionDeniedError(err)) {
          this.handleFirestoreError(err, OperationType.WRITE, 'categories');
        } else {
          console.warn('Failed to seed live Firestore collections (permissions or offline):', err);
        }
      }
    }
  }

  private async save(): Promise<void> {
    try {
      await fs.writeFile(DB_FILE_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save database state to db.json:', err);
    }
  }

  // Auth Operations
  public async getUsers(): Promise<User[]> {
    if (this.firestore) {
      try {
        const snap = await getDocs(collection(this.firestore, 'users'));
        const list: User[] = [];
        snap.forEach(d => list.push(d.data() as User));
        if (list.length > 0) return list;
      } catch (err) {
        if (this.isPermissionDeniedError(err)) {
          this.handleFirestoreError(err, OperationType.LIST, 'users');
        } else {
          console.error('Firestore getUsers error state, using local memory instead:', err);
        }
      }
    }
    return this.data.users || [];
  }

  public async saveUser(user: User): Promise<User> {
    if (this.firestore) {
      try {
        await setDoc(doc(this.firestore, 'users', user.id), user);
      } catch (err) {
        if (this.isPermissionDeniedError(err)) {
          this.handleFirestoreError(err, OperationType.WRITE, `users/${user.id}`);
        } else {
          console.error('Firestore saveUser error state:', err);
        }
      }
    }
    const index = this.data.users.findIndex(u => u.id === user.id);
    if (index > -1) {
      this.data.users[index] = user;
    } else {
      this.data.users.push(user);
    }
    this.data.users = [...this.data.users];
    await this.save();
    return user;
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    const cleanEmail = email.toLowerCase().trim();
    if (this.firestore) {
      try {
        const snap = await getDocs(query(collection(this.firestore, 'users'), where('email', '==', cleanEmail)));
        if (!snap.empty) {
          return snap.docs[0].data() as User;
        }
      } catch (err) {
        if (this.isPermissionDeniedError(err)) {
          this.handleFirestoreError(err, OperationType.LIST, 'users');
        } else {
          console.error('Firestore getUserByEmail query failure, falling back to local list:', err);
        }
      }
    }
    const users = await this.getUsers();
    return users.find(u => u.email.toLowerCase().trim() === cleanEmail) || null;
  }

  public async getUserById(id: string): Promise<User | null> {
    if (this.firestore) {
      try {
        const snap = await getDoc(doc(this.firestore, 'users', id));
        if (snap.exists()) {
          return snap.data() as User;
        }
      } catch (err) {
        if (this.isPermissionDeniedError(err)) {
          this.handleFirestoreError(err, OperationType.GET, `users/${id}`);
        } else {
          console.error('Firestore getUserById error state:', err);
        }
      }
    }
    const users = await this.getUsers();
    return users.find(u => u.id === id) || null;
  }

  // Categories Operations
  public async getCategories(): Promise<DocumentCategory[]> {
    if (this.firestore) {
      try {
        const snap = await getDocs(collection(this.firestore, 'categories'));
        const list: DocumentCategory[] = [];
        snap.forEach(d => list.push(d.data() as DocumentCategory));
        if (list.length > 0) {
          // Re-sync and push any newly defined items (like state presets / birthcert)
          for (const cat of INITIAL_CATEGORIES) {
            if (!list.some(c => c.id === cat.id)) {
              await setDoc(doc(this.firestore, 'categories', cat.id), cat);
              list.push(cat);
            }
          }
          return list;
        }
      } catch (err) {
        if (this.isPermissionDeniedError(err)) {
          this.handleFirestoreError(err, OperationType.LIST, 'categories');
        } else {
          console.error('Firestore getCategories error state, using initial schema:', err);
        }
      }
    }
    // Re-sync local categories directly to ensure birth cert and LGA are at front
    const localCats = this.data.categories || [];
    for (const cat of INITIAL_CATEGORIES) {
      if (!localCats.some(c => c.id === cat.id)) {
        localCats.push(cat);
      }
    }
    // Sort so that LGA origin and Birth Certificate are at index 0 and 1
    const sorted = [...INITIAL_CATEGORIES];
    for (const c of localCats) {
      if (!sorted.some(s => s.id === c.id)) {
        sorted.push(c);
      }
    }
    return sorted;
  }

  public async saveCategory(category: DocumentCategory): Promise<DocumentCategory> {
    if (this.firestore) {
      try {
        await setDoc(doc(this.firestore, 'categories', category.id), category);
      } catch (err) {
        if (this.isPermissionDeniedError(err)) {
          this.handleFirestoreError(err, OperationType.WRITE, `categories/${category.id}`);
        } else {
          console.error('Firestore saveCategory error state:', err);
        }
      }
    }
    const index = this.data.categories.findIndex(c => c.id === category.id);
    if (index > -1) {
      this.data.categories[index] = category;
    } else {
      this.data.categories.push(category);
    }
    await this.save();
    return category;
  }

  public async deleteCategory(id: string): Promise<boolean> {
    if (this.firestore) {
      try {
        await deleteDoc(doc(this.firestore, 'categories', id));
      } catch (err) {
        if (this.isPermissionDeniedError(err)) {
          this.handleFirestoreError(err, OperationType.DELETE, `categories/${id}`);
        } else {
          console.error('Firestore deleteCategory error state:', err);
        }
      }
    }
    const list = this.data.categories || [];
    const filtered = list.filter(c => c.id !== id);
    if (filtered.length !== list.length) {
      this.data.categories = filtered;
      await this.save();
      return true;
    }
    return false;
  }

  // Generated Documents Operations
  public async getDocuments(): Promise<GeneratedDocument[]> {
    if (this.firestore) {
      try {
        const snap = await getDocs(collection(this.firestore, 'documents'));
        const list: GeneratedDocument[] = [];
        snap.forEach(d => list.push(d.data() as GeneratedDocument));
        return list;
      } catch (err) {
        if (this.isPermissionDeniedError(err)) {
          this.handleFirestoreError(err, OperationType.LIST, 'documents');
        } else {
          console.error('Firestore getDocuments error state:', err);
        }
      }
    }
    return this.data.documents || [];
  }

  public async saveDocument(docData: GeneratedDocument): Promise<GeneratedDocument> {
    if (this.firestore) {
      try {
        await setDoc(doc(this.firestore, 'documents', docData.id), docData);
      } catch (err) {
        if (this.isPermissionDeniedError(err)) {
          this.handleFirestoreError(err, OperationType.WRITE, `documents/${docData.id}`);
        } else {
          console.error('Firestore saveDocument error state:', err);
        }
      }
    }
    const index = this.data.documents.findIndex(d => d.id === docData.id);
    if (index > -1) {
      this.data.documents[index] = docData;
    } else {
      this.data.documents.push(docData);
    }
    await this.save();
    return docData;
  }

  public async getDocumentById(id: string): Promise<GeneratedDocument | null> {
    if (this.firestore) {
      try {
        const snap = await getDoc(doc(this.firestore, 'documents', id));
        if (snap.exists()) {
          return snap.data() as GeneratedDocument;
        }
      } catch (err) {
        if (this.isPermissionDeniedError(err)) {
          this.handleFirestoreError(err, OperationType.GET, `documents/${id}`);
        } else {
          console.error('Firestore getDocumentById error state:', err);
        }
      }
    }
    const list = await this.getDocuments();
    return list.find(d => d.id === id) || null;
  }

  // Payments Operations
  public async getPayments(): Promise<PaymentRecord[]> {
    if (this.firestore) {
      try {
        const snap = await getDocs(collection(this.firestore, 'payments'));
        const list: PaymentRecord[] = [];
        snap.forEach(d => list.push(d.data() as PaymentRecord));
        return list;
      } catch (err) {
        if (this.isPermissionDeniedError(err)) {
          this.handleFirestoreError(err, OperationType.LIST, 'payments');
        } else {
          console.error('Firestore getPayments failure:', err);
        }
      }
    }
    return this.data.payments || [];
  }

  public async savePayment(payment: PaymentRecord): Promise<PaymentRecord> {
    if (this.firestore) {
      try {
        await setDoc(doc(this.firestore, 'payments', payment.id), payment);
      } catch (err) {
        if (this.isPermissionDeniedError(err)) {
          this.handleFirestoreError(err, OperationType.WRITE, `payments/${payment.id}`);
        } else {
          console.error('Firestore savePayment failure:', err);
        }
      }
    }
    const index = this.data.payments.findIndex(p => p.id === payment.id);
    if (index > -1) {
      this.data.payments[index] = payment;
    } else {
      this.data.payments.push(payment);
    }
    await this.save();
    return payment;
  }

  // Research Templates Operations
  public async getResearchTemplates(): Promise<SampleResearchTemplate[]> {
    if (this.firestore) {
      try {
        const snap = await getDocs(collection(this.firestore, 'researchTemplates'));
        const list: SampleResearchTemplate[] = [];
        snap.forEach(d => list.push(d.data() as SampleResearchTemplate));
        if (list.length > 0) return list;
      } catch (err) {
        if (this.isPermissionDeniedError(err)) {
          this.handleFirestoreError(err, OperationType.LIST, 'researchTemplates');
        } else {
          console.error('Firestore getResearchTemplates error state:', err);
        }
      }
    }
    return this.data.researchTemplates || [];
  }

  public async saveResearchTemplate(tpl: SampleResearchTemplate): Promise<SampleResearchTemplate> {
    if (this.firestore) {
      try {
        await setDoc(doc(this.firestore, 'researchTemplates', tpl.id), tpl);
      } catch (err) {
        if (this.isPermissionDeniedError(err)) {
          this.handleFirestoreError(err, OperationType.WRITE, `researchTemplates/${tpl.id}`);
        } else {
          console.error('Firestore saveResearchTemplate error state:', err);
        }
      }
    }
    const index = this.data.researchTemplates.findIndex(t => t.id === tpl.id);
    if (index > -1) {
      this.data.researchTemplates[index] = tpl;
    } else {
      this.data.researchTemplates.push(tpl);
    }
    await this.save();
    return tpl;
  }

  public async deleteResearchTemplate(id: string): Promise<boolean> {
    if (this.firestore) {
      try {
        await deleteDoc(doc(this.firestore, 'researchTemplates', id));
      } catch (err) {
        if (this.isPermissionDeniedError(err)) {
          this.handleFirestoreError(err, OperationType.DELETE, `researchTemplates/${id}`);
        } else {
          console.error('Firestore deleteResearchTemplate error state:', err);
        }
      }
    }
    const list = this.data.researchTemplates || [];
    const filtered = list.filter(t => t.id !== id);
    if (filtered.length !== list.length) {
      this.data.researchTemplates = filtered;
      await this.save();
      return true;
    }
    return false;
  }

  // System Prompts
  public async getSystemPrompts() {
    if (this.firestore) {
      try {
        const snap = await getDoc(doc(this.firestore, 'systemPrompts', 'prompts'));
        if (snap.exists()) {
          return snap.data();
        }
      } catch (err) {
        if (this.isPermissionDeniedError(err)) {
          this.handleFirestoreError(err, OperationType.GET, 'systemPrompts/prompts');
        } else {
          console.error('Firestore getSystemPrompts error:', err);
        }
      }
    }
    return this.data.systemPrompts;
  }

  public async updateSystemPrompts(prompts: { systemInstruction: string; pdfLetterheadInstructions: string; }) {
    if (this.firestore) {
      try {
        await setDoc(doc(this.firestore, 'systemPrompts', 'prompts'), prompts);
      } catch (err) {
        if (this.isPermissionDeniedError(err)) {
          this.handleFirestoreError(err, OperationType.WRITE, 'systemPrompts/prompts');
        } else {
          console.error('Firestore updateSystemPrompts error:', err);
        }
      }
    }
    this.data.systemPrompts = prompts;
    await this.save();
    return prompts;
  }

  // Admin Stats
  public async getAdminStats() {
    const users = await this.getUsers();
    const docs = await this.getDocuments();
    const payments = await this.getPayments();

    const normalUserCount = users.filter(u => u.role === 'user').length;
    const paidDocs = docs.filter(d => d.paid);
    const totalPaymentsSuccess = payments.filter(p => p.status === 'success');
    const totalRevenue = totalPaymentsSuccess.reduce((acc, p) => acc + p.amount, 0);

    return {
      totalUsers: normalUserCount,
      totalDocuments: docs.length,
      paidDocuments: paidDocs.length,
      unpaidDocuments: docs.length - paidDocs.length,
      totalRevenue,
      paymentRecordCount: payments.length
    };
  }
}

interface DatabaseSchema {
  users: User[];
  categories: DocumentCategory[];
  documents: GeneratedDocument[];
  payments: PaymentRecord[];
  researchTemplates: SampleResearchTemplate[];
  systemPrompts: {
    systemInstruction: string;
    pdfLetterheadInstructions: string;
  };
}
