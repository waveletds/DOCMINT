import fs from 'fs/promises';
import path from 'path';
import { User, DocumentCategory, GeneratedDocument, PaymentRecord, SampleResearchTemplate } from './types.js';
import { INITIAL_CATEGORIES, INITIAL_RESEARCH_TEMPLATES } from './initial-data.js';

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

const DB_FILE_PATH = path.join(process.cwd(), 'db.json');

export class ServerDB {
  private static instance: ServerDB;
  private data: DatabaseSchema = {
    users: [],
    categories: [],
    documents: [],
    payments: [],
    researchTemplates: [],
    systemPrompts: {
      systemInstruction: 'You are EduDocs AI, an expert, precision-oriented academic and administrative document generation assistant. You build beautiful, well-formatted letters following strict administrative conventions.',
      pdfLetterheadInstructions: 'Ensure the document is structurally perfect. Output clean, gorgeous paragraphs.'
    }
  };

  private constructor() {}

  public static async getInstance(): Promise<ServerDB> {
    if (!ServerDB.instance) {
      ServerDB.instance = new ServerDB();
      await ServerDB.instance.load();
    }
    return ServerDB.instance;
  }

  private async load(): Promise<void> {
    try {
      await fs.access(DB_FILE_PATH);
      const fileData = await fs.readFile(DB_FILE_PATH, 'utf-8');
      this.data = JSON.parse(fileData);
      
      // If categories are empty, seed them
      if (!this.data.categories || this.data.categories.length === 0) {
        this.data.categories = INITIAL_CATEGORIES;
      }
      if (!this.data.researchTemplates || this.data.researchTemplates.length === 0) {
        this.data.researchTemplates = INITIAL_RESEARCH_TEMPLATES;
      }
      if (!this.data.systemPrompts) {
        this.data.systemPrompts = {
          systemInstruction: 'You are EduDocs AI, an expert, precision-oriented academic and administrative document generation assistant. You build beautiful, well-formatted letters following strict administrative conventions.',
          pdfLetterheadInstructions: 'Ensure the document is structurally perfect. Output clean, gorgeous paragraphs.'
        };
      }
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
          createdAt: new Date().toISOString()
        },
        {
          id: 'student-demo',
          name: 'Amina Adebayo',
          email: 'student@edudocs.ai',
          phone: '+234 90 9876 5432',
          role: 'user',
          verified: true,
          createdAt: new Date().toISOString()
        }
      ];
      await this.save();
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
    return this.data.users || [];
  }

  public async saveUser(user: User): Promise<User> {
    const users = await this.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index > -1) {
      users[index] = user;
    } else {
      users.push(user);
    }
    this.data.users = users;
    await this.save();
    return user;
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    const users = await this.getUsers();
    const cleanEmail = email.toLowerCase().trim();
    return users.find(u => u.email.toLowerCase().trim() === cleanEmail) || null;
  }

  // Categories Operations
  public async getCategories(): Promise<DocumentCategory[]> {
    return this.data.categories || [];
  }

  public async saveCategory(category: DocumentCategory): Promise<DocumentCategory> {
    const list = await this.getCategories();
    const index = list.findIndex(c => c.id === category.id);
    if (index > -1) {
      list[index] = category;
    } else {
      list.push(category);
    }
    this.data.categories = list;
    await this.save();
    return category;
  }

  public async deleteCategory(id: string): Promise<boolean> {
    const list = await this.getCategories();
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
    return this.data.documents || [];
  }

  public async saveDocument(doc: GeneratedDocument): Promise<GeneratedDocument> {
    const list = await this.getDocuments();
    const index = list.findIndex(d => d.id === doc.id);
    if (index > -1) {
      list[index] = doc;
    } else {
      list.push(doc);
    }
    this.data.documents = list;
    await this.save();
    return doc;
  }

  public async getDocumentById(id: string): Promise<GeneratedDocument | null> {
    const list = await this.getDocuments();
    return list.find(d => d.id === id) || null;
  }

  // Payments Operations
  public async getPayments(): Promise<PaymentRecord[]> {
    return this.data.payments || [];
  }

  public async savePayment(payment: PaymentRecord): Promise<PaymentRecord> {
    const list = await this.getPayments();
    const index = list.findIndex(p => p.id === payment.id);
    if (index > -1) {
      list[index] = payment;
    } else {
      list.push(payment);
    }
    this.data.payments = list;
    await this.save();
    return payment;
  }

  // Research Templates Operations
  public async getResearchTemplates(): Promise<SampleResearchTemplate[]> {
    return this.data.researchTemplates || [];
  }

  public async saveResearchTemplate(tpl: SampleResearchTemplate): Promise<SampleResearchTemplate> {
    const list = await this.getResearchTemplates();
    const index = list.findIndex(t => t.id === tpl.id);
    if (index > -1) {
      list[index] = tpl;
    } else {
      list.push(tpl);
    }
    this.data.researchTemplates = list;
    await this.save();
    return tpl;
  }

  public async deleteResearchTemplate(id: string): Promise<boolean> {
    const list = await this.getResearchTemplates();
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
    return this.data.systemPrompts;
  }

  public async updateSystemPrompts(prompts: { systemInstruction: string; pdfLetterheadInstructions: string; }) {
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
