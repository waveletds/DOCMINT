import React from 'react';
import { GeneratedDocument } from '../types.js';
import { QrCode, Camera } from 'lucide-react';

interface CertificatePreviewProps {
  doc: GeneratedDocument;
  isPrintMode?: boolean;
}

export default function CertificatePreview({ doc, isPrintMode = false }: CertificatePreviewProps) {
  const inputs = doc.inputs || {};
  const stylePreset = inputs.stylePreset || 'Imo Heartland (Green teeth border)';

  // Destructure inputs with fallbacks
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
  
  // Custom new optional fields
  const fatherName = inputs.fatherName || 'Chief Odebiye Yusuf Kunle';
  const motherName = inputs.motherName || 'Deaconess Oluwaseun Beatrice';
  const bornPlace = inputs.bornPlace || 'Ondo East Town Center';

  // Format date helper
  const formatDateStr = (dateString?: string) => {
    if (!dateString) return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    try {
      return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const docDate = formatDateStr(doc.createdAt);

  const isImoHeartland = stylePreset.includes('Heartland') || stylePreset.includes('teeth border') || stylePreset.includes('Imo Heartland');
  const isLagosEpe = stylePreset.includes('Lagos Epe') || stylePreset.includes('Tri-color') || stylePreset.includes('Lagos');
  const isOgutaClassic = stylePreset.includes('Oguta') || stylePreset.includes('Double green') || stylePreset.includes('Oguta');
  const isCrossRiverIkom = stylePreset.includes('Cross River') || stylePreset.includes('Ikom') || stylePreset.includes('Dual royal');
  const isOndoEast = stylePreset.includes('Ondo') || stylePreset.includes('Ondo East');

  // Green alternating dynamic teeth border for Imo Style
  const renderImoTeethBorder = () => {
    return (
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Top */}
        <div className="absolute top-0 inset-x-0 h-4 flex overflow-hidden">
          {Array.from({ length: 48 }).map((_, i) => (
            <svg key={`t-${i}`} className="w-4 h-4 shrink-0" viewBox="0 0 16 16">
              <polygon points="0,0 16,0 8,16" fill="#006e4a" />
              <polygon points="0,16 8,0 16,16" fill="#ffffff" />
            </svg>
          ))}
        </div>
        {/* Bottom */}
        <div className="absolute bottom-0 inset-x-0 h-4 flex overflow-hidden rotate-180">
          {Array.from({ length: 48 }).map((_, i) => (
            <svg key={`b-${i}`} className="w-4 h-4 shrink-0" viewBox="0 0 16 16">
              <polygon points="0,0 16,0 8,16" fill="#006e4a" />
              <polygon points="0,16 8,0 16,16" fill="#ffffff" />
            </svg>
          ))}
        </div>
        {/* Left */}
        <div className="absolute left-0 top-4 bottom-4 w-4 flex flex-col overflow-hidden">
          {Array.from({ length: 70 }).map((_, i) => (
            <svg key={`l-${i}`} className="w-4 h-4 shrink-0 rotate-90" viewBox="0 0 16 16">
              <polygon points="0,0 16,0 8,16" fill="#006e4a" />
              <polygon points="0,16 8,0 16,16" fill="#ffffff" />
            </svg>
          ))}
        </div>
        {/* Right */}
        <div className="absolute right-0 top-4 bottom-4 w-4 flex flex-col overflow-hidden">
          {Array.from({ length: 70 }).map((_, i) => (
            <svg key={`r-${i}`} className="w-4 h-4 shrink-0 -rotate-90" viewBox="0 0 16 16">
              <polygon points="0,0 16,0 8,16" fill="#006e4a" />
              <polygon points="0,16 8,0 16,16" fill="#ffffff" />
            </svg>
          ))}
        </div>
      </div>
    );
  };

  // Draft banner for unpaid
  const renderDraftWatermark = () => {
    if (doc.addWatermark && !doc.paid) {
      return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-28deg] text-red-550/15 font-sans font-black text-4xl sm:text-5xl text-center select-none pointer-events-none uppercase tracking-widest z-30 whitespace-nowrap">
          Draft Preview - No Authority
        </div>
      );
    }
    return null;
  };

  // Standard Coat of Arms SVG watermark background
  const renderBackgroundWatermark = (opacity = "opacity-[0.05]") => {
    return (
      <div className={`absolute inset-0 flex items-center justify-center ${opacity} pointer-events-none select-none z-0`}>
        <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 text-neutral-900 fill-current">
          {/* Nigerian Coat of Arms vector outline style */}
          <path d="M50 15 L75 35 L65 75 L35 75 L25 35 Z M50 20 L30 36 L38 70 L62 70 L70 36 Z" />
          <path d="M45 40 L55 40 L55 60 L45 60 Z" />
          <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
          <text x="50" y="90" fontSize="6" textAnchor="middle" fontWeight="bold" fontFamily="sans-serif">FEDERAL REPUBLIC OF NIGERIA</text>
        </svg>
      </div>
    );
  };

  // 1. IMO STATE HEARTLAND TEMPLATE
  if (isImoHeartland) {
    return (
      <div 
        id={`certificate-root-${doc.id}`}
        style={{
          width: '100%',
          maxWidth: isPrintMode ? '100%' : '595px',
          minHeight: isPrintMode ? '100vh' : '820px',
          aspectRatio: '1 / 1.414',
        }}
        className="font-serif select-none p-6 sm:p-10 relative overflow-hidden bg-white shadow-xl rounded-lg flex flex-col justify-between text-[#111111] border border-gray-200 z-0"
      >
        {renderImoTeethBorder()}
        {renderBackgroundWatermark("opacity-[0.05]")}
        {renderDraftWatermark()}

        <div className="relative z-20 h-full flex flex-col justify-between p-2">
          {/* Top Section */}
          <div className="text-center">
            {/* Crest & Address Box block */}
            <div className="grid grid-cols-12 items-center gap-2 mb-2">
              <div className="col-span-3 text-left">
                <span className="font-mono text-[9px] block text-neutral-700 leading-none">
                  No. <b className="text-black">{certificateNo.split('/')[0] || 'IM'}/{certificateNo.split('/')[1] || 'LO'}/{certificateNo.split('/')[2] || 'ABJ'}</b>
                </span>
                <span className="font-mono text-[10px] block font-black text-emerald-800 mt-1">
                  {certificateNo.split('/').slice(-1)[0] || '2063'}
                </span>
              </div>

              {/* Center Lion Crest */}
              <div className="col-span-6 flex justify-center">
                <div className="relative">
                  <svg viewBox="0 0 100 100" className="w-16 h-16 text-amber-500 fill-current">
                     <path d="M50,5 L80,25 L80,65 L50,95 L20,65 L20,25 Z" fill="#b45309" />
                     <path d="M50,10 L75,28 L75,62 L50,88 L25,62 L25,28 Z" fill="#ffffff" />
                     <circle cx="50" cy="48" r="14" fill="#047857" />
                     <path d="M42,48 L58,48 M50,40 L50,56" stroke="#ffffff" strokeWidth="2.5" />
                     <path d="M15,40 Q25,25 25,48 M85,40 Q75,25 75,48" stroke="#111" strokeWidth="1.5" fill="none" />
                  </svg>
                </div>
              </div>

              {/* Right Side Liaison office text block from reference */}
              <div className="col-span-3 text-left border border-neutral-300 p-1 bg-neutral-50 rounded text-[7px] leading-tight font-sans text-neutral-800 scale-95 origin-right">
                <b className="text-[7.5px] text-emerald-850 block border-b border-neutral-200 pb-0.5 mb-0.5">IMO STATE LIAISON OFFICE</b>
                <p>PLOT 1240 MONROVIA STREET,</p>
                <p>WUSE II,</p>
                <p>ABUJA</p>
                <p>TEL: 09-4130224</p>
              </div>
            </div>

            {/* Header Title */}
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-emerald-850 font-sans">
                GOVERNMENT OF IMO STATE OF NIGERIA
              </h1>
              <p className="text-xs font-black text-[#dc2626] uppercase tracking-widest font-sans">
                (EASTERN HEARTLAND)
              </p>
            </div>

            {/* Document Red Title */}
            <div className="mt-4 mb-5">
              <h3 className="text-lg sm:text-xl font-bold text-red-650 uppercase tracking-tight border-y-2 border-red-200 py-1 max-w-md mx-auto font-sans">
                CERTIFICATE OF STATE OF ORIGIN
              </h3>
            </div>
          </div>

          {/* Certificate Main Content */}
          <div className="relative my-1 text-sm sm:text-base leading-loose px-4">
            
            {/* Passport Photograph Frame right hand side */}
            <div className="absolute right-4 top-2 w-28 h-28 border border-neutral-400 bg-neutral-50/50 flex flex-col items-center justify-center text-center p-1 font-sans shadow-sm z-30">
              <Camera className="w-6 h-6 text-neutral-400 mb-1" />
              <span className="text-[8px] font-black uppercase text-neutral-500 leading-tight">Affix Passport<br/>Photograph Here</span>
              <div className="absolute inset-0.5 border border-dashed border-neutral-300 pointer-events-none"></div>
            </div>

            {/* Custom fields and texts formatted exactly as dotted lines in Image 1 */}
            <div className="space-y-4 max-w-lg text-left font-serif">
              <p className="text-base font-medium text-neutral-800">
                This is to certify that <span className="font-sans font-extrabold text-black uppercase underline decoration-emerald-800 decoration-2 px-1">{gender}. {fullName}</span>
              </p>

              <p className="text-neutral-800">
                whose photograph appears above hails from <span className="font-bold underline text-black">{townOrVillage}</span>
              </p>

              <p className="text-neutral-800">
                village in <span className="font-bold underline text-black">{autonomousCommunity || 'N/A'}</span> autonomous
              </p>

              <p className="text-neutral-800">
                community in <span className="font-bold underline text-black">{lga}</span> Local Government Area
              </p>

              <p className="text-neutral-800">
                of <span className="font-black text-emerald-900">{state}</span> of Nigeria.
              </p>

              <p className="text-neutral-700">
                The name of his/her traditional ruler is <span className="font-bold underline text-black">{traditionalRuler || 'HRH Eze Oba Charles'}</span>
              </p>
            </div>
          </div>

          {/* Warning notice stamp */}
          <div className="my-3 text-center">
            <div className="border border-neutral-300 p-1.5 max-w-sm mx-auto text-[9px] uppercase font-bold bg-neutral-50/80 text-neutral-500 leading-normal">
              This certificate of state of origin is an official document<br/>
              issued by the Imo State Liaison office and is<br/>
              <span className="text-red-650 font-black">NOT TRANSFERABLE</span>
            </div>
          </div>

          {/* Footer Seals & Signatures */}
          <div className="pt-2 border-t border-dashed border-neutral-200 flex justify-between items-end">
            <div className="flex gap-2 items-center">
              {/* Simple approved wax stamp representation */}
              <div className="relative w-16 h-16 rounded-full border-2 border-dashed border-red-500/35 flex flex-col items-center justify-center text-center font-sans text-[7px] text-red-500/40 rotate-[-10deg] select-none scale-90">
                <b>IMO LIAISON</b>
                <span>APPROVED</span>
                <span>{docDate}</span>
              </div>
            </div>

            {/* Signature Block right aligned exactly like picture */}
            <div className="text-right pr-2">
              <span className="block text-[10px] text-neutral-500 italic uppercase tracking-wider font-sans">for. LIAISON OFFICER</span>
              <div className="mt-6 w-40 text-center font-sans border-t border-neutral-300 pt-1">
                <span className="block text-xs font-bold text-gray-900">{officerName}</span>
                <span className="text-[9px] text-neutral-500 block leading-tight">{officerTitle}</span>
                <span className="text-[8px] text-neutral-400 block font-mono mt-0.5">Date: {docDate}</span>
              </div>
            </div>
          </div>

          {/* Qr code tracking footer line */}
          <div className="flex justify-between items-center text-[7px] text-neutral-400 font-mono border-t border-neutral-100 pt-1 mt-1 font-bold">
            <span>IMO STATE DIGI-GOV VALIDATION PROTOCOL</span>
            <div className="flex gap-1 items-center bg-white px-1 border border-neutral-250 rounded">
              <QrCode className="h-2.5 w-2.5 text-neutral-700" />
              <span>REF-CODE: {doc.id.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. LAGOS STATE EPE LOCAL GOVERNMENT CERTIFICATE
  if (isLagosEpe) {
    return (
      <div 
        id={`certificate-root-${doc.id}`}
        style={{
          width: '100%',
          maxWidth: isPrintMode ? '100%' : '595px',
          minHeight: isPrintMode ? '100vh' : '820px',
          aspectRatio: '1 / 1.414',
        }}
        className="font-serif select-none p-6 sm:p-10 relative overflow-hidden bg-[#faf8ec] shadow-xl rounded-lg flex flex-col justify-between text-[#1a1a1a] border border-gray-200 z-0"
      >
        {/* Left Side triple banner colored ribbon */}
        <div className="absolute inset-y-0 left-0 w-8 flex flex-row shrink-0 bg-transparent z-10 border-r border-[#eddba4]">
          <div className="w-1/3 h-full bg-[#0284c7]"></div>
          <div className="w-1/3 h-full bg-[#dc2626]"></div>
          <div className="w-1/3 h-full bg-[#16a34a]"></div>
        </div>

        {renderBackgroundWatermark("opacity-[0.04]")}
        {renderDraftWatermark()}

        <div className="relative z-20 h-full flex flex-col justify-between pl-8 p-1">
          {/* Header */}
          <div className="text-center pt-2">
            {/* National Crest Badge with vertical ribbons */}
            <div className="flex flex-col items-center justify-center mb-3">
              <div className="w-16 h-16 rounded-full border border-neutral-400 bg-amber-50 flex flex-col items-center justify-center p-1 text-center font-sans tracking-tight shadow-xs">
                <span className="text-[6px] font-bold text-emerald-800 tracking-tight leading-none">GOVERNMENT</span>
                <div className="w-11 h-6 border-y border-neutral-300 relative flex items-center justify-center my-0.5 bg-white">
                  <span className="text-[12px]">🌴</span>
                </div>
                <span className="text-[6px] font-bold text-[#dc2626] leading-none uppercase">LAGOS STATE</span>
              </div>
              <div className="w-1 h-3 bg-gradient-to-b from-neutral-400 to-transparent"></div>
            </div>

            {/* LGA Bold Blue header with double underlines */}
            <div className="space-y-0.5 text-center">
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-normal text-[#1d3a5f] border-b border-[#1d3a5f]/40 pb-0.5 inline-block font-sans">
                EPE LOCAL GOVERNMENT
              </h1>
              <p className="text-xs sm:text-sm font-bold text-[#dc2626] tracking-widest uppercase font-sans">
                LAGOS STATE, NIGERIA
              </p>
            </div>

            {/* OHLG Reference block */}
            <div className="mt-3 text-center border-y border-[#eedfa2] py-1 max-w-sm mx-auto font-sans text-[10px] text-neutral-800">
              <span className="font-semibold text-[9.5px]">OHLG No:</span> <b className="font-mono bg-white px-1 border border-neutral-200">{certificateNo}</b> &nbsp;&bull;&nbsp; <span className="font-semibold">Date:</span> <b className="font-mono">{docDate.toUpperCase()}</b>
            </div>

            {/* Gothic redviolet title exactly like pic */}
            <div className="my-4">
              <h3 className="text-2xl font-semibold italic text-[#8d0e34] underline decoration-amber-600/70 py-1.5 font-serif tracking-normal">
                Certificate of Origin
              </h3>
            </div>
          </div>

          {/* Certificate statement */}
          <div className="my-3 text-center space-y-6 max-w-md mx-auto">
            <p className="text-lg italic font-sans text-neutral-700 leading-none">
              This is to certify that
            </p>

            <div className="my-3 py-1 border-b-2 border-dashed border-[#1d3a5f]/40">
              <span className="text-xl sm:text-2xl font-black block text-[#0f172a] uppercase font-sans tracking-wide">
                {gender}. {fullName}
              </span>
            </div>

            <p className="text-md leading-relaxed text-neutral-800 font-sans">
              is an Indigene of <span className="font-bold border-b border-black text-[#0c4a6e] px-1">{townOrVillage || 'Epe Town'}</span> in
            </p>

            <p className="text-lg font-black text-[#31572c] leading-tight font-sans">
              {lga.toUpperCase()} LOCAL GOVERNMENT AREA
            </p>

            <p className="text-md text-neutral-800 leading-relaxed font-sans">
              of <span className="font-black text-blue-900">Lagos State, Nigeria</span>.
            </p>

            <div className="pt-2">
              <p className="text-[#a21caf] font-bold italic text-xs leading-relaxed max-w-xs mx-auto">
                "You are requested to give Him/her the necessary assistance He/She may require."
              </p>
            </div>
          </div>

          {/* Bottom Wax seal left, rubber purple stamp right */}
          <div className="pt-4 border-t border-[#eedfa2] flex justify-between items-center px-4">
            {/* Red Wax Seal Sticker */}
            <div className="w-16 h-16 rounded-full bg-red-700 shadow-md border-2 border-amber-400 flex items-center justify-center text-white text-center text-[7px] font-bold p-1 leading-none select-none shrink-0 rotate-[8deg]">
              <div className="rounded-full border border-dashed border-amber-500 w-full h-full flex flex-col justify-center items-center">
                <span>⭐ EPE ⭐</span>
                <span className="text-[5px] mt-0.5 uppercase">LGA SEAL</span>
              </div>
            </div>

            {/* Purple rubber stamp */}
            <div className="relative w-20 h-20 rounded-full border-4 border-double border-purple-500/40 flex flex-col items-center justify-center text-center font-sans text-[7.5px] text-purple-600/50 font-black rotate-[-4deg] select-none bg-white/20">
              <span className="leading-tight">EPE LOCAL</span>
              <span className="text-[9px] border-y border-purple-400/45 my-0.5">APPROVED</span>
              <span className="text-[7.5px] font-mono">{docDate}</span>
            </div>

            {/* Signature Block */}
            <div className="text-right min-w-[150px] font-sans">
              <div className="border-t border-neutral-400 pt-1.5 inline-block text-center w-full">
                <span className="text-[#0284c7] block text-xs tracking-tight italic font-black h-4 select-none">
                  {officerName}
                </span>
                <span className="text-xs font-bold text-neutral-800 block">
                  {officerName}
                </span>
                <span className="text-[9px] text-[#047857] uppercase font-black tracking-widest block leading-none mt-1">
                  {officerTitle}
                </span>
                <span className="text-[8px] text-neutral-400 block font-mono">
                  {docDate}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Line */}
          <div className="flex justify-between items-center text-[7px] text-neutral-400 font-mono mt-2 leading-none border-t border-neutral-250/30 pt-1">
            <span>LAGOS STATE ELECTRONIC RECORD SYSTEM</span>
            <span>IDENTIFIER-HASH: {doc.id.toLowerCase()}</span>
          </div>
        </div>
      </div>
    );
  }

  // 3. IMO STATE OGUTA CLASSIC (Identification Certificate)
  if (isOgutaClassic) {
    return (
      <div 
        id={`certificate-root-${doc.id}`}
        style={{
          width: '100%',
          maxWidth: isPrintMode ? '100%' : '595px',
          minHeight: isPrintMode ? '100vh' : '820px',
          aspectRatio: '1 / 1.414',
        }}
        className="font-serif select-none p-6 sm:p-10 relative overflow-hidden bg-white shadow-xl rounded-lg flex flex-col justify-between text-[#111111] border border-gray-200 z-0"
      >
        {/* Double dashed inner layout border */}
        <div className="absolute inset-0 border-4 border-[#047857]/60 m-3 pointer-events-none z-10">
          <div className="absolute inset-1 border border-dashed border-[#047857]/45"></div>
        </div>

        {renderBackgroundWatermark("opacity-[0.05]")}
        {renderDraftWatermark()}

        <div className="relative z-20 h-full flex flex-col justify-between p-2 m-2">
          {/* Top header lines */}
          <div className="text-center">
            <div className="flex justify-between items-center px-4 text-xs font-bold text-neutral-500 font-sans tracking-wide">
              <span>Original Copy</span>
              <span className="text-[#dc2626]">OG-NO: {certificateNo}</span>
            </div>

            {/* Large circular emerald coat of arms seal */}
            <div className="flex justify-center my-3">
              <div className="w-16 h-16 rounded-full border-4 border-dotted border-emerald-600 bg-white flex items-center justify-center p-1 shadow-xs">
                <svg viewBox="0 0 100 100" className="w-10 h-10 text-emerald-700 fill-none stroke-current" strokeWidth="3.5">
                  <circle cx="50" cy="50" r="35" />
                  <ellipse cx="50" cy="50" rx="15" ry="30" fill="emerald" />
                  <circle cx="50" cy="50" r="6" fill="#dc2626" />
                </svg>
              </div>
            </div>

            {/* Split Green header */}
            <div className="space-y-0.5 text-center px-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-emerald-900 uppercase font-sans">
                GOVERNMENT OF {state.toUpperCase()}
              </h1>
              <h2 className="text-xs sm:text-sm font-black uppercase text-[#1d395e] tracking-widest font-sans border-b-2 border-neutral-200 pb-1 max-w-sm mx-auto">
                {lga.toUpperCase()} LOCAL GOVERNMENT AREA
              </h2>
            </div>

            {/* Giant Red heading */}
            <div className="my-4">
              <h3 className="text-2xl sm:text-3xl font-black text-red-600 uppercase font-sans tracking-tight leading-none mb-1">
                Identification Certificate
              </h3>
            </div>
          </div>

          {/* Dotted underline text content */}
          <div className="my-2 space-y-5 text-sm sm:text-base leading-relaxed max-w-lg mx-auto text-center font-serif text-neutral-800">
            <p className="italic font-sans text-neutral-600 leading-none text-base">This is to certify that</p>

            <div className="border-b border-dotted border-black/75 py-1 px-4">
              <b className="text-xl text-[#111] uppercase font-sans tracking-tight">{gender}. {fullName}</b>
            </div>
            <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-sans block mt-0">NAME OF REGISTRANT (IN BLOCK LETTERS)</span>

            <div className="text-left space-y-4 pt-1 text-md">
              <p>
                is an indigene of <span className="font-bold underline text-black px-1">{townOrVillage}</span> Village / Town,
              </p>
              {autonomousCommunity && (
                <p>
                  in <span className="font-bold underline text-black px-1">{autonomousCommunity}</span> Autonomous Community,
                </p>
              )}
              <p>
                situated in <span className="font-bold uppercase text-emerald-900">{lga}</span> Local Government Area of <span className="font-black text-neutral-900 border-b border-dashed border-neutral-300">{state}</span>, Federal Republic of Nigeria.
              </p>
              <p className="text-center font-mono text-xs text-neutral-600 pt-1 border-y border-dotted border-neutral-200 py-1.5">
                📅 DATED THIS: <span className="font-black text-black">{docDate.toUpperCase()}</span>
              </p>
            </div>
          </div>

          {/* Bottom Seals & Double Spiky seals */}
          <div className="pt-2 border-t border-dashed border-neutral-200 flex justify-between items-end">
            {/* Spiky Red Seal Left */}
            <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white text-center text-[7px] font-black p-1 leading-none shadow-md rotate-[-8deg] relative select-none">
              <span className="border-2 border-dashed border-white/40 rounded-full w-full h-full flex items-center justify-center">OFFICIAL SEAL</span>
            </div>

            {/* Officer signature block */}
            <div className="text-center min-w-[180px] font-sans">
              <span className="text-[10px] text-neutral-500 italic block mb-6">OFFICER'S SIGNATURE & DATE</span>
              <div className="border-t border-neutral-400 pt-1 w-full text-center">
                <span className="text-blue-700 block text-xs italic font-black h-4 mt-0.5 select-none">{officerName}</span>
                <span className="text-xs font-bold text-neutral-900 block leading-tight">{officerName.toUpperCase()}</span>
                <span className="text-[9px] text-[#047857] block font-semibold leading-none">{officerTitle}</span>
              </div>
            </div>

            {/* Spiky Red Seal Right */}
            <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white text-center text-[7px] font-black p-1 leading-none shadow-md rotate-[12deg] relative select-none">
              <span className="border-2 border-dashed border-white/40 rounded-full w-full h-full flex items-center justify-center">APPROVED</span>
            </div>
          </div>

          {/* Barcode line */}
          <div className="flex justify-between items-center text-[7px] text-neutral-400 font-mono mt-1 border-t border-neutral-150 pt-1">
            <span>SECURED BY OGUTA ADMINISTRATIVE COUNCIL SYSTEM</span>
            <span>VERIFICATION CODE: OG-{doc.id.slice(0, 8).toUpperCase()}</span>
          </div>
        </div>
      </div>
    );
  }

  // 4. CROSS RIVER STATE IKOM LOCAL GOVERNMENT CERTIFICATE
  if (isCrossRiverIkom) {
    return (
      <div 
        id={`certificate-root-${doc.id}`}
        style={{
          width: '100%',
          maxWidth: isPrintMode ? '100%' : '595px',
          minHeight: isPrintMode ? '100vh' : '820px',
          aspectRatio: '1 / 1.414',
        }}
        className="font-serif select-none p-6 sm:p-10 relative overflow-hidden bg-white shadow-xl rounded-lg flex flex-col justify-between text-[#1a1a1a] border border-gray-200 z-0"
      >
        {/* Rounded Indigo/Blue double frame border */}
        <div className="absolute inset-0 border-[10px] border-double border-[#1e3a8a] m-3 rounded-xl pointer-events-none z-10"></div>

        {renderBackgroundWatermark("opacity-[0.06]")}
        {renderDraftWatermark()}

        <div className="relative z-20 h-full flex flex-col justify-between p-3 m-2">
          {/* Header */}
          <div className="text-center pt-2">
            <span className="font-sans text-[10px] font-black tracking-widest text-[#1e3a8a] block mb-2 uppercase">CROSS RIVER STATE OF NIGERIA</span>

            {/* Flanked logos with Coat of arms in center */}
            <div className="flex justify-between items-center w-full max-w-[340px] mx-auto mb-3">
              {/* Left logo: Cross River waves */}
              <div className="w-11 h-11 rounded-full border border-blue-900 bg-white flex flex-col items-center justify-center font-sans text-[6px] font-extrabold leading-none tracking-tight shadow-xs text-blue-900 p-0.5">
                <span>CROSS RIVER</span>
                <span className="text-[10px] my-0.5">🌊</span>
                <span>PARADISE</span>
              </div>

              {/* Center Nigerian Coat of Arms */}
              <svg viewBox="0 0 100 100" className="w-14 h-14 text-neutral-800 fill-current">
                <path d="M50,10 L90,40 L95,80 L50,95 L5,80 L10,40 Z" fill="#1e3a8a" />
                <path d="M50,15 L15,82 L85,82 Z" fill="#ffffff" />
                <circle cx="50" cy="54" r="10" fill="#cc2525" />
              </svg>

              {/* Right logo: Ikom LGA mark */}
              <div className="w-11 h-11 rounded-full border border-blue-900 bg-white flex flex-col items-center justify-center font-sans text-[6px] font-extrabold leading-none tracking-tight shadow-xs text-emerald-850 p-0.5">
                <span>IKOM LGA</span>
                <span className="text-[10px] my-0.5">🏢</span>
                <span>HQ - IKOM</span>
              </div>
            </div>

            {/* Ikom Local Government header exact lettering */}
            <div className="space-y-0.5 text-center">
              <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#222222] font-sans">
                IKOM LOCAL GOVERNMENT
              </h1>
              <p className="text-[9px] font-black text-neutral-600 uppercase italic tracking-wider leading-none">
                LOCAL GOVERNMENT HEADQUARTERS, IKOM
              </p>
            </div>

            {/* Gothic Script Maroon title */}
            <div className="my-3">
              <h3 className="text-2xl font-bold font-serif text-[#991b1b] italic tracking-wide">
                Certificate of Origin
              </h3>
            </div>
          </div>

          {/* Dotted line form block with blue accent heading */}
          <div className="my-2 space-y-4 text-center max-w-lg mx-auto">
            {/* Contrast Violet highlight ribbon exact replica */}
            <div className="bg-[#581c87] text-white py-1 px-4 rounded font-sans font-bold text-xs max-w-xs mx-auto shadow-sm uppercase tracking-wider">
              This is to certify that:
            </div>

            <div className="py-1 border-b border-neutral-300">
              <b className="text-xl text-[#1e1b4b] uppercase font-sans font-black tracking-wide">{gender}. {fullName}</b>
            </div>

            <p className="text-md font-sans text-neutral-700 italic leading-none">
              whose photograph appears below, is an Indigene of
            </p>

            <div className="py-1 border-b border-neutral-300 max-w-sm mx-auto">
              <span className="text-md font-bold text-[#0f172a] font-sans underline">{townOrVillage || 'Ikom Town'}</span>
            </div>

            <p className="text-md text-neutral-800 font-sans">
              in <b className="text-[#047857] uppercase font-black">{lga} Local Government Area</b> of
            </p>

            <p className="text-lg font-black text-[#1e3a8a] font-sans">
              Cross River State of Nigeria
            </p>

            {/* Issued details line */}
            <div className="text-xs text-neutral-600 font-sans pt-1 border-t border-dotted border-neutral-200 mt-2">
              Issued this: <span className="font-bold text-neutral-900 border-b border-neutral-400 pb-0.5 px-3 font-mono">{docDate}</span>
            </div>
          </div>

          {/* Bottom Area: Waves logo left, Photograph box right, Signature right */}
          <div className="pt-4 border-t border-neutral-200 grid grid-cols-12 gap-3 items-end">
            {/* Waves branding left */}
            <div className="col-span-3 text-left">
              <div className="text-blue-900 text-[6.5px] font-sans font-black leading-tight flex flex-col items-start scale-95 origin-left">
                <span>DESTINATION</span>
                <span className="text-cyan-600 text-[10px] leading-none my-0.5">🌊</span>
                <span className="text-[7.5px] text-[#1e3a8a]">CROSS RIVER</span>
                <span className="text-[5.5px] italic text-neutral-500">"The Nation's Paradise"</span>
              </div>
            </div>

            {/* Photograph placeholder box in center bottom */}
            <div className="col-span-4 flex justify-center">
              <div className="w-20 h-24 border border-neutral-500 bg-neutral-55/75 flex flex-col items-center justify-center p-0.5 text-center relative text-neutral-500">
                <Camera className="w-4 h-4 mb-0.5 text-neutral-400" />
                <span className="text-[6.5px] font-bold uppercase leading-tight font-sans">Passport<br/>photograph</span>
                <div className="absolute inset-0.5 border border-dashed border-neutral-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Signature Area Right */}
            <div className="col-span-5 text-right font-sans">
              <div className="w-full border-t border-neutral-400 pt-1 inline-block text-center scale-95 origin-bottom">
                <b className="text-[#3b82f6] block text-xs italic font-black h-4 select-none mb-1">{officerName}</b>
                <span className="text-[9.5px] font-black text-neutral-900 block leading-tight">{officerName.toUpperCase()}</span>
                <span className="text-[8.5px] text-neutral-500 font-extrabold uppercase block tracking-wider mt-0.5">{officerTitle || 'Chairman/Secretary'}</span>
                <span className="text-[8px] text-neutral-400 block font-mono">Date: {docDate}</span>
              </div>
            </div>
          </div>

          {/* Verification Code */}
          <div className="flex justify-between items-center text-[7px] text-neutral-400 font-mono mt-1 pt-1 border-t border-neutral-100">
            <span>CROSS RIVER ID CORP NETWORK CERTIFICATION</span>
            <span>QR-REFID: CR-{doc.id.toUpperCase().slice(0,10)}</span>
          </div>
        </div>
      </div>
    );
  }

  // 5. ONDO EAST LOCAL GOVERNMENT CERTIFICATE
  if (isOndoEast) {
    return (
      <div 
        id={`certificate-root-${doc.id}`}
        style={{
          width: '100%',
          maxWidth: isPrintMode ? '100%' : '595px',
          minHeight: isPrintMode ? '100vh' : '820px',
          aspectRatio: '1 / 1.414',
        }}
        className="font-serif select-none p-6 sm:p-10 relative overflow-hidden bg-white shadow-xl rounded-lg flex flex-col justify-between text-[#111111] border border-gray-200 z-0"
      >
        {/* Simple double line border layout */}
        <div className="absolute inset-0 border-2 border-neutral-800 m-3 pointer-events-none z-10">
          <div className="absolute inset-2 border border-neutral-300"></div>
        </div>

        {/* Highly detailed giant watermark in background */}
        {renderBackgroundWatermark("opacity-[0.09]")}
        {renderDraftWatermark()}

        <div className="relative z-20 h-full flex flex-col justify-between p-3 m-2">
          {/* Top Section */}
          <div className="text-center">
            
            {/* Top row with Ondo Sun Logo on left and Coat of Arms in center */}
            <div className="flex justify-between items-center w-full px-2 mb-2">
              {/* Left: Ondo State Orange Sun logo */}
              <div className="flex items-center gap-1.5 origin-left scale-90">
                <div className="w-10 h-10 rounded-full bg-amber-400 border border-amber-600 flex items-center justify-center text-md relative shadow-xs">
                  <div className="absolute inset-0.5 rounded-full border border-dashed border-amber-800"></div>
                  <span>☀️</span>
                </div>
                <div className="text-left font-sans leading-none">
                  <span className="text-[10px] font-black text-amber-600 block uppercase leading-none">Ondo State</span>
                  <span className="text-[8px] text-[#047857] font-bold block leading-none mt-0.5">Ise Loogun Ise</span>
                </div>
              </div>

              {/* Center: Nigerian Coat of arms */}
              <svg viewBox="0 0 100 100" className="w-14 h-14 text-neutral-800 fill-current scale-95">
                <circle cx="50" cy="50" r="45" fill="#f8fafc" stroke="#111" strokeWidth="1" />
                <path d="M50 18 L72 36 L62 70 L38 70 L28 36 Z" fill="#111" />
                <path d="M50 22 L33 37 L40 65 L60 65 L67 37 Z" fill="#ffffff" />
                <circle cx="50" cy="48" r="9" fill="#dc2626" />
              </svg>

              {/* Right: reference serial block */}
              <div className="text-right font-mono text-[9px] text-neutral-600 scale-95 origin-right leading-relaxed">
                <span className="block font-bold text-[8.5px] uppercase font-sans text-[#7c2d12]">Original Reference</span>
                <span className="block border border-neutral-200 bg-neutral-50 px-1 font-black text-black">Ref: OG-{doc.id.slice(0,6).toUpperCase()}</span>
              </div>
            </div>

            {/* LGA Thick bold header */}
            <div className="space-y-0.5 text-center mt-1">
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-900 font-sans">
                {lga.toUpperCase()} LOCAL GOVERNMENT
              </h1>
              <p className="text-[10px] sm:text-xs font-semibold text-neutral-600 italic tracking-wider leading-none">
                P.M.B. 514, {lga}, {state}
              </p>
            </div>

            {/* Certificate of Origin cursive Red Title */}
            <div className="my-3">
              <h3 className="text-2xl font-serif text-[#b91c1c] italic tracking-wide font-black">
                Certificate of Origin
              </h3>
              {/* Blue handwritten subtitle */}
              <span className="font-sans text-xs italic text-blue-800 font-bold block leading-none">
                "This is to certify that from enquiry made"
              </span>
            </div>
          </div>

          {/* Paragraph content styled exactly as dot-spaced ledger fields in Image 5 */}
          <div className="my-2 text-left text-sm sm:text-base leading-loose max-w-lg mx-auto space-y-4 font-serif text-neutral-800 px-2">
            <p>
              of <span className="font-sans font-black text-black uppercase underline decoration-neutral-800 decoration-2 px-1">{gender}. {fullName}</span>
            </p>

            <p>
              is a native of <span className="font-bold underline text-black px-1">{townOrVillage}</span> in <b className="uppercase text-[#a21caf]">{lga}</b>
            </p>

            <p>
              Local Government of <span className="font-bold border-b border-black">{state}</span>.
            </p>

            <p>
              HIS/HER Father <span className="font-bold underline text-black px-1">{fatherName}</span>
            </p>

            <p>
              and Mother <span className="font-bold underline text-black px-1">{motherName}</span>
            </p>

            <p>
              were born and breed at <span className="font-bold underline text-black px-1">{bornPlace}</span>.
            </p>

            <p>
              This certificate of origin is issued today <span className="font-sans font-bold border-b-2 border-dashed border-red-500/50 text-neutral-900 bg-neutral-50/50 px-2 font-mono text-xs">{docDate}</span>
            </p>

            <p>
              at <span className="font-bold italic text-neutral-700">{lga} Local Government Secretariat</span>.
            </p>
          </div>

          {/* Bottom Row Seals & Diagonal ink stamps */}
          <div className="pt-4 border-t border-neutral-200 flex justify-between items-end relative overflow-visible">
            
            {/* Spiky Red Wax Seal left */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-red-700 flex items-center justify-center text-white text-center text-[7px] font-black p-1 leading-none shadow-md rotate-[-6deg] select-none scale-105">
                <span className="border-2 border-dashed border-white/50 rounded-full w-full h-full flex items-center justify-center">CHAIRMAN STAR</span>
              </div>
              <span className="text-[9px] font-bold text-neutral-500 font-sans mt-1">Chairman / Stamp</span>
            </div>

            {/* Overlaid DIAGONAL purple personnel stamp left-of-signatures */}
            <div className="absolute right-[170px] bottom-[30px] rotate-[-15deg] bg-blue-100/90 border-2 border-blue-650 px-2 py-1 text-[7px] text-blue-800 font-sans font-bold leading-tight font-black shadow-sm select-none z-30 uppercase text-center scale-95 pr-2">
              <div className="border border-dashed border-blue-650/50 p-0.5">
                <span className="block text-[8px]">HEAD OF PERSONNEL SIGN</span>
                <span className="block text-red-650">{lga.toUpperCase()} LGA</span>
                <span>DIRECTOR OF MANAGEMENT</span>
              </div>
            </div>

            {/* Signature Right */}
            <div className="text-right min-w-[180px] font-sans">
              <span className="text-[10px] text-neutral-500 italic block mb-7">for administrative clearance checks</span>
              <div className="border-t border-neutral-400 pt-1 w-full text-center">
                <span className="text-blue-800 block text-xs italic font-black h-4 mt-0.5 select-none">{officerName}</span>
                <span className="text-xs font-bold text-neutral-900 block leading-tight">{officerName.toUpperCase()}</span>
                <span className="text-[9px] text-[#b91c1c] block font-semibold leading-none">{officerTitle}</span>
              </div>
            </div>
          </div>

          {/* Stamp Date compliance record line */}
          <div className="flex justify-between items-center text-[7px] text-neutral-400 font-mono mt-1 border-t border-neutral-150 pt-1">
            <span>ONDO STATE GOVT ADMINISTRATIVE CLEARANCE</span>
            <span>ID: ON-EAST-{doc.id.slice(0, 8).toUpperCase()}</span>
          </div>

        </div>
      </div>
    );
  }

  return null;
}
