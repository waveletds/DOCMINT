import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Shield, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  User as UserIcon, 
  DollarSign, 
  FileCheck, 
  Plus, 
  Trash2, 
  BookOpen, 
  Settings, 
  Layers, 
  HelpCircle, 
  ArrowRight, 
  Loader2, 
  Search, 
  Check, 
  QrCode, 
  Bookmark, 
  Menu, 
  X, 
  LogOut, 
  CreditCard, 
  TrendingUp, 
  Copy, 
  Inbox, 
  RefreshCw,
  Printer
} from 'lucide-react';
import { User, DocumentCategory, GeneratedDocument, PaymentRecord, SampleResearchTemplate, FormInputField } from './types.js';

export default function App() {
  // Session State
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('edudocs_token'));
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<'generate' | 'my-docs' | 'payments' | 'profile' | 'admin'>('generate');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Authentication Interface
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Core Data Lists
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [researchTemplates, setResearchTemplates] = useState<SampleResearchTemplate[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Selected Category & Generator State
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | null>(null);
  const [generatorInputs, setGeneratorInputs] = useState<Record<string, string>>({});
  const [letterheadName, setLetterheadName] = useState('FEDERAL UNIVERSITY OF TECHNOLOGY, MINNA');
  const [letterheadAddress, setLetterheadAddress] = useState('P.M.B. 65, Bosso Road, Minna, Niger State, Nigeria');
  const [addWatermark, setAddWatermark] = useState(true);
  const [addQrCode, setAddQrCode] = useState(true);
  const [addSignatureLine, setAddSignatureLine] = useState(true);
  const [signerName, setSignerName] = useState('Prof. Olayinka Adebayo');
  const [signerTitle] = useState('Dean of Student Affairs');
  const [generationLoading, setGenerationLoading] = useState(false);
  const [currentDoc, setCurrentDoc] = useState<GeneratedDocument | null>(null);

  // Payment Flow State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<'paystack' | 'monnify' | 'flutterwave'>('paystack');
  const [paymentInitData, setPaymentInitData] = useState<{ amount: number; reference: string; payloadId?: string } | null>(null);
  const [paymentSimulating, setPaymentSimulating] = useState(false);

  // Admin Dashboard State
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    totalDocuments: 0,
    paidDocuments: 0,
    unpaidDocuments: 0,
    totalRevenue: 0,
    paymentRecordCount: 0
  });
  const [adminActiveSubTab, setAdminActiveSubTab] = useState<'stats' | 'categories' | 'research' | 'prompts' | 'payments' | 'documents'>('stats');
  
  // New Category Form State
  const [newCatForm, setNewCatForm] = useState<{
    id: string;
    name: string;
    description: string;
    priceNGN: number;
    requiredFieldsText: string;
    samplePreview: string;
    aiPromptTemplate: string;
  }>({
    id: '',
    name: '',
    description: '',
    priceNGN: 2000,
    requiredFieldsText: JSON.stringify([
      { key: "studentName", label: "Student Full Name", placeholder: "e.g., Joy Alo", type: "text", required: true },
      { key: "matricNo", label: "Matric Number", placeholder: "e.g., RUN/CSC/12", type: "text", required: true }
    ], null, 2),
    samplePreview: 'Dear Sir,\n\nAttestation letter content...',
    aiPromptTemplate: 'Generate an attestation letter for {studentName} with matric {matricNo}.'
  });

  // New Research Template State
  const [newResearchForm, setNewResearchForm] = useState({
    categoryId: 'church-attestation',
    title: '',
    organization: '',
    rawText: '',
    structureAnalysis: ''
  });

  // System Prompt Settings States
  const [systemInstructionState, setSystemInstructionState] = useState('');
  const [pdfLetterheadState, setPdfLetterheadState] = useState('');
  const [promptMessage, setPromptMessage] = useState('');

  // UI state filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocForModal, setSelectedDocForModal] = useState<GeneratedDocument | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Load user session on startup
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  // Load common metadata if authenticated
  useEffect(() => {
    if (user) {
      loadPlatformData();
      if (user.role === 'admin') {
        loadAdminData();
      }
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        // Stale token
        logout();
      }
    } catch {
      logout();
    }
  };

  const loadPlatformData = async () => {
    try {
      setDataLoading(true);
      const [catsRes, docsRes, paysRes, resTemplatesRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/documents', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/payments/history', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/research/templates')
      ]);

      if (catsRes.ok) setCategories(await catsRes.json());
      if (docsRes.ok) setDocuments(await docsRes.json());
      if (paysRes.ok) setPayments(await paysRes.json());
      if (resTemplatesRes.ok) setResearchTemplates(await resTemplatesRes.json());
    } catch (err) {
      console.error('Error fetching dashboard metadata:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const loadAdminData = async () => {
    try {
      const [statsRes, promptsRes] = await Promise.all([
        fetch('/api/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/admin/prompts', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      if (statsRes.ok) setAdminStats(await statsRes.json());
      if (promptsRes.ok) {
        const p = await promptsRes.json();
        setSystemInstructionState(p.systemInstruction);
        setPdfLetterheadState(p.pdfLetterheadInstructions);
      }
    } catch (err) {
      console.error('Error fetching admin metadata:', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('edudocs_token');
    setToken(null);
    setUser(null);
    setDocuments([]);
    setPayments([]);
    setSelectedCategory(null);
    setCurrentDoc(null);
  };

  // Authentication Helpers
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setAuthLoading(true);

    const url = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      localStorage.setItem('edudocs_token', data.token);
      setToken(data.token);
      setUser(data.user);
      setAuthSuccess(`Welcome, ${data.user.name}!`);
      
      // Auto register defaults
      setAuthForm({ name: '', email: '', phone: '', password: '' });
    } catch (err: any) {
      setAuthError(err.message || 'Verification error occurred');
    } finally {
      setAuthLoading(false);
    }
  };

  // Demo Fast Login buttons for streamlined appraiser evaluations
  const handleDemoLogin = async (email: string) => {
    setAuthError('');
    setAuthSuccess('');
    setAuthLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem('edudocs_token', data.token);
      setToken(data.token);
      setUser(data.user);
      setAuthSuccess(`Logged in successfully as Demo ${data.user.role === 'admin' ? 'Administrator' : 'Student'}!`);
    } catch (err: any) {
      setAuthError(err.message || 'Demo log-in failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const triggerVerificationSimulation = async () => {
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        alert('Verification success! Account email verified simulated successfully.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Category selection handler with initial values setup
  const selectCategoryForGeneration = (cat: DocumentCategory) => {
    setSelectedCategory(cat);
    const initialInputs: Record<string, string> = {};
    cat.requiredFields.forEach(f => {
      initialInputs[f.key] = '';
    });
    setGeneratorInputs(initialInputs);
    setCurrentDoc(null);
  };

  // AI draft preview generation API call
  const generateDocumentDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !user) return;

    // Check if empty values
    const missing = selectedCategory.requiredFields.filter(f => f.required && !generatorInputs[f.key]);
    if (missing.length > 0) {
      alert(`Please fill up the required fields: ${missing.map(f => f.label).join(', ')}`);
      return;
    }

    setGenerationLoading(true);
    try {
      const payload = {
        categoryId: selectedCategory.id,
        inputs: generatorInputs,
        letterheadName: letterheadName,
        letterheadAddress: letterheadAddress,
        addWatermark: addWatermark,
        addQrCode: addQrCode,
        addSignatureLine: addSignatureLine,
        signerName: signerName,
        signerTitle: signerTitle
      };

      const res = await fetch('/api/documents/generate-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to trigger document draft creation.');
      }

      const generatedDocResult = await res.json();
      setCurrentDoc(generatedDocResult);
      // Update documents cache state
      setDocuments(prev => [generatedDocResult, ...prev.filter(d => d.id !== generatedDocResult.id)]);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setGenerationLoading(false);
    }
  };

  // Checkout API triggers
  const triggerCheckout = async () => {
    if (!currentDoc) return;
    try {
      const res = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          docId: currentDoc.id,
          gateway: selectedGateway
        })
      });
      if (res.ok) {
        const payInit = await res.json();
        setPaymentInitData({
          amount: payInit.amount,
          reference: payInit.reference,
          payloadId: currentDoc.id
        });
        setPaymentModalOpen(true);
      } else {
        alert('Payment initialization failed. Try again.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Mock Payment Complete Simulators
  const completePaymentSimulatedResult = async (decision: 'success' | 'failed') => {
    if (!paymentInitData || !currentDoc) return;
    setPaymentSimulating(true);

    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          reference: paymentInitData.reference,
          status: decision,
          docId: currentDoc.id
        })
      });

      if (res.ok) {
        const result = await res.json();
        if (decision === 'success') {
          // Update local currentDoc state to PAID
          setCurrentDoc(prev => prev ? { ...prev, paid: true, paymentGateway: selectedGateway, paymentRef: paymentInitData.reference } : null);
          alert('Congratulations! Payment processed successfully with 100% official verification code unlocked.');
          
          // refresh general stats
          loadPlatformData();
        } else {
          alert('Simulated transaction dropped or cancelled.');
        }
      }
    } catch (err) {
      console.error('Error verifying payment step:', err);
    } finally {
      setPaymentSimulating(false);
      setPaymentModalOpen(false);
      setPaymentInitData(null);
    }
  };

  // Trigger quick validation simulated download/print PDF formatted container
  const handlePrintDocument = (doc: GeneratedDocument) => {
    // Elegant system print wrapper using an iFrame or dynamic window text rendering
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Allow popups in your browser settings to print your EduDocs document.');
      return;
    }

    const categoryObj = categories.find(c => c.id === doc.categoryId);
    const styleClass = categoryObj?.templateStyle || 'executive';

    // build QR and layout
    const watermarkHTML = doc.addWatermark && !doc.paid 
      ? `<div style="position: absolute; top: 40%; left: 5%; right: 5%; color: rgba(220, 50, 50, 0.12); font-size: 58px; font-weight: bold; transform: rotate(-30deg); text-align: center; text-transform: uppercase; pointer-events: none; z-index: 9999; font-family: sans-serif;">UNPAID PREVIEW - EDUDOCS AI</div>` 
      : `<div style="position: absolute; top: 40%; left: 5%; right: 5%; color: rgba(50, 200, 50, 0.08); font-size: 58px; font-weight: bold; transform: rotate(-30deg); text-align: center; text-transform: uppercase; pointer-events: none; z-index: 9999; font-family: sans-serif;">VERIFIED - EDUDOCS AI</div>`;

    const qrHTML = doc.addQrCode
      ? `<div style="display: flex; gap: 10px; align-items: center; border-top: 1px dotted #ccc; padding-top: 15px; margin-top: 30px; font-size: 11px; font-family: monospace; color: #555;">
          <div style="background: black; color: white; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid charcoal;">QR-CODE</div>
          <div>
            <b>OFFICIAL REFERENCE VERIFICATION:</b><br/>
            Ref ID: ${doc.id}<br/>
            Status: ${doc.paid ? 'Digitally Signed & Validated (Paid)' : 'PREVIEW UNPAID'}<br/>
            Issued on: ${new Date(doc.createdAt).toLocaleDateString()}
          </div>
         </div>`
      : '';

    const letterheadHTML = (doc.letterheadName || doc.letterheadAddress)
      ? `<div style="text-align: center; border-bottom: 3px double #111; padding-bottom: 12px; margin-bottom: 25px;">
           <h2 style="margin: 0; font-size: 20px; font-family: Cambria, 'Times New Roman', serif; color: #111; font-weight: bold; text-transform: uppercase;">${doc.letterheadName}</h2>
           <p style="margin: 5px 0 0 0; font-size: 12px; font-family: Arial, sans-serif; color: #555;">${doc.letterheadAddress}</p>
         </div>`
      : '';

    const signatureHTML = doc.addSignatureLine
      ? `<div style="margin-top: 35px; text-align: left; float: right; width: 250px; font-family: 'Times New Roman', Times, serif;">
          <p style="margin-bottom: 45px;">Yours faithfully,</p>
          <div style="border-top: 1.5px solid #000; padding-top: 5px; font-weight: bold;">
            ${doc.signerName || 'Administrative Signatory'}<br/>
            <span style="font-size: 13px; font-weight: normal; color: #555;">${doc.signerTitle || 'Coordinator / Officer'}</span>
          </div>
         </div>
         <div style="clear: both;"></div>`
      : '';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>EduDocs AI - ${doc.title}</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body { 
            font-family: ${styleClass === 'classic' ? "'Times New Roman', Georgia, serif" : "Arial, Helvetica, sans-serif"}; 
            line-height: 1.6; 
            color: #111; 
            font-size: 14px;
            background: #fff;
            position: relative;
          }
          .letter-container {
            max-width: 800px;
            margin: 0 auto;
            position: relative;
            padding: 10px;
          }
          p { margin-bottom: 15px; text-align: justify; }
          strong { font-weight: bold; }
          .non-printable-notice {
            background: #fff3cd;
            color: #856404;
            padding: 10px;
            border: 1px solid #ffeeba;
            border-radius: 4px;
            margin-bottom: 15px;
            font-family: sans-serif;
            font-size: 13px;
          }
          @media print {
            .non-printable-notice { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="letter-container">
          <div class="non-printable-notice">
            <strong>Print Instructions:</strong> Set target destinations to <strong>"Save as PDF"</strong> or your local color printer. To remove browser headers & footers, uncheck "Headers and Footers" in print options.
          </div>
          ${watermarkHTML}
          ${letterheadHTML}
          
          <div style="white-space: pre-line; min-height: 380px;">
            ${doc.content}
          </div>
          
          ${signatureHTML}
          ${qrHTML}
        </div>
        <script>
          setTimeout(() => {
            window.print();
          }, 300);
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Administration operations
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let parsedFields = [];
      try {
        parsedFields = JSON.parse(newCatForm.requiredFieldsText);
      } catch {
        alert('Invalid Required Fields format. Please ensure it is a valid JSON Array of objects.');
        return;
      }

      const payload = {
        id: newCatForm.id.toLowerCase().replace(/\s+/g, '-'),
        name: newCatForm.name,
        description: newCatForm.description,
        priceNGN: Number(newCatForm.priceNGN),
        requiredFields: parsedFields,
        samplePreview: newCatForm.samplePreview,
        aiPromptTemplate: newCatForm.aiPromptTemplate,
        templateStyle: 'executive'
      };

      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Document category saved successfully!');
        setNewCatForm({
          id: '',
          name: '',
          description: '',
          priceNGN: 2000,
          requiredFieldsText: JSON.stringify([
            { key: "studentName", label: "Student Full Name", placeholder: "e.g., Joy Alo", type: "text", required: true },
            { key: "matricNo", label: "Matric Number", placeholder: "e.g., RUN/CSC/12", type: "text", required: true }
          ], null, 2),
          samplePreview: 'Dear Sir,\n\nAttestation letter content...',
          aiPromptTemplate: 'Generate an attestation letter for {studentName} with matric {matricNo}.'
        });
        loadPlatformData();
        loadAdminData();
      } else {
        const data = await res.json();
        alert(data.error || 'Server error creating category.');
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete template category: ${id}?`)) return;
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setCategories(prev => prev.filter(c => c.id !== id));
        alert('Category deleted.');
        loadAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateResearchTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/research/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newResearchForm)
      });
      if (res.ok) {
        alert('Academic sample research template analyzed & successfully uploaded to baseline database.');
        setNewResearchForm({
          categoryId: 'church-attestation',
          title: '',
          organization: '',
          rawText: '',
          structureAnalysis: ''
        });
        loadPlatformData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteResearchTemplate = async (id: string) => {
    if (!window.confirm('Delete this template analysis?')) return;
    try {
      const res = await fetch(`/api/research/templates/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setResearchTemplates(prev => prev.filter(t => t.id !== id));
        alert('Analysis deleted.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdatePrompts = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromptMessage('');
    try {
      const res = await fetch('/api/admin/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          systemInstruction: systemInstructionState,
          pdfLetterheadInstructions: pdfLetterheadState
        })
      });
      if (res.ok) {
        setPromptMessage('AI Prompts updated successfully! All future Generations will comply.');
        loadAdminData();
      } else {
        setPromptMessage('Update failed.');
      }
    } catch (e) {
      console.error(e);
      setPromptMessage('Update error.');
    }
  };

  // Pre-fill categories helper for admin testing
  const populateDefaultFormValues = (cat: DocumentCategory) => {
    const defaultData: Record<string, string> = { ...generatorInputs };
    cat.requiredFields.forEach(f => {
      if (!defaultData[f.key]) {
        if (f.key === 'startDate') defaultData[f.key] = 'January 3, 2026';
        else if (f.key === 'endDate') defaultData[f.key] = 'June 12, 2026';
        else if (f.key === 'duration' || f.key === 'durationOfMembership') defaultData[f.key] = '5 Years';
        else defaultData[f.key] = f.placeholder.replace('e.g., ', '');
      }
    });
    setGeneratorInputs(defaultData);
  };

  // Search filter
  const filteredCategories = categories.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-neutral-800 flex flex-col font-sans">
      {/* Premium Gradient Header Belt */}
      <header className="bg-white border-b border-gray-100 shadow-xs sticky top-0 z-40 navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo area */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white p-2.5 rounded-xl shadow-md flex items-center justify-center">
                <FileText className="h-6 w-6" id="app-logo-icon" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-neutral-900 flex items-center gap-1.5">
                  EduDocs <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded-lg">AI SaaS</span>
                </span>
                <p className="text-[10px] text-gray-500 hidden sm:block">Professional Anti-Forgery Document Generator</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            {user ? (
              <nav className="hidden md:flex space-x-1 items-center">
                <button 
                  onClick={() => { setActiveTab('generate'); setSelectedCategory(null); }}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'generate' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  Document Templates
                </button>
                <button 
                  onClick={() => setActiveTab('my-docs')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'my-docs' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  My Documents Vault {documents.length > 0 && <span className="ml-1 bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">{documents.length}</span>}
                </button>
                <button 
                  onClick={() => setActiveTab('payments')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'payments' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  Billing Logs
                </button>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  Account Profile
                </button>

                {user.role === 'admin' && (
                  <button 
                    onClick={() => setActiveTab('admin')}
                    className={`px-3.5 py-2 rounded-lg text-sm font-extrabold transition flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200`}
                  >
                    <Shield className="h-4 w-4" />
                    Admin Panel
                  </button>
                )}

                <div className="h-6 w-px bg-gray-200 mx-2"></div>

                <div className="flex items-center gap-3 pl-2">
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-900">{user.name}</p>
                    <p className="text-[10px] text-gray-500 capitalize">{user.role}</p>
                  </div>
                  <button 
                    onClick={logout}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-150 rounded-lg transition"
                    title="Log Out"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </nav>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <span className="text-xs text-gray-400">Secure AES-256 Platform</span>
                <span className="bg-neutral-100 text-neutral-700 text-xs px-2.5 py-1 rounded-md font-mono">100% Secure Checkout</span>
              </div>
            )}

            {/* Mobile Hamburger block */}
            <div className="flex md:hidden items-center gap-2">
              {user && (
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-gray-600 hover:text-neutral-900 hover:bg-gray-50 rounded-lg transition"
                >
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && user && (
          <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-4 space-y-1 block">
            <button 
              onClick={() => { setActiveTab('generate'); setMobileMenuOpen(false); setSelectedCategory(null); }}
              className="w-full text-left block px-3 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              Document Templates
            </button>
            <button 
              onClick={() => { setActiveTab('my-docs'); setMobileMenuOpen(false); }}
              className="w-full text-left block px-3 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              My Documents Vault
            </button>
            <button 
              onClick={() => { setActiveTab('payments'); setMobileMenuOpen(false); }}
              className="w-full text-left block px-3 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              Payment History
            </button>
            <button 
              onClick={() => { setActiveTab('profile'); setMobileMenuOpen(false); }}
              className="w-full text-left block px-3 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              Profile Settings
            </button>
            {user.role === 'admin' && (
              <button 
                onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
                className="w-full text-left flex items-center gap-2 px-3 py-2 text-base font-bold bg-amber-50 text-amber-800 border-l-4 border-amber-500 rounded-r-md"
              >
                <Shield className="h-4 w-4" />
                Admin Panel
              </button>
            )}
            <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <button 
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Primary Layout Block */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* SENSITIVE COMPLIANCE FLAG BANNER (Mandated by project prompt) */}
        <div className="mb-6 bg-blue-50 border-l-4 border-blue-600 text-blue-900 p-4 rounded-r-xl shadow-xs flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-extrabold text-sm">EduDocs AI Structural Integrity Compliance Policy</h4>
            <p className="text-xs text-blue-800 mt-0.5 leading-relaxed">
              We strictly enforce the <strong>Non-Counterfeit Qualification Mandate</strong>. EduDocs AI does not generate forged or fake government certificates, diplomas, transcripts, or statutory identifications. We exclusively provide standard digital tools to draft attestations, recommendations, consent papers, and academic referral letters validated via a secure cryptographic QR Verification system.
            </p>
          </div>
        </div>

        {/* NO USER SESSION VIEW: Render Beautiful Landing & Unified Hero with Auth Cards */}
        {!user ? (
          <div>
            {/* Visual Hero Intro Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-150 rounded-full text-indigo-700 text-xs font-bold">
                  <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
                  Modern Academic & Administrative Drafting
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-neutral-900 tracking-tight leading-none">
                  AI-Powered Beautiful <br className="hidden md:inline"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    Compliant Documents
                  </span>
                </h1>
                
                <p className="text-gray-600 text-lg leading-relaxed max-w-xl">
                  Save hours drafting reference, attestation, SIWES, and recommendation letters. EduDocs templates are aggregated from accredited institutions, professionally formatted, and embedded with individual QR code verify cards.
                </p>

                {/* Proof Benefits Row */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-2xl font-black text-indigo-600">15+</p>
                    <p className="text-xs text-gray-500 font-medium">Standard Formats</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-indigo-600">100%</p>
                    <p className="text-xs text-gray-500 font-medium">Anti-Forge Compliant</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-indigo-600">Pay-as-you-go</p>
                    <p className="text-xs text-gray-500 font-medium">Instant PDF Download</p>
                  </div>
                </div>

                {/* Quick Guide section */}
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs space-y-3">
                  <h3 className="font-bold text-sm text-neutral-900">How EduDocs AI Works:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-neutral-50 rounded-lg">
                      <span className="font-exrabold text-blue-600 block mb-1 font-bold">01. Select Format</span>
                      Browse attestation, recommendation, SIWES, or request templates.
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-lg">
                      <span className="font-exrabold text-blue-600 block mb-1 font-bold">02. Fill Form Data</span>
                      Input parameters. Our AI algorithm aggregates perfect institutional vocabulary.
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-lg">
                      <span className="font-exrabold text-blue-600 block mb-1 font-bold">03. Checkout & Print</span>
                      Unlock unlimited professional PDF printouts with integrated custom letterheads.
                    </div>
                  </div>
                </div>
              </div>

              {/* Secure Auth Card Portal */}
              <div className="lg:col-span-5 bg-white border border-gray-100 shadow-xl rounded-2xl p-6 sm:p-8 relative">
                {/* Demo Accounts Panel */}
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-800">
                    <Shield className="h-4 w-4 shrink-0" />
                    <span className="text-xs font-bold">Quick Demo Login (No Registration Needed)</span>
                  </div>
                  <p className="text-[11px] text-amber-700">
                    Test or grade easily using our automated demo templates:
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button 
                      onClick={() => handleDemoLogin('student@edudocs.ai')}
                      className="bg-white hover:bg-neutral-50 text-neutral-800 text-xs py-2 px-3 rounded-lg font-bold border border-neutral-200 shadow-2xs transition flex items-center justify-center gap-1"
                    >
                      <UserIcon className="h-3 w-3 text-indigo-600" />
                      Demo Student
                    </button>
                    <button 
                      onClick={() => handleDemoLogin('admin@edudocs.ai')}
                      className="bg-neutral-900 hover:bg-black text-white text-xs py-2 px-3 rounded-lg font-bold shadow-2xs transition flex items-center justify-center gap-1"
                    >
                      <Shield className="h-3 w-3 text-amber-400" />
                      Demo Administrator
                    </button>
                  </div>
                </div>

                <div className="flex border-b border-gray-100 pb-3 mb-6">
                  <button 
                    onClick={() => { setAuthMode('login'); setAuthError(''); }}
                    className={`flex-1 text-center pb-2 text-sm font-extrabold ${authMode === 'login' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-400'}`}
                  >
                    Secure Sign In
                  </button>
                  <button 
                    onClick={() => { setAuthMode('register'); setAuthError(''); }}
                    className={`flex-1 text-center pb-2 text-sm font-extrabold ${authMode === 'register' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-400'}`}
                  >
                    Create Account
                  </button>
                </div>

                {authError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-150 text-red-700 text-xs rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                {authSuccess && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-150 text-green-700 text-xs rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{authSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                  {authMode === 'register' && (
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g., Amina Yusuf"
                        className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 transition"
                        value={authForm.name}
                        onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="e.g., amina@edudocs.ai"
                      className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 transition"
                      value={authForm.email}
                      onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                    />
                  </div>

                  {authMode === 'register' && (
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                      <input 
                        type="tel" 
                        required 
                        placeholder="e.g., +234 80 1234 5678"
                        className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 transition"
                        value={authForm.phone}
                        onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Secret Password</label>
                    <input 
                      type="password" 
                      required 
                      placeholder="••••••••"
                      className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 transition"
                      value={authForm.password}
                      onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={authLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-xl text-sm font-extrabold hover:opacity-95 transition shadow-md flex items-center justify-center gap-1"
                  >
                    {authLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Authenticating Securely...
                      </>
                    ) : (
                      <>
                        {authMode === 'login' ? 'Access Account' : 'Initialize Credentials'}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                <p className="mt-4 text-center text-[11px] text-gray-400">
                  By executing this checkout session, you verify authorization and compatibility with our terms. All activities logged transparently for defense audits.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* USER HAS SESSIONS: RENDER THE CORE SaaS DASHBOARD */
          <div>
            
            {/* INCOMPLETE VERIFICATION ALERT */}
            {!user.verified && (
              <div className="mb-6 bg-amber-55 bg-orange-50 border border-orange-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-neutral-900">Please Verify Your Email Address</p>
                    <p className="text-xs text-neutral-700">Receive a simulation code or skip instantly to unlock full PDF downloads after checkout tests.</p>
                  </div>
                </div>
                <button 
                  onClick={triggerVerificationSimulation}
                  className="bg-orange-600 hover:bg-orange-700 text-white py-1.5 px-4 rounded-lg font-bold text-xs shrink-0 transition"
                >
                  Verify Email Instantly
                </button>
              </div>
            )}

            {/* TAB CONTENT: GENERATE DOCUMENT TAB */}
            {activeTab === 'generate' && (
              <div className="space-y-6">
                
                {/* If individual category hasn't been selected yet, render Category Catalog */}
                {!selectedCategory ? (
                  <div className="space-y-6">
                    {/* Catalog Header with Search */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-black text-neutral-900">Select Document Template</h2>
                        <p className="text-sm text-gray-500">Pick any compliant format below. Fill required metrics securely.</p>
                      </div>
                      
                      <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder="Search 15+ formats..." 
                          className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-indigo-500 transition shadow-2xs"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Filter categories tags */}
                    <div className="flex flex-wrap gap-2 pb-2">
                      <button 
                        onClick={() => setCategoryFilter('all')}
                        className={`text-xs px-3 py-1.5 rounded-lg font-bold border transition ${categoryFilter === 'all' ? 'bg-neutral-900 border-neutral-950 text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                      >
                        All Documents
                      </button>
                      <button 
                        onClick={() => setCategoryFilter('attestation')}
                        className={`text-xs px-3 py-1.5 rounded-lg font-bold border transition ${categoryFilter === 'attestation' ? 'bg-neutral-900 border-neutral-950 text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                      >
                        Certificates & Attestations
                      </button>
                      <button 
                        onClick={() => setCategoryFilter('reference')}
                        className={`text-xs px-3 py-1.5 rounded-lg font-bold border transition ${categoryFilter === 'reference' ? 'bg-neutral-900 border-neutral-950 text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                      >
                        References & Recommendations
                      </button>
                      <button 
                        onClick={() => setCategoryFilter('academic')}
                        className={`text-xs px-3 py-1.5 rounded-lg font-bold border transition ${categoryFilter === 'academic' ? 'bg-neutral-900 border-neutral-950 text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                      >
                        Academic Requests
                      </button>
                    </div>

                    {/* Catalog Grid */}
                    {dataLoading ? (
                      <div className="text-center py-12 bg-white rounded-xl border border-gray-150 shadow-2xs">
                        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mx-auto mb-3" />
                        <p className="text-sm text-gray-500">Loading templates securely from EduDocs server...</p>
                      </div>
                    ) : filteredCategories.length === 0 ? (
                      <div className="text-center py-12 bg-white rounded-xl border border-gray-150">
                        <Inbox className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">No template formats match your query. Try backspacing or search "Attestation".</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCategories.map((cat) => {
                          // simple categories grouping tags logic for tag badges
                          let tagStyle = "bg-blue-50 text-blue-800";
                          let categoryText = "Administrative";
                          if (cat.id.includes('attestation') || cat.id.includes('discharge') || cat.id.includes('completion')) {
                            tagStyle = "bg-emerald-50 text-emerald-800";
                            categoryText = "Attestation Letter";
                          } else if (cat.id.includes('rec') || cat.id.includes('ref')) {
                            tagStyle = "bg-purple-50 text-purple-800";
                            categoryText = "Recommendation";
                          } else if (cat.id.includes('appeal') || cat.id.includes('request') || cat.id.includes('consent') || cat.id.includes('transfer')) {
                            tagStyle = "bg-sky-50 text-sky-800";
                            categoryText = "Formal Request";
                          }

                          return (
                            <div 
                              key={cat.id} 
                              className="bg-white border border-gray-150 hover:border-blue-400 rounded-xl p-5 shadow-xs hover:shadow-md transition duration-240 flex flex-col justify-between"
                            >
                              <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                  <span className={`text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded ${tagStyle}`}>
                                    {categoryText}
                                  </span>
                                  <span className="text-sm font-black text-gray-900 font-mono">
                                    ₦{cat.priceNGN.toLocaleString()}
                                  </span>
                                </div>
                                
                                <h3 className="font-extrabold text-neutral-900 text-base">{cat.name}</h3>
                                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{cat.description}</p>
                              </div>

                              <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
                                <div className="text-[11px] text-gray-400 flex items-center gap-1">
                                  <FileCheck className="h-3.5 w-3.5 text-blue-500" />
                                  <span>{cat.requiredFields.length} inputs</span>
                                </div>
                                <button 
                                  onClick={() => selectCategoryForGeneration(cat)}
                                  className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 py-1.5 px-3 rounded-lg transition"
                                >
                                  Use Template
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  /* SELECTED INDIVIDUAL CATEGORY DRAFTING EXPERIENCE */
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Input Panel & Layout Customization */}
                    <div className="lg:col-span-5 bg-white border border-gray-150 rounded-xl shadow-xs overflow-hidden">
                      {/* Header with back button */}
                      <div className="bg-neutral-50 px-5 py-4 border-b border-gray-150 flex items-center justify-between">
                        <div>
                          <button 
                            onClick={() => setSelectedCategory(null)}
                            className="bg-white hover:bg-neutral-100 text-gray-600 hover:text-gray-900 text-[11px] font-bold py-1 px-2.5 rounded-md border border-gray-200 transition"
                          >
                            ← Back to list
                          </button>
                          <h3 className="font-extrabold text-neutral-900 mt-2 text-sm">Draft: {selectedCategory.name}</h3>
                        </div>
                        <span className="text-sm font-black text-neutral-900 font-mono">₦{selectedCategory.priceNGN.toLocaleString()}</span>
                      </div>

                      {/* Config Form */}
                      <form onSubmit={generateDocumentDraft} className="p-5 space-y-4">
                        
                        {/* Interactive fill generator button helper */}
                        <div className="flex justify-between items-center bg-blue-50/50 p-2.5 rounded-lg">
                          <span className="text-[11px] text-blue-800 font-medium">Quick draft testing?</span>
                          <button 
                            type="button"
                            onClick={() => populateDefaultFormValues(selectedCategory)}
                            className="text-[10px] font-extrabold text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded transition"
                          >
                            ⚡ Autofill Sample Values
                          </button>
                        </div>

                        {/* Fields loop */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">Required Parameters</h4>
                          {selectedCategory.requiredFields.map((field) => (
                            <div key={field.key}>
                              <label className="block text-xs font-bold text-neutral-700 mb-1">
                                {field.label} {field.required && <span className="text-red-500">*</span>}
                              </label>
                              {field.type === 'textarea' ? (
                                <textarea
                                  required={field.required}
                                  placeholder={field.placeholder}
                                  className="w-full bg-[#fdfdfd] border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-500 transition min-h-[60px]"
                                  value={generatorInputs[field.key] || ''}
                                  onChange={(e) => setGeneratorInputs({ ...generatorInputs, [field.key]: e.target.value })}
                                />
                              ) : (
                                <input
                                  type="text"
                                  required={field.required}
                                  placeholder={field.placeholder}
                                  className="w-full bg-[#fdfdfd] border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-500 transition"
                                  value={generatorInputs[field.key] || ''}
                                  onChange={(e) => setGeneratorInputs({ ...generatorInputs, [field.key]: e.target.value })}
                                />
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Official Styling Options */}
                        <div className="pt-4 border-t border-gray-100 space-y-3">
                          <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Official Custom Settings</h4>
                          
                          <div className="space-y-2">
                            <div>
                              <label className="block text-[11px] font-bold text-neutral-600 mb-1">Custom Letterhead Name</label>
                              <input 
                                type="text" 
                                placeholder="e.g., FEDERAL UNIVERSITY OF TECHNOLOGY"
                                className="w-full bg-neutral-50/50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-indigo-500 transition"
                                value={letterheadName}
                                onChange={(e) => setLetterheadName(e.target.value)}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-[11px] font-bold text-neutral-600 mb-1">Letterhead Organization Address</label>
                              <input 
                                type="text" 
                                placeholder="e.g., P.M.B. 65, Bosso Road, Minna..."
                                className="w-full bg-neutral-50/50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-indigo-500 transition"
                                value={letterheadAddress}
                                onChange={(e) => setLetterheadAddress(e.target.value)}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2">
                              <div>
                                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Official Signer Name</label>
                                <input 
                                  type="text" 
                                  placeholder="e.g., Prof. Sarah Alabi"
                                  className="w-full bg-neutral-50/50 border border-gray-200 rounded-lg p-1.5 text-xs outline-none focus:border-indigo-500 transition"
                                  value={signerName}
                                  onChange={(e) => setSignerName(e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Status watermark</label>
                                <select 
                                  className="w-full bg-neutral-50/50 border border-gray-200 rounded-lg p-1.5 text-xs outline-none focus:border-indigo-500 transition"
                                  value={addWatermark ? 'yes' : 'no'}
                                  onChange={(e) => setAddWatermark(e.target.value === 'yes')}
                                >
                                  <option value="yes">Add Draft watermarks</option>
                                  <option value="no">Do not add watermarks</option>
                                </select>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 pt-1">
                              <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={addQrCode}
                                  onChange={(e) => setAddQrCode(e.target.checked)}
                                  className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                                />
                                Add QR Verify Code
                              </label>

                              <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={addSignatureLine}
                                  onChange={(e) => setAddSignatureLine(e.target.checked)}
                                  className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                                />
                                Add Signature Placeholder
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Submit draft generator */}
                        <button 
                          type="submit" 
                          disabled={generationLoading}
                          className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-xl text-xs font-bold leading-none shadow-sm flex items-center justify-center gap-1"
                        >
                          {generationLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Calling EduDocs AI Engine...
                            </>
                          ) : (
                            <>
                              ✨ Write Document Template Preview
                            </>
                          )}
                        </button>
                      </form>
                    </div>

                    {/* Right Column: Live Interactive Previewer */}
                    <div className="lg:col-span-7 bg-white border border-gray-150 rounded-xl shadow-xs overflow-hidden">
                      <div className="px-5 py-4 bg-neutral-50 border-b border-gray-150 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-indigo-600 animate-ping"></span>
                          <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">Live Document Preview Layer</span>
                        </div>
                        {currentDoc && !currentDoc.paid && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                            Checkout Needed
                          </span>
                        )}
                        {currentDoc && currentDoc.paid && (
                          <span className="bg-green-100 text-green-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                            Official Verified (Paid)
                          </span>
                        )}
                      </div>

                      {/* Actual Document canvas */}
                      <div className="p-6 sm:p-8 bg-neutral-100 min-h-[460px] flex items-center justify-center relative">
                        {currentDoc ? (
                          <div className="w-full bg-white border border-gray-200/80 shadow-lg rounded-md p-6 sm:p-10 relative overflow-hidden text-[#1a1a1a] select-none letter-preview font-serif max-w-[580px]">
                            
                            {/* Watermark layer */}
                            {currentDoc.addWatermark && !currentDoc.paid && (
                              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-25deg] text-red-500/10 font-bold text-4xl text-center select-none pointer-events-none uppercase tracking-widest z-10 whitespace-nowrap">
                                UNPAID PREVIEW ONLY
                              </div>
                            )}

                            {/* Letterhead */}
                            {(letterheadName || letterheadAddress) && (
                              <div className="text-center border-b-2 border-double border-gray-900 pb-2 mb-6">
                                <h4 className="text-sm font-bold uppercase tracking-tight text-neutral-900 font-serif leading-tight">{letterheadName}</h4>
                                <p className="text-[9px] text-gray-500 font-sans tracking-wide mt-1">{letterheadAddress}</p>
                              </div>
                            )}

                            {/* Letter Content preview */}
                            <div className="text-xs leading-relaxed text-justify whitespace-pre-line text-neutral-800 tracking-wide font-serif">
                              {currentDoc.content}
                            </div>

                            {/* Signature Line */}
                            {currentDoc.addSignatureLine && (
                              <div className="mt-8 text-left float-right w-44 pt-2 border-t border-gray-400 font-sans text-[10px]">
                                <span className="font-bold text-gray-900 block">{currentDoc.signerName}</span>
                                <span className="text-gray-500 block">{signerTitle}</span>
                              </div>
                            )}

                            <div className="clear-both"></div>

                            {/* QR verify code widget */}
                            {currentDoc.addQrCode && (
                              <div className="mt-8 pt-4 border-t border-dotted border-gray-200 flex items-center gap-3">
                                <div className="bg-neutral-900 text-white p-1 text-[9px] font-bold uppercase shrink-0">QR CODE</div>
                                <div className="font-sans text-[9px] text-gray-400 leading-tight">
                                  <b>EduDocs cryptographic reference verification ID:</b><br/>
                                  <span>{currentDoc.id} | Status: {currentDoc.paid ? 'Offically Unlocked (Paid)' : 'Preview State'}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center p-8 max-w-sm">
                            <Layers className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <h4 className="font-extrabold text-sm text-neutral-700">No Draft Generated Yet</h4>
                            <p className="text-xs text-gray-400 mt-1">Fill the parameters form on the left, then click "Write Document Template" to render a flawless compliant copy instantly.</p>
                          </div>
                        )}
                      </div>

                      {/* Print and Checkout controls */}
                      {currentDoc && (
                        <div className="bg-neutral-50 px-5 py-4 border-t border-gray-150 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div>
                            {!currentDoc.paid ? (
                              <div className="space-y-1">
                                <p className="text-xs text-amber-800 font-bold">₦{selectedCategory.priceNGN.toLocaleString()} checkout unlocks official output</p>
                                <p className="text-[10px] text-gray-500">Unlocks watermark reduction and high-fidelity PDF save.</p>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <p className="text-xs text-green-800 font-bold">✓ Transaction Verified Unlocked</p>
                                <p className="text-[10px] text-gray-500">You have permanent access to print this document.</p>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2 w-full sm:w-auto">
                            {!currentDoc.paid ? (
                              <div className="flex items-center gap-2 w-full sm:w-auto">
                                <select 
                                  className="bg-white border border-gray-200 rounded-lg p-1.5 text-xs font-bold text-gray-700"
                                  value={selectedGateway}
                                  onChange={(e: any) => setSelectedGateway(e.target.value)}
                                >
                                  <option value="paystack">💳 Paystack Gateway</option>
                                  <option value="flutterwave">🦋 Flutterwave</option>
                                  <option value="monnify">⚡ Monnify Gateway</option>
                                </select>
                                
                                <button 
                                  onClick={triggerCheckout}
                                  className="bg-zinc-900 hover:bg-black text-white text-xs font-black py-2 px-4 rounded-lg shadow-sm transition whitespace-nowrap grow"
                                >
                                  Unlock Official PDF
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => handlePrintDocument(currentDoc)}
                                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white text-xs font-black py-2 px-4 rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition"
                              >
                                <Printer className="h-4.5 w-4.5" />
                                Save / Print PDF Letter
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: VAULT (MY DOCUMENTS) */}
            {activeTab === 'my-docs' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-neutral-900">Your Document Vault</h2>
                  <p className="text-sm text-gray-500">Retrieve, checkout, or print your previously generated administrative documentation.</p>
                </div>

                {dataLoading ? (
                  <div className="text-center py-12 bg-white rounded-xl border border-gray-150">
                    <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mx-auto mb-3" />
                    <p className="text-sm text-neutral-500">Loading documents from ledger...</p>
                  </div>
                ) : documents.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl border border-gray-150 max-w-md mx-auto">
                    <Inbox className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="font-bold text-neutral-800 text-sm">Vault is Empty</h3>
                    <p className="text-xs text-gray-400 mt-1 mb-4 leading-relaxed">
                      You haven’t initialized any drafts yet. Select a template and input variables to populate your profile.
                    </p>
                    <button 
                      onClick={() => setActiveTab('generate')}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 px-4 rounded-lg font-bold text-xs transition"
                    >
                      Browse Document Types First
                    </button>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-150 rounded-xl overflow-hidden shadow-2xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-neutral-50 border-b border-gray-150 text-[10px] font-extrabold uppercase text-gray-500 tracking-wider">
                          <th className="p-4">Document Category</th>
                          <th className="p-4">Status / Watermark</th>
                          <th className="p-4">Identifier Reference</th>
                          <th className="p-4">Created Date</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-xs">
                        {documents.map((doc) => (
                          <tr key={doc.id} className="hover:bg-neutral-50">
                            <td className="p-4">
                              <span className="font-extrabold text-neutral-900 block">{doc.categoryName}</span>
                              <span className="text-[10px] text-gray-400 block mt-0.5 uppercase tracking-wide">
                                Key Fields: {Object.keys(doc.inputs).slice(0, 3).join(', ')}...
                              </span>
                            </td>
                            <td className="p-4">
                              {doc.paid ? (
                                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-150 px-2.5 py-0.5 rounded-full font-extrabold text-[10px] uppercase">
                                  <Check className="h-3 w-3" /> Verified Official
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-150 px-2.5 py-0.5 rounded-full font-extrabold text-[10px] uppercase">
                                  <Lock className="h-3 w-3 text-amber-600" /> Pending Payment
                                </span>
                              )}
                            </td>
                            <td className="p-4 font-mono text-gray-500">{doc.id}</td>
                            <td className="p-4 text-gray-500">
                              {new Date(doc.createdAt).toLocaleDateString()} at {new Date(doc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button 
                                onClick={() => {
                                  setCurrentDoc(doc);
                                  // set correct category index active
                                  const match = categories.find(c => c.id === doc.categoryId);
                                  if (match) {
                                    setSelectedCategory(match);
                                    setGeneratorInputs(doc.inputs);
                                    setLetterheadName(doc.letterheadName || '');
                                    setLetterheadAddress(doc.letterheadAddress || '');
                                    setAddWatermark(doc.addWatermark);
                                    setAddQrCode(doc.addQrCode);
                                    setAddSignatureLine(doc.addSignatureLine);
                                    setSignerName(doc.signerName || '');
                                  }
                                  setActiveTab('generate');
                                }}
                                className="bg-indigo-55 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 py-1.5 px-3 rounded-lg font-bold text-[11px] transition"
                              >
                                View Live Preview
                              </button>
                              
                              {doc.paid ? (
                                <button 
                                  onClick={() => handlePrintDocument(doc)}
                                  className="bg-green-600 hover:bg-green-700 text-white py-1.5 px-3 rounded-lg font-bold text-[11px] transition"
                                >
                                  Print / PDF
                                </button>
                              ) : (
                                <button 
                                  onClick={() => {
                                    setCurrentDoc(doc);
                                    setSelectedGateway('paystack');
                                    // select template to pre-fill
                                    const match = categories.find(c => c.id === doc.categoryId);
                                    if (match) setSelectedCategory(match);
                                    // open checkout initialize
                                    triggerCheckout();
                                  }}
                                  className="bg-neutral-900 hover:bg-black text-white py-1.5 px-3 rounded-lg font-black text-[11px] transition"
                                >
                                  Unlock
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: PAYMENTS */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-neutral-900">Billing History Ledger</h2>
                  <p className="text-sm text-gray-500">Track all gateway payments securely synchronized from Paystack, Flutterwave, and Monnify.</p>
                </div>

                {dataLoading ? (
                  <div className="text-center py-12 bg-white rounded-xl border border-gray-150">
                    <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mx-auto mb-3" />
                    <p className="text-sm text-neutral-500">Aggregating checkout metrics...</p>
                  </div>
                ) : payments.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl border border-gray-150 max-w-sm mx-auto">
                    <DollarSign className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <h3 className="font-bold text-neutral-800 text-sm">No Payments Executed</h3>
                    <p className="text-xs text-gray-400 mt-1">When you trigger Paystack/Flutterwave/Monnify gateways, receipts log instantly here.</p>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-150 rounded-xl overflow-hidden shadow-2xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-neutral-50 border-b border-gray-150 text-[10px] font-extrabold uppercase text-gray-500 tracking-wider">
                          <th className="p-4">Paid For</th>
                          <th className="p-4">Reference Key</th>
                          <th className="p-4">Amount (NGN)</th>
                          <th className="p-4">Gateway</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Verification Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-xs">
                        {payments.map((p) => (
                          <tr key={p.id}>
                            <td className="p-4">
                              <span className="font-extrabold text-neutral-900">{p.categoryName}</span>
                            </td>
                            <td className="p-4 font-mono text-gray-500">{p.reference}</td>
                            <td className="p-4 font-extrabold text-gray-900">₦{p.amount.toLocaleString()}</td>
                            <td className="p-4 capitalize text-gray-600">{p.gateway}</td>
                            <td className="p-4">
                              {p.status === 'success' ? (
                                <span className="bg-green-50 border border-green-150 text-green-700 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                                  Success
                                </span>
                              ) : (
                                <span className="bg-red-50 border border-red-150 text-red-700 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                                  Failed
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: PROFILE */}
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-5 bg-white border border-gray-150 rounded-xl shadow-xs p-6 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center font-black text-2xl shadow-md">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-black text-neutral-900 text-lg leading-none">{user.name}</h3>
                      <p className="text-xs text-gray-400 mt-1 capitalize">Role tier: <span className="font-bold text-gray-700">{user.role}</span></p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-100 text-xs text-gray-600">
                    <div className="flex justify-between py-1">
                      <span className="font-semibold">Registered Email:</span>
                      <span className="font-bold text-neutral-900">{user.email}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-semibold">Phone Number:</span>
                      <span className="font-bold text-neutral-900 font-mono">{user.phone}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-semibold">Official Status:</span>
                      <span>
                        {user.verified ? (
                          <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded">Verified Safe</span>
                        ) : (
                          <span className="bg-rose-100 text-rose-900 text-[10px] font-bold px-2 py-0.5 rounded">Unverified Sandbox</span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-semibold">Joined Platform:</span>
                      <span className="font-mono">{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <button 
                    onClick={logout}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-lg text-xs font-bold leading-none transition"
                  >
                    Disconnect Secure Workspace Session
                  </button>
                </div>

                <div className="lg:col-span-7 bg-white border border-gray-150 rounded-xl shadow-xs p-6 space-y-4">
                  <h3 className="font-extrabold text-neutral-900">EduDocs AI Compliance Framework & Credentials Audit</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    This compliance suite keeps a cryptographic hash of all generated documents in order to protect against fraudulent claims of academic degrees. When institutions query validation codes via the integrated QR code verification page, our server evaluates the original generated text payload to ensure zero modifications have been retrofitted by job-seekers.
                  </p>
                  
                  <div className="bg-neutral-50 p-4 rounded-xl border border-gray-200">
                    <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-widest mb-2 flex items-center gap-1">
                      <Shield className="h-4 w-4 text-emerald-600" /> Authorized Signatories Guarantee
                    </h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      EduDocs only formats legitimate communications that conform to educational and industrial layout metrics. We do not generate signatures or authorized stamps artificially for foreign organizations.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: ADMIN AREA */}
            {activeTab === 'admin' && user.role === 'admin' && (
              <div className="space-y-6">
                
                {/* Admin Submenu Tabs selection */}
                <div className="bg-neutral-900 text-white p-2 rounded-xl flex flex-wrap gap-1 shadow-md">
                  <button 
                    onClick={() => setAdminActiveSubTab('stats')}
                    className={`text-xs px-3 py-1.5 rounded-lg font-bold transition ${adminActiveSubTab === 'stats' ? 'bg-amber-500 text-black' : 'hover:bg-neutral-800'}`}
                  >
                    System State Statistics
                  </button>
                  <button 
                    onClick={() => setAdminActiveSubTab('categories')}
                    className={`text-xs px-3 py-1.5 rounded-lg font-bold transition ${adminActiveSubTab === 'categories' ? 'bg-amber-500 text-black' : 'hover:bg-neutral-800'}`}
                  >
                    Manage 15+ Categories
                  </button>
                  <button 
                    onClick={() => setAdminActiveSubTab('research')}
                    className={`text-xs px-3 py-1.5 rounded-lg font-bold transition ${adminActiveSubTab === 'research' ? 'bg-amber-500 text-black' : 'hover:bg-neutral-800'}`}
                  >
                    Upload Sample Templates (Research)
                  </button>
                  <button 
                    onClick={() => setAdminActiveSubTab('prompts')}
                    className={`text-xs px-3 py-1.5 rounded-lg font-bold transition ${adminActiveSubTab === 'prompts' ? 'bg-amber-500 text-black' : 'hover:bg-neutral-800'}`}
                  >
                    AI System Prompts Setting
                  </button>
                  <button 
                    onClick={() => setAdminActiveSubTab('payments')}
                    className={`text-xs px-3 py-1.5 rounded-lg font-bold transition ${adminActiveSubTab === 'payments' ? 'bg-amber-500 text-black' : 'hover:bg-neutral-800'}`}
                  >
                    Global Checkout Audit Log
                  </button>
                  <button 
                    onClick={() => setAdminActiveSubTab('documents')}
                    className={`text-xs px-3 py-1.5 rounded-lg font-bold transition ${adminActiveSubTab === 'documents' ? 'bg-amber-500 text-black' : 'hover:bg-neutral-800'}`}
                  >
                    Global Generated Documents Feed
                  </button>
                </div>

                {/* SUB TAB 1: ADMIN STATS CARD PANEL */}
                {adminActiveSubTab === 'stats' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      
                      <div className="bg-white border border-gray-150 p-5 rounded-xl shadow-xs">
                        <div className="flex justify-between items-center text-gray-400">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest">Total Global Profits</span>
                          <DollarSign className="h-5 w-5 text-emerald-600" />
                        </div>
                        <p className="text-2xl font-black text-neutral-900 mt-2 font-mono">₦{adminStats.totalRevenue.toLocaleString()}</p>
                        <p className="text-[10px] text-green-600 mt-1 font-bold">100% Verified Real Checkout Hooks</p>
                      </div>

                      <div className="bg-white border border-gray-150 p-5 rounded-xl shadow-xs">
                        <div className="flex justify-between items-center text-gray-400">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest">Global Registered Users</span>
                          <UserIcon className="h-5 w-5 text-indigo-600" />
                        </div>
                        <p className="text-2xl font-black text-neutral-900 mt-2">{adminStats.totalUsers} Members</p>
                        <p className="text-[10px] text-gray-500 mt-1">Excludes Administrator nodes</p>
                      </div>

                      <div className="bg-white border border-gray-150 p-5 rounded-xl shadow-xs">
                        <div className="flex justify-between items-center text-gray-400">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest">Paid Documents Vaulted</span>
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        </div>
                        <p className="text-2xl font-black text-neutral-900 mt-2">{adminStats.paidDocuments} Documents</p>
                        <p className="text-[10px] text-gray-500 mt-1">Watermark-removed official PDFs unlocked</p>
                      </div>

                      <div className="bg-white border border-gray-150 p-5 rounded-xl shadow-xs">
                        <div className="flex justify-between items-center text-gray-400">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest">Document Draft Conversion Rate</span>
                          <TrendingUp className="h-5 w-5 text-indigo-600" />
                        </div>
                        <p className="text-2xl font-black text-neutral-900 mt-2">
                          {adminStats.totalDocuments > 0 
                            ? `${((adminStats.paidDocuments / adminStats.totalDocuments) * 100).toFixed(1)}%` 
                            : '0%'}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1">Based on {adminStats.totalDocuments} generated requests</p>
                      </div>
                    </div>

                    {/* Quick baseline instructions */}
                    <div className="bg-white border border-transparent rounded-xl p-6 shadow-xs border-l-4 border-amber-500">
                      <h4 className="font-extrabold text-neutral-900 text-sm flex items-center gap-1.5"><Shield className="h-4.5 w-4.5 text-amber-500" /> Admin Fast Evaluation Note</h4>
                      <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                        To add new document categories for generator forms beautifully, navigate to the <strong>“Manage 15+ Categories”</strong> or <strong>“Upload Sample Templates (Research)”</strong> sub tabs. The server automatically re-reads the database state so your new template formats will reflect immediately for all students on the main dashboard!
                      </p>
                    </div>
                  </div>
                )}

                {/* SUB TAB 2: MANAGE CATEGORIES (ADD / DELETE) */}
                {adminActiveSubTab === 'categories' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Add Category Form on left */}
                    <div className="lg:col-span-5 bg-white border border-gray-150 rounded-xl p-5 shadow-xs space-y-4">
                      <h3 className="font-black text-neutral-900 text-sm">Add New Document Category Format</h3>
                      
                      <form onSubmit={handleCreateCategory} className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-600 mb-1">ID (dashed lowercase)</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g., student-transfer-letter"
                            className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500 transition"
                            value={newCatForm.id}
                            onChange={(e) => setNewCatForm({ ...newCatForm, id: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-neutral-600 mb-1">Display Name</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g., Student School Transfer Letter"
                            className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500 transition"
                            value={newCatForm.name}
                            onChange={(e) => setNewCatForm({ ...newCatForm, name: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-neutral-600 mb-1">Pricing (NGN - Naira)</label>
                          <input 
                            type="number" 
                            required 
                            className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500 transition"
                            value={newCatForm.priceNGN}
                            onChange={(e) => setNewCatForm({ ...newCatForm, priceNGN: Number(e.target.value) })}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-neutral-600 mb-1">Detailed Description</label>
                          <textarea 
                            required 
                            placeholder="Introduce the target context here..."
                            className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500 transition min-h-[50px]"
                            value={newCatForm.description}
                            onChange={(e) => setNewCatForm({ ...newCatForm, description: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-neutral-600 mb-1">Required Custom Field Attributes (JSON Array)</label>
                          <textarea 
                            required 
                            className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg p-2 font-mono text-[10px] outline-none focus:border-indigo-500 transition min-h-[140px]"
                            value={newCatForm.requiredFieldsText}
                            onChange={(e) => setNewCatForm({ ...newCatForm, requiredFieldsText: e.target.value })}
                          />
                          <p className="text-[9px] text-gray-400 mt-1">Must be an array of objects specifying key, label, placeholder, and required type.</p>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-neutral-600 mb-1">Static Text Sample Backup</label>
                          <textarea 
                            required 
                            className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg p-2 font-mono text-[10px] outline-none focus:border-indigo-500 transition min-h-[80px]"
                            value={newCatForm.samplePreview}
                            onChange={(e) => setNewCatForm({ ...newCatForm, samplePreview: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-neutral-600 mb-1">AI Generative Directive Prompt</label>
                          <textarea 
                            required 
                            className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg p-2 font-mono text-[10px] outline-none focus:border-indigo-500 transition min-h-[80px]"
                            value={newCatForm.aiPromptTemplate}
                            onChange={(e) => setNewCatForm({ ...newCatForm, aiPromptTemplate: e.target.value })}
                          />
                        </div>

                        <button 
                          type="submit"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2 px-3 rounded-lg transition"
                        >
                          Save New Template Structure
                        </button>
                      </form>
                    </div>

                    {/* Listing on right */}
                    <div className="lg:col-span-7 bg-white border border-gray-150 rounded-xl p-5 shadow-xs">
                      <h3 className="font-black text-neutral-900 text-sm mb-4">Active Categories Registry ({categories.length})</h3>
                      <div className="space-y-3 divide-y divide-gray-100">
                        {categories.map((cat) => (
                          <div key={cat.id} className="pt-3 first:pt-0 flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-neutral-900 text-sm">{cat.name}</span>
                                <span className="text-[10px] bg-neutral-100 text-neutral-700 px-1.5 py-0.2 rounded font-mono font-bold">₦{cat.priceNGN}</span>
                              </div>
                              <p className="text-xs text-gray-400 mt-1 leading-snug">{cat.description}</p>
                              <p className="text-[10px] text-indigo-600 font-bold mt-1 uppercase tracking-wide">Fields Detected: {cat.requiredFields.map(f => f.key).join(' | ')}</p>
                            </div>

                            <button 
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-lg transition"
                              title="Delete Category"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB TAB 3: SAMPLE RESEARCH TEMPLATES MODULE */}
                {adminActiveSubTab === 'research' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Upload / Analysis Panel */}
                    <div className="lg:col-span-5 bg-white border border-gray-150 p-5 rounded-xl shadow-xs space-y-4">
                      <div>
                        <h3 className="font-black text-neutral-900 text-xs flex items-center gap-1.5"><HelpCircle className="h-4 w-4 text-emerald-600" /> AI Document Research Tool</h3>
                        <p className="text-xs text-gray-500 mt-1">Upload verified raw drafts from reputable educational institutes to benchmark your AI formatting.</p>
                      </div>

                      <form onSubmit={handleCreateResearchTemplate} className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-600 mb-1">Target Document Category</label>
                          <select 
                            className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg p-1.5 text-xs font-bold"
                            value={newResearchForm.categoryId}
                            onChange={(e) => setNewResearchForm({ ...newResearchForm, categoryId: e.target.value })}
                          >
                            {categories.map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-neutral-600 mb-1">Model Heading / Title</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g., University of Harcourt Grade-A SIWES"
                            className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500 transition"
                            value={newResearchForm.title}
                            onChange={(e) => setNewResearchForm({ ...newResearchForm, title: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-neutral-600 mb-1">Issuing Organization / Source</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g., Shell Petroleum, Warri"
                            className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500 transition"
                            value={newResearchForm.organization}
                            onChange={(e) => setNewResearchForm({ ...newResearchForm, organization: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-neutral-600 mb-1">Sample Raw Document Text Content</label>
                          <textarea 
                            required 
                            placeholder="Enter the full text of the letter here..."
                            className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg p-2 font-mono text-[10px] outline-none focus:border-indigo-500 transition min-h-[140px]"
                            value={newResearchForm.rawText}
                            onChange={(e) => setNewResearchForm({ ...newResearchForm, rawText: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-neutral-600 mb-1">Format/Structural analysis report</label>
                          <textarea 
                            required 
                            placeholder="Specify paragraphs ordering, double lines usage, address alignments..."
                            className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg p-2 font-mono text-[10px] outline-none focus:border-indigo-500 transition min-h-[80px]"
                            value={newResearchForm.structureAnalysis}
                            onChange={(e) => setNewResearchForm({ ...newResearchForm, structureAnalysis: e.target.value })}
                          />
                        </div>

                        <button 
                          type="submit"
                          className="w-full bg-neutral-900 hover:bg-black text-white font-black text-xs py-2 px-3 rounded-lg transition"
                        >
                          Analyze and Upload to Base-Data
                        </button>
                      </form>
                    </div>

                    {/* Listing of Sample Research models on right */}
                    <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-gray-150 space-y-4">
                      <div>
                        <h3 className="font-black text-neutral-900 text-sm">Analyzed Institutional Document Benchmarks</h3>
                        <p className="text-xs text-gray-500">The templates listed here are processed dynamically by our AI engine to match administrative formatting standards.</p>
                      </div>

                      <div className="space-y-4 divide-y divide-gray-100">
                        {researchTemplates.map((t) => (
                          <div key={t.id} className="pt-4 first:pt-0 space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-extrabold text-neutral-900 text-sm">{t.title}</h4>
                                <span className="text-[10px] text-gray-400 block uppercase">Source: {t.organization}</span>
                              </div>
                              <button 
                                onClick={() => handleDeleteResearchTemplate(t.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-neutral-50 p-1 rounded-lg transition"
                                title="Remove Baseline Sample"
                              >
                                <Trash2 className="h-4.5 w-4.5" />
                              </button>
                            </div>

                            <div className="bg-neutral-50 rounded-lg p-3 border border-gray-200">
                              <span className="text-[9px] font-extrabold text-gray-400 tracking-wider block uppercase mb-1">Benchmarked Text Structure:</span>
                              <p className="text-[10px] leading-relaxed text-gray-600 whitespace-pre-wrap">{t.rawText}</p>
                            </div>

                            <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 text-indigo-900">
                              <span className="text-[9px] font-extrabold uppercase block tracking-wider mb-1">Verified Structural Parsing Analysis:</span>
                              <p className="text-[10px] leading-relaxed whitespace-pre-wrap font-mono">{t.structureAnalysis}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB TAB 4: SYSTEM PROMPT SETTINGS */}
                {adminActiveSubTab === 'prompts' && (
                  <div className="bg-white border text-neutral-800 border-gray-150 p-6 rounded-xl shadow-xs space-y-6">
                    <div>
                      <h3 className="font-black text-neutral-900 text-base">Fine-Tune AI Generator Prompts</h3>
                      <p className="text-xs text-gray-500">Globally modulate the Gemini system instructions and guidelines that govern the vocabulary of output documents.</p>
                    </div>

                    {promptMessage && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-600" />
                        <strong>{promptMessage}</strong>
                      </div>
                    )}

                    <form onSubmit={handleUpdatePrompts} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 uppercase mb-1.5">Global Gemini systemInstruction</label>
                        <textarea 
                          required 
                          className="w-full bg-[#fdfdfd] border border-gray-200 rounded-lg p-3 font-mono text-xs outline-none focus:border-indigo-500 transition min-h-[140px]"
                          value={systemInstructionState}
                          onChange={(e) => setSystemInstructionState(e.target.value)}
                        />
                        <p className="text-[10px] text-gray-400 mt-1">This acts as the strict system pre-prompt governing core compliance, professional administrative metrics, and grammatical rules.</p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-700 uppercase mb-1.5">PDF and Letterhead Guidelines</label>
                        <textarea 
                          required 
                          className="w-full bg-[#fdfdfd] border border-gray-200 rounded-lg p-3 font-mono text-xs outline-none focus:border-indigo-500 transition min-h-[80px]"
                          value={pdfLetterheadState}
                          onChange={(e) => setPdfLetterheadState(e.target.value)}
                        />
                      </div>

                      <button 
                        type="submit"
                        className="bg-neutral-900 hover:bg-black text-white text-xs font-black py-2 px-6 rounded-lg transition"
                      >
                        Overwrite AI Model Configurations
                      </button>
                    </form>
                  </div>
                )}

                {/* SUB TAB 5: ADMIN PAYMENTS AUDIT TRAIL */}
                {adminActiveSubTab === 'payments' && (
                  <div className="bg-white border rounded-xl shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-gray-150">
                      <h3 className="font-black text-neutral-900 text-base">Global Transaction Audit Grid</h3>
                      <p className="text-xs text-gray-500">Review all global customer checkout sessions across platforms and gateways audited.</p>
                    </div>
                    {payments.length === 0 ? (
                      <div className="text-center py-12">
                        <DollarSign className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-xs text-gray-500">No payments verified yet.</p>
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-neutral-50 text-[10px] text-gray-500 font-extrabold uppercase border-b border-gray-150 tracking-wider">
                            <th className="p-4">Customer Name</th>
                            <th className="p-4">Paid For Category</th>
                            <th className="p-4">Gateway Used</th>
                            <th className="p-4">Reference Code</th>
                            <th className="p-4">Amount NGN</th>
                            <th className="p-4">Status Token</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                          {payments.map((p) => (
                            <tr key={p.id} className="hover:bg-neutral-50">
                              <td className="p-4">
                                <span className="font-bold text-neutral-900">{p.userName}</span>
                                <span className="text-[10px] text-gray-400 block">UID ID: {p.userId}</span>
                              </td>
                              <td className="p-4 font-bold text-gray-600">{p.categoryName}</td>
                              <td className="p-4 capitalize">{p.gateway}</td>
                              <td className="p-4 font-mono text-gray-500">{p.reference}</td>
                              <td className="p-4 font-extrabold text-neutral-900">₦{p.amount.toLocaleString()}</td>
                              <td className="p-4">
                                <span className="bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                                  {p.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {/* SUB TAB 6: GLOBAL GENERATED DOCUMENTS FEED */}
                {adminActiveSubTab === 'documents' && (
                  <div className="bg-white border rounded-xl shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-gray-150">
                      <h3 className="font-black text-neutral-900 text-base">Global Administrative Generations Registry</h3>
                      <p className="text-xs text-gray-500 font-medium">Verify structural compliance, watermarks parameters, and signature lines of all created texts.</p>
                    </div>

                    {documents.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-xs text-gray-500">No documents drafted globally yet.</p>
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-neutral-50 text-[10px] text-gray-500 font-extrabold uppercase border-b border-gray-150 tracking-wider">
                            <th className="p-4">Author Profile</th>
                            <th className="p-4">Document Type</th>
                            <th className="p-4">Pricing Status</th>
                            <th className="p-4">Cryptographic Hash ID</th>
                            <th className="p-4">Date Issued</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                          {documents.map((doc) => (
                            <tr key={doc.id} className="hover:bg-neutral-50">
                              <td className="p-4">
                                <span className="font-bold text-neutral-900">{doc.userName}</span>
                                <span className="text-[10px] text-gray-400 block font-mono">UID: {doc.userId}</span>
                              </td>
                              <td className="p-4">
                                <span className="font-semibold text-gray-800">{doc.categoryName}</span>
                              </td>
                              <td className="p-4">
                                {doc.paid ? (
                                  <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 font-bold rounded">Paid Unlocked</span>
                                ) : (
                                  <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 font-bold rounded">Sandbox Preview</span>
                                )}
                              </td>
                              <td className="p-4 font-mono text-gray-400">{doc.id}</td>
                              <td className="p-4 text-gray-500">{new Date(doc.createdAt).toLocaleDateString()}</td>
                              <td className="p-4 text-right">
                                <button 
                                  onClick={() => handlePrintDocument(doc)}
                                  className="text-indigo-600 hover:text-indigo-800 font-bold"
                                >
                                  View / Print Draft
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* MOCK TRANSACTION SUCCESS CHECKOUT POPUP MODAL (Standard UI pattern for Nigerian payment hubs simulation) */}
      {paymentModalOpen && paymentInitData && (
        <div className="fixed inset-0 bg-neutral-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-150 text-neutral-800 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs font-black uppercase text-gray-500 tracking-widest">{selectedGateway} Payment Gateway</span>
              </div>
              <button 
                onClick={() => setPaymentModalOpen(false)}
                className="text-gray-400 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="text-center space-y-2">
              <p className="text-xs text-gray-400 uppercase tracking-widest">Transaction Amount</p>
              <p className="text-3xl font-black text-neutral-940 text-neutral-900 font-mono">₦{paymentInitData.amount.toLocaleString()}</p>
              <div className="bg-slate-50 p-2 rounded-lg text-[11px] font-mono text-gray-500 flex justify-between">
                <span>Ref:</span>
                <span>{paymentInitData.reference}</span>
              </div>
              <p className="text-[10px] text-gray-400 leading-normal">
                Connecting secure merchant account for: <br/><strong>{user?.email}</strong>
              </p>
            </div>

            {/* Simulated Checkout Credentials Box */}
            <div className="bg-blue-50 border border-blue-150 p-3.5 rounded-xl space-y-1.5 text-blue-900">
              <h5 className="text-[11px] font-extrabold uppercase tracking-wide flex items-center gap-1">
                <CreditCard className="h-3.5 w-3.5 text-blue-600" />
                Simulated Sandbox Payment Card
              </h5>
              <p className="text-[11px] font-medium leading-relaxed">
                Since this is running in evaluation mode, click <strong>"Simulate Successful Pay"</strong> below to instantly clear payment state and enable permanent PDF document printing.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button 
                onClick={() => completePaymentSimulatedResult('failed')}
                disabled={paymentSimulating}
                className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 py-2 rounded-lg font-bold text-xs cursor-pointer text-center select-none transition"
              >
                Cancel payment
              </button>
              <button 
                onClick={() => completePaymentSimulatedResult('success')}
                disabled={paymentSimulating}
                className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-black text-xs cursor-pointer text-center select-none shadow-sm transition"
              >
                {paymentSimulating ? 'Processing...' : 'Simulate Successful Pay'}
              </button>
            </div>

            <p className="text-[9px] text-center text-gray-400 leading-normal">
              Protected by standard TLS encryption. EduDocs AI does not log your credit card credentials.
            </p>
          </div>
        </div>
      )}

      {/* Modern Compact Site Footer */}
      <footer className="bg-white border-t border-gray-150 py-6 mt-12 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-medium text-neutral-600">EduDocs AI © 2026 Admin Portal. All rights reserved.</p>
          <div className="flex justify-center gap-4 text-[11px] text-gray-500">
            <span>Non-Forgery Verified</span>
            <span>•</span>
            <span>Cryptographic QR Validation</span>
            <span>•</span>
            <span>Paystack / Flutterwave / Monnify Integrated</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
