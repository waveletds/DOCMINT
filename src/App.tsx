import { useState, useEffect } from 'react';
import { 
  Search, 
  BookOpen, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard,
  X,
  AlertCircle,
  Lock,
  Menu,
  Printer,
  Wallet,
  Coins,
  UserPlus,
  LogIn,
  Sliders,
  Sparkles,
  RefreshCw,
  Settings,
  Unlock
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { INITIAL_CATEGORIES, INITIAL_RESEARCH_TEMPLATES } from './initial-data';
import { DocumentCategory, GeneratedDocument, PaymentRecord, SampleResearchTemplate, User } from './types';
import CertificatePreview from './components/CertificatePreview';


// Global Nav component to handle links
function Navbar({ 
  currentUser, 
  onLogout,
  onOpenAuth,
  activeTab,
  setActiveTab,
  setIsDraftingActive
}: { 
  currentUser: User | null; 
  onLogout: () => void;
  onOpenAuth: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setIsDraftingActive: (val: boolean) => void;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'dashboard', name: 'Drafting Console', icon: Sliders },
    { id: 'drafts', name: 'My Archives', icon: FileText },
    { id: 'templates', name: 'Research Models', icon: BookOpen },
    { id: 'verify', name: 'Verify Document', icon: ShieldCheck },
  ];

  if (currentUser?.role === 'admin') {
    navLinks.push({ id: 'admin', name: 'Admin Hub', icon: Settings });
  }

  return (
    <nav className="bg-white text-black sticky top-0 z-40 border-b-2 border-black font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => { setActiveTab('dashboard'); setIsDraftingActive(false); }}>
            <div className="bg-black text-[#00c060] p-2.5 rounded-xl border border-black shadow-sm flex items-center justify-center">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex items-center space-x-1.5 text-left">
              <div>
                <span className="block font-black text-lg sm:text-xl tracking-tight text-black leading-none uppercase font-display">
                  DocMint
                </span>
                <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest mt-0.5 block">
                  ACCÈS OFFICIEL
                </span>
              </div>
              <span className="bg-black text-[#00c060] border border-black text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider leading-none self-center">
                Pro
              </span>
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id);
                    if (link.id !== 'dashboard') {
                      setIsDraftingActive(false);
                    }
                  }}
                  className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-black tracking-wider uppercase transition-all duration-150 ${
                    active 
                      ? 'bg-black text-white border-2 border-black shadow-xs' 
                      : 'text-neutral-500 hover:text-black border border-transparent hover:bg-neutral-50'
                  }`}
                >
                  <Icon className="w-4 h-4" style={{ color: active ? '#00c060' : 'currentColor' }} />
                  <span>{link.name}</span>
                </button>
              );
            })}
          </div>

          {/* User and Wallet Widgets */}
          <div className="hidden lg:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                {/* Wallet Balance Widget */}
                <div className="bg-white border-2 border-black rounded-xl px-3.5 py-1.5 flex items-center space-x-2.5">
                  <Wallet className="w-4 h-4 text-[#00c060]" />
                  <div className="text-left font-sans">
                    <span className="block text-[8px] text-neutral-400 font-black uppercase leading-none">Wallet</span>
                    <span className="block text-xs font-black text-black leading-none mt-1">
                      ₦{(currentUser.walletBalance ?? 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block text-[9px] font-black text-[#00c060] uppercase tracking-wider leading-none">Authorized</span>
                  <span className="block text-xs font-bold text-black max-w-[145px] truncate leading-tight mt-1">
                    {currentUser.name}
                  </span>
                </div>

                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 border-2 border-black hover:bg-black hover:text-white text-black text-xs font-black rounded-lg transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-1.5 bg-[#00c060] hover:bg-[#00c060] text-white border-2 border-black px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Console Access</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="lg:hidden flex items-center space-x-2.5">
            {currentUser && (
              <div className="bg-white border-2 border-black px-2.5 py-1 rounded-lg text-right scale-90">
                <span className="block text-[8px] text-neutral-405 font-black leading-none font-sans">WALLET</span>
                <span className="block text-xs font-black text-[#00c060]">₦{(currentUser.walletBalance ?? 0).toLocaleString()}</span>
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-black border border-neutral-300 hover:bg-neutral-50 focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Options */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t-2 border-black px-3 pt-2 pb-4 space-y-1 shadow-inner">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  if (link.id !== 'dashboard') {
                    setIsDraftingActive(false);
                  }
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-3 w-full text-left px-4 py-3 rounded-md text-sm font-black uppercase tracking-wider transition-all ${
                  active 
                    ? 'bg-black text-white border border-black' 
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-black'
                }`}
              >
                <Icon className="w-5 h-5" style={{ color: active ? '#00c060' : 'currentColor' }} />
                <span>{link.name}</span>
              </button>
            );
          })}
          {currentUser ? (
            <div className="border-t border-neutral-200 pt-3 mt-3 px-4 flex items-center justify-between font-sans">
              <div>
                <span className="block text-xs font-bold text-black">{currentUser.name}</span>
                <span className="block text-[10px] text-neutral-400 italic font-mono">ID: {currentUser.id}</span>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="text-xs border-2 border-black text-black hover:bg-black hover:text-white px-3.5 py-1.5 rounded-lg font-black transition-all"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-neutral-200 mt-3 px-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full text-center bg-[#00c060] hover:bg-[#00c060] text-white border-2 border-black font-black py-3 rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                Access Account
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isDraftingActive, setIsDraftingActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPill, setSelectedPill] = useState<'all' | 'attestation' | 'recommendation'>('all');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Categories and templates state
  const [categories, setCategories] = useState<DocumentCategory[]>(INITIAL_CATEGORIES);
  const [templates, setTemplates] = useState<SampleResearchTemplate[]>(INITIAL_RESEARCH_TEMPLATES);
  const [myDocuments, setMyDocuments] = useState<GeneratedDocument[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);

  // Selection state
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | null>(INITIAL_CATEGORIES[0]);
  const [inputs, setInputs] = useState<Record<string, string>>({});

  // Design Studio settings
  const [letterheadName, setLetterheadName] = useState('FEDERAL UNIVERSITY OF TECHNOLOGY, MINNA');
  const [letterheadAddress, setLetterheadAddress] = useState('MAIN CAMPUS, GIDAN KWANO, P.M.B. 65, MINNA, NIGER STATE');
  const [letterheadLogo, setLetterheadLogo] = useState('https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=200');
  const [watermarkLogo, setWatermarkLogo] = useState('');
  const [letterheadLogoAlign, setLetterheadLogoAlign] = useState<'left' | 'right' | 'center'>('left');
  const watermarkLogoAlign = 'diagonal';
  const [letterheadTitleColor, setLetterheadTitleColor] = useState('#064e3b');
  const [letterheadLineColor, setLetterheadLineColor] = useState('#b45309');
  const [letterheadLineStyle, setLetterheadLineStyle] = useState<'solid' | 'double' | 'dotted' | 'dashed' | 'none'>('double');
  const designPatternStyle = 'standard-formal';
  const letterheadTitleSize = 'md';
  const [addWatermark, setAddWatermark] = useState(true);
  const [addQrCode, setAddQrCode] = useState(true);
  const [addSignatureLine, setAddSignatureLine] = useState(true);
  const [signerName, setSignerName] = useState('PROF. AMINA S. BELLO');
  const [signerTitle] = useState('Dean of Student Affairs Office');

  // Generator State
  const [generating, setGenerating] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<GeneratedDocument | null>(null);

  // Checkout State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<'paystack' | 'monnify' | 'flutterwave'>('paystack');
  const [simulatedCheckoutOpen, setSimulatedCheckoutOpen] = useState(false);
  const [simulatedCardNumber, setSimulatedCardNumber] = useState('');
  const [simulatedCardExpiry, setSimulatedCardExpiry] = useState('');
  const [simulatedCardCvv, setSimulatedCardCvv] = useState('');
  const [simulatingPayment, setSimulatingPayment] = useState(false);
  const [walletPaying, setWalletPaying] = useState(false);
  const [simulatedRef, setSimulatedRef] = useState('');

  // Top Up Wallet State
  const [topupAmount, setTopupAmount] = useState('2500');

  // Verification Portal state
  const [verifyId, setVerifyId] = useState('');
  const [verifiedDoc, setVerifiedDoc] = useState<GeneratedDocument | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');

  // Admin Dashboard State
  const [adminStats, setAdminStats] = useState<any>(null);
  const [adminPrompts, setAdminPrompts] = useState<any>(null);
  const [savingPrompts, setSavingPrompts] = useState(false);

  // Authentication Fields
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [userTypeInput, setUserTypeInput] = useState<'student' | 'faculty' | 'organization' | 'general'>('student');
  const [institutionInput, setInstitutionInput] = useState('');
  const [departmentInput, setDepartmentInput] = useState('');
  const [matricNoInput, setMatricNoInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Quick helper to fetch templates or reload drafts
  const fetchMyDrafts = async (userId: string) => {
    try {
      const response = await fetch('/api/documents', {
        headers: { 'Authorization': `Bearer ${userId}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMyDocuments(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPaymentHistory = async (userId: string) => {
    try {
      const response = await fetch('/api/payments/history', {
        headers: { 'Authorization': `Bearer ${userId}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPaymentHistory(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchServerCategoriesAndTemplates = async () => {
    try {
      const catRes = await fetch('/api/categories');
      if (catRes.ok) {
        const cats = await catRes.json();
        if (cats && cats.length > 0) setCategories(cats);
      }
      const tplRes = await fetch('/api/research/templates');
      if (tplRes.ok) {
        const tpls = await tplRes.json();
        if (tpls && tpls.length > 0) setTemplates(tpls);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAdminData = async (userId: string) => {
    try {
      const statsRes = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${userId}` }
      });
      if (statsRes.ok) {
        const stats = await statsRes.json();
        setAdminStats(stats);
      }
      const promptsRes = await fetch('/api/admin/prompts', {
        headers: { 'Authorization': `Bearer ${userId}` }
      });
      if (promptsRes.ok) {
        const prompts = await promptsRes.json();
        setAdminPrompts(prompts);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Auth Action handlers
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!nameInput || !emailInput || !phoneInput || !passwordInput) {
      setAuthError('Please fill out all mandatory fields.');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameInput,
          email: emailInput,
          phone: phoneInput,
          password: passwordInput,
          institution: institutionInput,
          department: departmentInput,
          matricNo: matricNoInput,
          userType: userTypeInput
        })
      });

      const data = await response.json();
      if (!response.ok) {
        setAuthError(data.error || 'Registration failed.');
        return;
      }

      localStorage.setItem('docmint_user_id', data.token);
      setCurrentUser(data.user);
      setToken(data.token);
      setAuthModalOpen(false);
      confetti({ particleCount: 150, spread: 80 });

      // Load specific student preloaded context
      fetchMyDrafts(data.token);
      fetchPaymentHistory(data.token);
    } catch (err: any) {
      setAuthError(err.message || 'Server error.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!emailInput) {
      setAuthError('Please enter email address.');
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput,
          password: passwordInput
        })
      });

      const data = await response.json();
      if (!response.ok) {
        setAuthError(data.error || 'Authentication failed.');
        return;
      }

      localStorage.setItem('docmint_user_id', data.token);
      setCurrentUser(data.user);
      setToken(data.token);
      setAuthModalOpen(false);

      if (data.user?.role === 'admin') {
        fetchAdminData(data.token);
      }
      fetchMyDrafts(data.token);
      fetchPaymentHistory(data.token);
    } catch (err: any) {
      setAuthError(err.message || 'Server connection error.');
    }
  };

  const handleDemoAccess = (email: string) => {
    setEmailInput(email);
    setPasswordInput('admin123');
    setIsRegistering(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('docmint_user_id');
    setCurrentUser(null);
    setToken(null);
    setActiveTab('dashboard');
    setMyDocuments([]);
    setPaymentHistory([]);
    setCurrentDocument(null);
  };

  // Trigger registration modal automatically if unauthenticated on document generation action
  const handleTryGenerate = () => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
  };

  // Seeding/Load effect
  useEffect(() => {
    fetchServerCategoriesAndTemplates();
    const storedUid = localStorage.getItem('docmint_user_id');
    if (storedUid) {
      // Direct session log with backend
      fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${storedUid}` }
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then(data => {
        setCurrentUser(data.user);
        setToken(storedUid);
        if (data.user?.role === 'admin') {
          fetchAdminData(storedUid);
        }
        fetchMyDrafts(storedUid);
        fetchPaymentHistory(storedUid);
      })
      .catch(() => {
        localStorage.removeItem('docmint_user_id');
      });
    }
  }, []);

  // Sync state options and restore cached drafts when category shifts
  useEffect(() => {
    if (selectedCategory) {
      const cached = localStorage.getItem(`docmint_draft_inputs_${selectedCategory.id}`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === 'object') {
            setInputs(parsed);
            return;
          }
        } catch (e) {
          // Fallback to defaults on corrupt parse
        }
      }

      const defaultInputs: Record<string, string> = {};
      selectedCategory.requiredFields.forEach(f => {
        defaultInputs[f.key] = '';
      });
      setInputs(defaultInputs);
    }
  }, [selectedCategory]);

  // Real-time Auto-save state helper
  useEffect(() => {
    if (selectedCategory && inputs && Object.keys(inputs).length > 0) {
      localStorage.setItem(`docmint_draft_inputs_${selectedCategory.id}`, JSON.stringify(inputs));
    }
  }, [inputs, selectedCategory]);

  // Document Draft Maker Action
  const generatePreview = async () => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    if (!selectedCategory) return;

    // Check validation of mandatory fields
    const missing = selectedCategory.requiredFields.filter(f => f.required && !inputs[f.key]);
    if (missing.length > 0) {
      alert(`Please fill in all required draft parameters: ${missing.map(m => m.label).join(', ')}`);
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch('/api/documents/generate-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          categoryId: selectedCategory.id,
          inputs,
          letterheadName,
          letterheadAddress,
          letterheadLogo,
          watermarkLogo,
          letterheadLogoAlign,
          watermarkLogoAlign,
          letterheadTitleColor,
          letterheadLineColor,
          letterheadLineStyle,
          designPatternStyle,
          letterheadTitleSize,
          addWatermark,
          addQrCode,
          addSignatureLine,
          signerName,
          signerTitle
        })
      });

      if (!response.ok) {
        throw new Error('Draft assembly failed on backend.');
      }

      const freshDoc = await response.json();
      setCurrentDocument(freshDoc);
      fetchMyDrafts(token!);
      confetti({ particleCount: 80, spread: 60 });
    } catch (e: any) {
      alert(e.message || 'Error creating document layout.');
    } finally {
      setGenerating(false);
    }
  };

  // Payment Unlock Flow
  const initialTransactionCheckout = async () => {
    if (!currentDocument || !currentUser) return;
    setSimulatingPayment(true);

    try {
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          docId: currentDocument.id,
          gateway: selectedGateway
        })
      });

      if (!response.ok) {
        throw new Error('Could not contact checkout terminal.');
      }

      const payData = await response.json();
      setSimulatedRef(payData.reference);
      setSimulatingPayment(false);
      setSimulatedCheckoutOpen(true);
    } catch (e) {
      alert('Error initializing billing gateway.');
      setSimulatingPayment(false);
    }
  };

  const handleFinishCreditSimulator = async (simStatus: 'success' | 'failed') => {
    if (!currentDocument || !simulatedRef) return;
    setSimulatingPayment(true);

    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          reference: simulatedRef,
          status: simStatus,
          docId: currentDocument.id
        })
      });

      if (!response.ok) {
        throw new Error('Verification failed.');
      }

      const data = await response.json();
      if (data.status === 'success') {
        confetti({ particleCount: 200, spread: 100 });
        setSimulatedCheckoutOpen(false);
        setPaymentModalOpen(false);
        
        // Reload active unlocked sheet
        const loadFreshRes = await fetch(`/api/documents/${currentDocument.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (loadFreshRes.ok) {
          const freshUnlocked = await loadFreshRes.json();
          setCurrentDocument(freshUnlocked);
        }

        fetchMyDrafts(token!);
        fetchPaymentHistory(token!);
        
        // Update user's remote session
        const meRes = await fetch('/api/auth/me', { headers: { 'Authorization': `Bearer ${token}` } });
        if (meRes.ok) {
          const meData = await meRes.json();
          setCurrentUser(meData.user);
        }
      } else {
        alert('Transaction was flagged or rejected by checkout terminal.');
      }
    } catch (e) {
      alert('Verification terminal error.');
    } finally {
      setSimulatingPayment(false);
    }
  };

  const handleWalletPay = async () => {
    if (!currentDocument || !currentUser) return;
    setWalletPaying(true);

    try {
      const response = await fetch('/api/payments/pay-with-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ docId: currentDocument.id })
      });

      const resBody = await response.json();
      if (!response.ok) {
        alert(resBody.error || 'Wallet checkout failed.');
        return;
      }

      confetti({ particleCount: 200, spread: 100 });
      setPaymentModalOpen(false);
      setCurrentDocument(resBody.document);
      
      fetchMyDrafts(token!);
      fetchPaymentHistory(token!);

      setCurrentUser({
        ...currentUser,
        walletBalance: resBody.walletBalance
      });
    } catch (e) {
      alert('Wallet debit system problem.');
    } finally {
      setWalletPaying(false);
    }
  };

  const handleWalletTopup = async () => {
    if (!currentUser) return;
    const cleanAmt = parseFloat(topupAmount);
    if (isNaN(cleanAmt) || cleanAmt <= 0) {
      alert('Please enter a valid amount to topup.');
      return;
    }

    try {
      const response = await fetch('/api/wallet/topup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: cleanAmt })
      });

      if (!response.ok) throw new Error();
      const resBody = await response.json();
      
      confetti({ particleCount: 100, spread: 70 });
      setCurrentUser(resBody.user);
      fetchPaymentHistory(token!);
      alert(`Top-up of ₦${cleanAmt.toLocaleString()} successful! New Balance: ₦${resBody.walletBalance.toLocaleString()}`);
    } catch (e) {
      alert('Error charging card for top-up.');
    }
  };

  const triggerQuickTopup = async (amount: number) => {
    if (!currentUser) return;
    try {
      const response = await fetch('/api/wallet/topup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      });

      if (!response.ok) throw new Error();
      const resBody = await response.json();
      
      confetti({ particleCount: 100, spread: 70 });
      setCurrentUser(resBody.user);
      fetchPaymentHistory(token!);
      alert(`Top-up of ₦${amount.toLocaleString()} successful! New Balance: ₦${resBody.walletBalance.toLocaleString()}`);
    } catch (e) {
      alert('Error charging card for top-up.');
    }
  };

  // Document verification matching engine
  const runVerifyTracker = async () => {
    setVerifyError('');
    setVerifiedDoc(null);
    if (!verifyId.trim()) {
      setVerifyError('Please specify document/certificate referential ID.');
      return;
    }
    setVerifying(true);

    try {
      const response = await fetch(`/api/documents/${verifyId.trim()}`, {
        headers: {
          'Authorization': `Bearer ${token || 'guest_viewer_or_verifier'}`
        }
      });

      if (!response.ok) {
        setVerifyError('Referential document ID not found inside database registries.');
        return;
      }

      const found = await response.json();
      setVerifiedDoc(found);
      confetti({ particleCount: 70, spread: 45 });
    } catch (e) {
      setVerifyError('Tracker offline or unauthorized check.');
    } finally {
      setVerifying(false);
    }
  };

  const handleSavePrompts = async () => {
    if (currentUser?.role !== 'admin') return;
    setSavingPrompts(true);
    try {
      const response = await fetch('/api/admin/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          systemInstruction: adminPrompts.systemInstruction
        })
      });
      if (response.ok) {
        alert('AI Core prompts saved successfully!');
      }
    } catch (e) {
      alert('Error saving custom instruction.');
    } finally {
      setSavingPrompts(false);
    }
  };

  const handleOpenPrintLayout = () => {
    window.print();
  };

  return (
    <div className="bg-white min-h-screen text-black flex flex-col justify-between selection:bg-[#00c060]/30 selection:text-neutral-900 font-sans">
      
      {/* Dynamic Navigation Rails */}
      <Navbar 
        currentUser={currentUser} 
        onLogout={handleLogout} 
        onOpenAuth={() => setAuthModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setIsDraftingActive={setIsDraftingActive}
      />

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in print:p-0">
        
        {/* Printable Section wrapper for raw documents printouts */}
        {activeTab === 'dashboard' && currentDocument && currentDocument.paid && (
          <div className="hidden print:block absolute inset-0 bg-white z-[9999] p-0">
            <CertificatePreview doc={currentDocument} isPrintMode={true} />
          </div>
        )}

        {/* 🏛️ VIEW 1: DRAFTING CONSOLE (STUDIO) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 print:hidden">
            {!currentUser ? (
              /* GUEST RECEPTION LANDING (Screenshot 3 Style) */
              <div className="space-y-12 py-6">
                {/* Hero card based on Screenshot 3 */}
                <div className="border-2 border-black rounded-3xl p-8 sm:p-14 text-center max-w-4xl mx-auto bg-white">
                  <div className="bg-black text-white border border-black text-[11px] font-black uppercase px-4 py-1.5 rounded-full inline-flex items-center space-x-2 mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00c060] animate-pulse"></span>
                    <span>Modern Academic & Administrative Drafting</span>
                  </div>
                  <h1 className="text-black font-display font-black text-3.5xl sm:text-5xl lg:text-6.5xl tracking-normal leading-[1.05] max-w-4xl mx-auto mb-6 uppercase">
                    AI-Powered Beautiful Compliant Documents
                  </h1>
                  <p className="text-neutral-500 text-xs sm:text-sm mt-2 max-w-2xl mx-auto leading-relaxed font-semibold">
                    Save hours drafting reference, attestation, SIWES, and recommendation letters. DocMint templates are aggregated from accredited institutions, professionally formatted, and embedded with individual QR code verify cards.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                    <button 
                      onClick={() => setAuthModalOpen(true)}
                      className="bg-[#00c060] hover:bg-[#00a352] text-white border-2 border-black font-black text-xs uppercase tracking-wider py-4_5 px-10 rounded-2xl transition-all w-full sm:w-auto cursor-pointer"
                    >
                      Console Access
                    </button>
                    <button 
                      onClick={() => {
                        setActiveTab('verify');
                      }}
                      className="bg-white hover:bg-neutral-50 text-black border-2 border-black font-black text-xs uppercase tracking-wider py-4_5 px-10 rounded-2xl transition-all w-full sm:w-auto cursor-pointer"
                    >
                      Verify Document
                    </button>
                  </div>
                </div>

                {/* Steps banner */}
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                  <div className="bg-white border-2 border-black rounded-2xl p-6 text-left flex items-start space-x-4">
                    <div className="bg-black text-[#00c060] border border-black text-xs font-black p-3 rounded-xl h-10 w-10 flex items-center justify-center">01</div>
                    <div>
                      <h4 className="text-sm font-extrabold text-black">Browse Formats</h4>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed font-medium">Select indigeneship, birth, character referee, or recommendation models.</p>
                    </div>
                  </div>
                  <div className="bg-white border-2 border-black rounded-2xl p-6 text-left flex items-start space-x-4">
                    <div className="bg-black text-[#00c060] border border-black text-xs font-black p-3 rounded-xl h-10 w-10 flex items-center justify-center">02</div>
                    <div>
                      <h4 className="text-sm font-extrabold text-black">Assemble Variables</h4>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed font-medium">Enter student coordinates, church clergy titles, or local state references.</p>
                    </div>
                  </div>
                  <div className="bg-white border-2 border-black rounded-2xl p-6 text-left flex items-start space-x-4">
                    <div className="bg-black text-[#00c060] border border-black text-xs font-black p-3 rounded-xl h-10 w-10 flex items-center justify-center">03</div>
                    <div>
                      <h4 className="text-sm font-extrabold text-black">Unlock Draft</h4>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed font-medium">Instantly verify compiled templates and download official high-fidelity copies in NGN.</p>
                    </div>
                  </div>
                </div>

                {/* Grid of Templates for Demo */}
                <div className="pt-8 text-center max-w-6xl mx-auto">
                  <div className="mb-6">
                    <span className="text-[#00c060] text-[10px] font-black tracking-widest uppercase font-sans">CATALOGUE</span>
                    <h2 className="text-2xl font-black text-black tracking-tight mt-1 uppercase">Available Document Models</h2>
                    <p className="text-xs text-neutral-400 mt-0.5 font-medium">Explore our professional presets ready for draft generation.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat) => (
                      <div key={cat.id} className="bg-white border-2 border-black rounded-2xl p-5 text-left flex flex-col justify-between transition-all">
                        <div>
                          <span className="bg-black text-white border border-black text-[9px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">₦{cat.priceNGN.toLocaleString()} NGN</span>
                          <h3 className="font-extrabold text-neutral-950 mt-3.5 text-base leading-tight uppercase font-display">{cat.name}</h3>
                          <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed line-clamp-2">{cat.description}</p>
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedCategory(cat);
                            setAuthModalOpen(true);
                          }}
                          className="mt-4 bg-[#00c060] hover:bg-[#00a352] text-white border-2 border-black py-2.5 w-full rounded-xl text-xs font-black uppercase tracking-wider transition-all text-center cursor-pointer"
                        >
                          Use Format →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : !isDraftingActive ? (
              /* LOGGED IN MAIN HOME (Screenshot 1 & 2 Style) */
              <div className="space-y-6 text-left animate-fade-in font-sans">
                {/* Greeting */}
                <div>
                  <span className="text-neutral-400 font-extrabold tracking-wider text-[11px] uppercase">GREETINGS, AUTHORIZED ACCESS</span>
                  <h1 className="text-3xl font-black tracking-tight text-black mt-1 leading-none font-display uppercase">
                    {currentUser.name} 👋
                  </h1>
                </div>

                {/* Modern search bar */}
                <div className="relative max-w-xl w-full">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                    <Search className="w-5 h-5" />
                  </span>
                  <input 
                    type="text" 
                    placeholder="Search 15+ formats..." 
                    className="w-full bg-white border-2 border-black rounded-2xl pl-12 pr-4 py-4 text-sm text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#00c060]/20 focus:border-[#00c060] transition-all font-sans"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Wallet Balance Widget & Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Wallet card (matches Screenshot 1 & 2) */}
                  <div className="bg-black text-white rounded-3xl p-6 border-2 border-black relative overflow-hidden flex flex-col justify-between h-[180px]">
                    <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-44 h-44 bg-[#00c060]/10 rounded-full blur-xl pointer-events-none"></div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#00c060] flex items-center gap-1.5 leading-none">
                        <Wallet className="w-3.5 h-3.5" />
                        WALLET BALANCE
                      </span>
                      <span className="bg-white/10 px-2.5 py-1 rounded-full text-[9px] font-bold tracking-widest text-[#00c060] border border-white/5 flex items-center gap-1.5 leading-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00c060] animate-pulse"></span>
                        ACTIVE
                      </span>
                    </div>

                    <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-wide mt-2 font-display">
                      ₦{(currentUser.walletBalance ?? 0).toLocaleString()} <span className="text-sm font-bold opacity-75">NGN</span>
                    </div>

                    <div className="flex items-center gap-2.5 mt-4">
                      <button 
                        onClick={() => triggerQuickTopup(2000)}
                        className="bg-[#00c060] text-white hover:bg-[#00a352] border border-black font-black text-[11px] uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all flex items-center space-x-1 scale-100 active:scale-95 cursor-pointer"
                      >
                        <span>+ Top Up ₦2,000</span>
                      </button>
                      <button 
                        onClick={() => triggerQuickTopup(5000)}
                        className="bg-white text-black hover:bg-neutral-100 border-2 border-black font-black text-[11px] uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all flex items-center justify-center cursor-pointer"
                      >
                        <span>+ ₦5,000</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Stacked Statistics widgets */}
                  <div className="flex flex-col gap-4 col-span-1">
                    {/* Widget 1: Documents Drafted */}
                    <div className="bg-white border-2 border-black rounded-2xl p-4.5 flex items-center justify-between h-[82px]">
                      <div>
                        <span className="block text-[9px] font-black text-neutral-500 tracking-wider leading-none uppercase">DOCUMENTS</span>
                        <span className="block text-2.5xl font-black text-black mt-1.5 leading-none font-display">
                          {myDocuments.length}
                        </span>
                        <span className="block text-[10px] text-neutral-400 font-bold mt-1 leading-none">Total generated</span>
                      </div>
                      <div className="bg-[#00c060]/10 text-[#00c060] border border-[#00c060]/20 p-3 rounded-xl">
                        <FileText className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Widget 2: Spent this month */}
                    <div className="bg-white border-2 border-black rounded-2xl p-4.5 flex items-center justify-between h-[82px]">
                      <div>
                        <span className="block text-[9px] font-black text-neutral-500 tracking-wider leading-none uppercase">THIS MONTH</span>
                        <span className="block text-2.5xl font-black text-black mt-1.5 leading-none font-display">
                          ₦{paymentHistory.reduce((s, p) => s + (p.status === 'success' ? p.amount : 0), 0).toLocaleString()}
                        </span>
                        <span className="block text-[10px] text-neutral-400 font-bold mt-1 leading-none">Spent on letters</span>
                      </div>
                      <div className="bg-[#00c060]/10 text-[#00c060] border border-[#00c060]/20 p-3 rounded-xl font-sans">
                        <Coins className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Template filters & headers */}
                <div className="pt-4 font-sans">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-black text-black tracking-tight leading-none uppercase font-display">Quick actions</h2>
                      <p className="text-xs text-neutral-405 font-medium mt-1 leading-none">Pick an administrative template to compile instantly.</p>
                    </div>

                    {/* Filter pills scroll */}
                    <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 shrink-0">
                      <button 
                        onClick={() => setSelectedPill('all')}
                        className={`px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                          selectedPill === 'all' 
                            ? 'bg-black text-white border-2 border-black' 
                            : 'bg-white text-black border hover:border-black hover:bg-neutral-50'
                        }`}
                      >
                        All Templates
                      </button>
                      <button 
                        onClick={() => setSelectedPill('attestation')}
                        className={`px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                          selectedPill === 'attestation' 
                            ? 'bg-black text-white border-2 border-black' 
                            : 'bg-white text-black border hover:border-black hover:bg-neutral-50'
                        }`}
                      >
                        Attestations & Certs
                      </button>
                      <button 
                        onClick={() => setSelectedPill('recommendation')}
                        className={`px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                          selectedPill === 'recommendation' 
                            ? 'bg-black text-white border-2 border-black' 
                            : 'bg-white text-black border hover:border-black hover:bg-neutral-50'
                        }`}
                      >
                        Recommendations & Refs
                      </button>
                    </div>
                  </div>

                  {/* Template grid cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {categories
                      .filter((cat) => {
                        const matchQuery = cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                           cat.description.toLowerCase().includes(searchQuery.toLowerCase());
                        let matchPill = true;
                        if (selectedPill === 'attestation') {
                          matchPill = ['lga-origin', 'birth-certificate', 'church-attestation', 'character-reference'].includes(cat.id);
                        } else if (selectedPill === 'recommendation') {
                          matchPill = !['lga-origin', 'birth-certificate', 'church-attestation', 'character-reference'].includes(cat.id);
                        }
                        return matchQuery && matchPill;
                      })
                      .map((cat) => (
                        <div key={cat.id} className="bg-white border-2 border-black rounded-3xl p-5 transition-all flex flex-col justify-between relative group text-left">
                          <div>
                            <span className="bg-black text-white text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider border border-black">
                              AUTHENTIC {cat.templateStyle || 'ADMIN'} MODEL
                            </span>
                            <h3 className="font-extrabold text-black mt-3 text-base leading-tight group-hover:text-[#00c060] transition-colors uppercase font-display">{cat.name}</h3>
                            <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed line-clamp-2">{cat.description}</p>
                          </div>

                          <div className="flex items-center justify-between border-t border-neutral-150 mt-5 pt-4">
                            <span className="text-[#00c060] font-black font-sans text-sm">₦{cat.priceNGN.toLocaleString()} NGN</span>
                            <button 
                              onClick={() => {
                                setSelectedCategory(cat);
                                setCurrentDocument(null);
                                setIsDraftingActive(true);
                              }}
                              className="bg-[#00c060] hover:bg-[#00a352] text-white border-2 border-black px-4 py-2.5 rounded-xl font-black text-xs tracking-wider transition-all uppercase leading-none cursor-pointer"
                            >
                              Write →
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Empty state when query matches nothing */}
                  {categories.filter((cat) => {
                    const matchQuery = cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                       cat.description.toLowerCase().includes(searchQuery.toLowerCase());
                    let matchPill = true;
                    if (selectedPill === 'attestation') {
                      matchPill = ['lga-origin', 'birth-certificate', 'church-attestation', 'character-reference'].includes(cat.id);
                    } else if (selectedPill === 'recommendation') {
                      matchPill = !['lga-origin', 'birth-certificate', 'church-attestation', 'character-reference'].includes(cat.id);
                    }
                    return matchQuery && matchPill;
                  }).length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-black max-w-lg mx-auto mt-6">
                      <Search className="w-10 h-10 mx-auto text-neutral-350 stroke-1" />
                      <h4 className="text-sm font-bold text-black mt-2 uppercase">No matching formats found</h4>
                      <p className="text-xs text-neutral-400 mt-1">Try resetting your filters or altering your search query coordinates.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* ACTIVE STUDIO EDITOR WORKSPACE */
              <div className="space-y-6 animate-fade-in text-left">
                {/* Back Link to Home */}
                <div className="flex items-center justify-between border-b border-neutral-200/60 pb-4 font-sans">
                  <button 
                    onClick={() => {
                      setIsDraftingActive(false);
                      setCurrentDocument(null);
                    }} 
                    className="flex items-center space-x-1.5 text-black hover:text-[#00c060] font-black text-xs uppercase tracking-wider cursor-pointer"
                  >
                    <span>← Back to Dashboard Overview</span>
                  </button>
                  <div className="bg-black text-[#00c060] border border-black text-[9px] font-black uppercase px-2.5 py-1 rounded">
                    Active Assembler: {selectedCategory?.name}
                  </div>
                </div>

                {/* Core Work Station Side-by-Side Grid */}
                <div className="grid grid-cols-12 gap-6">
                  
                  {/* Left Column: Selector and Forms */}
                  <div className="col-span-12 lg:col-span-5 space-y-6">
                
                {/* 1. Pick a Document Category */}
                <div className="bg-white rounded-2xl border-2 border-black p-5 space-y-3">
                  <h3 className="text-xs font-black text-black uppercase tracking-widest border-b-2 border-black pb-2">
                    1. Select Document Category
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {categories.map((cat) => {
                      const isSelected = selectedCategory?.id === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(cat);
                            setCurrentDocument(null);
                          }}
                          className={`flex items-center justify-between text-left p-2.5 rounded-xl border transition-all ${
                            isSelected 
                              ? 'border-black bg-neutral-50 border-l-[6px]' 
                              : 'border-neutral-200 hover:bg-neutral-50'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-black text-[#00c060]' : 'bg-neutral-100 text-slate-500'}`}>
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="block text-xs font-black truncate text-black uppercase tracking-tight">{cat.name}</span>
                              <span className="block text-[10px] text-neutral-401 truncate max-w-[200px] font-medium">{cat.description}</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-black text-[#00c060] bg-black border border-black px-1.5 py-0.5 rounded shrink-0">
                            ₦{cat.priceNGN.toLocaleString()}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Fill variable inputs */}
                {selectedCategory && (
                  <div className="bg-white rounded-2xl border-2 border-black p-5 space-y-4">
                    <h3 className="text-xs font-black text-black uppercase tracking-widest border-b-2 border-black pb-2 flex items-center justify-between">
                      <span>2. Input Template Fields</span>
                      <span className="bg-black text-[#00c060] border border-black text-[10px] font-black px-2 py-0.5 rounded uppercase">
                        {selectedCategory.id}
                      </span>
                    </h3>

                    <div className="space-y-3.5">
                      {selectedCategory.requiredFields.map((field) => (
                        <div key={field.key} className="space-y-1 text-left">
                          <label className="block text-xs font-bold text-black uppercase tracking-wide">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                          </label>
                          
                          {field.type === 'textarea' ? (
                            <textarea
                              rows={3}
                              className="w-full text-xs p-2.5 border-2 border-black rounded-lg focus:ring-1 focus:ring-[#00c060] focus:border-[#00c060] text-black font-sans placeholder-neutral-400"
                              placeholder={field.placeholder}
                              value={inputs[field.key] || ''}
                              onChange={(e) => setInputs({ ...inputs, [field.key]: e.target.value })}
                            />
                          ) : field.type === 'select' ? (
                            <select
                              className="w-full text-xs p-2.5 border-2 border-black rounded-lg focus:ring-1 focus:ring-[#00c060] focus:border-[#00c060] text-black font-sans"
                              value={inputs[field.key] || ''}
                              onChange={(e) => setInputs({ ...inputs, [field.key]: e.target.value })}
                            >
                              <option value="">-- Choose style --</option>
                              {field.options?.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              className="w-full text-xs p-2.5 border-2 border-black rounded-lg focus:ring-1 focus:ring-[#00c060] focus:border-[#00c060] text-black font-sans placeholder-neutral-400"
                              placeholder={field.placeholder}
                              value={inputs[field.key] || ''}
                              onChange={(e) => setInputs({ ...inputs, [field.key]: e.target.value })}
                            />
                          )}
                        </div>
                      ))}

                      {/* Dynamic Real-time Live Security Local-Backup Badge */}
                      <div className="flex items-center justify-between bg-[#fcfdfa] px-3.5 py-3 rounded-xl border-2 border-dashed border-neutral-300 mt-4 text-[10px] text-neutral-500 font-mono select-none">
                        <div className="flex items-center space-x-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00c060] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00c060]"></span>
                          </span>
                          <span className="font-extrabold text-black uppercase tracking-tight">Active Archive Mode</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-black uppercase block leading-none mb-0.5 text-[9.5px]">✓ SECURED & AUTO-SAVED</span>
                          <span className="text-[8.5px] text-neutral-400 block leading-none">Console Cache Synchronized</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Customize Style & Brand letterheads */}
                <div className="bg-white rounded-2xl border-2 border-black p-5 space-y-4 font-sans">
                  <h3 className="text-xs font-black text-black uppercase tracking-widest border-b-2 border-black pb-2">
                    3. Letterhead & Brand Customizer
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1 text-left">
                      <label className="block text-[10px] font-black uppercase tracking-wide text-neutral-600">Letterhead Preset</label>
                      <select
                        className="w-full text-[11px] p-2 border-2 border-black rounded-lg text-black bg-white"
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'unilag') {
                            setLetterheadName('UNIVERSITY OF LAGOS');
                            setLetterheadAddress('OFFICE OF STUDENT WELFARE AFFAIRS, SENATE HOUSE, AKOKA, LAGOS');
                            setLetterheadTitleColor('#1e40af');
                            setLetterheadLineColor('#b45309');
                            setLetterheadLineStyle('double');
                            setSignerName('PROF. OLAYINKA ADEBAYO');
                          } else if (val === 'futm') {
                            setLetterheadName('FEDERAL UNIVERSITY OF TECHNOLOGY, MINNA');
                            setLetterheadAddress('MAIN CAMPUS, GIDAN KWANO, P.M.B. 65, MINNA, NIGER STATE');
                            setLetterheadTitleColor('#064e3b');
                            setLetterheadLineColor('#d97706');
                            setLetterheadLineStyle('double');
                            setSignerName('PROF. AMINA S. BELLO');
                          } else if (val === 'church') {
                            setLetterheadName('REDEEMED CHRISTIAN CHURCH OF GOD');
                            setLetterheadAddress('GRACE SANCTUARY, SABO METROPOLIS, IKEJA, LAGOS STATE');
                            setLetterheadTitleColor('#b91c1c');
                            setLetterheadLineColor('#1e3a8a');
                            setLetterheadLineStyle('solid');
                            setSignerName('PASTOR TIMOTHY GARI');
                          } else if (val === 'corporate') {
                            setLetterheadName('FLUTTERWAVE TECHNOLOGIES PLC');
                            setLetterheadAddress('43 MARINA ROAD, BROAD STREET HARBOUR, LAGOS CONCOURSE');
                            setLetterheadTitleColor('#111111');
                            setLetterheadLineColor('#475569');
                            setLetterheadLineStyle('solid');
                            setSignerName('MRS. CHIOMA ADELEKE');
                          }
                        }}
                      >
                        <option value="futm">⭐ FUT Minna Academic</option>
                        <option value="unilag">🏫 UNILAG Senate Block</option>
                        <option value="church">⛪ Redeemed Sanctuary</option>
                        <option value="corporate">🏢 Flutterwave Corp HQ</option>
                      </select>
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="block text-[10px] font-black uppercase tracking-wide text-neutral-600">Border Style Rule</label>
                      <select
                        className="w-full text-[11px] p-2 border-2 border-black rounded-lg text-black bg-white"
                        value={letterheadLineStyle}
                        onChange={(e: any) => setLetterheadLineStyle(e.target.value)}
                      >
                        <option value="double">Double Border</option>
                        <option value="solid">Single Solid</option>
                        <option value="dotted">Fine Dotted</option>
                        <option value="dashed">Dashed Pattern</option>
                        <option value="none">No Separator</option>
                      </select>
                    </div>

                    <div className="col-span-2 space-y-1 text-left">
                      <label className="block text-[10px] font-black uppercase tracking-wide text-neutral-600">Letterhead Custom Header Name</label>
                      <input
                        type="text"
                        className="w-full text-[11px] p-2 border-2 border-black rounded-lg text-black font-medium"
                        value={letterheadName}
                        onChange={(e) => setLetterheadName(e.target.value)}
                      />
                    </div>

                    <div className="col-span-2 space-y-1 text-left">
                      <label className="block text-[10px] font-black uppercase tracking-wide text-neutral-600">Header Sub-Address</label>
                      <input
                        type="text"
                        className="w-full text-[11px] p-2 border-2 border-black rounded-lg text-black font-medium"
                        value={letterheadAddress}
                        onChange={(e) => setLetterheadAddress(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="block text-[10px] font-black uppercase tracking-wide text-neutral-600">Logo align</label>
                      <select
                        className="w-full text-[11px] p-2 border-2 border-black rounded-lg text-black bg-white"
                        value={letterheadLogoAlign}
                        onChange={(e: any) => setLetterheadLogoAlign(e.target.value)}
                      >
                        <option value="left">Left Edge</option>
                        <option value="center">Center top</option>
                        <option value="right">Right Edge</option>
                      </select>
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="block text-[10px] font-black uppercase tracking-wide text-neutral-600">Signer Name</label>
                      <input
                        type="text"
                        className="w-full text-[11px] p-2 border-2 border-black rounded-lg text-black font-medium"
                        value={signerName}
                        onChange={(e) => setSignerName(e.target.value)}
                      />
                    </div>

                    <div className="col-span-2 grid grid-cols-2 gap-3 pb-2 border-t-2 border-black pt-2">
                      <div className="space-y-1 text-left">
                        <label className="block text-[10px] font-black uppercase tracking-wide text-neutral-600">Custom Logo URL</label>
                        <input
                          type="text"
                          className="w-full text-[11px] p-2 border-2 border-black rounded-lg text-black font-mono"
                          value={letterheadLogo}
                          onChange={(e) => setLetterheadLogo(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1 text-left">
                        <label className="block text-[10px] font-black uppercase tracking-wide text-neutral-600">Watermark URL</label>
                        <input
                          type="text"
                          className="w-full text-[11px] p-2 border-2 border-black rounded-lg text-black font-mono"
                          value={watermarkLogo}
                          onChange={(e) => setWatermarkLogo(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="col-span-2 flex flex-wrap gap-x-4 gap-y-2 pt-2 border-t-2 border-black">
                      <label className="flex items-center space-x-2 text-[11px] font-bold text-black uppercase cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={addWatermark} 
                          onChange={(e) => setAddWatermark(e.target.checked)} 
                          className="rounded text-[#00c060] focus:ring-[#00c060] border-2 border-black w-4 h-4"
                        />
                        <span>Enforce Watermarks Draft overlay</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 text-[11px] font-bold text-black uppercase cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={addQrCode} 
                          onChange={(e) => setAddQrCode(e.target.checked)} 
                          className="rounded text-[#00c060] focus:ring-[#00c060] border-2 border-black w-4 h-4"
                        />
                        <span>Validate with tracking QR Code</span>
                      </label>

                      <label className="flex items-center space-x-2 text-[11px] font-bold text-black uppercase cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={addSignatureLine} 
                          onChange={(e) => setAddSignatureLine(e.target.checked)} 
                          className="rounded text-[#00c060] focus:ring-[#00c060] border-2 border-black w-4 h-4"
                        />
                        <span>Enforce signature block</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Main Action Trigger */}
                <button
                  onClick={currentUser ? generatePreview : handleTryGenerate}
                  disabled={generating}
                  className="w-full bg-[#00c060] text-white hover:bg-[#00c060] disabled:bg-neutral-300 disabled:text-neutral-500 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-2 border-2 border-black transition-all h-14 cursor-pointer"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin text-white" />
                      <span>Generating Document Draft with Gemini AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-white" />
                      <span>{currentUser ? 'Generate AI Preview Draft' : 'Sign in to generate preview'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right Column: Live Sheet Preview Canvas */}
              <div className="col-span-12 lg:col-span-7 flex flex-col">
                <div className="bg-white rounded-2xl border-2 border-black p-5 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="border-b-2 border-black pb-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00c060] animate-pulse"></div>
                      <h3 className="text-xs font-black text-black uppercase tracking-widest leading-none">
                        Live Sheet Preview Canvas
                      </h3>
                    </div>
                    {currentDocument && (
                      <span className={`text-[10px] font-extrabold px-2 py-1 rounded-md uppercase leading-none border-2 ${
                        currentDocument.paid 
                          ? 'bg-black text-[#00c060] border-black' 
                          : 'bg-[#00c060] text-black border-black font-bold animate-pulse'
                      }`}>
                        {currentDocument.paid ? 'Official Unlocked ID' : 'DRAFT ONLY (LOCKED)'}
                      </span>
                    )}
                  </div>

                  {/* The Document Area */}
                  <div className="flex-grow flex items-center justify-center py-4 bg-neutral-50 rounded-2xl p-3 border-2 border-dashed border-black min-h-[500px]">
                    {currentDocument ? (
                      /* If indigeneship style, render styled component; else classic letterhead */
                      (currentDocument.categoryId === 'lga-origin' || currentDocument.categoryId === 'birth-certificate') ? (
                        <div className="scale-[0.82] lg:scale-95 origin-center rounded-2xl bg-white border-2 border-black overflow-hidden">
                          <CertificatePreview doc={currentDocument} />
                        </div>
                      ) : (
                        <div 
                          id={`classic-document-body-${currentDocument.id}`}
                          className="bg-white border-2 border-black text-left rounded-xl font-serif p-8 max-w-[595px] w-full min-h-[660px] relative overflow-hidden flex flex-col justify-between"
                        >
                          {/* Top Draft bar */}
                          {currentDocument.addWatermark && !currentDocument.paid && (
                            <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center rotate-[-25deg] select-none text-red-500/10 font-sans font-black text-3xl tracking-widest whitespace-nowrap uppercase">
                              DocMint Draft copy - No Authority
                            </div>
                          )}

                          {/* Letterhead block */}
                          <div className={`flex flex-col mb-4 pb-2 border-b-${currentDocument.letterheadLineStyle === 'none' ? '0' : '2'}`} style={{ borderColor: currentDocument.letterheadLineColor }}>
                            
                            {/* Inner Logo + Text row */}
                            <div className={`flex items-center gap-4 ${
                              currentDocument.letterheadLogoAlign === 'center' 
                                ? 'flex-col text-center' 
                                : currentDocument.letterheadLogoAlign === 'right' 
                                  ? 'flex-row-reverse text-right' 
                                  : 'flex-row text-left'
                            }`}>
                              {currentDocument.letterheadLogo && (
                                <img 
                                  src={currentDocument.letterheadLogo} 
                                  alt="logo-crest" 
                                  className="w-13 h-13 object-contain select-none shadow-xs border bg-neutral-50 p-1" 
                                />
                              )}
                              <div className="flex-grow min-w-0">
                                <h1 className="text-sm font-black uppercase tracking-tight font-sans" style={{ color: currentDocument.letterheadTitleColor }}>
                                  {currentDocument.letterheadName}
                                </h1>
                                <p className="text-[9px] text-gray-400 font-sans leading-relaxed tracking-wider mt-0.5 font-semibold">
                                  {currentDocument.letterheadAddress}
                                </p>
                              </div>
                            </div>

                            {/* Separator rule depending on style */}
                            {currentDocument.letterheadLineStyle !== 'none' && (
                              <div className="w-full mt-2.5 h-[3px]" style={{ 
                                borderBottom: `${currentDocument.letterheadLineStyle === 'double' ? '3px double' : '1px ' + currentDocument.letterheadLineStyle}`,
                                borderColor: currentDocument.letterheadLineColor 
                              }}></div>
                            )}
                          </div>

                          {/* Heading ref & dates */}
                          <div className="flex justify-between items-start text-xs font-sans text-neutral-600 mb-6">
                            <span>REF Code: <b>DM-{currentDocument.id.toUpperCase().slice(0, 8)}</b></span>
                            <span>Date: <b>{new Date(currentDocument.createdAt).toLocaleDateString()}</b></span>
                          </div>

                          {/* Body text content */}
                          <div className="flex-grow text-neutral-950 text-sm leading-relaxed mb-6 font-serif whitespace-pre-wrap px-1 prose max-w-none">
                            {currentDocument.paid ? (
                              currentDocument.content
                            ) : (
                              <div className="relative">
                                {/* Only first paragraph readable, remaining blurred as draft standard */}
                                <p className="mb-4">
                                  {currentDocument.content.split('\n\n')[0] || 'Draft Preview Content is locked.'}
                                </p>
                                <div className="blur-[5px] select-none pointer-events-none leading-loose">
                                  {currentDocument.content.split('\n\n').slice(1).join('\n\n') || 'Please pay the processing fee to instantly compile the official administrative copy of this generated letterhead draft.'}
                                </div>
                                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
                              </div>
                            )}
                          </div>

                          {/* Bottom controls and signature */}
                          <div className="border-t border-dashed border-neutral-200 pt-3 flex items-end justify-between font-sans">
                            
                            {/* Simulated stamp sticker overlay */}
                            <div className="flex items-center space-x-2">
                              {currentDocument.addQrCode && (
                                <div className="border-2 border-black p-1 bg-white flex flex-col items-center justify-center tracking-tight leading-none text-black">
                                  <Sliders className="w-9 h-9 text-black" />
                                  <span className="text-[6px] font-black mt-0.5 uppercase tracking-wide">VERIFIED</span>
                                </div>
                              )}
                            </div>

                            {/* Verification Tag */}
                            {currentDocument.addSignatureLine && currentDocument.signerName && (
                              <div className="text-right">
                                <div className="w-36 border-t border-neutral-400 pt-1 text-center font-sans tracking-tight">
                                  <span className="block text-xs font-black text-black">{currentDocument.signerName}</span>
                                  <span className="text-[9px] text-neutral-500 block leading-tight font-medium">{currentDocument.signerTitle || 'Direct Signing Officer'}</span>
                                  <span className="text-[8px] text-neutral-400 block font-mono">Date: {new Date(currentDocument.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            )}

                          </div>
                        </div>
                      )
                    ) : (
                      <div className="text-center p-6 text-neutral-400 max-w-sm">
                        <Sliders className="w-14 h-14 mx-auto text-[#00c060] stroke-1 mb-3 animate-pulse" />
                        <h4 className="text-sm font-black text-black uppercase">No generated document preview</h4>
                        <p className="text-xs text-neutral-400 mt-1 font-medium">Configure your variable parameter coordinates on the left and click Generate AI Preview to assemble the custom draft letterhead here.</p>
                      </div>
                    )}
                  </div>

                  {/* Payment controls for Draft preview */}
                  {currentDocument && (
                    <div className="border-t-2 border-black pt-4 bg-black text-white -mx-5 -mb-5 p-5 rounded-b-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-center sm:text-left">
                        <span className="block text-[11px] text-[#00c060] uppercase tracking-widest font-black leading-none">Draft cost to unlock</span>
                        <span className="text-xl font-black text-white mt-1.5 block font-display">
                          ₦{selectedCategory?.priceNGN.toLocaleString()} NGN
                        </span>
                      </div>

                      {currentDocument.paid ? (
                        <div className="flex gap-2 w-full sm:w-auto">
                          <button
                            onClick={handleOpenPrintLayout}
                            className="flex-grow sm:flex-grow-0 bg-[#00c060] text-black border-2 border-black hover:bg-[#00a352] hover:text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase flex items-center justify-center space-x-1.5 tracking-wider cursor-pointer"
                          >
                            <Printer className="w-4 h-4" />
                            <span>Print Doc / Save PDF</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setPaymentModalOpen(true)}
                          className="w-full sm:w-auto bg-[#00c060] hover:bg-[#00a352] text-white border-2 border-black px-6 py-3 rounded-xl font-black text-xs uppercase flex items-center justify-center space-x-2 tracking-wider cursor-pointer"
                        >
                          <Unlock className="w-4 h-4 text-white" />
                          <span>Unlock Official Document</span>
                        </button>
                      )}
                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    )}

        {/* 📋 VIEW 2: MY ARCHIVES */}
        {activeTab === 'drafts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-black leading-tight uppercase font-display">Your Saved Document Archives</h1>
                <p className="text-xs text-neutral-400 mt-0.5 font-medium">Access historic certificates, complete unfinished checkouts, and reprint unlocked letterheads cleanly.</p>
              </div>

              {/* Instant wallet checkup block */}
              {currentUser && (
                <div className="bg-white border-2 border-black rounded-2xl p-3.5 flex items-center space-x-3 shrink-0 self-start justify-between">
                  <Coins className="w-5 h-5 text-[#00c060] shrink-0" />
                  <div className="text-left font-sans">
                    <span className="block text-[9px] text-neutral-400 font-black uppercase leading-none">Simulated Balance</span>
                    <span className="block text-sm font-black text-black leading-tight mt-1 font-display">₦{(currentUser.walletBalance ?? 0).toLocaleString()}</span>
                  </div>
                  <button 
                    onClick={() => {
                      const ans = prompt('Enter top-up amount in NGN (e.g., 2000, 5000):', '5000');
                      if (ans) {
                        setTopupAmount(ans);
                        setTimeout(() => handleWalletTopup(), 200);
                      }
                    }}
                    className="bg-[#00c060] hover:bg-[#00a352] text-white font-black text-[10px] uppercase border border-black px-3 py-1.5 rounded-lg cursor-pointer"
                  >
                    Quick Add Credit
                  </button>
                </div>
              )}
            </div>

            {myDocuments.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border-2 border-black">
                <FileText className="w-16 h-16 text-neutral-300 mx-auto stroke-1 mb-3 animate-pulse" />
                <h3 className="text-md font-black text-black uppercase">No document history found</h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1 font-medium">You have not assembled any dynamic previews in this session yet. Navigate to the Drafting Console to configure and view template letters.</p>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="mt-5 bg-[#00c060] hover:bg-[#00c060] text-white border-2 border-black font-black text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl cursor-pointer"
                >
                  Generate First Draft
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myDocuments.map((doc) => (
                  <div 
                    key={doc.id}
                    className="bg-white border-2 border-black rounded-2xl p-4 flex flex-col justify-between transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="bg-black text-[#00c060] text-[9px] font-black px-2 py-0.5 rounded uppercase border border-black">
                            {doc.categoryId}
                          </span>
                          <h4 className="text-sm font-extrabold text-black mt-2 leading-tight uppercase font-display">{doc.categoryName}</h4>
                          <span className="text-[10px] text-neutral-400 block font-mono mt-0.5">REF: {doc.id}</span>
                        </div>
                        <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase border ${
                          doc.paid ? 'bg-black text-[#00c060] border-black' : 'bg-[#00c060] text-black border-black'
                        }`}>
                          {doc.paid ? 'Official Copy' : 'Draft locked'}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-500 leading-normal line-clamp-2 italic font-serif border-t-2 border-neutral-100 pt-2.5">
                        "{doc.content.substring(0, 110)}..."
                      </p>
                    </div>

                    <div className="border-t border-neutral-150 pt-3 mt-4 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-neutral-450">
                        📅 {new Date(doc.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                      
                      <button
                        onClick={() => {
                          setCurrentDocument(doc);
                          // Autofill inputs to continue tweaking
                          setInputs(doc.inputs);
                          const matchedCat = categories.find(c => c.id === doc.categoryId);
                          if (matchedCat) setSelectedCategory(matchedCat);
                          setActiveTab('dashboard');
                        }}
                        className="bg-white text-black hover:bg-black hover:text-[#00c060] border-2 border-black font-black text-[11px] uppercase tracking-wider px-3.5 py-1.5 rounded-xl transition-all cursor-pointer"
                      >
                        {doc.paid ? 'Open & Reprint' : 'Unlock / Pay Draft'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 🏦 Your Transaction Statement / billing logs */}
            {currentUser && paymentHistory.length > 0 && (
              <div className="bg-white border-2 border-black rounded-2xl p-5 mt-8 text-left space-y-4">
                <h3 className="text-xs font-black text-black uppercase tracking-widest border-b-2 border-black pb-2 flex items-center justify-between">
                  <span>Billing Statement & Receipt Logs</span>
                  <span className="text-[9px] text-[#00c060] font-black uppercase">Account security active</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-neutral-600">
                    <thead className="bg-black text-[10px] text-white uppercase font-black border-b border-black">
                      <tr>
                        <th className="py-3 px-3">Date</th>
                        <th className="py-3 px-3">Reference No</th>
                        <th className="py-3 px-3">Service Details</th>
                        <th className="py-3 px-3">Checkout Mode</th>
                        <th className="py-3 px-3 text-right">Amount charged</th>
                        <th className="py-3 px-3 text-right">Billing Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 font-semibold text-black">
                      {paymentHistory.map((p) => (
                        <tr key={p.id} className="hover:bg-neutral-50">
                          <td className="py-3 px-3 text-neutral-400 font-mono">
                            {new Date(p.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-3 font-mono text-[11px] font-black">{p.reference}</td>
                          <td className="py-3 px-3 uppercase font-display text-xs">{p.categoryName}</td>
                          <td className="py-3 px-3 uppercase text-[10px] font-black text-neutral-400">{p.gateway} Sandbox</td>
                          <td className="py-3 px-3 text-right font-black text-black">₦{p.amount.toLocaleString()}</td>
                          <td className="py-3 px-3 text-right">
                            <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black border uppercase ${
                              p.status === 'success' 
                                ? 'bg-black text-[#00c060] border-black' 
                                : 'bg-black text-white border-black'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 📚 VIEW 3: RESEARCH MODELS */}
        {activeTab === 'templates' && (
          <div className="space-y-6 text-left">
            <div>
              <h1 className="text-2xl font-black text-black leading-tight uppercase font-display">Academic Research Models & Layout Templates</h1>
              <p className="text-xs text-neutral-400 mt-0.5 font-medium">Explore standard structural reference systems across Nigerian institutions, verifying correct alignment, seals, and signoffs.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {templates.map((tpl) => (
                <div key={tpl.id} className="bg-white rounded-2xl border-2 border-black p-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="border-b-2 border-black pb-3 flex items-start justify-between">
                      <div>
                        <span className="bg-black text-[#00c060] text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded border border-black">
                          {tpl.categoryId} Model
                        </span>
                        <h3 className="text-base font-black text-black mt-2 leading-snug uppercase font-display">{tpl.title}</h3>
                        <p className="text-[10px] text-gray-500 font-sans mt-0.5 leading-none font-semibold">Verification coordinate: {tpl.organization}</p>
                      </div>
                      <BookOpen className="w-5 h-5 text-neutral-400 shrink-0" />
                    </div>

                    {/* Left Pane structured block */}
                    <div className="bg-neutral-50 p-3.5 rounded-xl text-xs leading-relaxed font-mono text-black border-2 border-dashed border-neutral-300 overflow-x-auto max-h-[190px]">
                      <pre className="whitespace-pre-wrap font-mono select-all font-semibold">{tpl.rawText}</pre>
                    </div>

                    <div className="bg-[#00c060]/5 border-2 border-black p-3.5 rounded-xl text-xs text-black font-sans space-y-1">
                      <b className="text-[10px] text-black uppercase font-black block tracking-wider mb-1 flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-[#00c060]" />
                        <span>Visual Template Layout Analysis</span>
                      </b>
                      <p className="whitespace-pre-line leading-relaxed text-[11px] font-medium">{tpl.structureAnalysis}</p>
                    </div>
                  </div>

                  <div className="border-t border-neutral-150 pt-3 mt-4 flex justify-end">
                    <button
                      onClick={() => {
                        const targetCategory = categories.find(c => c.id === tpl.categoryId);
                        if (targetCategory) {
                          setSelectedCategory(targetCategory);
                          setCurrentDocument(null);
                          // Quick load preloaded values from research text where viable
                          setActiveTab('dashboard');
                          confetti({ particleCount: 30 });
                        }
                      }}
                      className="bg-[#00c060] hover:bg-[#00a352] text-white border-2 border-black font-black text-xs uppercase tracking-wider px-3.5 py-2 rounded-xl cursor-pointer"
                    >
                      Draft from this category
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🔍 VIEW 4: VERIFY DOCUMENT */}
        {activeTab === 'verify' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <ShieldCheck className="w-12 h-12 text-[#00c060] mx-auto animate-bounce" />
              <h1 className="text-2xl font-black text-black uppercase tracking-wide font-display font-black">Document Authenticity Tracker</h1>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed font-semibold">
                Paste unique document transaction reference ID to fetch verified legal credentials, matching signatures, and metadata timestamps directly from database archives.
              </p>
            </div>

            <div className="bg-white rounded-2xl border-2 border-black p-6 space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-black uppercase tracking-widest">Enter Document / Reference ID</label>
                <div className="flex gap-2.5">
                  <div className="transparent relative flex-grow">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      className="w-full text-sm pl-9 pr-3 py-2.5 border-2 border-black rounded-xl focus:ring-2 focus:ring-[#00c060] focus:border-[#00c060] text-black font-mono font-semibold bg-white"
                      placeholder="e.g., doc_3oaj81h..."
                      value={verifyId}
                      onChange={(e) => setVerifyId(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={runVerifyTracker}
                    disabled={verifying}
                    className="bg-[#00c060] hover:bg-[#00a352] disabled:bg-neutral-200 text-white border-2 border-black font-black text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider shrink-0 cursor-pointer"
                  >
                    {verifying ? 'Tracking...' : 'Track'}
                  </button>
                </div>
              </div>

              {verifyError && (
                <div className="bg-black text-white border-2 border-black p-3.5 rounded-xl text-xs font-semibold flex items-center space-x-2.5">
                  <AlertCircle className="w-4 h-4 text-[#00c060] shrink-0" />
                  <span>{verifyError}</span>
                </div>
              )}

              {/* Verified Result matching */}
              {verifiedDoc && (
                <div className="border-2 border-black bg-neutral-50 p-4 rounded-xl space-y-4">
                  <div className="border-b-2 border-black pb-2.5 flex items-center justify-between">
                    <span className="text-[#00c060] font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#00c060] shrink-0 font-black" />
                      <span>Registry Record Verified Match</span>
                    </span>
                    <span className="text-neutral-400 text-[9px] font-mono font-black border border-neutral-300 rounded px-1">MATCH-SECURED</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs leading-loose font-sans text-neutral-800">
                    <div>
                      <span className="block text-[10px] text-neutral-400 font-extrabold uppercase leading-none">Document Title:</span>
                      <span className="block font-black text-black mt-0.5 uppercase">{verifiedDoc.title}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-neutral-400 font-extrabold uppercase leading-none">Issuing Authority:</span>
                      <span className="block font-black text-black mt-0.5">{verifiedDoc.letterheadName || 'General Docmint Agency'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-neutral-400 font-extrabold uppercase leading-none">Issued To Name:</span>
                      <span className="block font-black text-black mt-0.5">{verifiedDoc.inputs.fullName || verifiedDoc.inputs.studentName || verifiedDoc.userName}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-neutral-400 font-extrabold uppercase leading-none">Authored Timestamp:</span>
                      <span className="block font-bold text-black mt-0.5">{new Date(verifiedDoc.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="col-span-2 border-t-2 border-neutral-200 pt-2.5 mt-1 text-center">
                      <span className="block text-[10px] text-neutral-400 font-bold uppercase leading-none mb-1.5">Verified Document text snippet</span>
                      <p className="p-2.5 bg-white border-2 border-dashed border-black rounded-xl font-serif italic text-[11px] max-h-[140px] overflow-y-auto leading-relaxed text-left text-neutral-950 font-medium">
                        "{verifiedDoc.content.substring(0, 350)}..."
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ⚙️ VIEW 5: ADMIN OPERATIONS HUB */}
        {activeTab === 'admin' && currentUser?.role === 'admin' && (
          <div className="space-y-6 text-left animate-fade-in">
            <div>
              <h1 className="text-2xl font-black text-black leading-tight uppercase font-display">Admin System Operations Hub</h1>
              <p className="text-xs text-neutral-400 mt-0.5 font-semibold">Edit systemic Gemini AI core parameters, view general analytics of billing transactions, and explore metrics.</p>
            </div>

            {/* General Database Stats cards */}
            {adminStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border-2 border-black p-4 rounded-2xl text-left">
                  <span className="block text-[9px] text-[#00c060] font-black uppercase leading-none">Gross Draft Revenue</span>
                  <span className="block text-xl font-black text-black mt-1.5 font-display">₦{(adminStats.totalRevenueNGN || 0).toLocaleString()}</span>
                </div>
                <div className="bg-white border-2 border-black p-4 rounded-2xl text-left">
                  <span className="block text-[9px] text-neutral-400 font-black uppercase leading-none">Total Papers Processed</span>
                  <span className="block text-xl font-black text-black mt-1.5 font-display">{(adminStats.totalDocsCount || 0)}</span>
                </div>
                <div className="bg-white border-2 border-black p-4 rounded-2xl text-left">
                  <span className="block text-[9px] text-[#00c060] font-black uppercase leading-none">Unlocked Official Copies</span>
                  <span className="block text-xl font-black text-black mt-1.5 font-display">{(adminStats.paidDocsCount || 0)}</span>
                </div>
                <div className="bg-white border-2 border-black p-4 rounded-2xl text-left">
                  <span className="block text-[9px] text-neutral-400 font-black uppercase leading-none">User Registry size</span>
                  <span className="block text-xl font-black text-black mt-1.5 font-display">{(adminStats.totalUsersCount || 0)}</span>
                </div>
              </div>
            )}

            {/* Prompt Tuning Box */}
            {adminPrompts && (
              <div className="bg-white border-2 border-black rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-black text-black uppercase tracking-widest border-b-2 border-black pb-2 flex items-center justify-between">
                  <span>Gemini AI Core System Instruction Tuning</span>
                  <span className="bg-[#00c060] text-white border border-black px-2.5 py-1 rounded text-[8px] font-black">LIVE PARAMETER</span>
                </h3>

                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-neutral-700 uppercase">Underlying systemInstruction Prompt</label>
                  <textarea
                    rows={8}
                    className="w-full text-xs p-2.5 font-mono border-2 border-black rounded-xl text-black leading-normal focus:ring-2 focus:ring-[#00c060]"
                    value={adminPrompts.systemInstruction || ''}
                    onChange={(e) => setAdminPrompts({ ...adminPrompts, systemInstruction: e.target.value })}
                  />
                  <p className="text-[10px] text-neutral-400 font-semibold">This string acts as the root system directive for all `/api/documents/generate-preview` operations, establishing strict guidance on formatting and structure limits.</p>
                </div>

                <div className="flex justify-end pt-2 border-t-2 border-neutral-100">
                  <button
                    onClick={handleSavePrompts}
                    disabled={savingPrompts}
                    className="bg-[#00c060] hover:bg-[#00a352] text-white border-2 border-black font-black text-xs px-5 py-2.5 rounded-xl tracking-wider uppercase cursor-pointer"
                  >
                    {savingPrompts ? 'Saving...' : 'Sync prompt instruct to Firestore'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-black text-[#6b7280] border-t-2 border-black py-8 text-center font-sans tracking-tight text-[11px] mt-12 print:hidden select-none">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-black text-[#00c060] uppercase tracking-widest text-xs shrink-0">DocMint Draft System &copy; 2026</p>
          <p className="mt-1.5 text-neutral-400 font-medium">Designed by administrative specialists for academic reference letterheads, state origin liasons, and certified attesters.</p>
        </div>
      </footer>

      {/* 🔐 MODAL: ACCESS CONSOLE (LOGIN / SIGNUP) */}
      {authModalOpen && (
        <div className="fixed inset-0 bg-neutral-900/65 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border-2 border-black max-w-md w-full p-6 space-y-5 animate-fade-in relative text-left">
            <button 
              onClick={() => setAuthModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-full text-black hover:bg-neutral-100 border-2 border-transparent hover:border-black transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1">
              <h2 className="text-xl font-black text-black uppercase font-display">DocMint Account Access</h2>
              <p className="text-xs text-neutral-400 font-medium">Choose simulated user profile level to instantly seed sandboxed demo credits.</p>
            </div>

            {authError && (
              <div className="bg-black text-white border-2 border-black p-2.5 rounded-xl text-xs leading-normal flex items-center space-x-2.5">
                <AlertCircle className="w-4 h-4 text-[#00c060] shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
              {isRegistering && (
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-black uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full text-xs p-2.5 border-2 border-black rounded-xl text-black bg-white focus:outline-none focus:ring-1 focus:ring-[#00c060]"
                    placeholder="e.g., Odebiye Aduragbemi Adekunle"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[10px] font-black text-black uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full text-xs p-2.5 border-2 border-black rounded-xl text-black bg-white focus:outline-none focus:ring-1 focus:ring-[#00c060]"
                  placeholder="e.g., student@edudocs.ai"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
              </div>

              {isRegistering && (
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-black uppercase tracking-wider">Phone Number</label>
                  <input
                    type="text"
                    required
                    className="w-full text-xs p-2.5 border-2 border-black rounded-xl text-black bg-white focus:outline-none focus:ring-1 focus:ring-[#00c060]"
                    placeholder="e.g., 08123456789"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[10px] font-black text-black uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  required
                  className="w-full text-xs p-2.5 border-2 border-black rounded-xl text-black bg-white focus:outline-none focus:ring-1 focus:ring-[#00c060]"
                  placeholder="Password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                />
              </div>

              {isRegistering && (
                <div className="grid grid-cols-2 gap-3 pb-2 border-t-2 border-black pt-2">
                  <div className="space-y-1 text-left">
                    <label className="block text-[10px] font-black text-black uppercase">Profile Level</label>
                    <select
                      className="w-full text-xs p-2 border-2 border-black rounded-xl text-black bg-white"
                      value={userTypeInput}
                      onChange={(e: any) => setUserTypeInput(e.target.value)}
                    >
                      <option value="student">Student Attestation</option>
                      <option value="faculty">Faculty Endorsement</option>
                      <option value="organization">Organization rep</option>
                      <option value="general">General indigen</option>
                    </select>
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="block text-[10px] font-black text-black uppercase">Institution Name</label>
                    <input
                      type="text"
                      className="w-full text-xs p-2 border-2 border-black rounded-xl text-black"
                      placeholder="e.g., FUT Minna"
                      value={institutionInput}
                      onChange={(e) => setInstitutionInput(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="block text-[10px] font-black text-black uppercase">Department</label>
                    <input
                      type="text"
                      className="w-full text-xs p-2 border-2 border-black rounded-xl text-black"
                      placeholder="e.g., Computer Science"
                      value={departmentInput}
                      onChange={(e) => setDepartmentInput(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="block text-[10px] font-black text-black uppercase">Matric / ID No</label>
                    <input
                      type="text"
                      className="w-full text-xs p-2 border-2 border-black rounded-xl text-black"
                      placeholder="e.g., ENG/2021/045"
                      value={matricNoInput}
                      onChange={(e) => setMatricNoInput(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#00c060] hover:bg-[#00a352] text-white border-2 border-black py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                {isRegistering ? (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Sandboxed Account</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Access Console Panel</span>
                  </>
                )}
              </button>
            </form>

            <div className="border-t-2 border-black pt-3 text-center">
              <button
                onClick={() => {
                  setAuthError('');
                  setIsRegistering(!isRegistering);
                }}
                className="text-xs text-black font-black hover:underline uppercase tracking-wide"
              >
                {isRegistering ? 'Already registered? Log in here' : 'New to Docmint? Register here'}
              </button>
            </div>

            {/* Quick preloaded Accounts for AI Studio previewing speed */}
            <div className="bg-neutral-50 p-3.5 rounded-xl border-2 border-black text-left mt-2 space-y-2">
              <span className="block text-[10px] text-neutral-450 font-black uppercase tracking-wider text-center leading-none">
                🚀 AI Studio Quick Sandbox Logins
              </span>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                <button
                  onClick={() => handleDemoAccess('student@edudocs.ai')}
                  className="bg-white border-2 border-black rounded-lg p-1 hover:bg-[#00c060] hover:text-white text-black block transition-all font-black cursor-pointer"
                >
                  🏫 Student
                </button>
                <button
                  onClick={() => handleDemoAccess('lecturer@edudocs.ai')}
                  className="bg-white border-2 border-black rounded-lg p-1 hover:bg-[#00c060] hover:text-white text-black block transition-all font-black cursor-pointer"
                >
                  🎓 Faculty
                </button>
                <button
                  onClick={() => handleDemoAccess('admin@edudocs.ai')}
                  className="bg-black text-[#00c060] border-2 border-black rounded-lg p-1 hover:bg-neutral-800 block transition-all font-black cursor-pointer"
                >
                  ⚙️ Admin
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 💳 MODAL: BILLING & CHECKOUT (INVOICE LIGHTBOX) */}
      {paymentModalOpen && (
        <div className="fixed inset-0 bg-neutral-900/65 backdrop-blur-xs z-50 flex items-center justify-center p-4 text-left">
          <div className="bg-white rounded-2xl border-2 border-black max-w-sm w-full p-6 space-y-5 animate-fade-in relative animate-fade-in">
            <button 
              onClick={() => setPaymentModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-full text-black hover:bg-neutral-100 border-2 border-transparent hover:border-black transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1">
              <Lock className="w-10 h-10 text-[#00c060] mx-auto mb-2" />
              <h2 className="text-xl font-black text-black uppercase font-display">Secure Invoicing</h2>
              <p className="text-xs text-neutral-400 font-semibold leading-relaxed">Unlock official copy PDF, completely stripped of draft blur watermarks.</p>
            </div>

            {currentDocument && selectedCategory && (
              <div className="bg-neutral-50 p-4 border-2 border-black rounded-xl space-y-3 font-sans text-xs text-black leading-loose">
                <div className="flex justify-between font-black border-b-2 border-black pb-1.5 leading-none">
                  <span>Document Draft:</span>
                  <span className="text-neutral-900 uppercase font-display">{selectedCategory.id}</span>
                </div>
                <div className="flex justify-between leading-none mt-1 font-semibold">
                  <span>Draft Title:</span>
                  <span className="font-extrabold truncate max-w-[150px]">{currentDocument.title}</span>
                </div>
                <div className="flex justify-between font-black text-black leading-none mt-1 pt-1.5 border-t-2 border-dashed border-neutral-300">
                  <span>Locking Fee:</span>
                  <span className="text-[#00c060]">₦{selectedCategory.priceNGN.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Wallet vs card select */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Select Checkout Gateway</h4>
              <div className="grid grid-cols-2 gap-3 text-center">
                <button
                  onClick={() => setSelectedGateway('paystack')}
                  className={`border-2 border-black rounded-xl p-3 text-xs font-black uppercase tracking-wide flex flex-col items-center justify-center space-y-1.5 transition-all cursor-pointer ${
                    selectedGateway === 'paystack' 
                      ? 'bg-[#00c060] text-white' 
                      : 'bg-white hover:bg-neutral-50 text-neutral-500'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Card / Paystack</span>
                </button>

                <button
                  onClick={handleWalletPay}
                  disabled={walletPaying}
                  className="border-2 border-black rounded-xl p-3 text-xs font-black uppercase tracking-widest flex flex-col items-center justify-center space-y-1.5 bg-black text-white hover:text-[#00c060] transition-all cursor-pointer"
                >
                  {walletPaying ? (
                    <RefreshCw className="w-5 h-5 animate-spin text-[#00c060]" />
                  ) : (
                    <Coins className="w-5 h-5 text-[#00c060] animate-pulse" />
                  )}
                  <span>Pay with Wallet</span>
                </button>
              </div>
            </div>

            <button
              onClick={initialTransactionCheckout}
              className="w-full bg-[#00c060] hover:bg-[#00a352] text-white border-2 border-black font-black text-xs uppercase py-3 rounded-xl tracking-wider cursor-pointer"
            >
              Verify & Initial Card Checkout
            </button>
          </div>
        </div>
      )}

      {/* 📟 Simulated Paystack inline sandbox popup */}
      {simulatedCheckoutOpen && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-xs z-[60] flex items-center justify-center p-4 text-left">
          <div className="bg-[#0c0c0c] text-white rounded-2xl border-2 border-white shadow-2xl max-w-sm w-full p-6 space-y-5 animate-fade-in relative z-50">
            <button 
              onClick={() => setSimulatedCheckoutOpen(false)}
              className="absolute right-4 top-4 p-1 rounded-full text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <div className="bg-[#00c060]/10 text-[#00c060] p-2.5 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2 border border-[#00c060]/30">
                <CreditCard className="w-6 h-6" />
              </div>
              <h2 className="text-md font-black text-white tracking-tight uppercase flex items-center justify-center gap-1 font-display">
                <span>Paystack Sandboxed Checkout</span>
              </h2>
              <p className="text-[10px] text-neutral-400 font-mono tracking-wider text-center">SECURE SANDBOX PORTAL &bull; REF: {simulatedRef}</p>
            </div>

            <div className="bg-[#161616] border border-neutral-800 p-3 rounded-xl text-[11px] leading-relaxed font-mono text-neutral-300">
              <div className="flex justify-between">
                <span>Billing merchant:</span>
                <span className="text-white font-bold">DocMint Ltd</span>
              </div>
              <div className="flex justify-between border-t border-neutral-800 pt-1.5 mt-1.5 font-black text-[#00c060] text-xs">
                <span>Amount:</span>
                <span>₦{selectedCategory?.priceNGN.toLocaleString()} NGN</span>
              </div>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase text-neutral-400 font-bold leading-none">Dummy Credit/Debit card number</label>
                <input
                  type="text"
                  maxLength={19}
                  className="w-full bg-[#1e1e1e] border border-neutral-800 rounded-lg p-2 text-sm text-neutral-200 font-mono placeholder-neutral-600 focus:outline-none focus:border-[#00c060]"
                  placeholder="4000 1234 5678 9010"
                  value={simulatedCardNumber}
                  onChange={(e) => setSimulatedCardNumber(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase text-neutral-400 font-bold leading-none">Card expiry date</label>
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="12/28"
                    className="w-full bg-[#1e1e1e] border border-neutral-800 rounded-lg p-2 text-sm text-neutral-200 font-mono placeholder-neutral-600 focus:outline-none focus:border-[#00c060]"
                    value={simulatedCardExpiry}
                    onChange={(e) => setSimulatedCardExpiry(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase text-neutral-400 font-bold leading-none">Card CVV / Exp</label>
                  <input
                    type="password"
                    maxLength={3}
                    placeholder="***"
                    className="w-full bg-[#1e1e1e] border border-neutral-800 rounded-lg p-2 text-sm text-neutral-200 font-mono placeholder-neutral-600 focus:outline-none focus:border-[#00c060]"
                    value={simulatedCardCvv}
                    onChange={(e) => setSimulatedCardCvv(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-[#1a1408] border border-yellow-500/10 text-yellow-500 p-2 text-[10px] rounded-lg italic">
                ℹ️ Sandbox notice: Simulate checkout success/failure on other cards using sandbox keys.
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-850">
                <button
                  onClick={() => handleFinishCreditSimulator('success')}
                  disabled={simulatingPayment}
                  className="bg-[#00c060] hover:bg-[#00a352] text-white font-black py-2.5 rounded-xl text-xs uppercase cursor-pointer"
                >
                  Confirm Success
                </button>
                <button
                  onClick={() => handleFinishCreditSimulator('failed')}
                  disabled={simulatingPayment}
                  className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold py-2.5 rounded-xl text-xs uppercase cursor-pointer"
                >
                  Decline (Cancel)
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
