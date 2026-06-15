import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { ServerDB } from './src/server-db.js';
import { User, GeneratedDocument, DocumentCategory, PaymentRecord, SampleResearchTemplate } from './src/types.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Initialize server database
  const db = await ServerDB.getInstance();

  // Initialize Gemini client safely
  let ai: GoogleGenAI | null = null;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (geminiKey && geminiKey !== 'MY_GEMINI_API_KEY' && geminiKey.trim() !== '') {
    try {
      ai = new GoogleGenAI({
        apiKey: geminiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      console.log('Gemini AI Client successfully initialized via process.env.GEMINI_API_KEY');
    } catch (e) {
      console.error('Failed to instantiate GoogleGenAI:', e);
    }
  } else {
    console.log('No GEMINI_API_KEY set or is using placeholder. Graceful local template engine will act as fallback.');
  }

  // Middleware to authenticate user by custom header
  // Client-side will send: Authorization: Bearer <userId>
  app.use(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const userId = authHeader.split('Bearer ')[1]?.trim();
      if (userId) {
        const users = await db.getUsers();
        const user = users.find(u => u.id === userId);
        if (user) {
          (req as any).user = user;
        }
      }
    }
    next();
  });

  // Auth API
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { name, email, phone, password, institution, department, matricNo, userType } = req.body;
      if (!name || !email || !phone) {
        return res.status(400).json({ error: 'Name, Email and Phone Number are required.' });
      }

      const existing = await db.getUserByEmail(email);
      if (existing) {
        return res.status(400).json({ error: 'A user with this email already exists.' });
      }

      const newUser: User = {
        id: 'u_' + Math.random().toString(36).substr(2, 9),
        name,
        email: email.toLowerCase().trim(),
        phone,
        role: 'user',
        verified: false, // will require verification simulation
        walletBalance: 2500, // Preloaded balance for student actions
        createdAt: new Date().toISOString(),
        institution: institution || '',
        department: department || '',
        matricNo: matricNo || '',
        userType: userType || 'general'
      };

      await db.saveUser(newUser);
      res.json({ user: newUser, token: newUser.id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
      }

      const user = await db.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials. User not found.' });
      }

      if (user.walletBalance === undefined) {
        user.walletBalance = 2500;
        await db.saveUser(user);
      }

      res.json({ user, token: user.id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/auth/verify', async (req, res) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthenticated.' });
    }
    user.verified = true;
    if (user.walletBalance === undefined) {
      user.walletBalance = 2500;
    }
    await db.saveUser(user);
    res.json({ message: 'Email verified successfully!', user });
  });

  app.get('/api/auth/me', async (req, res) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthenticated.' });
    }
    if (user.walletBalance === undefined) {
      user.walletBalance = 2500;
      await db.saveUser(user);
    }
    res.json({ user });
  });

  // Categories API
  app.get('/api/categories', async (req, res) => {
    const categories = await db.getCategories();
    res.json(categories);
  });

  app.post('/api/categories', async (req, res) => {
    const user = (req as any).user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin permissions required.' });
    }
    try {
      const category: DocumentCategory = req.body;
      if (!category.id || !category.name) {
        return res.status(400).json({ error: 'Category ID and Name are required.' });
      }
      const updated = await db.saveCategory(category);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/categories/:id', async (req, res) => {
    const user = (req as any).user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin permissions required.' });
    }
    const success = await db.deleteCategory(req.params.id);
    res.json({ success });
  });

  // Research Templates API
  app.get('/api/research/templates', async (req, res) => {
    const templates = await db.getResearchTemplates();
    res.json(templates);
  });

  app.post('/api/research/templates', async (req, res) => {
    const user = (req as any).user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin permissions required.' });
    }
    try {
      const template: SampleResearchTemplate = {
        id: req.body.id || 'tpl_' + Math.random().toString(36).substr(2, 9),
        categoryId: req.body.categoryId,
        title: req.body.title,
        organization: req.body.organization,
        rawText: req.body.rawText,
        structureAnalysis: req.body.structureAnalysis,
        createdAt: new Date().toISOString()
      };
      const updated = await db.saveResearchTemplate(template);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/research/templates/:id', async (req, res) => {
    const user = (req as any).user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin permissions required.' });
    }
    const success = await db.deleteResearchTemplate(req.params.id);
    res.json({ success });
  });

  // Payments List List API
  app.get('/api/payments/history', async (req, res) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthenticated.' });
    }
    const payments = await db.getPayments();
    if (user.role === 'admin') {
      res.json(payments);
    } else {
      res.json(payments.filter(p => p.userId === user.id));
    }
  });

  // Documents API
  app.get('/api/documents', async (req, res) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthenticated.' });
    }
    const docs = await db.getDocuments();
    if (user.role === 'admin') {
      res.json(docs);
    } else {
      res.json(docs.filter(d => d.userId === user.id));
    }
  });

  app.get('/api/documents/:id', async (req, res) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthenticated.' });
    }
    const doc = await db.getDocumentById(req.params.id);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found.' });
    }
    if (user.role !== 'admin' && doc.userId !== user.id) {
      return res.status(403).json({ error: 'Unauthorized.' });
    }
    res.json(doc);
  });

  // AI Document Generator Endpoint
  app.post('/api/documents/generate-preview', async (req, res) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthenticated.' });
    }

    const {
      categoryId,
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
      signerTitle,
    } = req.body;

    if (!categoryId || !inputs) {
      return res.status(400).json({ error: 'Category ID and input fields values are required.' });
    }

    const categories = await db.getCategories();
    const category = categories.find(c => c.id === categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Document category not found.' });
    }

    // Prepare inputs substitution for prompt or fallback
    let systemInstruction = 'You are DocMint, a premium educational & administrative document generating assistant. You draft extremely brief, direct, and straight-to-the-point letters (usually max 2-3 concise paragraphs of letter body). DO NOT generate long-winded paragraphs. DO NOT use markdown bold tags/asterisks (such as * or **) to bold text or build lists. Do NOT generate forged academic certs or government IDs. Provide ONLY the polished letter body with placeholder address lines if none supplied.';
    const systemPrompts = await db.getSystemPrompts();
    if (systemPrompts?.systemInstruction) {
      systemInstruction = systemPrompts.systemInstruction + ' ALWAYS keep the output brief, concise, straight to the point (maximum 2 to 3 short paragraphs), and NEVER use markdown bold tags/asterisks (* or **).';
    }

    // Build user prompt
    let userPrompt = `Draft a professionally formatted educational/administrative letter based on the following parameters:\n`;
    userPrompt += `DOCUMENT TYPE: ${category.name}\n`;
    userPrompt += `DESCRIPTION: ${category.description}\n\n`;
    userPrompt += `USER SUPPLIED FIELD VALUES:\n`;
    for (const [key, val] of Object.entries(inputs)) {
      userPrompt += `- ${key}: ${val}\n`;
    }
    userPrompt += `\nSPECIAL DIRECTIVE: ${category.aiPromptTemplate}\n\n`;
    userPrompt += `GUIDELINES FOR OUTPUT:\n`;
    userPrompt += `1. Follow premium professional formatting.\n`;
    userPrompt += `2. Ensure correct grammar, perfect tone, and official vocabulary.\n`;
    userPrompt += `3. Include clear paragraph structures. Avoid conversational preambles outside the letter. Only generate the letter text itself inside a clear markdown or text interface.\n`;
    userPrompt += `4. Keep it strictly compliant. Do not issue a fake certificate of qualification or credentials. Write it as an attestation, request, consent, reference, or introduction letter.\n`;
    userPrompt += `5. VERY IMPORTANT: Keep the letter brief and straight to the point. Long-winded essays will be rejected. Output maximum 2 to 3 concise, extremely powerful yet simple paragraphs.\n`;
    userPrompt += `6. DO NOT use asterisks (*) or (**), bolding formatting, or bullet points with asterisks. Just output beautifully spaced text.`;

    let generatedContentText = '';
    let isAIGenerated = false;

    if (ai) {
      try {
        console.log(`Querying Gemini (gemini-3.5-flash) for letter generation...`);
        const aiResponse = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: userPrompt,
          config: {
            systemInstruction
          }
        });
        if (aiResponse && aiResponse.text) {
          // Sanitize any raw or bold asterisks generated by the model
          generatedContentText = aiResponse.text.replace(/\*/g, '');
          isAIGenerated = true;
        }
      } catch (err) {
        console.error('Gemini call errored out, entering fallback mode:', err);
      }
    }

    if (!generatedContentText) {
      // Fallback rule-based template filler
      console.log('Generating letter via deterministic local regex rendering (no active AI Key or connection)');
      let text = category.samplePreview || `Dear Sir,\n\nThis is a student letter regarding ${category.name}.`;
      
      // Category-specific precise substitutions
      if (categoryId === 'church-attestation') {
        const church = String(inputs.churchName || 'REDEEMED CHRISTIAN CHURCH OF GOD');
        const address = String(inputs.churchAddress || 'Grace Sanctuary, Lagos');
        const pastor = String(inputs.pastorName || 'Pastor Enoch Adeboye');
        const title = String(inputs.pastorTitle || 'Resident Pastor');
        const member = String(inputs.memberFullName || 'JOHN CHIDI OBI');
        const duration = String(inputs.durationOfMembership || '5 years');
        const activities = String(inputs.churchActivities || 'choir department and youth fellowship');
        
        const firstSpaceIdx = member.trim().indexOf(' ');
        const memberFirst = firstSpaceIdx > -1 ? member.trim().substring(0, firstSpaceIdx) : member;

        text = text
          .replace(/REDEEMED CHRISTIAN CHURCH OF GOD/gi, church)
          .replace(/Grace Sanctuary, Lagos/gi, address)
          .replace(/JOHN CHIDI OBI/gi, member)
          .replace(/John Chidi Obi/gi, member)
          .replace(/John is a committed member of our choir department/gi, `${memberFirst} is a committed member of our ${activities}`)
          .replace(/choir department and serves diligently in the youth fellowship/gi, activities)
          .replace(/5 years/gi, duration)
          .replace(/Pastor Enoch Adeboye/gi, pastor)
          .replace(/Resident Pastor/gi, title);
      } else if (categoryId === 'siwes-completion') {
        const company = String(inputs.companyName || 'CHEVRON NIGERIA LIMITED');
        const supervisor = String(inputs.supervisorName || 'Engr. Tunde Bakare');
        const title = String(inputs.supervisorTitle || 'Lead Systems Engineer');
        const student = String(inputs.studentName || 'AMINA YUSUF');
        const matric = String(inputs.matricNo || 'ENG/2021/045');
        const inst = String(inputs.institutionName || 'Federal University of Technology, Minna');
        const dept = String(inputs.department || 'Mechanical Engineering');
        const start = String(inputs.startDate || 'January 3, 2026');
        const end = String(inputs.endDate || 'June 12, 2026');

        text = text
          .replace(/CHEVRON NIGERIA LIMITED/gi, company)
          .replace(/Engr\. Tunde Bakare/gi, supervisor)
          .replace(/Lead Systems Engineer/gi, title)
          .replace(/AMINA YUSUF/gi, student)
          .replace(/Amina Yusuf/gi, student)
          .replace(/ENG\/2021\/045/gi, matric)
          .replace(/Federal University of Technology, Minna/gi, inst)
          .replace(/Mechanical Engineering/gi, dept)
          .replace(/January 3, 2026/gi, start)
          .replace(/June 12, 2026/gi, end);
      } else if (categoryId === 'internship-discharge') {
        const company = String(inputs.companyName || 'Flutterwave Technologies');
        const internName = String(inputs.internName || inputs.studentName || 'David Alao');
        const duration = String(inputs.duration || '3 Months');
        const role = String(inputs.role || 'Frontend Web Developer Intern');
        const supervisor = String(inputs.supervisorName || 'Chioma Adeleke');
        const title = String(inputs.supervisorTitle || 'Head of People & Culture');

        const firstSpaceIdx = internName.trim().indexOf(' ');
        const internFirst = firstSpaceIdx > -1 ? internName.trim().substring(0, firstSpaceIdx) : internName;

        text = text
          .replace(/FLUTTERWAVE TECHNOLOGIES/gi, company)
          .replace(/David Alao/gi, internName)
          .replace(/david/gi, internFirst)
          .replace(/3 Months/gi, duration)
          .replace(/Frontend Web Developer Intern/gi, role)
          .replace(/Chioma Adeleke/gi, supervisor)
          .replace(/Head of People & Culture/gi, title);
      } else {
        // Generic safe, strict-key-based fallback
        for (const [key, value] of Object.entries(inputs)) {
          const valStr = String(value);
          const regex = new RegExp(`\\{${key}\\}`, 'gi');
          text = text.replace(regex, valStr);

          if (key === 'memberFullName' || key === 'studentName' || key === 'childName' || key === 'fullName' || key === 'internName') {
            text = text.replace(/JOHN CHIDI OBI/gi, valStr);
            text = text.replace(/AMINA YUSUF/gi, valStr);
            text = text.replace(/DAVID ALAO/gi, valStr);
            text = text.replace(/CHARLES OKAFOR/gi, valStr);
            text = text.replace(/FATIMA IBRAHIM/gi, valStr);
            text = text.replace(/Victor James/gi, valStr);
            text = text.replace(/Kenneth Ndu/gi, valStr);
            text = text.replace(/Samuel Cole/gi, valStr);
            text = text.replace(/Ibrahim Babangida/gi, valStr);
          } else if (key === 'churchName' || key === 'companyName' || key === 'schoolName' || key === 'institutionName') {
            text = text.replace(/REDEEMED CHRISTIAN CHURCH OF GOD/gi, valStr);
            text = text.replace(/CHEVRON NIGERIA LIMITED/gi, valStr);
            text = text.replace(/FLUTTERWAVE TECHNOLOGIES/gi, valStr);
            text = text.replace(/UNIVERSITY OF LAGOS/gi, valStr);
            text = text.replace(/UNIVERSITY OF ILORIN/gi, valStr);
            text = text.replace(/STERLING BANK PLC/gi, valStr);
          } else if (key === 'pastorName' || key === 'supervisorName' || key === 'officerName' || key === 'registrarName') {
            text = text.replace(/Pastor Enoch Adeboye/gi, valStr);
            text = text.replace(/Engr\. Tunde Bakare/gi, valStr);
            text = text.replace(/Chioma Adeleke/gi, valStr);
            text = text.replace(/Prof\. Olayinka Adebayo/gi, valStr);
            text = text.replace(/Dr\. Chidi Nwosu/gi, valStr);
            text = text.replace(/Prof\. Sarah Alabi/gi, valStr);
          } else if (key === 'pastorTitle' || key === 'supervisorTitle' || key === 'officerTitle' || key === 'title') {
            text = text.replace(/Resident Pastor/gi, valStr);
            text = text.replace(/Lead Systems Engineer/gi, valStr);
            text = text.replace(/Head of People & Culture/gi, valStr);
          }
        }
      }
      
      generatedContentText = `[Deterministic Local Draft - AI is Offline]\n\n${text}\n\n*Note: This letter was assembled locally to facilitate offline operation because your Gemini API Key is loading or unset. Reconnect a valid secret key to generate rich deep AI phrasing.*`;
    }

    // Save document state as unpaid
    const docId = 'doc_' + Math.random().toString(36).substr(2, 9);
    const newDoc: GeneratedDocument = {
      id: docId,
      userId: user.id,
      userName: user.name,
      categoryId,
      categoryName: category.name,
      inputs,
      title: category.name,
      content: generatedContentText,
      letterheadName: letterheadName || '',
      letterheadAddress: letterheadAddress || '',
      letterheadLogo: letterheadLogo || '',
      watermarkLogo: watermarkLogo || '',
      letterheadLogoAlign: letterheadLogoAlign || 'center',
      watermarkLogoAlign: watermarkLogoAlign || 'center',
      letterheadTitleColor: letterheadTitleColor || '#111111',
      letterheadLineColor: letterheadLineColor || '#111111',
      letterheadLineStyle: letterheadLineStyle || 'double',
      designPatternStyle: designPatternStyle || 'standard-formal',
      letterheadTitleSize: letterheadTitleSize || 'md',
      addWatermark: !!addWatermark,
      addQrCode: !!addQrCode,
      addSignatureLine: !!addSignatureLine,
      signerName: signerName || '',
      signerTitle: signerTitle || '',
      paid: false, // Default is unpaid
      createdAt: new Date().toISOString()
    };

    await db.saveDocument(newDoc);
    res.json(newDoc);
  });

  // Checkout Payment System API (Paystack, Monnify, Flutterwave Simulation)
  app.post('/api/payments/initialize', async (req, res) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthenticated.' });
    }

    const { docId, gateway } = req.body;
    if (!docId || !gateway) {
      return res.status(400).json({ error: 'Document ID and Gateway (paystack, monnify, flutterwave) are required.' });
    }

    const doc = await db.getDocumentById(docId);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    const categories = await db.getCategories();
    const category = categories.find(c => c.id === doc.categoryId);
    const amount = category ? category.priceNGN : 2500;

    const reference = 'ED_' + Math.random().toString(36).substr(2, 10).toUpperCase();

    // Create a Payment Record in database, pending state
    const paymentRec: PaymentRecord = {
      id: 'pay_' + Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      categoryId: doc.categoryId,
      categoryName: doc.categoryName,
      amount,
      gateway,
      reference,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    await db.savePayment(paymentRec);

    // Return initialization configurations for mock gateway rendering
    res.json({
      paymentId: paymentRec.id,
      amount,
      currency: 'NGN',
      reference,
      gateway,
      customerEmail: user.email,
      customerPhone: user.phone
    });
  });

  app.post('/api/payments/verify', async (req, res) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthenticated.' });
    }

    const { reference, status, docId } = req.body;
    if (!reference || !status || !docId) {
      return res.status(400).json({ error: 'Reference, Verification Status, and Document ID are required.' });
    }

    const payments = await db.getPayments();
    const payment = payments.find(p => p.reference === reference);
    if (!payment) {
      return res.status(404).json({ error: 'Payment transaction reference not found.' });
    }

    // Update payment record
    payment.status = status === 'success' ? 'success' : 'failed';
    await db.savePayment(payment);

    // Update active document to PAID
    if (status === 'success') {
      const doc = await db.getDocumentById(docId);
      if (doc) {
        doc.paid = true;
        doc.paymentGateway = payment.gateway;
        doc.paymentRef = reference;
        await db.saveDocument(doc);
      }
    }

    res.json({ status: payment.status, payment });
  });

  // Wallet and Instant Wallet Payments API
  app.post('/api/wallet/topup', async (req, res) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthenticated.' });
    }
    const { amount } = req.body;
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required.' });
    }
    
    // Increment wallet balance
    user.walletBalance = (user.walletBalance || 0) + amount;
    await db.saveUser(user);

    // Create a Payment Record for Top-up
    const paymentRec: PaymentRecord = {
      id: 'pay_' + Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      categoryId: 'topup',
      categoryName: `Wallet Top-up ₦${amount.toLocaleString()}`,
      amount,
      gateway: 'monnify',
      reference: 'TOPUP_' + Math.random().toString(36).substr(2, 10).toUpperCase(),
      status: 'success',
      createdAt: new Date().toISOString()
    };
    await db.savePayment(paymentRec);

    res.json({ success: true, walletBalance: user.walletBalance, payment: paymentRec, user });
  });

  app.post('/api/payments/pay-with-wallet', async (req, res) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthenticated.' });
    }

    const { docId } = req.body;
    if (!docId) {
      return res.status(400).json({ error: 'Document ID is required.' });
    }

    const doc = await db.getDocumentById(docId);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    const categories = await db.getCategories();
    const category = categories.find(c => c.id === doc.categoryId);
    const amount = category ? category.priceNGN : 2500;

    const currentBalance = user.walletBalance || 0;
    if (currentBalance < amount) {
      return res.status(400).json({ error: `Insufficient wallet balance. You need ₦${amount.toLocaleString()} but only have ₦${currentBalance.toLocaleString()}.` });
    }

    // Deduct from wallet
    user.walletBalance = currentBalance - amount;
    await db.saveUser(user);

    // Create successful payment record
    const reference = 'WL_' + Math.random().toString(36).substr(2, 10).toUpperCase();
    const paymentRec: PaymentRecord = {
      id: 'pay_' + Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      categoryId: doc.categoryId,
      categoryName: doc.categoryName,
      amount,
      gateway: 'monnify',
      reference,
      status: 'success',
      createdAt: new Date().toISOString()
    };
    await db.savePayment(paymentRec);

    // Update document status
    doc.paid = true;
    doc.paymentGateway = 'monnify';
    doc.paymentRef = reference;
    await db.saveDocument(doc);

    res.json({ success: true, walletBalance: user.walletBalance, document: doc, payment: paymentRec });
  });

  // Admin Prompt and Settings API
  app.get('/api/admin/prompts', async (req, res) => {
    const user = (req as any).user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin permissions required.' });
    }
    const prompts = await db.getSystemPrompts();
    res.json(prompts);
  });

  app.post('/api/admin/prompts', async (req, res) => {
    const user = (req as any).user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin permissions required.' });
    }
    const { systemInstruction, pdfLetterheadInstructions } = req.body;
    const prompts = await db.updateSystemPrompts({ systemInstruction, pdfLetterheadInstructions });
    res.json(prompts);
  });

  app.get('/api/admin/stats', async (req, res) => {
    const user = (req as any).user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin permissions required.' });
    }
    const stats = await db.getAdminStats();
    res.json(stats);
  });

  // Vite development vs production serving logic
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DocMint Server running securely on http://localhost:${PORT}`);
  });
}

startServer().catch((e) => {
  console.error('Fatal server boot failure:', e);
});
