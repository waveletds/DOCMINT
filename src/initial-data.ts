import { DocumentCategory, SampleResearchTemplate } from './types.js';

export const INITIAL_CATEGORIES: DocumentCategory[] = [
  {
    id: 'church-attestation',
    name: 'Church Attestation Letter',
    description: 'Official letter from a church confirming a member’s active participation, good moral character, and spiritual standing.',
    priceNGN: 2500,
    templateStyle: 'classic',
    requiredFields: [
      { key: 'churchName', label: 'Church / Ministry Name', placeholder: 'e.g., Redeemed Christian Church of God', type: 'text', required: true },
      { key: 'pastorName', label: 'Pastor / Priest / Clergy Name', placeholder: 'e.g., Pastor Enoch Adeboye', type: 'text', required: true },
      { key: 'pastorTitle', label: 'Clergy Title', placeholder: 'e.g., Resident Pastor, Parish Priest', type: 'text', required: true },
      { key: 'memberFullName', label: 'Member Full Name', placeholder: 'e.g., John Chidi Obi', type: 'text', required: true },
      { key: 'durationOfMembership', label: 'Membership Duration', placeholder: 'e.g., 5 years, since January 2021', type: 'text', required: true },
      { key: 'churchActivities', label: 'Active Departments / Activities', placeholder: 'e.g., Choir member, youth fellowship coordinator', type: 'text', required: true },
      { key: 'recipientName', label: 'Recipient Name / Designation', placeholder: 'e.g., The HR Manager, Admission Officer', type: 'text', required: false },
      { key: 'recipientOrg', label: 'Recipient Organization Name', placeholder: 'e.g., Zenith Bank Plc, University of Ibadan', type: 'text', required: false }
    ],
    samplePreview: `REDEEMED CHRISTIAN CHURCH OF GOD\nGrace Sanctuary, Lagos\n\nDate: June 15, 2026\n\nTo Whom It May Concern,\n\nLETTER OF ATTESTATION FOR MR. JOHN CHIDI OBI\n\nI am writing to attest to the character and active participation of Mr. John Chidi Obi, who has been a dedicated member of our congregation for the past 5 years.\n\nJohn is a committed member of our choir department and serves diligently in the youth fellowship. Throughout his years in our parish, he has demonstrated high moral standards, integrity, and excellent leadership skills...\n\nYours faithfully,\n\n___________________\nPastor Enoch Adeboye\nResident Pastor`,
    aiPromptTemplate: 'Generate a professional church attestation letter. Emphasize the member’s spiritual growth, moral standing, and commitment to church activities like {churchActivities} at {churchName}. Signer is {pastorName}, who holds the title of {pastorTitle}. Reiterate that the applicant, {memberFullName}, is highly recommended.'
  },
  {
    id: 'siwes-completion',
    name: 'SIWES Completion Letter',
    description: 'An official discharge or completion letter for students who finished their Students Industrial Work Experience Scheme (SIWES IT).',
    priceNGN: 3000,
    templateStyle: 'executive',
    requiredFields: [
      { key: 'companyName', label: 'Company / Organization Name', placeholder: 'e.g., Chevron Nigeria Limited', type: 'text', required: true },
      { key: 'supervisorName', label: 'Industry Supervisor Name', placeholder: 'e.g., Engr. Tunde Bakare', type: 'text', required: true },
      { key: 'supervisorTitle', label: 'Supervisor Job Title', placeholder: 'e.g., Lead Systems Engineer', type: 'text', required: true },
      { key: 'studentName', label: 'Student Full Name', placeholder: 'e.g., Amina Yusuf', type: 'text', required: true },
      { key: 'matricNo', label: 'Matriculation / ID Number', placeholder: 'e.g., ENG/2021/045', type: 'text', required: true },
      { key: 'institutionName', label: 'University / Poly Name', placeholder: 'e.g., Federal University of Technology, Minna', type: 'text', required: true },
      { key: 'department', label: 'Department / Discipline', placeholder: 'e.g., Mechanical Engineering', type: 'text', required: true },
      { key: 'startDate', label: 'SIWES Start Date', placeholder: 'e.g., January 3, 2026', type: 'text', required: true },
      { key: 'endDate', label: 'SIWES End Date', placeholder: 'e.g., June 12, 2026', type: 'text', required: true }
    ],
    samplePreview: `CHEVRON NIGERIA LIMITED\n12 General Buhari Way, Lekki, Lagos\n\nDate: June 13, 2026\n\nThe Coordinator,\nSIWES Coordinating Unit,\nFederal University of Technology, Minna.\n\nDear Sir/Ma,\n\nSIWES COMPLETION LETTER FOR AMINA YUSUF (ENG/2021/045)\n\nWe hereby write to certify that Amina Yusuf, a student of Mechanical Engineering, completed her 6-month industrial attachment under the Students Industrial Work Experience Scheme (SIWES) at Chevron Nigeria Limited from January 3, 2026, to June 12, 2026.\n\nDuring her stay with us, she was placed under our Systems Engineering unit and showed exceptional dedication...\n\nYours faithfully,\n\n___________________\nEngr. Tunde Bakare\nLead Systems Engineer`,
    aiPromptTemplate: 'Write a professional SIWES Completion Letter certifying that {studentName} with Matric No {matricNo} from {institutionName} (Department of {department}) completed industrial training at {companyName} from {startDate} to {endDate}. The supervisor {supervisorName} ({supervisorTitle}) should praise the student’s work ethic, technical progress, and core projects completed.'
  },
  {
    id: 'internship-discharge',
    name: 'Internship Completion/Discharge Letter',
    description: 'Official document given to an intern upon successful completion of their internship program with an organization.',
    priceNGN: 2500,
    requiredFields: [
      { key: 'companyName', label: 'Company / Organization Name', placeholder: 'e.g., Flutterwave Technologies', type: 'text', required: true },
      { key: 'hrName', label: 'HR Manager / Manager Name', placeholder: 'e.g., Chioma Adeleke', type: 'text', required: true },
      { key: 'hrTitle', label: 'Manager Designation', placeholder: 'e.g., Head of People & Culture', type: 'text', required: true },
      { key: 'internName', label: 'Intern Name', placeholder: 'e.g., David Alao', type: 'text', required: true },
      { key: 'internRole', label: 'Intern Role / Department', placeholder: 'e.g., Frontend Web Developer Intern', type: 'text', required: true },
      { key: 'duration', label: 'Internship Duration (e.g., 3 Months)', placeholder: 'e.g., 3 Months (March - May 2026)', type: 'text', required: true },
      { key: 'contributions', label: 'Notable Achievements or Projects', placeholder: 'e.g., Rebuilt the primary dashboard user interface, fixed responsive bugs', type: 'textarea', required: false }
    ],
    samplePreview: `FLUTTERWAVE TECHNOLOGIES\nLagos, Nigeria\n\nTo Whom It May Concern,\n\nLETTER OF INTERNSHIP DISCHARGE & RECOMMENDATION\n\nThis is to certify that David Alao worked as a Frontend Web Developer Intern at Flutterwave Technologies for a period of 3 Months...\n\nDuring his internship, David contributed actively to our core team in rebuilding the primary dashboard UI...\n\nSincerely,\n\n___________________\nChioma Adeleke\nHead of People & Culture`,
    aiPromptTemplate: 'Generate an internship completion letter from {companyName} signed by {hrName} ({hrTitle}) certifying that {internName} successfully concluded their internship as a {internRole} for {duration}. Mention the notable contributions: {contributions}.'
  },
  {
    id: 'student-intro',
    name: 'Student Introduction Letter',
    description: 'Letter written by a school/institution introducing a student to a third party (e.g., for research, visa application, or industrial studies).',
    priceNGN: 2500,
    requiredFields: [
      { key: 'schoolName', label: 'School Name', placeholder: 'e.g., University of Lagos', type: 'text', required: true },
      { key: 'schoolOfficerName', label: 'Registrar / Dean Name', placeholder: 'e.g., Prof. Olayinka Adebayo', type: 'text', required: true },
      { key: 'schoolOfficerTitle', label: 'Officer Designation', placeholder: 'e.g., Dean of Student Affairs', type: 'text', required: true },
      { key: 'studentName', label: 'Student Full Name', placeholder: 'e.g., Charles Okafor', type: 'text', required: true },
      { key: 'matricNo', label: 'Matriculation / Reg Number', placeholder: 'e.g., 180405112', type: 'text', required: true },
      { key: 'level', label: 'Current Level/Year of Study', placeholder: 'e.g., 400 Level (Final Year)', type: 'text', required: true },
      { key: 'department', label: 'Department / Course of Study', placeholder: 'e.g., Sociology', type: 'text', required: true },
      { key: 'purpose', label: 'Purpose of Introduction', placeholder: 'e.g., Fieldwork research on metropolitan transport systems at Lagos State Transit Authority', type: 'textarea', required: true }
    ],
    samplePreview: `UNIVERSITY OF LAGOS\nOffice of the Dean of Student Affairs\n\nDate: June 13, 2026\n\nTo Whom It May Concern,\n\nLETTER OF INTRODUCTION: CHARLES OKAFOR (180405112)\n\nWe write to introduce the bearer, Charles Okafor, a bona fide final year student of the Department of Sociology, University of Lagos...\n\nHe is conducting historical academic fieldwork as part of his research requirements. We would appreciate any assistance and access granted to him...\n\nDean of Student Affairs\nProf. Olayinka Adebayo`,
    aiPromptTemplate: 'Draft a Student Introduction Letter from {schoolName} signed by {schoolOfficerName} ({schoolOfficerTitle}). Introduce {studentName}, matriculation number {matricNo}, a student in {department} ({level}). Explain that the purpose is: {purpose}. Request that the recipient accord them necessary assistance cooperation.'
  },
  {
    id: 'character-ref',
    name: 'Character Reference Letter',
    description: 'Personal or educational testimony from a lecturer, community leader, or mentor attesting to an applicant’s moral standing and qualities.',
    priceNGN: 2000,
    requiredFields: [
      { key: 'refereeName', label: 'Referee Full Name', placeholder: 'e.g., Dr. Chidi Nwosu', type: 'text', required: true },
      { key: 'refereeTitle', label: 'Referee Title/Organization', placeholder: 'e.g., Senior Lecturer, Department of History', type: 'text', required: true },
      { key: 'applicantName', label: 'Applicant Full Name', placeholder: 'e.g., Fatima Ibrahim', type: 'text', required: true },
      { key: 'durationKnown', label: 'How long have you known them?', placeholder: 'e.g., 4 years, since 2022', type: 'text', required: true },
      { key: 'relationship', label: 'Relationship to Applicant', placeholder: 'e.g., Academic adviser, former boss, mentor', type: 'text', required: true },
      { key: 'qualities', label: 'Applicant Key Integrity Qualities', placeholder: 'e.g., Honesty, exceptional leadership in student union, highly level headed', type: 'textarea', required: true },
      { key: 'recipientInfo', label: 'Recipient Name & Address (Optional)', placeholder: 'e.g., Postgraduate Admissions Board, University of Ghana', type: 'textarea', required: false }
    ],
    samplePreview: `Date: June 13, 2026\n\nTo Whom It May Concern,\n\nCHARACTER REFERENCE FOR FATIMA IBRAHIM\n\nI am writing to provide my highest personal recommendation and character reference for Fatima Ibrahim. I have known Fatima for the past 4 years in my capacity as her Academic adviser.\n\nFatima has consistently shown herself to be an individual of sound character, displaying honesty, exceptional leadership in student union, highly level headed...\n\nSincerely,\n\n___________________\nDr. Chidi Nwosu\nSenior Lecturer, Department of History`,
    aiPromptTemplate: 'Generate a brilliant and sincere Character Reference Letter. Referee is {refereeName} ({refereeTitle}), writing in reference to {applicantName}. They have known the applicant for {durationKnown} as a {relationship}. Discuss their positive qualities such as {qualities} in rich detail.'
  },
  {
    id: 'academic-rec',
    name: 'Academic Recommendation Letter',
    description: 'Formal academic endorsement from a professor or head of department for admission, scholarship, or study abroad.',
    priceNGN: 3500,
    requiredFields: [
      { key: 'professorName', label: 'Professor/Lecturer Name', placeholder: 'e.g., Prof. Sarah Alabi', type: 'text', required: true },
      { key: 'professorTitle', label: 'Academic Designation', placeholder: 'e.g., Professor of Biochemistry & Head of Department', type: 'text', required: true },
      { key: 'university', label: 'University / College Name', placeholder: 'e.g., University of Ilorin', type: 'text', required: true },
      { key: 'studentName', label: 'Student Full Name', placeholder: 'e.g., Victor James', type: 'text', required: true },
      { key: 'studentGrade', label: 'Student Core Grades / GPA Performance', placeholder: 'e.g., First Class Honours (CGPA of 4.82/5.0)', type: 'text', required: true },
      { key: 'targetProgram', label: 'Target Program / Award', placeholder: 'e.g., MSc in Molecular Biology at Oxford University', type: 'text', required: true },
      { key: 'academicStrengths', label: 'Key Academic Strengths', placeholder: 'e.g., Resourceful lab assistant, amazing thesis defense on plant DNA splicing', type: 'textarea', required: true }
    ],
    samplePreview: `UNIVERSITY OF ILORIN\nDepartment of Biochemistry\n\nDate: June 13, 2026\n\nDear Admissions Committee,\n\nACADEMIC RECOMMENDATION LETTER: VICTOR JAMES\n\nI write to offer my enthusiastic recommendation for Victor James, who is applying for the MSc in Molecular Biology at Oxford University...\n\nVictor finished with a First Class Honours (CGPA of 4.82/5.0). His performance in my advanced biochemistry lab classes was exceptional, demonstrating that he is a resourceful lab assistant, and delivered an amazing thesis defense...\n\nSincerely,\n\nProf. Sarah Alabi\nProfessor of Biochemistry & Head of Department`,
    aiPromptTemplate: 'Write an Academic Recommendation Letter promoting {studentName} for the {targetProgram}. The letter is from {professorName} ({professorTitle}) at {university}. Focus on academic excellence: {studentGrade} and specific strengths/achievements: {academicStrengths}. Keep the language elite and scholarly.'
  },
  {
    id: 'scholarship-app',
    name: 'Scholarship Application Letter',
    description: 'A compelling application or cover letter written by a student to apply for educational funding programs or grants.',
    priceNGN: 2000,
    requiredFields: [
      { key: 'studentName', label: 'Your Full Name', placeholder: 'e.g., Tolani Abiodun', type: 'text', required: true },
      { key: 'studentEmail', label: 'Your Email Address', placeholder: 'e.g., tolani@example.com', type: 'text', required: true },
      { key: 'scholarshipName', label: 'Scholarship / Grant Title', placeholder: 'e.g., MTN Foundation Science & Technology Scholarship', type: 'text', required: true },
      { key: 'academicGoals', label: 'Academic & Career Goals', placeholder: 'e.g., To complete a degree in Artificial Intelligence and develop agricultural tech for West African farms', type: 'textarea', required: true },
      { key: 'financialNeed', label: 'Why do you need this scholarship?', placeholder: 'e.g., Coming from a low-income family with retired parents, paying university tuition is extremely challenging', type: 'textarea', required: true },
      { key: 'academicMerits', label: 'Academic Merits & High school results', placeholder: 'e.g., 320 in JAMB, straight As in WAEC mathematics and physics', type: 'textarea', required: true }
    ],
    samplePreview: `Tolani Abiodun\ntolani@example.com\nLagos, Nigeria\n\nTo the Scholarship Committee,\n\nAPPLICATION FOR THE MTN FOUNDATION SCIENCE & TECHNOLOGY SCHOLARSHIP\n\nI am writing to express my eager interest in applying for the prestigious MTN Foundation Science & Technology Scholarship. I believe that my academic record and professional ambitions align directly with the objectives of your program...\n\nMy goals include to complete a degree in Artificial Intelligence and develop agricultural tech for West African farms. Coming from a low-income background, this funding is essential...\n\nSincerely,\n\nTolani Abiodun`,
    aiPromptTemplate: 'Generate a highly compelling Scholarship Application Letter for {studentName} applying for the {scholarshipName}. Incorporate their career goals: {academicGoals}, explain financial hardship respectfully: {financialNeed}, and list academic accomplishments: {academicMerits}. Do not sound overly dramatic but rather resilient, ambitious, and well-organized.'
  },
  {
    id: 'nysc-request',
    name: 'NYSC Request Letter',
    description: 'Official correspondence written regarding National Youth Service Corps (NYSC) deployments, relocations, or request for corps members.',
    priceNGN: 3000,
    requiredFields: [
      { key: 'writerRole', label: 'Who is writing?', placeholder: 'e.g., The Principal, Resident Doctor, Managing Director', type: 'text', required: true },
      { key: 'writerName', label: 'Your Name / Signer Name', placeholder: 'e.g., Chief Dr. Adekunle Johnson', type: 'text', required: true },
      { key: 'organizationName', label: 'Organization / Institution Name', placeholder: 'e.g., Model College Lekki', type: 'text', required: true },
      { key: 'requestType', label: 'Request Type', placeholder: 'e.g., Request for Deployment of Corps Members (Math and English Teachers)', type: 'text', required: true },
      { key: 'nyscState', label: 'NYSC State Secretariat Address', placeholder: 'e.g., NYSC State Coordinator, Surulere, Lagos State', type: 'textarea', required: true },
      { key: 'specificRequirements', label: 'Specific Requirements / Perks offered', placeholder: 'e.g., Seeking 2 English teachers, accommodation of 1-bedroom flat will be provided with N15,000 monthly stipend', type: 'textarea', required: true }
    ],
    samplePreview: `MODEL COLLEGE LEKKI\nLekki Expressway, Lagos\n\nDate: June 13, 2026\n\nThe NYSC State Coordinator,\nSurulere, Lagos State.\n\nDear Sir,\n\nREQUEST FOR THE DEPLOYMENT OF CORPS MEMBERS TO MODEL COLLEGE LEKKI\n\nWe hereby write to request the deployment of Corps Members for secondary educational tutoring during the upcoming batch...\n\nSpecifically, we are in need of instructors for Mathematics and English. To facilitate their service, we guarantee N15,000 monthly stipend and suitable housing accommodation...\n\nYours faithfully,\n\nChief Dr. Adekunle Johnson\nPrincipal`,
    aiPromptTemplate: 'Draft an NYSC Request Letter for {organizationName} signed by {writerName} ({writerRole}). Type of request is {requestType}. Target coordinates: {nyscState}. Incorporate key benefits and parameters: {specificRequirements}. Ensure standard organizational letter format.'
  },
  {
    id: 'admission-appeal',
    name: 'Admission Appeal Letter',
    description: 'Formal letter written by a student appealing a negative admission decision or requesting special case reconsideration.',
    priceNGN: 2500,
    requiredFields: [
      { key: 'studentName', label: 'Applicant Name', placeholder: 'e.g., Fatima Bello', type: 'text', required: true },
      { key: 'applicationRef', label: 'Application ID / Reference', placeholder: 'e.g., APP-2026-904', type: 'text', required: true },
      { key: 'universityName', label: 'Target University Name', placeholder: 'e.g., University of Benin', type: 'text', required: true },
      { key: 'targetCourse', label: 'Intended Course of Study', placeholder: 'e.g., Bachelor of Law (LL.B)', type: 'text', required: true },
      { key: 'reasonsForAppeal', label: 'Reasons & New Facts for Appeal', placeholder: 'e.g., Miscalculation of UTME JAMB cutoffs, latest WAEC high-grade results came late, exceptional community service record', type: 'textarea', required: true }
    ],
    samplePreview: `Fatima Bello\nLagos, Nigeria\n\nDate: June 13, 2026\n\nThe Chairman,\nAdmissions Committee,\nUniversity of Benin.\n\nDear Sir/Ma,\n\nADMISSION APPEAL LETTER: FATIMA BELLO (APP-2026-904) FOR LAW\n\nI am writing to formally appeal the recent decision concerning my admission application to study Bachelor of Law (LL.B) at the University of Benin...\n\nWhile I appreciate the extensive selection process, I would love the board to review new developments, particularly that my corrected WAEC score transcript was delayed...\n\nSincerely,\n\nFatima Bello`,
    aiPromptTemplate: 'Generate an Admission Appeal Letter for student {studentName} with Reference {applicationRef} seeking {targetCourse} at {universityName}. Elaborate on the core grounds for appeal: {reasonsForAppeal}. Maintain a respectful, humble, and persuasive administrative tone.'
  },
  {
    id: 'transfer-request',
    name: 'Transfer Request Letter',
    description: 'Formal letter requesting a transfer from one department, campus, or course to another within an academic institution.',
    priceNGN: 2000,
    requiredFields: [
      { key: 'studentName', label: 'Your Name', placeholder: 'e.g., Kenneth Ndu', type: 'text', required: true },
      { key: 'matricNo', label: 'Matriculation Number', placeholder: 'e.g., RUN/CSC/22/1004', type: 'text', required: true },
      { key: 'schoolName', label: 'University / College Name', placeholder: 'e.g., Redeemer’s University', type: 'text', required: true },
      { key: 'currentDept', label: 'Current Department', placeholder: 'e.g., Department of Physics', type: 'text', required: true },
      { key: 'targetDept', label: 'Target Transfer Department', placeholder: 'e.g., Department of Computer Science', type: 'text', required: true },
      { key: 'reasonsForTransfer', label: 'Reasons for seeking transfer', placeholder: 'e.g., Excelling in software algorithms classes, clear alignment with my future focus in cloud databases, CGPA is well above requirement', type: 'textarea', required: true }
    ],
    samplePreview: `RUN/CSC/22/1004\nRedeemer’s University\n\nThe Registrar,\nRedeemer’s University.\n\nDear Sir,\n\nAPPLICATION FOR DEPARTMENTAL TRANSFER: PHY TO CSC\n\nI, Kenneth Ndu, a 200Level student in the Department of Physics, hereby apply for a formal transfer to the Department of Computer Science...\n\nI believe my academic performance, particularly my programming classes, confirms my strong compatibility with Computer Science...\n\nSincerely,\n\nKenneth Ndu`,
    aiPromptTemplate: 'Draft a departmental transfer request letter for {studentName} (Matric: {matricNo}) at {schoolName}, moving from {currentDept} to {targetDept}. Focus on academic alignment, specific career passion, and performance metrics: {reasonsForTransfer}.'
  },
  {
    id: 'parent-consent',
    name: 'Parent Consent Letter',
    description: 'Letter signed by a parent/guardian providing authorization for their child to participate in local/foreign study tours, excursions, or events.',
    priceNGN: 1500,
    requiredFields: [
      { key: 'parentName', label: 'Parent / Guardian Full Name', placeholder: 'e.g., Dr. & Mrs. Kolawole Cole', type: 'text', required: true },
      { key: 'childName', label: 'Child / Student Full Name', placeholder: 'e.g., Samuel Cole', type: 'text', required: true },
      { key: 'schoolName', label: 'School Name / Organizer', placeholder: 'e.g., Corona Secondary School', type: 'text', required: true },
      { key: 'activity', label: 'Authorized Activity / Event', placeholder: 'e.g., 2-week Cultural Exchange & Science Boot Camp in Abuja', type: 'textarea', required: true },
      { key: 'emergencyContact', label: 'Parent Emergency Contact Number', placeholder: 'e.g., +234 803 112 3344', type: 'text', required: true },
      { key: 'dates', label: 'Event Dates', placeholder: 'e.g., August 10th to August 24th, 2026', type: 'text', required: true }
    ],
    samplePreview: `From: Dr. & Mrs. Kolawole Cole\nPhone: +234 803 112 3344\n\nTo the Administrator,\nCorona Secondary School.\n\nDear Sir/Ma,\n\nLETTER of PARENTAL CONSENT FOR SAMUEL COLE\n\nI am writing to formally grant consent for my son, Samuel Cole, to participate in the upcoming 2-week Cultural Exchange & Science Boot Camp in Abuja Scheduled from August 10th to August 24th, 2026 organized by Corona Secondary School...\n\nIn case of emergencies, I can be reached on +234 803 112 3344...\n\nSincerely,\n\nDr. Kolawole Cole`,
    aiPromptTemplate: 'Draft an official Parent Consent Letter from parent {parentName} authorizing child {childName} to partake in {activity} organized by {schoolName} on {dates}. Include emergency contact {emergencyContact} and a statement of liability release/cooperation.'
  },
  {
    id: 'employment-intro',
    name: 'Employment Introduction Letter',
    description: 'An official letter from an employer introducing a key staff member to third-party institutions (e.g. for embassies, banks, or corporate partnerships).',
    priceNGN: 3500,
    requiredFields: [
      { key: 'companyName', label: 'Employer Company Name', placeholder: 'e.g., Sterling Bank Plc', type: 'text', required: true },
      { key: 'signerName', label: 'Signer Name (e.g., HR Director)', placeholder: 'e.g., Mrs. Janet Nnamani', type: 'text', required: true },
      { key: 'signerTitle', label: 'Signer Title', placeholder: 'e.g., Human Resources Director', type: 'text', required: true },
      { key: 'employeeName', label: 'Employee Full Name', placeholder: 'e.g., Ibrahim Babangida', type: 'text', required: true },
      { key: 'employeeRole', label: 'Employee Job Title', placeholder: 'e.g., Chief Risk Analyst', type: 'text', required: true },
      { key: 'employmentDate', label: 'Date of Employment', placeholder: 'e.g., October 12, 2020', type: 'text', required: true },
      { key: 'purposeOfLetter', label: 'Purpose of Introduction', placeholder: 'e.g., Visa application support to attend the Global Risk Summit in Germany', type: 'textarea', required: true }
    ],
    samplePreview: `STERLING BANK PLC\nMarina, Lagos, Nigeria\n\nDate: June 13, 2026\n\nTo Whom It May Concern,\n\nLETTER OF EMPLOYMENT INTRODUCTION: IBRAHIM BABANGIDA\n\nWe hereby write to introduce Ibrahim Babangida, who is a full-time employee of Sterling Bank Plc. He joined our organization on October 12, 2020, and currently serves as our Chief Risk Analyst...\n\nThis letter is issued at his request for Visa application support to attend the Global Risk Summit in Germany...\n\nSincerely,\n\nMrs. Janet Nnamani\nHuman Resources Director`,
    aiPromptTemplate: 'Draft a high-end Employment Introduction Letter from {companyName} signed by {signerName} ({signerTitle}) confirming that {employeeName} is employed as a {employeeRole} since {employmentDate}. State that the purpose of the letter is {purposeOfLetter}. Re-verify that their salary/status satisfies corporate trust standards.'
  },
  {
    id: 'project-defense',
    name: 'Project Defense Request Letter',
    description: 'Formal letter written by a student or research group to a department to schedule, request approval, or list details for their final research project/thesis defense.',
    priceNGN: 2500,
    requiredFields: [
      { key: 'studentName', label: 'Student / Researchers Names', placeholder: 'e.g., Olumide Lawson & Mary Silas', type: 'text', required: true },
      { key: 'matricNo', label: 'Matriculation or Team Registration Numbers', placeholder: 'e.g., FASS/ECN/22/100', type: 'text', required: true },
      { key: 'university', label: 'University / Poly Name', placeholder: 'e.g., University of Jos', type: 'text', required: true },
      { key: 'department', label: 'Department Name', placeholder: 'e.g., Department of Economics', type: 'text', required: true },
      { key: 'projectTitle', label: 'Research Project Thesis Title', placeholder: 'e.g., Impact of Mobile Money Solutions on Rural Entrepreneurs in Plateau State', type: 'text', required: true },
      { key: 'supervisorName', label: 'Internal supervisor Name', placeholder: 'e.g., Dr. Sylvester Long', type: 'text', required: true },
      { key: 'preferredDefenseMonth', label: 'Preferred Defense Month/Timeline', placeholder: 'e.g., Late July 2026', type: 'text', required: true }
    ],
    samplePreview: `UNIVERSITY OF JOS\nDepartment of Economics\n\nThe Head of Department,\nDepartment of Economics,\nUniversity of Jos.\n\nDear Sir,\n\nREQUEST TO SCHEDULE FINAL B.SC. PROJECT DEFENSE\n\nWe, Olumide Lawson & Mary Silas, hereby formally submit our completed B.Sc. thesis research titled "Impact of Mobile Money Solutions on Rural Entrepreneurs in Plateau State" for defense evaluation...\n\nOur supervisor, Dr. Sylvester Long, has approved our research draft, and we kindly appeal for a Defense scheduling in Late July 2026...\n\nCollaborators,\nOlumide Lawson & Mary Silas`,
    aiPromptTemplate: 'Write a Project Defense Request Letter for student(s) {studentName} ({matricNo}) at {university} under {department}. The thesis title is {projectTitle}, supervised by {supervisorName}. Request schedule for {preferredDefenseMonth}.'
  },
  {
    id: 'research-approval',
    name: 'Research Approval Request Letter',
    description: 'Letter to a Head of Institution, Hospital, or Research Hub asking for formal ethical approval, resource access, or clearance to execute Academic Research.',
    priceNGN: 3000,
    requiredFields: [
      { key: 'researcherName', label: 'Principal Researcher Name', placeholder: 'e.g., Dr. Maryam Bello-Sule', type: 'text', required: true },
      { key: 'researcherTitle', label: 'Designation / Affiliation', placeholder: 'e.g., Postgraduate PhD Scholar, College of Medicine', type: 'text', required: true },
      { key: 'targetInstitution', label: 'Target Organization/Hospital', placeholder: 'e.g., Federal Medical Centre, Abeokuta', type: 'text', required: true },
      { key: 'researchTitle', label: 'Full Research Study Title', placeholder: 'e.g., Assessing Diabetic Retinopathy prevalence and local laser access limits in South-West Nigeria', type: 'text', required: true },
      { key: 'dataRequired', label: 'Resources or Datasets Needed', placeholder: 'e.g., Anonymous demographic health databases, diabetic patient surveys, clinic attendance records', type: 'textarea', required: true },
      { key: 'ethicalCommitment', label: 'Data Privacy & Ethics Commitment', placeholder: 'e.g., Zero names will be logged, strict HIPAA-inspired security measures will be implemented, purely aggregated metrics', type: 'textarea', required: true }
    ],
    samplePreview: `From: Dr. Maryam Bello-Sule\nPhD Scholar, College of Medicine\n\nTo the Chief Medical Director,\nFederal Medical Centre, Abeokuta.\n\nDear Sir,\n\nAPPLICATION FOR ETHICAL CLEARANCE AND DATA ACCESS APPROVAL FOR ACADEMIC RESEARCH\n\nI wish to formally request authorization to execute an academic research at your reputable facility, titled: "Assessing Diabetic Retinopathy prevalence"... \n\nI would require access to: Anonymous demographic health databases, diabetic patient surveys. To guarantee ethical standards: Zero names will be logged...\n\nWith respect,\n\n___________________\nDr. Maryam Bello-Sule`,
    aiPromptTemplate: 'Write an elite Research Approval Request Letter for researcher {researcherName} ({researcherTitle}) seeking approval from {targetInstitution} to conduct research titled "{researchTitle}". Explicitly outline required datasets/resources: {dataRequired} and the strict ethical compliance standards: {ethicalCommitment}.'
  },
  {
    id: 'lga-origin',
    name: 'LGA State of Origin Draft',
    description: 'Generates a highly polished, visually authentic Local Government Area (LGA) State of Origin & Indigene Attestation Reference document draft.',
    priceNGN: 4000,
    requiredFields: [
      { key: 'state', label: 'State of Origin', placeholder: 'e.g., Imo State, Lagos State, Cross River State, Ondo State', type: 'text', required: true },
      { key: 'lga', label: 'Local Government Area (LGA)', placeholder: 'e.g., Oguta, Epe, Ikom, Ondo West', type: 'text', required: true },
      { key: 'fullName', label: 'Applicant Full Name', placeholder: 'e.g., Odebiye Aduragbemi Adekunle', type: 'text', required: true },
      { key: 'gender', label: 'Title / Gender', placeholder: 'e.g., MR, MRS, MISS, MASTER', type: 'text', required: true },
      { key: 'townOrVillage', label: 'Village / Town of Origin', placeholder: 'e.g., Epe Town, Oguta Village', type: 'text', required: true },
      { key: 'autonomousCommunity', label: 'Autonomous Community (Optional)', placeholder: 'e.g., Oguta Autonomous Community', type: 'text', required: false },
      { key: 'traditionalRuler', label: 'Traditional Ruler (Optional)', placeholder: 'e.g., His Royal Highness Eze Anthony', type: 'text', required: false },
      { key: 'certificateNo', label: 'Certificate Reference Number', placeholder: 'e.g., IM/LO/ABJ/2063, OG-08173', type: 'text', required: true },
      { key: 'liaisonOffice', label: 'Liaison Office Location (Optional)', placeholder: 'e.g., Imo State Liaison Office, Abuja', type: 'text', required: false },
      { key: 'officerName', label: 'Signing Officer Name', placeholder: 'e.g., Hon. Anthony Njoku', type: 'text', required: true },
      { key: 'officerTitle', label: 'Signing Officer Designation', placeholder: 'e.g., Liaison Officer, LGA Chairman, Secretary', type: 'text', required: true },
      { key: 'fatherName', label: "Father's Name (Optional - Ondo Style)", placeholder: "e.g., Chief Odebiye Yusuf Kunle", type: 'text', required: false },
      { key: 'motherName', label: "Mother's Name (Optional - Ondo Style)", placeholder: "e.g., Deaconess Oluwaseun Beatrice", type: 'text', required: false },
      { key: 'bornPlace', label: "Born and Breed At (Optional - Ondo Style)", placeholder: "e.g., Ondo East Town Center", type: 'text', required: false },
      { key: 'stylePreset', label: 'Visual Certificate Style Preset', placeholder: 'Select style option', type: 'select', options: [
        'Imo Heartland (Green teeth border)',
        'Lagos Epe Style (Tri-color banner)',
        'Oguta Classic (Double green circle)',
        'Cross River Ikom (Dual royal blue border)',
        'Ondo East Authentic (Red seal, light watermark)',
        'Abia Authentic (Double gold border)',
        'Adamawa Savannah (Brown border)',
        'Akwa Ibom Dakkada (Orange banner)',
        'Anambra Light of the Nation (Gold crest)',
        'Bauchi Pearl (Teal watermark)',
        'Bayelsa Pride (Navy blue border)',
        'Benue Food Basket (Green stripe)',
        'Borno Home of Peace (Light blue border)',
        'Delta Big Heart (Red banner)',
        'Ebonyi Salt of the Nation (Slate double frame)',
        'Edo Heartbeat (Red teeth border)',
        'Ekiti Fountain of Knowledge (Green water certificate)',
        'Enugu Coal City (Black/gray seal)',
        'FCT Abuja (Federal blue, tri-color emblem)',
        'Gombe Jewel (Gold/purple border)',
        'Jigawa New Horizon (Orange watermark)',
        'Kaduna Liberal State (Blue double circle)',
        'Kano Centre of Commerce (Red border)',
        'Katsina Home of Hospitality (Amber border)',
        'Kebbi Land of Equity (Green double circle)',
        'Kogi Confluence (Slate blue ribbon)',
        'Kwara State of Harmony (Gold seal)',
        'Nasarawa Home of Solid Minerals (Double brown frame)',
        'Niger Power State (Red/gold border)',
        'Ogun Gateway State (Blue ribbon strip)',
        'Osun State of the Living Spring (Blue water seal)',
        'Oyo Pace Setter (Maroon ribbon)',
        'Plateau Home of Peace & Tourism (Green border)',
        'Rivers Treasure Base (Crimson double frame)',
        'Sokoto Caliphate (Black ribbon border)',
        'Taraba Nature\'s Gift (Gold double thin frame)',
        'Yobe Pride of the Sahel (Khaki seal)',
        'Zamfara Farming is our Pride (Green/gold banner)'
      ], required: true }
    ],
    samplePreview: `GOVERNMENT OF IMO STATE OF NIGERIA\n(EASTERN HEARTLAND)\n\nRef: IM/LO/ABJ/2063\n\nCERTIFICATE OF STATE OF ORIGIN\n\nThis is to certify that MR. ODEBIYE ADURAGBEMI ADEKUNLE hails from Oguta Village in Oguta Autonomous Community, Oguta Local Government Area of Imo State of Nigeria.\n\nThe name of his traditional ruler is His Royal Highness Eze Anthony.\n\nThis document is a formal reference issued for authentic indigeneship representation.`,
    aiPromptTemplate: 'Generate a highly polished administrative Certificate of State of Origin Draft document. Certify that {fullName} ({gender}) hails from {townOrVillage} in {lga} Local Government Area of {state}, Nigeria. Autonomous Community is {autonomousCommunity} and Traditional Ruler is {traditionalRuler}. Reference number is {certificateNo}. Signature block issued by {officerName} ({officerTitle}). Output a structured layout with state headers and standard Nigerian legal wording.'
  }
];

export const INITIAL_RESEARCH_TEMPLATES: SampleResearchTemplate[] = [
  {
    id: 'sample-church',
    categoryId: 'church-attestation',
    title: 'Model Baptist Church Attestation',
    organization: 'First Baptist Church, Kaduna',
    rawText: `FIRST BAPTIST CHURCH KADUNA\n14 Baptist Way, Kaduna\n\nJune 10, 2026\n\nTo Whom It May Concern,\n\nRECOMMENDATION AND ATTESTATION LETTER\n\nThis is to certify that the bearer, Brother Emmanuel Danjuma, has been a full communicant member in perfect standing since the year 2018. Over the years, he has contributed selflessly to the Evangelism ministry.\n\nHis integrity, Christian demeanor, and dedication to local community initiatives are highly exemplary. We wish him standard divine assistance in all administrative engagements.\n\nYours in His Vineyard,\n\nReverend Timothy Gari\nPresiding Pastor`,
    structureAnalysis: '1. Standard Church Letterhead Header.\n2. Date & Unified Title Structure bold, capitalized.\n3. Opening attestation paragraph confirming membership dates.\n4. Character feedback paragraph depicting church departments.\n5. Professional signature block featuring the presiding clergyman.',
    createdAt: '2026-06-13T12:00:00Z'
  },
  {
    id: 'sample-siwes',
    categoryId: 'siwes-completion',
    title: 'NLNG Internship/SIWES Clearance Model',
    organization: 'Nigeria LNG Limited, Port Harcourt',
    rawText: `NIGERIA LNG LIMITED\nPlant Site, Bonny Island, Rivers State\n\nMay 29, 2026\n\nLETTER OF DISCHARGE AND SIWES DISCHARGE CARD\n\nTo: The Coordinator, SIWES Office, University of Port Harcourt.\n\nThis is to certify that Mr. George Lawson (Matric: ENG/22/0890) has completed his Students Industrial Work Experience Scheme (SIWES) at our Operations Department.\n\nThe training ran from December 1st, 2025 to May 28th, 2026. He achieved full operations orientation and passed supervisor assessment with distinction.\n\nBest Regards,\n\nEngr. Victor Iniobong\nLead Coordinator, HR Training Division`,
    structureAnalysis: '1. Multi-national style header detailing Plant Site location.\n2. Addressed directly to Academic SIWES Office.\n3. Concise performance rating and confirmation of exact date boundaries.\n4. Industry supervisor stamp designation details.',
    createdAt: '2026-06-13T12:05:00Z'
  },
  {
    id: 'sample-lga-imo',
    categoryId: 'lga-origin',
    title: 'Imo State Liaison Certificate Template',
    organization: 'Imo State Liaison Office, Abuja',
    rawText: `GOVERNMENT OF IMO STATE OF NIGERIA\n(EASTERN HEARTLAND)\n\nNo: IM/LO/ABJ/2063\n\nCERTIFICATE OF STATE OF ORIGIN\n\nThis is to certify that MR. ODEBIYE ADURAGBEMI ADEKUNLE whose photograph appears above hails from Oguta village in Oguta autonomous community in Oguta Local Government Area of Imo State of Nigeria.\n\nThe name of his/her traditional ruler is HRH Eze Anthony Njoku.\n\nThis certificate of state of origin is an official document issued by the Imo State Liaison Office and is NOT TRANSFERABLE.\n\nfor LIAISON OFFICER\nName: Hon. Anthony Njoku\nDate: October 14, 2026`,
    structureAnalysis: '1. Government body and state details at top center with Eastern Heartland slogan.\n2. Aligned serial code and registration year.\n3. Certifying clause with details of village, autonomous community, and LGA.\n4. Traditional ruler declaration line.\n5. Official Liaison office seal, restriction statement, and officer details.',
    createdAt: '2026-06-13T14:10:00Z'
  },
  {
    id: 'sample-lga-lagos',
    categoryId: 'lga-origin',
    title: 'Lagos Epe LGA Origin Certificate',
    organization: 'Epe Local Government Area, Lagos State',
    rawText: `EPE LOCAL GOVERNMENT\nLAGOS STATE, NIGERIA\n\nOHLG No: PM/S348/NI/CS/350 Date: OCT. 14 2024\n\nCERTIFICATE OF ORIGIN\n\nThis is to certify that MR/MRS/MISS ODEBIYE ADURAGBEMI ADEKUNLE is an Indigene of Epe Town in Epe Local Government Area of Lagos State, Nigeria.\n\nYou are requested to give Him/her the necessary assistance He/She may require.\n\nName: Hon. Biodun Adesanya\nDesignation: Chairman, Epe LGA\nDate: OCT 14, 2024`,
    structureAnalysis: '1. Two banner header layout with circular LGA crest.\n2. Unified certification text on individual line bounds.\n3. Request of assistance clause characteristic of southwestern LGA letters.\n4. Bottom alignment with red stamp reference and date markers.',
    createdAt: '2026-06-13T14:15:00Z'
  }
];
