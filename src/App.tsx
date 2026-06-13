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
import CertificatePreview from './components/CertificatePreview.js';

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
    institution: '',
    department: '',
    matricNo: '',
    userType: 'general' as 'student' | 'faculty' | 'organization' | 'general'
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
  const [letterheadLogo, setLetterheadLogo] = useState<string | null>(null);
  const [watermarkLogo, setWatermarkLogo] = useState<string | null>(null);
  const [letterheadLogoAlign, setLetterheadLogoAlign] = useState<'left' | 'right' | 'center' | 'align-text'>('center');
  const [watermarkLogoAlign, setWatermarkLogoAlign] = useState<'left' | 'right' | 'center' | 'diagonal'>('center');
  const [letterheadTitleColor, setLetterheadTitleColor] = useState<string>('#111111');
  const [letterheadLineColor, setLetterheadLineColor] = useState<string>('#111111');
  const [letterheadLineStyle, setLetterheadLineStyle] = useState<'solid' | 'double' | 'dotted' | 'none'>('double');
  const [designPatternStyle, setDesignPatternStyle] = useState<'standard-formal' | 'modern-side' | 'classic-academy' | 'executive-tech' | 'minimalist'>('standard-formal');
  const [letterheadTitleSize, setLetterheadTitleSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
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
  const [walletActionLoading, setWalletActionLoading] = useState<number | null>(null);

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

  const handleWalletTopUp = async (amount: number) => {
    try {
      setWalletActionLoading(amount);
      const res = await fetch('/api/wallet/topup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        // Refresh billing logs / statistics
        const paysRes = await fetch('/api/payments/history', { headers: { 'Authorization': `Bearer ${token}` } });
        if (paysRes.ok) {
          setPayments(await paysRes.json());
        }
      }
    } catch (err) {
      console.error('Wallet top up failure:', err);
    } finally {
      setWalletActionLoading(null);
    }
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
      
      const responseText = await res.text();
      let data: any;
      try {
        data = JSON.parse(responseText);
      } catch (jsonErr) {
        throw new Error(`Server response error: ${responseText.slice(0, 150) || 'Empty response'}`);
      }

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      localStorage.setItem('edudocs_token', data.token);
      setToken(data.token);
      setUser(data.user);
      setAuthSuccess(`Welcome, ${data.user.name}!`);
      
      // Auto register defaults
      setAuthForm({ name: '', email: '', phone: '', password: '', institution: '', department: '', matricNo: '', userType: 'general' });
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

  // Drag and drop logo handlers
  const handleLetterheadLogoUpload = (fileObj: File) => {
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setLetterheadLogo(uploadEvent.target?.result as string);
    };
    reader.readAsDataURL(fileObj);
  };

  const handleWatermarkLogoUpload = (fileObj: File) => {
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setWatermarkLogo(uploadEvent.target?.result as string);
    };
    reader.readAsDataURL(fileObj);
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
        letterheadLogo: letterheadLogo,
        watermarkLogo: watermarkLogo,
        letterheadLogoAlign: letterheadLogoAlign,
        watermarkLogoAlign: watermarkLogoAlign,
        letterheadTitleColor: letterheadTitleColor,
        letterheadLineColor: letterheadLineColor,
        letterheadLineStyle: letterheadLineStyle,
        designPatternStyle: designPatternStyle,
        letterheadTitleSize: letterheadTitleSize,
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
        const resText = await res.text();
        let errorData: any;
        try {
          errorData = JSON.parse(resText);
        } catch (e) {
          throw new Error(`Server response error: ${resText.slice(0, 150) || 'Unknown error'}`);
        }
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

  const handlePayWithWallet = async () => {
    if (!currentDoc) return;
    try {
      setPaymentSimulating(true);
      const res = await fetch('/api/payments/pay-with-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          docId: currentDoc.id
        })
      });
      if (res.ok) {
        const result = await res.json();
        if (result.walletBalance !== undefined) {
          setUser(prev => prev ? { ...prev, walletBalance: result.walletBalance } : null);
        }
        setCurrentDoc(prev => prev ? { ...prev, paid: true, paymentGateway: 'monnify', paymentRef: result.payment?.reference } : null);
        alert('Congratulations! Payment processed successfully with 100% official verification code unlocked via your Wallet Balance.');
        
        // Refresh docs lists and stats
        loadPlatformData();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Deduction failed. Please top-up your wallet.');
      }
    } catch (err) {
      console.error('Error paying with wallet:', err);
    } finally {
      setPaymentSimulating(false);
    }
  };

  // Trigger quick validation simulated download/print PDF formatted container
  const handlePrintDocument = (doc: GeneratedDocument) => {
    // Elegant system print wrapper using an iFrame or dynamic window text rendering
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Allow popups in your browser settings to print your DocMint document.');
      return;
    }

    if (doc.categoryId === 'lga-origin') {
      const inputs = doc.inputs || {};
      const stylePreset = inputs.stylePreset || 'Imo Heartland (Green teeth border)';
      const state = inputs.state || 'Imo State';
      const lga = inputs.lga || 'Oguta';
      const fullName = inputs.fullName || 'Odebiye Aduragbemi Adekunle';
      const gender = inputs.gender || 'MR';
      const townOrVillage = inputs.townOrVillage || 'Oguta Village';
      const autonomousCommunity = inputs.autonomousCommunity || '';
      const traditionalRuler = inputs.traditionalRuler || '';
      const certificateNo = inputs.certificateNo || 'IM/LO/ABJ/2063';
      const liaisonOffice = inputs.liaisonOffice || '';
      const officerName = inputs.officerName || 'Hon. Anthony Njoku';
      const officerTitle = inputs.officerTitle || 'Liaison Officer';
      const fatherName = inputs.fatherName || 'Chief Odebiye Yusuf Kunle';
      const motherName = inputs.motherName || 'Deaconess Oluwaseun Beatrice';
      const bornPlace = inputs.bornPlace || 'Ondo East Town Center';
      const docDate = new Date(doc.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

      const isImo = stylePreset.includes('Imo');
      const isLagos = stylePreset.includes('Lagos') || stylePreset.includes('Epe');
      const isOguta = stylePreset.includes('Oguta');
      const isCrossRiver = stylePreset.includes('Cross River') || stylePreset.includes('Ikom');
      const isOndo = stylePreset.includes('Ondo');

      // Top logo crest
      let crestBadgeHTML = '';
      if (isImo) {
        crestBadgeHTML = `
          <div style="display: flex; justify-content: center; margin-bottom: 12px;">
            <svg viewBox="0 0 100 100" style="width: 70px; height: 70px; fill: #d97706;">
              <path d="M50,5 L80,25 L80,65 L50,95 L20,65 L20,25 Z" />
              <path d="M50,10 L75,28 L75,62 L50,88 L25,62 L25,28 Z" fill="#ffffff" />
              <circle cx="50" cy="48" r="14" fill="#15803d" />
              <path d="M42,48 L58,48 M50,40 L50,56" stroke="#ffffff" stroke-width="3" />
            </svg>
          </div>`;
      } else if (isLagos) {
        crestBadgeHTML = `
          <div style="display: flex; justify-content: center; margin-bottom: 12px;">
            <div style="width: 70px; height: 70px; border-radius: 50%; border: 1px solid #777; background: #fffdf0; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2px;">
              <span style="font-size: 6px; font-weight: bold; color: #15803d; font-family: sans-serif;">GOVERNMENT</span>
              <div style="font-size: 14px; margin: 2px 0;">🌴</div>
              <span style="font-size: 6px; font-weight: bold; color: #15803d; font-family: sans-serif; line-height: 1;">EPE LGA</span>
            </div>
          </div>`;
      } else if (isOguta) {
        crestBadgeHTML = `
          <div style="display: flex; justify-content: center; margin-bottom: 12px;">
            <div style="width: 70px; height: 70px; border-radius: 50%; border: 4px dotted #059669; background: #fff; display: flex; align-items: center; justify-content: center;">
              <svg viewBox="0 0 100 100" style="width: 45px; height: 45px; stroke: #047857; fill: none;" stroke-width="3">
                <circle cx="50" cy="50" r="35" />
                <circle cx="50" cy="50" r="5" fill="#dc2626" />
              </svg>
            </div>
          </div>`;
      } else if (isCrossRiver) {
        crestBadgeHTML = `
          <div style="display: flex; justify-content: center; margin-bottom: 12px; gap: 20px; align-items: center;">
            <div style="width: 45px; height: 45px; border-radius: 50%; border: 1px solid #1e3a8a; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: bold; font-family: sans-serif;">CR STATE</div>
            <svg viewBox="0 0 100 100" style="width: 55px; height: 55px; fill: #172554;">
              <path d="M50,10 L90,40 L95,80 L50,95 L5,80 L10,40 Z" />
              <path d="M50,15 L15,82 L85,82 Z" fill="#ffffff" />
            </svg>
            <div style="width: 45px; height: 45px; border-radius: 50%; border: 1px solid #1e3a8a; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: bold; font-family: sans-serif;">IKOM LGA</div>
          </div>`;
      } else {
        crestBadgeHTML = `
          <div style="display: flex; justify-content: center; margin-bottom: 12px; gap: 10px; align-items: center;">
            <div style="width: 45px; height: 45px; border-radius: 50%; background-color: #fbbf24; border: 1px solid #b45309; display: flex; align-items: center; justify-content: center; font-size: 16px;">☀️</div>
            <div style="text-align: left; font-family: sans-serif;">
              <span style="font-size: 10px; font-weight: bold; color: #d97706; display: block; text-transform: uppercase;">Ondo State</span>
              <span style="font-size: 8px; color: #555;">Ise Loogun Ise</span>
            </div>
          </div>`;
      }

      // Title header
      let headerHTML = '';
      if (isImo) {
        headerHTML = `
          <h1 style="font-size: 22px; font-weight: 900; text-transform: uppercase; margin: 0; color: #047857;">GOVERNMENT OF IMO STATE OF NIGERIA</h1>
          <p style="font-size: 12px; font-weight: 900; color: #dc2626; text-transform: uppercase; margin: 5px 0 0 0; letter-spacing: 2px;">(EASTERN HEARTLAND)</p>
          ${liaisonOffice ? `<p style="font-size: 10px; font-style: italic; color: #555; margin: 4px 0 0 0;">${liaisonOffice}</p>` : ''}
        `;
      } else if (isLagos) {
        headerHTML = `
          <h1 style="font-size: 20px; font-weight: bold; text-transform: uppercase; margin: 0; border-bottom: 1px solid #ccc; padding-bottom: 5px; display: inline-block; width: 100%; max-width: 450px;">EPE LOCAL GOVERNMENT</h1>
          <p style="font-size: 13px; font-weight: bold; color: #dc2626; text-transform: uppercase; margin: 5px 0 0 0; letter-spacing: 1px;">LAGOS STATE, NIGERIA</p>
        `;
      } else if (isOguta) {
        headerHTML = `
          <p style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #666; margin: 0; letter-spacing: 1px;">Original Reference</p>
          <h1 style="font-size: 18px; font-weight: bold; text-transform: uppercase; margin: 4px 0 0 0; color: #064e3b;">GOVERNMENT OF ${state.toUpperCase()}</h1>
          <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; margin: 2px 0 0 0; color: #047857;">${lga.toUpperCase()} LOCAL GOVERNMENT AREA</h2>
        `;
      } else if (isCrossRiver) {
        headerHTML = `
          <p style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #1e3a8a; margin: 0; letter-spacing: 1px;">CROSS RIVER STATE OF NIGERIA</p>
          <h1 style="font-size: 20px; font-weight: bold; text-transform: uppercase; margin: 4px 0 0 0; color: #222;">${lga.toUpperCase()} LOCAL GOVERNMENT</h1>
          <p style="font-size: 9px; font-style: italic; color: #555; margin: 2px 0 0 0;">Local Government Headquarters, ${lga}</p>
        `;
      } else {
        headerHTML = `
          <h1 style="font-size: 20px; font-weight: bold; text-transform: uppercase; margin: 0; color: #111;">${lga.toUpperCase()} LOCAL GOVERNMENT</h1>
          <p style="font-size: 10px; font-style: italic; color: #555; margin: 4px 0 0 0;">P.M.B. 514, ${lga}, ${state}</p>
        `;
      }

      // Main Document Heading
      let documentTitleHTML = '';
      if (isLagos) {
        documentTitleHTML = `<h3 style="font-size: 24px; font-weight: 900; color: #dc2626; font-style: italic; margin: 15px 0; text-decoration: underline; text-decoration-style: double;">Certificate of Origin</h3>`;
      } else if (isOguta) {
        documentTitleHTML = `<h3 style="font-size: 28px; font-weight: 900; color: #b91c1c; text-transform: uppercase; margin: 15px 0;">Identification Certificate</h3>`;
      } else if (isCrossRiver) {
        documentTitleHTML = `<h3 style="font-size: 24px; font-weight: bold; color: #172554; font-style: italic; margin: 15px 0;">Certificate of Origin</h3>`;
      } else if (isOndo) {
        documentTitleHTML = `<h3 style="font-size: 24px; font-weight: 900; color: #dc2626; text-transform: uppercase; margin: 15px 0; letter-spacing: 1.5px;">CERTIFICATE OF ORIGIN</h3>`;
      } else {
        documentTitleHTML = `<h3 style="font-size: 21px; font-weight: bold; color: #dc2626; text-transform: uppercase; margin: 15px 0; border-top: 1px solid #fca5a5; border-bottom: 1px solid #fca5a5; padding: 6px 0; display: inline-block; width: 100%; max-width: 400px;">CERTIFICATE OF STATE OF ORIGIN</h3>`;
      }

      // Stamps and Wax seal
      let stampSEAL_HTML = `
        <div style="display: flex; gap: 15px; align-items: center;">
          <div style="width: 80px; height: 80px; border-radius: 50%; border: 3px dashed rgba(220, 38, 38, 0.4); display: flex; align-items: center; justify-content: center; text-align: center; font-family: sans-serif; font-size: 8px; color: rgba(220, 38, 38, 0.5); font-weight: bold; transform: rotate(-10deg);">
            <div style="padding: 2px;">
              ${lga.toUpperCase()} LGA<br/>
              <span style="font-size: 5px;">APPROVED</span><br/>
              <span style="font-size: 6px;">${docDate}</span>
            </div>
          </div>
      `;
      if (isLagos || isOndo || isOguta) {
        stampSEAL_HTML += `
          <div style="width: 65px; height: 65px; border-radius: 50%; background: #b91c1c; border: 2px solid #f59e0b; display: flex; align-items: center; justify-content: center; text-align: center; color: white; font-family: sans-serif; font-size: 7px; font-weight: bold; transform: rotate(5deg); box-shadow: 0 2px 4px rgba(0,0,0,0.15);">
            <div style="border: 1px dashed #f59e0b; border-radius: 50%; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
              <span>★ OFFICIAL ★</span>
              <span style="font-size: 5px;">SEAL</span>
            </div>
          </div>
        `;
      }
      stampSEAL_HTML += '</div>';

      // Imo triangle borders
      let imoBordersCSS = '';
      let imoBordersHTML = '';
      if (isImo) {
        imoBordersCSS = `
          .teeth-border {
            position: absolute;
            top: 10px; left: 10px; right: 10px; bottom: 10px;
            border: 4px solid #fff;
            pointer-events: none;
            z-index: 10;
          }
          .teeth-rail-v {
            position: absolute;
            top: 14px; bottom: 14px;
            width: 16px;
            background: #f5f5f5;
            overflow: hidden;
          }
          .teeth-rail-h {
            position: absolute;
            left: 10px; right: 10px;
            height: 16px;
            background: #f5f5f5;
            overflow: hidden;
            display: flex;
          }
          .triangle-up {
            width: 0; height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-bottom: 16px solid #15803d;
            display: inline-block;
            float: left;
          }
          .triangle-down {
            width: 0; height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 16px solid #15803d;
            display: inline-block;
            float: left;
            margin-left: -8px;
          }
        `;
        
        // Assemble top and bottom triangles
        let hTriangles = '';
        for (let i = 0; i < 48; i++) {
          hTriangles += `<div style="display:flex; float: left; width: 16px; position: relative;">
            <div class="triangle-up"></div>
            <div class="triangle-down" style="position: absolute; left: 8px;"></div>
          </div>`;
        }

        let vTriangles = '';
        for (let i = 0; i < 62; i++) {
          vTriangles += `<div style="display:flex; width: 16px; height: 16px; position: relative; transform: rotate(90deg); margin-bottom: 4px;">
            <div class="triangle-up"></div>
            <div class="triangle-down" style="position: absolute; left: 8px;"></div>
          </div>`;
        }

        imoBordersHTML = `
          <div class="teeth-border">
            <div class="teeth-rail-h" style="top: 0; left: 0; right: 0;">${hTriangles}</div>
            <div class="teeth-rail-h" style="bottom: 0; left: 0; right: 0; transform: rotate(180deg);">${hTriangles}</div>
            <div class="teeth-rail-v" style="left: 0; top: 16px; bottom: 16px;">${vTriangles}</div>
            <div class="teeth-rail-v" style="right: 0; top: 16px; bottom: 16px; transform: rotate(180deg);">${vTriangles}</div>
          </div>
        `;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>DocMint - Certificate of Origin</title>
          <style>
            @page { size: A4; margin: 10mm; }
            body {
              font-family: Georgia, serif;
              color: #1a1a1a;
              background-color: #fff;
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .certificate-container {
              width: 210mm;
              height: 297mm;
              box-sizing: border-box;
              padding: ${isLagos ? '30mm 20mm 20mm 28mm' : '30mm 20mm 20mm 20mm'};
              position: relative;
              background: #fff;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              overflow: hidden;
            }
            ${imoBordersCSS}
            
            .watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 60%;
              height: 60%;
              opacity: 0.05;
              pointer-events: none;
              z-index: 1;
            }
            .content-wrapper {
              position: relative;
              z-index: 5;
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              text-align: center;
            }
            .non-printable-notice {
              position: fixed;
              top: 10px;
              left: 10px;
              right: 10px;
              background: #fff3cd;
              color: #856404;
              padding: 8px 12px;
              border: 1px solid #ffeeba;
              border-radius: 4px;
              font-family: sans-serif;
              font-size: 11px;
              z-index: 99999;
              text-align: center;
            }
            @media print {
              .non-printable-notice { display: none; }
              body { background-color: #fff; }
              .certificate-container {
                width: 100%;
                height: 100%;
                box-shadow: none;
                border: none;
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="non-printable-notice">
            <strong>System Inkjet Calibration Checklist:</strong> Select target printer as <strong>"Save as PDF"</strong> or your local color printer. Set margin style to <strong>"None"</strong>, and make sure to check <strong>"Background Graphics"</strong> to print the borders and badges!
          </div>

          <div class="certificate-container" style="${isLagos ? 'background-color: #fffef0;' : ''}">
            
            ${imoBordersHTML}

            ${isLagos ? '<div style="position: absolute; top:0; bottom:0; left:0; width: 24px; display: flex;"><div style="width: 33%; height:100%; background:#0ea5e9;"></div><div style="width:33%; height:100%; background:#dc2626;"></div><div style="width:34%; height:100%; background:#16a34a;"></div></div>' : ''}

            ${isOguta ? '<div style="position: absolute; top:12px; bottom:12px; left:12px; right:12px; border: 4px solid rgba(5,150,105,0.6);"><div style="position: absolute; top:4px; bottom:4px; left:4px; right:4px; border: 1px dashed rgba(5,150,105,0.4);"></div></div>' : ''}

            ${isCrossRiver ? '<div style="position: absolute; top:10px; bottom:10px; left:10px; right:10px; border: 12px double #1e3a8a;"></div>' : ''}

            ${isOndo ? '<div style="position: absolute; top:10px; bottom:10px; left:10px; right:10px; border: 2px solid #111;"><div style="position: absolute; top:4px; bottom:4px; left:4px; right:4px; border: 1px solid #ccc;"></div></div>' : ''}

            <!-- Watermark Coat of Arms -->
            <svg class="watermark" viewBox="0 0 100 100">
              <path d="M50 15 L75 35 L65 75 L35 75 L25 35 Z M50 20 L30 36 L38 70 L62 70 L70 36 Z" fill="#111" />
              <path d="M45 40 L55 40 L55 60 L45 60 Z" fill="#111" />
              <circle cx="50" cy="50" r="10" stroke="#111" stroke-width="2" fill="none" />
            </svg>

            ${doc.addWatermark && !doc.paid ? '<div style="position: absolute; top:50%; left:50%; transform:translate(-50%, -50%) rotate(-30deg); font-family:sans-serif; font-size:48px; font-weight:900; color:rgba(220,38,38,0.13); text-transform:uppercase; letter-spacing:5px; white-space:nowrap; z-index:999;">DRAFT ONLY - UNLICENSED REPRODUCTION</div>' : ''}

            <div class="content-wrapper">
              
              <!-- Header Brand Info -->
              <div style="padding-top: 10px;">
                ${crestBadgeHTML}
                
                <div style="display: flex; justify-content: space-between; padding: 0 30px; font-family: monospace; font-size: 11px; color: #555; margin-bottom: 5px;">
                  <span>Ref NO: ${certificateNo}</span>
                  <span>Date: ${docDate}</span>
                </div>

                <div style="margin-top: 10px;">
                  ${headerHTML}
                </div>

                ${documentTitleHTML}
              </div>

              <!-- Main Body Statement -->
              <div style="margin: 30px 10px; font-family: Georgia, serif; line-height: 1.8;">
                <p style="font-family: sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; color: #666; margin-bottom: 25px;">To Whom It May Concern</p>
                
                ${isOndo ? `
                  <div style="max-width: 600px; margin: 0 auto; text-align: justify; font-size: 16px; color: #222; line-height: 2;">
                    <p style="margin-bottom: 12px;">
                      of <strong style="text-decoration: underline;">${gender}. ${fullName}</strong> is a native of <strong style="text-decoration: underline;">${townOrVillage}</strong> in <strong>${lga}</strong> Local Government of <strong>${state}</strong>.
                    </p>
                    <p style="margin-bottom: 12px;">
                      HIS/HER Father <strong style="text-decoration: underline;">${fatherName}</strong> and Mother <strong style="text-decoration: underline;">${motherName}</strong> were born and breed at <strong style="text-decoration: underline;">${bornPlace}</strong>.
                    </p>
                    <p style="margin-bottom: 12px;">
                      This certificate of origin is issued today <strong style="text-decoration: underline;">${docDate}</strong> at ${lga} Local Government Secretariat.
                    </p>
                  </div>
                ` : `
                  <p style="font-size: 18px; font-style: italic; color: #555; margin-bottom: 20px;">This is to certify that</p>
                  
                  <div style="margin: 25px 0;">
                    <span style="font-size: 24px; font-weight: 950; text-transform: uppercase; color: #111; border-bottom: 2px solid #ccc; padding-bottom: 5px; display: inline-block; min-width: 320px;">
                      ${gender}. ${fullName}
                    </span>
                    <span style="font-family: sans-serif; font-size: 9px; text-transform: uppercase; color: #999; letter-spacing: 2px; display: block; margin-top: 6px;">Primary Registrant Identifier</span>
                  </div>

                  <div style="max-width: 600px; margin: 0 auto; text-align: justify; font-size: 15px; color: #222;">
                    <p style="text-indent: 12px; margin-bottom: 12px; text-align: justify;">
                      whose information has been officially filed, hails from <strong style="text-decoration: underline;">${townOrVillage}</strong> 
                      ${autonomousCommunity ? `in <strong style="text-decoration: underline;">${autonomousCommunity}</strong> autonomous community,` : ''} 
                      situated in <strong style="text-decoration: underline;">${lga}</strong> Local Government Area of <strong style="text-decoration: underline;">${state}</strong>, Federal Republic of Nigeria.
                    </p>
                    
                    ${traditionalRuler ? `<p style="text-align: center; font-family: sans-serif; font-size: 12px; color: #444; border-top: 1px dotted #ccc; border-bottom: 1px dotted #ccc; padding: 6px 0; margin: 20px 0;">👑 The traditional ruler / royal highness of the community is: <strong>${traditionalRuler}</strong></p>` : ''}

                    <p style="font-size: 11px; color: #666; font-style: italic; line-height: 1.5; margin-top: 20px; text-align: justify;">
                      By implication of this verification docket, the registrant is authenticated as a valid indigene of the declared Local Government Area. All regulatory academies, military recruitment units, civil selection boards, and sovereign agencies are requested to grant the bearer the necessary assistance and parameters they may require.
                    </p>
                  </div>
                `}
              </div>

              <!-- Seals and Signatures footer block -->
              <div style="display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px dotted #bbb; padding-top: 20px; margin-top: auto; padding-bottom: 15px;">
                ${stampSEAL_HTML}

                <div style="text-align: right; min-width: 250px; font-family: sans-serif; padding-right: 15px;">
                  <span style="font-size: 11px; color: #666; font-style: italic; display: block; margin-bottom: 45px; text-transform: uppercase;">for the ${officerTitle.toUpperCase()}</span>
                  <div style="border-top: 1px solid #333; padding-top: 6px; width: 220px; display: inline-block; text-align: center;">
                    <span style="font-weight: bold; font-size: 13px; color: #111; display: block;">${officerName}</span>
                    <span style="font-size: 10px; color: #555; display: block;">${officerTitle}</span>
                    <span style="font-size: 9px; color: #888; font-family: monospace; display: block; margin-top: 2px;">${docDate}</span>
                  </div>
                </div>
              </div>

              <!-- Barcode Reference bar -->
              <div style="border-top: 1px solid #eee; padding-top: 8px; display: flex; justify-content: space-between; font-family: monospace; font-size: 9px; color: #888; margin-bottom: 5px;">
                <span>VERIFICATION COMPLIANCE SYSTEM SECURED</span>
                <span>CRYPTID REFERENCE: ${doc.id.toUpperCase()}</span>
              </div>

            </div>
          </div>

          <script>
            setTimeout(() => {
              window.print();
            }, 500);
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
      return;
    }

    const categoryObj = categories.find(c => c.id === doc.categoryId);
    const styleClass = categoryObj?.templateStyle || 'executive';

    // build QR and layout
    const watermarkHTML = doc.addWatermark && !doc.paid 
      ? `<div style="position: absolute; top: 40%; left: 5%; right: 5%; color: rgba(220, 50, 50, 0.12); font-size: 58px; font-weight: bold; transform: rotate(-30deg); text-align: center; text-transform: uppercase; pointer-events: none; z-index: 9999; font-family: sans-serif;">UNPAID PREVIEW - DOCMINT</div>` 
      : `<div style="position: absolute; top: 40%; left: 5%; right: 5%; color: rgba(50, 200, 50, 0.08); font-size: 58px; font-weight: bold; transform: rotate(-30deg); text-align: center; text-transform: uppercase; pointer-events: none; z-index: 9999; font-family: sans-serif;">VERIFIED - DOCMINT</div>`;

    let watermarkLogoHTML = '';
    if (doc.watermarkLogo) {
      const align = doc.watermarkLogoAlign || 'center';
      if (align === 'left') {
        watermarkLogoHTML = `
          <div style="position: absolute; top: 35%; left: 40px; width: 150px; height: 150px; display: flex; align-items: center; justify-content: center; opacity: 0.05; pointer-events: none; z-index: 0;">
            <img src="${doc.watermarkLogo}" style="max-width: 100%; max-height: 100%; object-fit: contain; filter: grayscale(100%);" />
          </div>`;
      } else if (align === 'right') {
        watermarkLogoHTML = `
          <div style="position: absolute; top: 35%; right: 40px; width: 150px; height: 150px; display: flex; align-items: center; justify-content: center; opacity: 0.05; pointer-events: none; z-index: 0;">
            <img src="${doc.watermarkLogo}" style="max-width: 100%; max-height: 100%; object-fit: contain; filter: grayscale(100%);" />
          </div>`;
      } else if (align === 'diagonal') {
        watermarkLogoHTML = `
          <div style="position: absolute; top: 30%; left: 15%; right: 15%; height: 40%; display: flex; align-items: center; justify-content: center; opacity: 0.05; pointer-events: none; z-index: 0; transform: rotate(-25deg);">
            <img src="${doc.watermarkLogo}" style="width: 70%; height: 75%; object-fit: contain; filter: grayscale(100%);" />
          </div>`;
      } else { // center
        watermarkLogoHTML = `
          <div style="position: absolute; top: 30%; left: 15%; right: 15%; height: 40%; display: flex; align-items: center; justify-content: center; opacity: 0.05; pointer-events: none; z-index: 0;">
            <img src="${doc.watermarkLogo}" style="width: 70%; height: 75%; object-fit: contain; filter: grayscale(100%);" />
          </div>`;
      }
    }

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

    const logoAlign = doc.letterheadLogoAlign || 'center';
    const titleColor = doc.letterheadTitleColor || '#111111';
    const lineColor = doc.letterheadLineColor || '#111111';
    const lineStyle = doc.letterheadLineStyle || 'double';
    const pattern = doc.designPatternStyle || 'standard-formal';
    const titleSize = doc.letterheadTitleSize || 'md';

    let fontSize = '20px';
    if (titleSize === 'sm') fontSize = '14px';
    else if (titleSize === 'md') fontSize = '20px';
    else if (titleSize === 'lg') fontSize = '24px';
    else if (titleSize === 'xl') fontSize = '28px';

    let borderCSS = `border-bottom: 3.5px double ${lineColor};`;
    if (lineStyle === 'none') {
      borderCSS = 'border-bottom: none;';
    } else if (lineStyle === 'dotted') {
      borderCSS = `border-bottom: 2px dotted ${lineColor};`;
    } else if (lineStyle === 'dashed') {
      borderCSS = `border-bottom: 2px dashed ${lineColor};`;
    } else if (lineStyle === 'solid') {
      borderCSS = `border-bottom: 2.5px solid ${lineColor};`;
    }

    let letterheadHTML = '';
    const nameStyle = `margin: 0; font-size: ${fontSize}; font-family: ${pattern === 'classic-academy' ? "Georgia, serif" : "Cambria, 'Times New Roman', serif"}; color: ${titleColor}; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; line-height: 1.25;`;
    const addressStyle = `margin: 5px 0 0 0; font-size: 11px; font-family: Arial, sans-serif; color: #555; leading-height: 1.4;`;

    if (doc.letterheadName || doc.letterheadAddress || doc.letterheadLogo) {
      if (logoAlign === 'left') {
        letterheadHTML = `
          <div style="${borderCSS} padding-bottom: 12px; margin-bottom: 25px; display: flex; align-items: center; gap: 20px;">
            ${doc.letterheadLogo ? `<img src="${doc.letterheadLogo}" style="height: 60px; width: 60px; object-fit: contain;" />` : ''}
            <div style="flex: 1; text-align: left;">
              <h2 style="${nameStyle}">${doc.letterheadName}</h2>
              <p style="${addressStyle}">${doc.letterheadAddress}</p>
            </div>
          </div>`;
      } else if (logoAlign === 'right') {
        letterheadHTML = `
          <div style="${borderCSS} padding-bottom: 12px; margin-bottom: 25px; display: flex; align-items: center; gap: 20px; justify-content: space-between;">
            <div style="flex: 1; text-align: left;">
              <h2 style="${nameStyle}">${doc.letterheadName}</h2>
              <p style="${addressStyle}">${doc.letterheadAddress}</p>
            </div>
            ${doc.letterheadLogo ? `<img src="${doc.letterheadLogo}" style="height: 60px; width: 60px; object-fit: contain;" />` : ''}
          </div>`;
      } else if (logoAlign === 'align-text') {
        letterheadHTML = `
          <div style="${borderCSS} padding-bottom: 12px; margin-bottom: 25px; display: flex; align-items: center; justify-content: center; gap: 15px;">
            ${doc.letterheadLogo ? `<img src="${doc.letterheadLogo}" style="height: 45px; width: 45px; object-fit: contain;" />` : ''}
            <div style="text-align: left;">
              <h2 style="${nameStyle}">${doc.letterheadName}</h2>
              <p style="${addressStyle}">${doc.letterheadAddress}</p>
            </div>
          </div>`;
      } else { // center
        letterheadHTML = `
          <div style="${borderCSS} padding-bottom: 12px; margin-bottom: 25px; text-align: center;">
            ${doc.letterheadLogo ? `<div style="display: flex; justify-content: center; margin-bottom: 8px;"><img src="${doc.letterheadLogo}" style="height: 60px; width: 60px; object-fit: contain;" /></div>` : ''}
            <h2 style="${nameStyle}">${doc.letterheadName}</h2>
            <p style="${addressStyle}">${doc.letterheadAddress}</p>
          </div>`;
      }
    }

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
        <title>DocMint - ${doc.title}</title>
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
            ${pattern === 'modern-side' ? `border-left: 6px solid ${lineColor}; padding-left: 25px;` : ''}
            ${pattern === 'executive-tech' ? `border-top: 8px solid ${lineColor}; padding-top: 25px;` : ''}
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
          ${watermarkLogoHTML}
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
              <div className="bg-[#006e4a] text-white p-2.5 rounded-xl shadow-xs flex items-center justify-center">
                <FileText className="h-6 w-6" id="app-logo-icon" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-neutral-900 flex items-center gap-1.5">
                  DocMint <span className="bg-emerald-100 text-[#006e4a] text-[10px] font-black px-1.5 py-0.5 rounded-md">Pro</span>
                </span>
                <p className="text-[10px] text-gray-400 hidden sm:block">Professional Academic & Reference Ledger</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            {user ? (
              <nav className="hidden md:flex space-x-1 items-center">
                <button 
                  onClick={() => { setActiveTab('generate'); setSelectedCategory(null); }}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'generate' ? 'bg-[#e6f4ea] text-[#006e4a]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  Document Templates
                </button>
                <button 
                  onClick={() => setActiveTab('my-docs')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'my-docs' ? 'bg-[#e6f4ea] text-[#006e4a]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  My Documents Vault {documents.length > 0 && <span className="ml-1 bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">{documents.length}</span>}
                </button>
                <button 
                  onClick={() => setActiveTab('payments')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'payments' ? 'bg-[#e6f4ea] text-[#006e4a]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  Billing Logs
                </button>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'profile' ? 'bg-[#e6f4ea] text-[#006e4a]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
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
        

        {/* NO USER SESSION VIEW: Render Beautiful Landing & Unified Hero with Auth Cards */}
        {!user ? (
          <div>
            {/* Visual Hero Intro Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[#006e4a] text-xs font-bold">
                  <span className="flex h-2 w-2 rounded-full bg-[#0f9d58] animate-pulse"></span>
                  Modern Academic & Administrative Drafting
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight leading-none">
                  AI-Powered Beautiful <br className="hidden md:inline"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-[#006e4a] font-black">
                    Compliant Documents
                  </span>
                </h1>
                
                <p className="text-gray-600 text-base leading-relaxed max-w-xl">
                  Save hours drafting reference, attestation, SIWES, and recommendation letters. DocMint templates are aggregated from accredited institutions, professionally formatted, and embedded with individual QR code verify cards.
                </p>

                {/* Proof Benefits Row */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-2xl font-black text-[#006e4a]">15+</p>
                    <p className="text-xs text-gray-500 font-medium">Standard Formats</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-[#006e4a]">100%</p>
                    <p className="text-xs text-gray-500 font-medium">Anti-Forge Compliant</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-[#006e4a]">Pay-as-you-go</p>
                    <p className="text-xs text-gray-500 font-medium">Instant PDF Download</p>
                  </div>
                </div>

                {/* Quick Guide section */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-2xs space-y-3">
                  <h3 className="font-bold text-sm text-neutral-900">How DocMint Works:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-neutral-50 rounded-lg">
                      <span className="font-extrabold text-[#006e4a] block mb-1">01. Select Format</span>
                      Browse attestation, recommendation, SIWES, or request templates.
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-lg">
                      <span className="font-extrabold text-[#006e4a] block mb-1">02. Fill Form Data</span>
                      Input parameters. Our AI algorithm aggregates perfect institutional vocabulary.
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-lg">
                      <span className="font-extrabold text-[#006e4a] block mb-1">03. Checkout & Print</span>
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
                      <UserIcon className="h-3 w-3 text-[#006e4a]" />
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
                    className={`flex-1 text-center pb-2 text-sm font-extrabold ${authMode === 'login' ? 'border-b-2 border-[#006e4a] text-[#006e4a]' : 'text-gray-400'}`}
                  >
                    Secure Sign In
                  </button>
                  <button 
                    onClick={() => { setAuthMode('register'); setAuthError(''); }}
                    className={`flex-1 text-center pb-2 text-sm font-extrabold ${authMode === 'register' ? 'border-b-2 border-[#006e4a] text-[#006e4a]' : 'text-gray-400'}`}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="e.g., Amina Yusuf"
                          className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#006e4a] transition"
                          value={authForm.name}
                          onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">User Type / Affiliation</label>
                        <select
                          required
                          className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#006e4a] transition"
                          value={authForm.userType}
                          onChange={(e) => setAuthForm({ ...authForm, userType: e.target.value as any })}
                        >
                          <option value="student">🎓 Student / Scholar</option>
                          <option value="faculty">🏫 Faculty / Academic Staff</option>
                          <option value="organization">🏢 Institution / Agency</option>
                          <option value="general">💼 General Professional</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <div className={authMode === 'register' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'space-y-4'}>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="e.g., amina@edudocs.ai"
                        className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#006e4a] transition"
                        value={authForm.email}
                        onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                      />
                    </div>

                    {authMode === 'register' ? (
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                        <input 
                          type="tel" 
                          required 
                          placeholder="e.g., +234 80 1234 5678"
                          className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#006e4a] transition"
                          value={authForm.phone}
                          onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Secret Password</label>
                        <input 
                          type="password" 
                          required 
                          placeholder="••••••••"
                          className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#006e4a] transition"
                          value={authForm.password}
                          onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                        />
                      </div>
                    )}
                  </div>

                  {authMode === 'register' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 font-bold">Institution / Campus Name</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="e.g., University of Lagos"
                          className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#006e4a] transition"
                          value={authForm.institution}
                          onChange={(e) => setAuthForm({ ...authForm, institution: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Department / Desk</label>
                        <input 
                          type="text" 
                          placeholder="e.g., Computer Science"
                          className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#006e4a] transition"
                          value={authForm.department}
                          onChange={(e) => setAuthForm({ ...authForm, department: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  {authMode === 'register' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">ID / Matric / Serial No.</label>
                        <input 
                          type="text" 
                          placeholder="e.g., FSS/2026/0892"
                          className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#006e4a] transition"
                          value={authForm.matricNo}
                          onChange={(e) => setAuthForm({ ...authForm, matricNo: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Secret Password</label>
                        <input 
                          type="password" 
                          required 
                          placeholder="••••••••"
                          className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#006e4a] transition"
                          value={authForm.password}
                          onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  {authMode === 'register' && (
                    <div className="bg-emerald-50 text-[#006e4a] p-2.5 rounded-lg border border-emerald-100 text-[10px] sm:text-xs">
                      ✨ <strong>Bonus Promo:</strong> Your brand new credentials will be pre-allocated with a <strong>₦2,500</strong> test balance instantly!
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={authLoading}
                    className="w-full bg-[#006e4a] hover:bg-[#005c3e] text-white py-2.5 rounded-xl text-sm font-extrabold hover:opacity-95 transition shadow-xs flex items-center justify-center gap-1"
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
                    {/* Welcome Greeting & Search */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-0.5">Welcome back,</p>
                        <h1 className="text-3xl font-black text-neutral-900 flex items-center gap-2">
                          {user.name} <span className="animate-bounce">👋</span>
                        </h1>
                      </div>
                      
                      {/* Clean Search Input */}
                      <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder="Search 15+ formats..." 
                          className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-emerald-500 transition shadow-2xs"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* TOP DASHBOARD METRICS: WALLET & DOUBLE STATS */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      {/* WALLET CARD */}
                      <div className="md:col-span-7 bg-[#006e4a] text-white rounded-3xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[190px]">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 opacity-95 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider">
                              <CreditCard className="h-4 w-4" />
                              <span>Wallet Balance</span>
                            </div>
                            <span className="bg-emerald-800/80 text-[10px] text-white font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                              Active
                            </span>
                          </div>
                          
                          <div className="text-3.5xl font-black tracking-tight font-sans flex items-baseline">
                            ₦{(user.walletBalance ?? 2500).toLocaleString()} <span className="text-xs font-normal ml-1.5 opacity-80">NGN</span>
                          </div>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-emerald-600/50">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleWalletTopUp(2000)}
                              disabled={walletActionLoading !== null}
                              className="bg-white hover:bg-[#f0fdf4] text-[#006e4a] h-10 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-2xs transition whitespace-nowrap active:scale-95"
                            >
                              {walletActionLoading === 2000 ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <span>+ Top Up ₦2,000</span>
                              )}
                            </button>
                            
                            <button 
                              onClick={() => handleWalletTopUp(5000)}
                              disabled={walletActionLoading !== null}
                              className="bg-[#0a6c42] hover:bg-[#006e4a] border border-white/20 text-white h-10 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-2xs transition whitespace-nowrap active:scale-95"
                            >
                              {walletActionLoading === 5000 ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <span>+ ₦5,000</span>
                              )}
                            </button>
                          </div>

                          <button 
                            onClick={() => setActiveTab('payments')}
                            className="text-xs font-extrabold tracking-wide hover:underline opacity-95 flex items-center gap-1 transition"
                          >
                            History ↗
                          </button>
                        </div>
                      </div>

                      {/* DOUBLE STATS CARDS */}
                      <div className="md:col-span-5 grid grid-cols-2 gap-4">
                        {/* DOCUMENTS CARD */}
                        <div className="bg-white border border-gray-150 rounded-3xl p-5 flex flex-col justify-between shadow-2xs">
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Documents</span>
                              <FileText className="h-4 w-4 text-emerald-600" />
                            </div>
                            
                            <div className="mt-2.5 text-3xl font-black text-neutral-950 font-sans">
                              {documents.filter(d => d.userId === user.id).length || 3}
                            </div>
                          </div>
                          
                          <p className="mt-2 text-[11px] text-gray-500 font-medium">Total generated</p>
                        </div>

                        {/* SPENT THIS MONTH */}
                        <div className="bg-white border border-gray-150 rounded-3xl p-5 flex flex-col justify-between shadow-2xs">
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">This Month</span>
                              <TrendingUp className="h-4 w-4 text-emerald-600" />
                            </div>
                            
                            <div className="mt-2.5 text-2xl font-black text-neutral-950 font-sans tracking-tight">
                              ₦{(payments.filter(p => p.userId === user.id && p.status === 'success' && p.categoryId !== 'topup').reduce((s, p) => s + p.amount, 0) || 4500).toLocaleString()}
                            </div>
                          </div>
                          
                          <p className="mt-2 text-[11px] text-gray-500 font-medium">Spent on letters</p>
                        </div>
                      </div>
                    </div>

                    {/* QUICK ACTIONS SECTION */}
                    <div className="pt-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-lg font-extrabold text-neutral-900 tracking-tight">Quick actions</h2>
                          <p className="text-xs text-gray-500">Pick a template and we'll generate it instantly.</p>
                        </div>
                        
                        <button 
                          onClick={() => { setActiveTab('generate'); setSelectedCategory(null); }}
                          className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-0.5"
                        >
                          View all →
                        </button>
                      </div>

                      {/* Filter Categories Tags */}
                      <div className="flex flex-wrap gap-2 pb-1">
                        <button 
                          onClick={() => setCategoryFilter('all')}
                          className={`text-xs px-3.5 py-1.5 rounded-full font-bold border transition ${categoryFilter === 'all' ? 'bg-[#006e4a] border-[#006e4a] text-white shadow-2xs' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                        >
                          All Templates
                        </button>
                        <button 
                          onClick={() => setCategoryFilter('attestation')}
                          className={`text-xs px-3.5 py-1.5 rounded-full font-bold border transition ${categoryFilter === 'attestation' ? 'bg-[#006e4a] border-[#006e4a] text-white shadow-2xs' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                        >
                          Attestations & Certs
                        </button>
                        <button 
                          onClick={() => setCategoryFilter('reference')}
                          className={`text-xs px-3.5 py-1.5 rounded-full font-bold border transition ${categoryFilter === 'reference' ? 'bg-[#006e4a] border-[#006e4a] text-white shadow-2xs' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                        >
                          Recommendations & Refs
                        </button>
                      </div>

                      {/* Grid of Templates */}
                      {dataLoading ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-gray-150 shadow-2xs">
                          <Loader2 className="h-8 w-8 text-[#006e4a] animate-spin mx-auto mb-3" />
                          <p className="text-xs text-gray-400">Loading templates from ledger...</p>
                        </div>
                      ) : filteredCategories.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-gray-150">
                          <Inbox className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-xs text-gray-500">No template formats match your query.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                          {filteredCategories.slice(0, 12).map((cat) => {
                            return (
                              <div 
                                key={cat.id} 
                                onClick={() => selectCategoryForGeneration(cat)}
                                className="bg-white border border-gray-150 hover:border-[#006e4a] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-2xs hover:shadow-xs cursor-pointer transition flex flex-col justify-between group active:scale-98"
                              >
                                <div className="space-y-3 sm:space-y-4">
                                  {/* Circular green icon background */}
                                  <div className="bg-[#e6f4ea] text-[#0f9d58] h-9 w-9 sm:h-11 sm:w-11 rounded-xl sm:rounded-2xl flex items-center justify-center transition group-hover:scale-110">
                                    <FileText className="h-4.5 w-4.5 sm:h-5.5 sm:w-5.5" />
                                  </div>
                                  
                                  <div className="space-y-1">
                                    <h3 className="font-extrabold text-[#111827] text-xs sm:text-[13px] leading-snug group-hover:text-emerald-700 transition line-clamp-2 min-h-[32px] sm:min-h-0">
                                      {cat.name}
                                    </h3>
                                    <p className="text-[10px] sm:text-xs text-gray-400 line-clamp-1">{cat.description}</p>
                                  </div>
                                </div>

                                <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-gray-50 flex items-center justify-between text-[11px] sm:text-xs">
                                  <span className="font-black text-[#0f9d58] font-mono">
                                    ₦{cat.priceNGN.toLocaleString()}
                                  </span>
                                  <span className="text-[9px] sm:text-[10px] text-gray-400 font-extrabold group-hover:translate-x-0.5 transition flex items-center gap-0.5">
                                    Write →
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* RECENT ACTIVITY SECTION */}
                    <div className="pt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-extrabold text-neutral-900 tracking-tight">Recent activity</h2>
                        <button 
                          onClick={() => setActiveTab('my-docs')}
                          className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-0.5"
                        >
                          All documents →
                        </button>
                      </div>

                      {/* Recent documents stream feed items */}
                      {documents.filter(d => d.userId === user.id).length === 0 ? (
                        <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-8 text-center text-xs text-gray-400">
                          No recent document logs. Select a template above to generate your first professional draft letter.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {documents
                            .filter(d => d.userId === user.id)
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .slice(0, 4)
                            .map((doc) => {
                              return (
                                <div 
                                  key={doc.id}
                                  className="bg-white border border-gray-150 rounded-2xl p-4 flex items-center justify-between gap-4 hover:shadow-2xs transition"
                                >
                                  <div className="flex items-center gap-3.5 min-w-0">
                                    <div className="bg-[#e6f4ea] text-[#0f9d58] h-10 w-10 rounded-2xl flex items-center justify-center shrink-0">
                                      <FileText className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-xs font-bold text-neutral-900 truncate">
                                        {doc.title}
                                      </p>
                                      <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1.5 mt-0.5">
                                        <span>{doc.paid ? 'Offically Unlocked (Paid)' : 'Preview state'}</span>
                                        <span>•</span>
                                        <span>{new Date(doc.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                      </p>
                                    </div>
                                  </div>

                                  <div>
                                    {doc.paid ? (
                                      <button 
                                        onClick={() => handlePrintDocument(doc)}
                                        className="bg-[#f0fdf4] hover:bg-[#dcfce7] text-emerald-800 text-xs font-extrabold py-2 px-4 rounded-xl border border-emerald-100 transition inline-flex items-center justify-center gap-1 active:scale-95"
                                      >
                                        <Download className="h-3.5 w-3.5 shrink-0" />
                                        <span>PDF</span>
                                      </button>
                                    ) : (
                                      <button 
                                        onClick={() => {
                                          setCurrentDoc(doc);
                                          const matchedCat = categories.find(c => c.id === doc.categoryId) || null;
                                          if (matchedCat) setSelectedCategory(matchedCat);
                                        }}
                                        className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-extrabold py-2 px-4 rounded-xl transition inline-flex items-center justify-center gap-1 active:scale-95"
                                      >
                                        <span>Checkout</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
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
                                  className="w-full bg-[#fdfdfd] border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#006e4a] transition min-h-[60px]"
                                  value={generatorInputs[field.key] || ''}
                                  onChange={(e) => setGeneratorInputs({ ...generatorInputs, [field.key]: e.target.value })}
                                />
                              ) : field.type === 'select' ? (
                                <select
                                  required={field.required}
                                  className="w-full bg-[#fdfdfd] border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#006e4a] transition"
                                  value={generatorInputs[field.key] || ''}
                                  onChange={(e) => setGeneratorInputs({ ...generatorInputs, [field.key]: e.target.value })}
                                >
                                  <option value="">-- {field.placeholder} --</option>
                                  {field.options?.map((opt) => (
                                    <option key={opt} value={opt}>
                                      {opt}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type="text"
                                  required={field.required}
                                  placeholder={field.placeholder}
                                  className="w-full bg-[#fdfdfd] border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#006e4a] transition"
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
                                className="w-full bg-neutral-50/50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#006e4a] transition"
                                value={letterheadName}
                                onChange={(e) => setLetterheadName(e.target.value)}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-[11px] font-bold text-neutral-600 mb-1">Letterhead Organization Address</label>
                              <input 
                                type="text" 
                                placeholder="e.g., P.M.B. 65, Bosso Road, Minna..."
                                className="w-full bg-neutral-50/50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#006e4a] transition"
                                value={letterheadAddress}
                                onChange={(e) => setLetterheadAddress(e.target.value)}
                              />
                            </div>

                            {/* LOGO AND WATERMARK SETTINGS */}
                            <div className="pt-2 border-t border-dashed border-gray-150 space-y-3">
                              <span className="text-[10px] uppercase font-black tracking-wider text-[#006e4a] block">Header Logo & Watermark Logo</span>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in">
                                {/* Letterhead Logo Box */}
                                <div className="space-y-1.5">
                                  <label className="block text-[10px] font-bold text-neutral-500">Letterhead Logo</label>
                                  {letterheadLogo ? (
                                    <div className="relative border border-emerald-200 bg-emerald-50/30 p-2 rounded-xl flex items-center justify-between gap-2">
                                      <img src={letterheadLogo} className="h-10 w-10 object-contain rounded bg-white border border-gray-200" alt="Letterhead Preview" />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-bold text-gray-700 truncate">Logo Ready</p>
                                        <button 
                                          type="button" 
                                          onClick={() => setLetterheadLogo(null)}
                                          className="text-[9px] text-red-600 font-extrabold hover:underline"
                                        >
                                          Remove Logo
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div 
                                      className="border-2 border-dashed border-gray-200 hover:border-[#006e4a] rounded-xl p-3 text-center cursor-pointer bg-neutral-50/50 hover:bg-white transition relative"
                                      onDragOver={(e) => e.preventDefault()}
                                      onDrop={(e) => {
                                        e.preventDefault();
                                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                          handleLetterheadLogoUpload(e.dataTransfer.files[0]);
                                        }
                                      }}
                                      onClick={() => document.getElementById('letterhead-logo-input')?.click()}
                                    >
                                      <input 
                                        type="file" 
                                        id="letterhead-logo-input" 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={(e) => {
                                          if (e.target.files && e.target.files[0]) {
                                            handleLetterheadLogoUpload(e.target.files[0]);
                                          }
                                        }}
                                      />
                                      <p className="text-[10px] font-black text-[#006e4a]">⚡ Drop Logo</p>
                                      <p className="text-[8px] text-gray-400 mt-0.5">or Select file</p>
                                    </div>
                                  )}
                                </div>

                                {/* Watermark Logo Box */}
                                <div className="space-y-1.5">
                                  <label className="block text-[10px] font-bold text-neutral-500">Watermark Logo</label>
                                  {watermarkLogo ? (
                                    <div className="relative border border-emerald-200 bg-emerald-50/30 p-2 rounded-xl flex items-center justify-between gap-2">
                                      <img src={watermarkLogo} className="h-10 w-10 object-contain rounded bg-white border border-gray-200" alt="Watermark Preview" />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-bold text-gray-700 truncate">Watermark Ready</p>
                                        <button 
                                          type="button" 
                                          onClick={() => setWatermarkLogo(null)}
                                          className="text-[9px] text-red-600 font-extrabold hover:underline"
                                        >
                                          Remove Watermark
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div 
                                      className="border-2 border-dashed border-gray-200 hover:border-[#006e4a] rounded-xl p-3 text-center cursor-pointer bg-neutral-50/50 hover:bg-white transition relative"
                                      onDragOver={(e) => e.preventDefault()}
                                      onDrop={(e) => {
                                        e.preventDefault();
                                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                          handleWatermarkLogoUpload(e.dataTransfer.files[0]);
                                        }
                                      }}
                                      onClick={() => document.getElementById('watermark-logo-input')?.click()}
                                    >
                                      <input 
                                        type="file" 
                                        id="watermark-logo-input" 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={(e) => {
                                          if (e.target.files && e.target.files[0]) {
                                            handleWatermarkLogoUpload(e.target.files[0]);
                                          }
                                        }}
                                      />
                                      <p className="text-[10px] font-black text-[#006e4a]">🛡️ Drop Watermark</p>
                                      <p className="text-[8px] text-gray-400 mt-0.5">or Select file</p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Logo alignment settings details */}
                              <div>
                                <label className="block text-[10px] font-semibold text-neutral-500 mb-1">Logo Placement / Position Alignment</label>
                                <div className="grid grid-cols-4 gap-1">
                                  {(['left', 'center', 'right', 'align-text'] as const).map((pos) => (
                                    <button
                                      key={pos}
                                      type="button"
                                      onClick={() => setLetterheadLogoAlign(pos)}
                                      className={`px-1 py-1 text-[9px] font-black uppercase rounded border transition ${
                                        letterheadLogoAlign === pos 
                                          ? 'bg-[#006e4a] text-white border-[#006e4a]' 
                                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                      }`}
                                    >
                                      {pos === 'align-text' ? 'Inline Text' : pos}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Watermark logo alignment settings details */}
                              <div>
                                <label className="block text-[10px] font-semibold text-neutral-500 mb-1">Watermark Placement / Position Alignment</label>
                                <div className="grid grid-cols-4 gap-1">
                                  {(['left', 'center', 'right', 'diagonal'] as const).map((pos) => (
                                    <button
                                      key={pos}
                                      type="button"
                                      onClick={() => setWatermarkLogoAlign(pos)}
                                      className={`px-1 py-1 text-[9px] font-black uppercase rounded border transition ${
                                        watermarkLogoAlign === pos 
                                          ? 'bg-[#006e4a] text-white border-[#006e4a]' 
                                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                      }`}
                                    >
                                      {pos}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* DESIGN WORK DESIGN PATTERN SELECTOR WITH VISUAL PREVIEWS */}
                              <div className="pt-3 border-t border-dashed border-gray-150 space-y-2">
                                <span className="text-[10px] uppercase font-black tracking-wider text-[#006e4a] block font-bold">
                                  Select Design Work Pattern
                                </span>
                                <p className="text-[9px] text-gray-400">Choose a professional pre-designed administrative pattern structure.</p>
                                
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                  {[
                                    {
                                      id: 'standard-formal',
                                      name: 'Standard Formal',
                                      desc: 'Elegant Serif / Royal double lines',
                                      logoAlign: 'center',
                                      lineStyle: 'double',
                                      titleSize: 'md',
                                      titleColor: '#111111',
                                      lineColor: '#111111',
                                      preview: (
                                        <div className="space-y-1 py-1">
                                          <div className="h-1.5 w-1/4 bg-neutral-300 rounded mx-auto" />
                                          <div className="h-1 w-2/3 bg-[#111111] rounded mx-auto" />
                                          <div className="h-[2px] bg-[#111111] w-full mt-1 border-b border-t border-[#111111]" />
                                        </div>
                                      )
                                    },
                                    {
                                      id: 'modern-side',
                                      name: 'Modern Sideband',
                                      desc: 'Left accent colored border & clean sans',
                                      logoAlign: 'left',
                                      lineStyle: 'solid',
                                      titleSize: 'lg',
                                      titleColor: '#006e4a',
                                      lineColor: '#006e4a',
                                      preview: (
                                        <div className="flex gap-2.5 items-center py-1">
                                          <div className="w-[3px] bg-[#006e4a] h-6 rounded" />
                                          <div className="space-y-0.5 flex-1">
                                            <div className="h-1 bg-[#006e4a] w-3/4 rounded" />
                                            <div className="h-1 bg-neutral-300 w-1/2 rounded" />
                                          </div>
                                        </div>
                                      )
                                    },
                                    {
                                      id: 'classic-academy',
                                      name: 'Classic Academy',
                                      desc: 'Old school serif, royal burgundy text',
                                      logoAlign: 'center',
                                      lineStyle: 'solid',
                                      titleSize: 'md',
                                      titleColor: '#800020',
                                      lineColor: '#800020',
                                      preview: (
                                        <div className="space-y-1 py-1 text-center">
                                          <div className="w-2 h-2 bg-[#800020] rotate-45 rounded-xs mx-auto" />
                                          <div className="h-1 w-3/4 bg-[#800020] rounded mx-auto mt-0.5" />
                                          <div className="h-[1px] bg-[#800020] w-full" />
                                        </div>
                                      )
                                    },
                                    {
                                      id: 'executive-tech',
                                      name: 'Executive Tech',
                                      desc: 'Top thick accent block & clean mono',
                                      logoAlign: 'align-text',
                                      lineStyle: 'solid',
                                      titleSize: 'sm',
                                      titleColor: '#003366',
                                      lineColor: '#003366',
                                      preview: (
                                        <div className="space-y-1 py-1">
                                          <div className="h-1 bg-[#003366] w-full -mt-1 rounded-t-xs" />
                                          <div className="flex gap-1 items-center">
                                            <div className="h-1.5 w-1.5 bg-[#003366] rounded-full" />
                                            <div className="h-1 w-1/2 bg-[#003366] rounded" />
                                          </div>
                                        </div>
                                      )
                                    },
                                    {
                                      id: 'minimalist',
                                      name: 'Artistic Minimal',
                                      desc: 'Clean compact space, thin dotted divider',
                                      logoAlign: 'center',
                                      lineStyle: 'dotted',
                                      titleSize: 'sm',
                                      titleColor: '#2d3748',
                                      lineColor: '#718096',
                                      preview: (
                                        <div className="space-y-1 py-1 text-center font-sans">
                                          <div className="h-[3px] w-1/3 bg-neutral-800 rounded mx-auto" />
                                          <div className="border-t border-dotted border-gray-400 w-2/3 mx-auto mt-1" />
                                        </div>
                                      )
                                    }
                                  ].map((pat) => (
                                    <button
                                      key={pat.id}
                                      type="button"
                                      onClick={() => {
                                        setDesignPatternStyle(pat.id);
                                        setLetterheadLogoAlign(pat.logoAlign);
                                        setLetterheadLineStyle(pat.lineStyle);
                                        setLetterheadTitleSize(pat.titleSize);
                                        setLetterheadTitleColor(pat.titleColor);
                                        setLetterheadLineColor(pat.lineColor);
                                      }}
                                      className={`p-1.5 rounded-xl text-left border flex flex-col justify-between h-[100px] transition group hover:shadow-xs ${
                                        designPatternStyle === pat.id 
                                          ? 'border-[#006e4a] bg-emerald-50/25 ring-2 ring-emerald-500/10' 
                                          : 'border-gray-200 bg-white hover:border-gray-300'
                                      }`}
                                    >
                                      <div>
                                        <div className="font-extrabold text-[9px] text-neutral-800 leading-tight group-hover:text-neutral-900">{pat.name}</div>
                                        <div className="text-[7.5px] text-gray-400 line-clamp-1 mt-0.5 leading-snug">{pat.desc}</div>
                                      </div>
                                      <div className="bg-neutral-50 rounded-lg p-1 border border-neutral-100 w-full mt-1.5 overflow-hidden">
                                        {pat.preview}
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* STYLISTIC ACCESS FOR CUSTOM DESIGN */}
                              <div className="pt-3 border-t border-dashed border-gray-150 space-y-3 bg-neutral-50/50 p-2.5 rounded-xl">
                                <span className="text-[10px] uppercase font-black tracking-wider text-[#006e4a] flex items-center justify-between font-bold">
                                  <span>⚙️ Access For Custom Design</span>
                                  <span className="text-[7px] font-normal text-gray-500 capitalize leading-none">Custom Style Options</span>
                                </span>
                                
                                <div className="space-y-2.5">
                                  {/* Letterhead Title Color */}
                                  <div>
                                    <label className="block text-[9px] font-bold text-neutral-500 mb-0.5">Letterhead Title Color</label>
                                    <div className="flex flex-wrap gap-1 items-center">
                                      {[
                                        { value: '#111111', label: 'Black' },
                                        { value: '#003366', label: 'Navy' },
                                        { value: '#006e4a', label: 'Emerald' },
                                        { value: '#800020', label: 'Burgundy' },
                                        { value: '#9a7b56', label: 'Sovereign' },
                                        { value: '#553c9a', label: 'Royal' }
                                      ].map((col) => (
                                        <button
                                          key={col.value}
                                          type="button"
                                          title={col.label}
                                          onClick={() => setLetterheadTitleColor(col.value)}
                                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                                            letterheadTitleColor === col.value 
                                              ? 'border-neutral-950 ring-2 ring-emerald-300 scale-110' 
                                              : 'border-transparent hover:scale-105'
                                          }`}
                                          style={{ backgroundColor: col.value }}
                                        >
                                          {letterheadTitleColor === col.value && (
                                            <div className="w-1 h-1 bg-white rounded-full" />
                                          )}
                                        </button>
                                      ))}
                                      {/* Custom Input */}
                                      <input 
                                        type="text"
                                        placeholder="#000"
                                        className="text-[8px] font-mono bg-white border border-gray-200 rounded px-1 w-14 outline-none focus:border-[#006e4a]"
                                        value={letterheadTitleColor}
                                        onChange={(e) => setLetterheadTitleColor(e.target.value)}
                                      />
                                    </div>
                                  </div>

                                  {/* Divider Line Color */}
                                  <div>
                                    <label className="block text-[9px] font-bold text-neutral-500 mb-0.5">Divider Line Color</label>
                                    <div className="flex flex-wrap gap-1 items-center">
                                      {[
                                        { value: '#111111', label: 'Black' },
                                        { value: '#003366', label: 'Navy' },
                                        { value: '#006e4a', label: 'Emerald' },
                                        { value: '#800020', label: 'Burgundy' },
                                        { value: '#cccccc', label: 'Light Gray' }
                                      ].map((col) => (
                                        <button
                                          key={col.value}
                                          type="button"
                                          title={col.label}
                                          onClick={() => setLetterheadLineColor(col.value)}
                                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                                            letterheadLineColor === col.value 
                                              ? 'border-neutral-950 ring-2 ring-emerald-300 scale-110' 
                                              : 'border-transparent hover:scale-105'
                                          }`}
                                          style={{ backgroundColor: col.value }}
                                        >
                                          {letterheadLineColor === col.value && (
                                            <div className="w-1 h-1 bg-white rounded-full" />
                                          )}
                                        </button>
                                      ))}
                                      {/* Match Title Button */}
                                      <button
                                        type="button"
                                        onClick={() => setLetterheadLineColor(letterheadTitleColor)}
                                        className="text-[7.5px] bg-[#006e4a]/10 text-[#006e4a] hover:bg-[#006e4a]/25 px-1 rounded font-black uppercase tracking-normal"
                                      >
                                        Match Title
                                      </button>
                                      {/* Custom Line Input */}
                                      <input 
                                        type="text"
                                        placeholder="#000"
                                        className="text-[8px] font-mono bg-white border border-gray-200 rounded px-1 w-14 outline-none focus:border-[#006e4a]"
                                        value={letterheadLineColor}
                                        onChange={(e) => setLetterheadLineColor(e.target.value)}
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                                    {/* Line Style Selection */}
                                    <div>
                                      <label className="block text-[9px] font-semibold text-neutral-500 mb-0.5">Divider Style</label>
                                      <select 
                                        className="w-full bg-white border border-gray-150 rounded px-1 py-0.5 text-[10px] outline-none focus:border-[#006e4a]"
                                        value={letterheadLineStyle}
                                        onChange={(e) => setLetterheadLineStyle(e.target.value as any)}
                                      >
                                        <option value="double">Double Rule</option>
                                        <option value="solid">Solid Thick</option>
                                        <option value="dotted">Dotted</option>
                                        <option value="dashed">Dashed</option>
                                        <option value="none">No Line</option>
                                      </select>
                                    </div>

                                    {/* Font Size Selection */}
                                    <div>
                                      <label className="block text-[9px] font-semibold text-neutral-500 mb-0.5">Title Size</label>
                                      <select 
                                        className="w-full bg-white border border-gray-150 rounded px-1 py-0.5 text-[10px] outline-none focus:border-[#006e4a]"
                                        value={letterheadTitleSize}
                                        onChange={(e) => setLetterheadTitleSize(e.target.value as any)}
                                      >
                                        <option value="sm">Small (11px)</option>
                                        <option value="md">Normal (14px)</option>
                                        <option value="lg">Large (16px)</option>
                                        <option value="xl">Extra (18px)</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2">
                              <div>
                                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Official Signer Name</label>
                                <input 
                                  type="text" 
                                  placeholder="e.g., Prof. Sarah Alabi"
                                  className="w-full bg-neutral-50/50 border border-gray-200 rounded-lg p-1.5 text-xs outline-none focus:border-[#006e4a] transition"
                                  value={signerName}
                                  onChange={(e) => setSignerName(e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Status watermark</label>
                                <select 
                                  className="w-full bg-neutral-50/50 border border-gray-200 rounded-lg p-1.5 text-xs outline-none focus:border-[#006e4a] transition"
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
                                  className="rounded text-[#006e4a] focus:ring-[#006e4a] h-3.5 w-3.5"
                                />
                                Add QR Verify Code
                              </label>

                              <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={addSignatureLine}
                                  onChange={(e) => setAddSignatureLine(e.target.checked)}
                                  className="rounded text-[#006e4a] focus:ring-[#006e4a] h-3.5 w-3.5"
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
                          className="w-full mt-4 bg-[#006e4a] hover:bg-[#005c3e] text-white py-2 px-4 rounded-xl text-xs font-bold leading-none shadow-sm flex items-center justify-center gap-1"
                        >
                          {generationLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Calling DocMint AI Engine...
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
                          <span className="h-2 w-2 rounded-full bg-[#006e4a] animate-ping"></span>
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
                          currentDoc.categoryId === 'lga-origin' ? (
                            <CertificatePreview doc={currentDoc} />
                          ) : (
                            <div 
                              className="w-full bg-white border border-gray-200/80 shadow-lg rounded-md p-6 sm:p-10 relative overflow-hidden text-[#1a1a1a] select-none letter-preview font-serif max-w-[580px] z-0"
                              style={{
                                borderLeft: (currentDoc.designPatternStyle || designPatternStyle) === 'modern-side' ? `6px solid ${currentDoc.letterheadLineColor || letterheadLineColor || '#111111'}` : undefined,
                                borderTop: (currentDoc.designPatternStyle || designPatternStyle) === 'executive-tech' ? `8px solid ${currentDoc.letterheadLineColor || letterheadLineColor || '#111111'}` : undefined,
                                paddingLeft: (currentDoc.designPatternStyle || designPatternStyle) === 'modern-side' ? '28px' : undefined,
                                borderLeftStyle: 'solid',
                                borderTopStyle: 'solid'
                              }}
                            >
                              
                              {/* Watermark layer */}
                              {currentDoc.addWatermark && !currentDoc.paid && (
                                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-25deg] text-red-500/10 font-bold text-4xl text-center select-none pointer-events-none uppercase tracking-widest z-10 whitespace-nowrap">
                                  UNPAID PREVIEW ONLY
                                </div>
                              )}

                              {/* Watermark logo image layer */}
                              {(currentDoc.watermarkLogo || watermarkLogo) && (() => {
                                const align = currentDoc.watermarkLogoAlign || watermarkLogoAlign || 'center';
                                let containerClass = "absolute inset-x-4 inset-y-12 flex items-center justify-center opacity-[0.06] pointer-events-none z-0 select-none";
                                let imgClass = "w-2/3 h-2/3 object-contain";
                                
                                if (align === 'left') {
                                  containerClass = "absolute left-6 top-[30%] w-32 h-32 flex items-center justify-center opacity-[0.05] pointer-events-none z-0 select-none";
                                  imgClass = "w-full h-full object-contain";
                                } else if (align === 'right') {
                                  containerClass = "absolute right-6 top-[30%] w-32 h-32 flex items-center justify-center opacity-[0.05] pointer-events-none z-0 select-none";
                                  imgClass = "w-full h-full object-contain";
                                } else if (align === 'diagonal') {
                                  containerClass = "absolute inset-x-4 inset-y-12 flex items-center justify-center opacity-[0.06] pointer-events-none z-0 select-none rotate-[-25deg]";
                                  imgClass = "w-2/3 h-2/3 object-contain";
                                } else { // center
                                  containerClass = "absolute inset-x-4 inset-y-12 flex items-center justify-center opacity-[0.06] pointer-events-none z-0 select-none";
                                  imgClass = "w-2/3 h-2/3 object-contain";
                                }
                                
                                return (
                                  <div className={containerClass} style={{ mixBlendMode: 'multiply' }}>
                                    <img 
                                      src={currentDoc.watermarkLogo || watermarkLogo} 
                                      className={imgClass} 
                                      alt="Watermark background" 
                                    />
                                  </div>
                                );
                              })()}

                              {/* Letterhead */}
                              {(letterheadName || letterheadAddress || currentDoc.letterheadLogo || letterheadLogo) && (() => {
                                const currentPattern = currentDoc.designPatternStyle || designPatternStyle || 'standard-formal';
                                const currentTitleColor = currentDoc.letterheadTitleColor || letterheadTitleColor || '#111111';
                                const currentLineColor = currentDoc.letterheadLineColor || letterheadLineColor || '#111111';
                                const currentLineStyle = currentDoc.letterheadLineStyle || letterheadLineStyle || 'double';
                                const currentTitleSize = currentDoc.letterheadTitleSize || letterheadTitleSize || 'md';
                                const currentLogoAlign = currentDoc.letterheadLogoAlign || letterheadLogoAlign || 'center';

                                let fontSizeClass = "text-sm";
                                if (currentTitleSize === 'sm') fontSizeClass = "text-[11px]";
                                else if (currentTitleSize === 'md') fontSizeClass = "text-sm";
                                else if (currentTitleSize === 'lg') fontSizeClass = "text-base";
                                else if (currentTitleSize === 'xl') fontSizeClass = "text-lg";

                                let lineStyleCSS: React.CSSProperties = {};
                                if (currentLineStyle === 'none') {
                                  lineStyleCSS = { borderBottom: 'none' };
                                } else if (currentLineStyle === 'dotted') {
                                  lineStyleCSS = { borderBottom: `2px dotted ${currentLineColor}` };
                                } else if (currentLineStyle === 'dashed') {
                                  lineStyleCSS = { borderBottom: `2px dashed ${currentLineColor}` };
                                } else if (currentLineStyle === 'solid') {
                                  lineStyleCSS = { borderBottom: `2.5px solid ${currentLineColor}` };
                                } else { // double
                                  lineStyleCSS = { borderBottom: `4px double ${currentLineColor}` };
                                }

                                const fontFamClass = currentPattern === 'classic-academy' ? 'font-serif tracking-wide' : 'font-serif';

                                return (
                                  <div style={{ ...lineStyleCSS, paddingBottom: '10px', marginBottom: '24px', position: 'relative', zIndex: 10 }}>
                                    {/* Align Left layout */}
                                    {currentLogoAlign === 'left' && (
                                      <div className="flex items-center gap-4 text-left">
                                        {(currentDoc.letterheadLogo || letterheadLogo) && (
                                          <img src={currentDoc.letterheadLogo || letterheadLogo} className="h-12 w-12 object-contain shrink-0 rounded bg-white shadow-xs border border-gray-100" alt="Logo" />
                                        )}
                                        <div className="flex-1">
                                          <h4 className={`font-bold uppercase tracking-tight leading-tight ${fontSizeClass} ${fontFamClass}`} style={{ color: currentTitleColor }}>{letterheadName}</h4>
                                          <p className="text-[9px] text-gray-500 font-sans tracking-wide mt-1 leading-normal">{letterheadAddress}</p>
                                        </div>
                                      </div>
                                    )}

                                    {/* Align Right layout */}
                                    {currentLogoAlign === 'right' && (
                                      <div className="flex items-center gap-4 text-left justify-between">
                                        <div className="flex-1">
                                          <h4 className={`font-bold uppercase tracking-tight leading-tight ${fontSizeClass} ${fontFamClass}`} style={{ color: currentTitleColor }}>{letterheadName}</h4>
                                          <p className="text-[9px] text-gray-500 font-sans tracking-wide mt-1 leading-normal">{letterheadAddress}</p>
                                        </div>
                                        {(currentDoc.letterheadLogo || letterheadLogo) && (
                                          <img src={currentDoc.letterheadLogo || letterheadLogo} className="h-12 w-12 object-contain shrink-0 rounded bg-white shadow-xs border border-gray-100" alt="Logo" />
                                        )}
                                      </div>
                                    )}

                                    {/* Align Center layout */}
                                    {currentLogoAlign === 'center' && (
                                      <div className="text-center">
                                        {(currentDoc.letterheadLogo || letterheadLogo) && (
                                          <div className="flex justify-center mb-1.5">
                                            <img src={currentDoc.letterheadLogo || letterheadLogo} className="h-12 w-12 object-contain rounded bg-white shadow-xs border border-gray-100" alt="Logo" />
                                          </div>
                                        )}
                                        <h4 className={`font-bold uppercase tracking-tight leading-tight ${fontSizeClass} ${fontFamClass}`} style={{ color: currentTitleColor }}>{letterheadName}</h4>
                                        <p className="text-[9px] text-gray-500 font-sans tracking-wide mt-1 leading-normal">{letterheadAddress}</p>
                                      </div>
                                    )}

                                    {/* Align with Text (inline) layout */}
                                    {currentLogoAlign === 'align-text' && (
                                      <div className="flex items-center justify-center gap-3">
                                        {(currentDoc.letterheadLogo || letterheadLogo) && (
                                          <img src={currentDoc.letterheadLogo || letterheadLogo} className="h-10 w-10 object-contain shrink-0 rounded bg-white shadow-xs border border-gray-100" alt="Logo" />
                                        )}
                                        <div className="text-left">
                                          <h4 className={`font-bold uppercase tracking-tight leading-none ${fontSizeClass} ${fontFamClass}`} style={{ color: currentTitleColor }}>{letterheadName}</h4>
                                          <p className="text-[8px] text-gray-500 font-sans tracking-wide mt-0.5 leading-normal">{letterheadAddress}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}

                              {/* Letter Content preview */}
                              <div className="text-xs leading-relaxed text-justify whitespace-pre-line text-neutral-800 tracking-wide font-serif">
                                {currentDoc.content ? currentDoc.content.replace(/\*/g, '') : ''}
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
                                    <b>DocMint cryptographic reference verification ID:</b><br/>
                                    <span>{currentDoc.id} | Status: {currentDoc.paid ? 'Offically Unlocked (Paid)' : 'Preview State'}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
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
                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                                <div className="flex items-center gap-1.5">
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
                                    className="bg-zinc-800 hover:bg-zinc-900 text-white text-xs font-black py-2 px-3 rounded-lg shadow-xs transition whitespace-nowrap"
                                  >
                                    Online Checkout
                                  </button>
                                </div>
                                
                                <span className="text-xs text-gray-400 text-center hidden sm:inline">|</span>
                                
                                <button 
                                  onClick={handlePayWithWallet}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3 rounded-lg shadow-xs transition flex items-center justify-center gap-1"
                                >
                                  <span>⚡ Pay ₦{(selectedCategory?.priceNGN ?? 2500).toLocaleString()} via Wallet</span>
                                  <span className="text-[10px] opacity-85">(Bal: ₦{(user?.walletBalance ?? 2500).toLocaleString()})</span>
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
                    <Loader2 className="h-8 w-8 text-[#006e4a] animate-spin mx-auto mb-3" />
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
                      className="bg-[#006e4a] hover:bg-[#005c3e] text-white py-1.5 px-4 rounded-lg font-bold text-xs transition"
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
                                    setLetterheadLogo(doc.letterheadLogo || null);
                                    setWatermarkLogo(doc.watermarkLogo || null);
                                    setLetterheadLogoAlign(doc.letterheadLogoAlign || 'center');
                                    setWatermarkLogoAlign(doc.watermarkLogoAlign || 'center');
                                    setLetterheadTitleColor(doc.letterheadTitleColor || '#111111');
                                    setLetterheadLineColor(doc.letterheadLineColor || '#111111');
                                    setLetterheadLineStyle(doc.letterheadLineStyle || 'double');
                                    setDesignPatternStyle(doc.designPatternStyle || 'standard-formal');
                                    setLetterheadTitleSize(doc.letterheadTitleSize || 'md');
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
                    <Loader2 className="h-8 w-8 text-[#006e4a] animate-spin mx-auto mb-3" />
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
                    <div className="h-16 w-16 bg-gradient-to-tr from-[#006e4a] to-emerald-600 text-white rounded-full flex items-center justify-center font-black text-2xl shadow-md">
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
                    {user.userType && (
                      <div className="flex justify-between py-1">
                        <span className="font-semibold">Affiliation Type:</span>
                        <span className="font-bold text-neutral-950 capitalize">
                          {user.userType === 'student' && '🎓 Student / Scholar'}
                          {user.userType === 'faculty' && '🏫 Faculty / Staff'}
                          {user.userType === 'organization' && '🏢 Agency / Org'}
                          {user.userType === 'general' && '💼 Professional'}
                        </span>
                      </div>
                    )}
                    {user.institution && (
                      <div className="flex justify-between py-1">
                        <span className="font-semibold">Institution Name:</span>
                        <span className="font-bold text-emerald-900">{user.institution}</span>
                      </div>
                    )}
                    {user.department && (
                      <div className="flex justify-between py-1">
                        <span className="font-semibold">Department:</span>
                        <span className="font-bold text-neutral-900">{user.department}</span>
                      </div>
                    )}
                    {user.matricNo && (
                      <div className="flex justify-between py-1">
                        <span className="font-semibold">ID / Matric No.:</span>
                        <span className="font-bold text-[#006e4a] font-mono">{user.matricNo}</span>
                      </div>
                    )}
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
                  <h3 className="font-extrabold text-neutral-900">DocMint Compliance Framework & Credentials Audit</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    This compliance suite keeps a cryptographic hash of all generated documents in order to protect against fraudulent claims of academic degrees. When institutions query validation codes via the integrated QR code verification page, our server evaluates the original generated text payload to ensure zero modifications have been retrofitted by job-seekers.
                  </p>
                  
                  <div className="bg-neutral-50 p-4 rounded-xl border border-gray-200">
                    <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-widest mb-2 flex items-center gap-1">
                      <Shield className="h-4 w-4 text-emerald-600" /> Authorized Signatories Guarantee
                    </h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      DocMint only formats legitimate communications that conform to educational and industrial layout metrics. We do not generate signatures or authorized stamps artificially for foreign organizations.
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
                          <UserIcon className="h-5 w-5 text-[#006e4a]" />
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
                          <TrendingUp className="h-5 w-5 text-[#006e4a]" />
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
                            className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-[#006e4a] transition"
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
                            className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-[#006e4a] transition"
                            value={newCatForm.name}
                            onChange={(e) => setNewCatForm({ ...newCatForm, name: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-neutral-600 mb-1">Pricing (NGN - Naira)</label>
                          <input 
                            type="number" 
                            required 
                            className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-[#006e4a] transition"
                            value={newCatForm.priceNGN}
                            onChange={(e) => setNewCatForm({ ...newCatForm, priceNGN: Number(e.target.value) })}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-neutral-600 mb-1">Detailed Description</label>
                          <textarea 
                            required 
                            placeholder="Introduce the target context here..."
                            className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-[#006e4a] transition min-h-[50px]"
                            value={newCatForm.description}
                            onChange={(e) => setNewCatForm({ ...newCatForm, description: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-neutral-600 mb-1">Required Custom Field Attributes (JSON Array)</label>
                          <textarea 
                            required 
                            className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg p-2 font-mono text-[10px] outline-none focus:border-[#006e4a] transition min-h-[140px]"
                            value={newCatForm.requiredFieldsText}
                            onChange={(e) => setNewCatForm({ ...newCatForm, requiredFieldsText: e.target.value })}
                          />
                          <p className="text-[9px] text-gray-400 mt-1">Must be an array of objects specifying key, label, placeholder, and required type.</p>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-neutral-600 mb-1">Static Text Sample Backup</label>
                          <textarea 
                            required 
                            className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg p-2 font-mono text-[10px] outline-none focus:border-[#006e4a] transition min-h-[80px]"
                            value={newCatForm.samplePreview}
                            onChange={(e) => setNewCatForm({ ...newCatForm, samplePreview: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-neutral-600 mb-1">AI Generative Directive Prompt</label>
                          <textarea 
                            required 
                            className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg p-2 font-mono text-[10px] outline-none focus:border-[#006e4a] transition min-h-[80px]"
                            value={newCatForm.aiPromptTemplate}
                            onChange={(e) => setNewCatForm({ ...newCatForm, aiPromptTemplate: e.target.value })}
                          />
                        </div>

                        <button 
                          type="submit"
                          className="w-full bg-[#006e4a] hover:bg-[#005c3e] text-white font-extrabold text-xs py-2 px-3 rounded-lg transition"
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
                              <p className="text-[10px] text-[#006e4a] font-bold mt-1 uppercase tracking-wide">Fields Detected: {cat.requiredFields.map(f => f.key).join(' | ')}</p>
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
                            className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-[#006e4a] transition"
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
                            className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-[#006e4a] transition"
                            value={newResearchForm.organization}
                            onChange={(e) => setNewResearchForm({ ...newResearchForm, organization: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-neutral-600 mb-1">Sample Raw Document Text Content</label>
                          <textarea 
                            required 
                            placeholder="Enter the full text of the letter here..."
                            className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg p-2 font-mono text-[10px] outline-none focus:border-[#006e4a] transition min-h-[140px]"
                            value={newResearchForm.rawText}
                            onChange={(e) => setNewResearchForm({ ...newResearchForm, rawText: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-neutral-600 mb-1">Format/Structural analysis report</label>
                          <textarea 
                            required 
                            placeholder="Specify paragraphs ordering, double lines usage, address alignments..."
                            className="w-full bg-[#fcfcfc] border border-gray-200 rounded-lg p-2 font-mono text-[10px] outline-none focus:border-[#006e4a] transition min-h-[80px]"
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

                            <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100 text-[#006e4a]">
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
                          className="w-full bg-[#fdfdfd] border border-gray-200 rounded-lg p-3 font-mono text-xs outline-none focus:border-[#006e4a] transition min-h-[140px]"
                          value={systemInstructionState}
                          onChange={(e) => setSystemInstructionState(e.target.value)}
                        />
                        <p className="text-[10px] text-gray-400 mt-1">This acts as the strict system pre-prompt governing core compliance, professional administrative metrics, and grammatical rules.</p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-700 uppercase mb-1.5">PDF and Letterhead Guidelines</label>
                        <textarea 
                          required 
                          className="w-full bg-[#fdfdfd] border border-gray-200 rounded-lg p-3 font-mono text-xs outline-none focus:border-[#006e4a] transition min-h-[80px]"
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
                                  className="text-[#006e4a] hover:text-[#005c3e] font-bold"
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
              Protected by standard TLS encryption. DocMint does not log your credit card credentials.
            </p>
          </div>
        </div>
      )}

      {/* Modern Compact Site Footer */}
      <footer className="bg-white border-t border-gray-150 py-6 mt-12 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-medium text-neutral-600">DocMint © 2026 Admin Portal. All rights reserved.</p>
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
