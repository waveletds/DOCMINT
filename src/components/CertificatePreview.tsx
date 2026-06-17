import { GeneratedDocument } from '../types.js';
import { QrCode, Camera } from 'lucide-react';
import { getPresetConfig } from '../state-presets.js';

interface CertificatePreviewProps {
  doc: GeneratedDocument;
  isPrintMode?: boolean;
}

export default function CertificatePreview({ doc, isPrintMode = false }: CertificatePreviewProps) {
  const inputs = doc.inputs || {};
  const stylePreset = inputs.stylePreset || 'Imo Heartland (Green teeth border)';
  const presetConfig = getPresetConfig(stylePreset);

  // Destructure inputs with fallbacks
  const rawState = inputs.state || presetConfig.stateName || 'Imo State';
  const stateSuffix = (rawState && !rawState.toLowerCase().includes('state') && !rawState.toLowerCase().includes('abuja') && !rawState.toLowerCase().includes('fct')) ? ' State' : '';
  const state = `${rawState}${stateSuffix}`;
  const lga = inputs.lga || 'Oguta';
  const fullName = inputs.fullName || inputs.childName || 'Odebiye Aduragbemi Adekunle';
  const gender = inputs.gender || 'MR';
  const townOrVillage = inputs.townOrVillage || 'Oguta Village';
  const autonomousCommunity = inputs.autonomousCommunity || '';
  const traditionalRuler = inputs.traditionalRuler || '';
  const certificateNo = inputs.certificateNo || 'IM/LO/ABJ/2063';
  const officerName = inputs.officerName || 'Hon. Anthony Njoku';
  const officerTitle = inputs.officerTitle || 'Liaison Officer';
  
  // Custom new optional fields
  const fatherName = inputs.fatherName || 'Chief Odebiye Yusuf Kunle';
  const motherName = inputs.motherName || 'Deaconess Oluwaseun Beatrice';
  const bornPlace = inputs.bornPlace || inputs.placeOfBirth || 'Ondo East Town Center';

  const isBirthCert = doc.categoryId === 'birth-certificate';
  const certTitle = isBirthCert ? 'ATTESTATION OF BIRTH' : 'CERTIFICATE OF STATE OF ORIGIN';

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

  const isImoHeartland = presetConfig.layout === 'teeth';
  const isLagosEpe = presetConfig.layout === 'tricolor';
  const isOgutaClassic = presetConfig.layout === 'circle';
  const isCrossRiverIkom = presetConfig.layout === 'double';
  const isOndoEast = presetConfig.layout === 'seal';

  // Dynamic alternating teeth border for different state styles
  const renderImoTeethBorder = () => {
    const teethColor = presetConfig.teethColorHex || '#006e4a';
    return (
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Top */}
        <div className="absolute top-0 inset-x-0 h-4 flex overflow-hidden">
          {Array.from({ length: 48 }).map((_, i) => (
            <svg key={`t-${i}`} className="w-4 h-4 shrink-0" viewBox="0 0 16 16">
              <polygon points="0,0 16,0 8,16" fill={teethColor} />
              <polygon points="0,16 8,0 16,16" fill="#ffffff" />
            </svg>
          ))}
        </div>
        {/* Bottom */}
        <div className="absolute bottom-0 inset-x-0 h-4 flex overflow-hidden rotate-180">
          {Array.from({ length: 48 }).map((_, i) => (
            <svg key={`b-${i}`} className="w-4 h-4 shrink-0" viewBox="0 0 16 16">
              <polygon points="0,0 16,0 8,16" fill={teethColor} />
              <polygon points="0,16 8,0 16,16" fill="#ffffff" />
            </svg>
          ))}
        </div>
        {/* Left */}
        <div className="absolute left-0 top-4 bottom-4 w-4 flex flex-col overflow-hidden">
          {Array.from({ length: 70 }).map((_, i) => (
            <svg key={`l-${i}`} className="w-4 h-4 shrink-0 rotate-90" viewBox="0 0 16 16">
              <polygon points="0,0 16,0 8,16" fill={teethColor} />
              <polygon points="0,16 8,0 16,16" fill="#ffffff" />
            </svg>
          ))}
        </div>
        {/* Right */}
        <div className="absolute right-0 top-4 bottom-4 w-4 flex flex-col overflow-hidden">
          {Array.from({ length: 70 }).map((_, i) => (
            <svg key={`r-${i}`} className="w-4 h-4 shrink-0 -rotate-90" viewBox="0 0 16 16">
              <polygon points="0,0 16,0 8,16" fill={teethColor} />
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-28deg] text-black/10 font-sans font-black text-4xl sm:text-5xl text-center select-none pointer-events-none uppercase tracking-widest z-30 whitespace-nowrap">
          Draft Preview - No Authority
        </div>
      );
    }
    return null;
  };

  // Render user's custom watermark logo or empty if none (removed automated watermark as requested)
  const renderBackgroundWatermark = (opacity = "opacity-[0.08]") => {
    if (doc.addWatermark && doc.watermarkLogo) {
      const align = doc.watermarkLogoAlign || 'center';
      let containerClass = "absolute inset-x-4 inset-y-12 flex items-center justify-center pointer-events-none z-0 select-none";
      let imgClass = "w-2/3 h-2/3 object-contain";
      
      if (align === 'left') {
        containerClass = "absolute left-6 top-[30%] w-32 h-32 flex items-center justify-center pointer-events-none z-0 select-none";
        imgClass = "w-full h-full object-contain";
      } else if (align === 'right') {
        containerClass = "absolute right-6 top-[30%] w-32 h-32 flex items-center justify-center pointer-events-none z-0 select-none";
        imgClass = "w-full h-full object-contain";
      } else if (align === 'diagonal') {
        containerClass = "absolute inset-x-4 inset-y-12 flex items-center justify-center pointer-events-none z-0 select-none rotate-[-25deg]";
        imgClass = "w-2/3 h-2/3 object-contain";
      } else { // center
        containerClass = "absolute inset-x-4 inset-y-12 flex items-center justify-center pointer-events-none z-0 select-none";
        imgClass = "w-2/3 h-2/3 object-contain";
      }
      
      return (
        <div className={`${containerClass} ${opacity}`} style={{ mixBlendMode: 'multiply' }}>
          <img 
            src={doc.watermarkLogo} 
            className={imgClass} 
            alt="Watermark background" 
            referrerPolicy="no-referrer"
          />
        </div>
      );
    }
    // Automated/hardcoded watermark removed as requested by the user.
    return null;
  };

  // 1. IMO STATE HEARTLAND TEMPLATE (TEETH BORDER PATTERN)
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
                  No. <b className="text-black">{certificateNo.split('/')[0] || presetConfig.stateName.slice(0, 2)}/{certificateNo.split('/')[1] || 'LO'}/{certificateNo.split('/')[2] || 'ABJ'}</b>
                </span>
                <span className="font-mono text-[10px] block font-black text-neutral-800 mt-1" style={{ color: presetConfig.primaryColor }}>
                  {certificateNo.split('/').slice(-1)[0] || '2063'}
                </span>
              </div>

              {/* Center Crest */}
              <div className="col-span-6 flex justify-center">
                <div className="relative">
                  <svg viewBox="0 0 100 100" className="w-16 h-16 text-black fill-current">
                     <path d="M50,5 L80,25 L80,65 L50,95 L20,65 L20,25 Z" fill={presetConfig.primaryColor} />
                     <path d="M50,10 L75,28 L75,62 L50,88 L25,62 L25,28 Z" fill="#ffffff" />
                     <circle cx="50" cy="48" r="14" fill={presetConfig.primaryColor} />
                     <text x="50" y="55" fontSize="18" textAnchor="middle">{presetConfig.crestEmoji || '🦁'}</text>
                  </svg>
                </div>
              </div>

              {/* Right Side Liaison office text block from reference */}
              <div className="col-span-3 text-left border border-neutral-300 p-1 bg-neutral-50 rounded text-[7px] leading-tight font-sans text-neutral-800 scale-95 origin-right">
                <b className="text-[7.5px] block border-b border-neutral-200 pb-0.5 mb-0.5" style={{ color: presetConfig.primaryColor }}>{presetConfig.liaisonTitle}</b>
                {presetConfig.liaisonAddressLines.map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            </div>

            {/* Header Title */}
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-royal font-black uppercase tracking-tight text-neutral-900" style={{ color: presetConfig.primaryColor }}>
                GOVERNMENT OF {presetConfig.stateName} OF NIGERIA
              </h1>
              <p className="text-[10px] font-extrabold uppercase tracking-widest font-sans" style={{ color: presetConfig.primaryColor }}>
                ({presetConfig.slogan})
              </p>
            </div>

            {/* Document Red Title */}
            <div className="mt-4 mb-5">
              <h3 className="text-lg sm:text-xl font-royal font-black uppercase tracking-widest border-y-2 py-1 px-4 max-w-md mx-auto" style={{ color: presetConfig.primaryColor, borderColor: presetConfig.primaryColor }}>
                {certTitle}
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
            {isBirthCert ? (
              <div className="space-y-3.5 max-w-lg text-left font-serif text-sm">
                <p className="font-medium text-neutral-800">
                  This is to certify and attest that: <span className="font-royal italic font-black text-black text-lg uppercase underline decoration-2 px-1" style={{ textDecorationColor: presetConfig.primaryColor }}>{fullName} ({gender})</span>
                </p>
                <p className="text-neutral-800">
                  was born at: <span className="font-bold underline text-black">{bornPlace}</span>
                </p>
                <p className="text-neutral-800">
                  on the date: <span className="font-bold underline text-black">{inputs.dateOfBirth || docDate}</span>
                </p>
                <p className="text-neutral-800">
                  to the father: <span className="font-bold text-black border-b border-neutral-300 pb-0.5">{fatherName}</span>
                </p>
                <p className="text-neutral-805">
                  and mother: <span className="font-bold text-black border-b border-neutral-300 pb-0.5">{motherName}</span>.
                </p>
                <p className="text-neutral-700 font-sans text-xs">
                  This record is registered with <span className="font-black" style={{ color: presetConfig.primaryColor }}>{lga} LGA</span> of {state || 'Nigeria'}.
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-w-lg text-left font-serif">
                <p className="text-base font-medium text-neutral-800">
                  This is to certify that <span className="font-royal italic font-black text-black text-lg uppercase underline decoration-2 px-1" style={{ textDecorationColor: presetConfig.primaryColor }}>{gender}. {fullName}</span>
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
                  of <span className="font-black" style={{ color: presetConfig.primaryColor }}>{presetConfig.stateName}</span> of Nigeria.
                </p>

                <p className="text-neutral-700">
                  The name of his/her traditional ruler is <span className="font-bold underline text-black">{traditionalRuler || presetConfig.traditionalRulerFallback}</span>
                </p>
              </div>
            )}
          </div>

          {/* Warning notice stamp */}
          <div className="my-3 text-center">
            <div className="border border-neutral-300 p-1.5 max-w-sm mx-auto text-[9px] uppercase font-bold bg-neutral-50/80 text-neutral-500 leading-normal">
              This official certificate is generated under direct municipal administrative oversight and is<br/>
              <span className="font-black" style={{ color: presetConfig.primaryColor }}>NOT TRANSFERABLE</span>
            </div>
          </div>

          {/* Footer Seals & Signatures */}
          <div className="pt-2 border-t border-dashed border-neutral-200 flex justify-between items-end">
            <div className="flex gap-2 items-center">
              {/* Approved wax stamp representation */}
              <div className={`relative w-16 h-16 rounded-full border-2 border-dashed flex flex-col items-center justify-center text-center font-sans text-[7px] rotate-[-10deg] select-none scale-90 ${presetConfig.stampColorClass}`}>
                <b>{presetConfig.stampText}</b>
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
          <div className="flex justify-between items-center text-[7px] text-neutral-400 font-mono border-t border-neutral-100 pt-1 mt-1 font-bold font-sans">
            <span>{presetConfig.stateName} DIGI-GOV VALIDATION PROTOCOL</span>
            <div className="flex gap-1 items-center bg-white px-1 border border-neutral-250 rounded">
              <QrCode className="h-2.5 w-2.5 text-neutral-700" />
              <span>REF-CODE: {doc.id.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. LAGOS STATE EPE LOCAL GOVERNMENT CERTIFICATE (TRICOLOR RIBBON PATTERN)
  if (isLagosEpe) {
    const b0 = presetConfig.bannerColors?.[0] || '#0284c7';
    const b1 = presetConfig.bannerColors?.[1] || '#dc2626';
    const b2 = presetConfig.bannerColors?.[2] || '#16a34a';
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
          <div className="w-1/3 h-full" style={{ backgroundColor: b0 }}></div>
          <div className="w-1/3 h-full" style={{ backgroundColor: b1 }}></div>
          <div className="w-1/3 h-full" style={{ backgroundColor: b2 }}></div>
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
                  <span className="text-[12px]">{presetConfig.crestEmoji || '🌴'}</span>
                </div>
                <span className="text-[6px] font-bold text-[#dc2626] leading-none uppercase">{presetConfig.stateName}</span>
              </div>
              <div className="w-1 h-3 bg-gradient-to-b from-neutral-400 to-transparent"></div>
            </div>

            {/* LGA Bold Blue header with double underlines */}
            <div className="space-y-0.5 text-center">
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-normal border-b pb-0.5 inline-block font-sans" style={{ color: presetConfig.primaryColor, borderBottomColor: presetConfig.primaryColor }}>
                {lga.toUpperCase()} LOCAL GOVERNMENT
              </h1>
              <p className="text-xs sm:text-sm font-bold tracking-widest uppercase font-sans" style={{ color: presetConfig.primaryColor }}>
                {presetConfig.stateName}, NIGERIA
              </p>
            </div>

            {/* OHLG Reference block */}
            <div className="mt-3 text-center border-y border-neutral-200 py-1 max-w-sm mx-auto font-sans text-[10px] text-neutral-800">
              <span className="font-semibold text-[9.5px]">OHLG No:</span> <b className="font-mono bg-white px-1 border border-neutral-200">{certificateNo}</b> &nbsp;&bull;&nbsp; <span className="font-semibold">Date:</span> <b className="font-mono">{docDate.toUpperCase()}</b>
            </div>

            {/* Gothic redviolet title exactly like pic */}
            <div className="my-4">
              <h3 className="text-2xl font-semibold italic py-1.5 font-serif tracking-normal border-b border-black/10 inline-block" style={{ color: presetConfig.primaryColor }}>
                {isBirthCert ? 'Attestation of Birth' : 'Certificate of Origin'}
              </h3>
            </div>
          </div>

          {/* Certificate statement */}
          <div className="my-3 text-center space-y-4 max-w-md mx-auto">
            <p className="text-lg italic font-sans text-neutral-700 leading-none">
              This is to certify that
            </p>

            <div className="my-3 py-1 border-b-2 border-dashed" style={{ borderBottomColor: `${presetConfig.primaryColor}50` }}>
              <span className="text-xl sm:text-2xl font-royal italic font-black block text-black uppercase tracking-wide">
                {isBirthCert ? fullName : `${gender}. ${fullName}`}
              </span>
            </div>

            {isBirthCert ? (
              <div className="space-y-2 text-sm text-neutral-850 font-sans leading-relaxed">
                <p>was born at <span className="font-bold">{bornPlace}</span> on <span className="font-bold">{inputs.dateOfBirth || docDate}</span>.</p>
                <p>Father: <span className="font-semibold">{fatherName}</span> &nbsp;&bull;&nbsp; Mother: <span className="font-semibold">{motherName}</span></p>
                <p className="text-md font-black text-blue-900 pt-1">{lga.toUpperCase()} LOCAL GOVERNMENT AREA</p>
                <p>of {state || 'Nigeria'}.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-md leading-relaxed text-neutral-800 font-sans">
                  is an Indigene of <span className="font-bold border-b border-black text-[#0c4a6e] px-1">{townOrVillage || 'Local Town'}</span> in
                </p>

                <p className="text-lg font-black text-[#31572c] leading-tight font-sans">
                  {lga.toUpperCase()} LOCAL GOVERNMENT AREA
                </p>

                <p className="text-md text-neutral-800 leading-relaxed font-sans">
                  of <span className="font-black text-blue-900">{presetConfig.stateName}, Nigeria</span>.
                </p>
              </div>
            )}

            <div className="pt-2">
              <p className="font-bold italic text-xs leading-relaxed max-w-xs mx-auto" style={{ color: presetConfig.primaryColor }}>
                "You are requested to give Him/her the necessary assistance He/She may require."
              </p>
            </div>
          </div>

          {/* Bottom Wax seal left, rubber purple stamp right */}
          <div className="pt-4 border-t border-neutral-200 flex justify-between items-center px-4">
            {/* Red Wax Seal Sticker */}
            <div className="w-16 h-16 rounded-full shadow-md border-2 border-white/80 flex items-center justify-center text-white text-center text-[7px] font-bold p-1 leading-none select-none shrink-0 rotate-[8deg]" style={{ backgroundColor: presetConfig.primaryColor }}>
              <div className="rounded-full border border-dashed border-white/50 w-full h-full flex flex-col justify-center items-center">
                <span>⭐ {lga.toUpperCase().split(' ')[0]} ⭐</span>
                <span className="text-[5px] mt-0.5 uppercase">LGA SEAL</span>
              </div>
            </div>

            {/* Purple rubber stamp */}
            <div className={`relative w-20 h-20 rounded-full border-4 border-double flex flex-col items-center justify-center text-center font-sans text-[7.5px] font-black rotate-[-4deg] select-none bg-white/20 ${presetConfig.stampColorClass || 'border-[#00c060]/40 text-[#00c060]/55'}`}>
              <span className="leading-tight">{lga.toUpperCase().split(' ')[0]} LOCAL</span>
              <span className="text-[9px] border-y border-purple-400/45 my-0.5">APPROVED</span>
              <span className="text-[7.5px] font-mono">{docDate}</span>
            </div>

            {/* Signature Block */}
            <div className="text-right min-w-[150px] font-sans">
              <div className="border-t border-neutral-400 pt-1.5 inline-block text-center w-full">
                <span className="text-[#0284c7] block text-xs tracking-tight italic font-black h-4 select-none" style={{ color: presetConfig.primaryColor }}>
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
            <span>{presetConfig.stateName} ELECTRONIC RECORD SYSTEM</span>
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
        <div className="absolute inset-0 border-4 m-3 pointer-events-none z-10" style={{ borderColor: `${presetConfig.primaryColor}95` }}>
          <div className="absolute inset-1 border border-dashed" style={{ borderColor: `${presetConfig.primaryColor}70` }}></div>
        </div>

        {renderBackgroundWatermark("opacity-[0.05]")}
        {renderDraftWatermark()}

        <div className="relative z-20 h-full flex flex-col justify-between p-2 m-2">
          {/* Top header lines */}
          <div className="text-center">
            <div className="flex justify-between items-center px-4 text-xs font-bold text-neutral-500 font-sans tracking-wide">
              <span>Original Copy</span>
              <span className="font-bold" style={{ color: presetConfig.primaryColor }}>OG-NO: {certificateNo}</span>
            </div>

            {/* Large circular coat of arms seal */}
            <div className="flex justify-center my-3">
              <div className="w-16 h-16 rounded-full border-4 border-dotted bg-white flex items-center justify-center p-1 shadow-xs" style={{ borderColor: presetConfig.primaryColor }}>
                <span className="text-2xl">{presetConfig.crestEmoji || '🔱'}</span>
              </div>
            </div>

            {/* Split Green header */}
            <div className="space-y-0.5 text-center px-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight uppercase font-sans" style={{ color: presetConfig.primaryColor }}>
                GOVERNMENT OF {state.toUpperCase() || presetConfig.stateName}
              </h1>
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-widest font-sans border-b-2 border-neutral-200 pb-1 max-w-sm mx-auto" style={{ color: presetConfig.primaryColor }}>
                {lga.toUpperCase()} LOCAL GOVERNMENT AREA
              </h2>
            </div>

            {/* Giant Red heading */}
            <div className="my-4">
              <h3 className="text-2xl sm:text-3xl font-black uppercase font-sans tracking-tight leading-none mb-1" style={{ color: presetConfig.primaryColor }}>
                {isBirthCert ? 'Birth Registration Attestation' : 'Identification Certificate'}
              </h3>
            </div>
          </div>

          {/* Dotted underline text content */}
          <div className="my-2 space-y-3.5 text-sm sm:text-base leading-relaxed max-w-lg mx-auto text-center font-serif text-neutral-800">
            <p className="italic font-sans text-neutral-600 leading-none text-base">This is to certify that</p>

            <div className="border-b border-dotted border-black/75 py-1 px-4">
              <b className="text-xl sm:text-2xl text-black uppercase font-royal italic font-black tracking-tight">{isBirthCert ? fullName : `${gender}. ${fullName}`}</b>
            </div>
            <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-sans block mt-0">
              {isBirthCert ? 'NAME OF REGISTERED INDIVIDUAL' : 'NAME OF REGISTRANT (IN BLOCK LETTERS)'}
            </span>

            {isBirthCert ? (
              <div className="text-left space-y-3 pt-1 text-md leading-relaxed">
                <p>was born at: <span className="font-bold underline text-black px-1">{bornPlace}</span> on: <span className="font-bold border-b border-dashed text-black px-1">{inputs.dateOfBirth || docDate}</span>.</p>
                <p>Father: <span className="font-semibold underline text-neutral-800">{fatherName}</span></p>
                <p>Mother: <span className="font-semibold underline text-neutral-800">{motherName}</span></p>
                <p>This registration falls under: <span className="font-black" style={{ color: presetConfig.primaryColor }}>{lga} LGA</span> of {state || 'Nigeria'}.</p>
              </div>
            ) : (
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
                  situated in <span className="font-bold uppercase" style={{ color: presetConfig.primaryColor }}>{lga}</span> Local Government Area of <span className="font-black text-neutral-900 border-b border-dashed border-neutral-300">{state}</span>, Federal Republic of Nigeria.
                </p>
              </div>
            )}
            <p className="text-center font-mono text-xs text-neutral-600 pt-1 border-y border-dotted border-neutral-200 py-1.5">
              📅 DATED THIS: <span className="font-black text-black">{docDate.toUpperCase()}</span>
            </p>
          </div>

          {/* Bottom Seals & Double Spiky seals */}
          <div className="pt-2 border-t border-dashed border-neutral-200 flex justify-between items-end">
            {/* Spiky Red Seal Left */}
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-center text-[7px] font-black p-1 leading-none shadow-md rotate-[-8deg] relative select-none" style={{ backgroundColor: presetConfig.primaryColor }}>
              <span className="border-2 border-dashed border-white/40 rounded-full w-full h-full flex items-center justify-center">OFFICIAL SEAL</span>
            </div>

            {/* Officer signature block */}
            <div className="text-center min-w-[180px] font-sans">
              <span className="text-[10px] text-neutral-500 italic block mb-6">OFFICER'S SIGNATURE & DATE</span>
              <div className="border-t border-neutral-400 pt-1 w-full text-center">
                <span className="text-blue-700 block text-xs italic font-black h-4 mt-0.5 select-none" style={{ color: presetConfig.primaryColor }}>{officerName}</span>
                <span className="text-xs font-bold text-neutral-900 block leading-tight">{officerName.toUpperCase()}</span>
                <span className="text-[9px] block font-semibold leading-none" style={{ color: presetConfig.primaryColor }}>{officerTitle}</span>
              </div>
            </div>

            {/* Spiky Red Seal Right */}
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-center text-[7px] font-black p-1 leading-none shadow-md rotate-[12deg] relative select-none" style={{ backgroundColor: presetConfig.primaryColor }}>
              <span className="border-2 border-dashed border-white/40 rounded-full w-full h-full flex items-center justify-center">APPROVED</span>
            </div>
          </div>

          {/* Barcode line */}
          <div className="flex justify-between items-center text-[7px] text-neutral-400 font-mono mt-1 border-t border-neutral-150 pt-1">
            <span>SECURED BY {state.toUpperCase()} ADMINISTRATIVE COUNCIL SYSTEM</span>
            <span>VERIFICATION CODE: OG-{doc.id.slice(0, 8).toUpperCase()}</span>
          </div>
        </div>
      </div>
    );
  }

  // 4. CROSS RIVER STATE IKOM LOCAL GOVERNM  // 4. CROSS RIVER STATE IKOM LOCAL GOVERNMENT CERTIFICATE (DOUBLE BORDER PATTERN)
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
        {/* Rounded double frame border */}
        <div className="absolute inset-0 border-[10px] border-double m-3 rounded-xl pointer-events-none z-10" style={{ borderColor: presetConfig.primaryColor }}></div>

        {renderBackgroundWatermark("opacity-[0.06]")}
        {renderDraftWatermark()}

        <div className="relative z-20 h-full flex flex-col justify-between p-3 m-2">
          {/* Header */}
          <div className="text-center pt-2">
            <span className="font-sans text-[10px] font-black tracking-widest block mb-2 uppercase" style={{ color: presetConfig.primaryColor }}>{presetConfig.stateName} OF NIGERIA</span>

            {/* Flanked logos with Coat of arms in center */}
            <div className="flex justify-between items-center w-full max-w-[340px] mx-auto mb-3">
              {/* Left logo: State waves/emblem */}
              <div className="w-13 h-13 rounded-full border bg-white flex flex-col items-center justify-center font-sans text-[5.5px] font-extrabold leading-none tracking-tight shadow-xs p-0.5" style={{ borderColor: presetConfig.primaryColor, color: presetConfig.primaryColor }}>
                <span className="uppercase text-center leading-none">{presetConfig.stateName.split(' ')[0]}</span>
                <span className="text-[11px] my-0.5">{presetConfig.crestEmoji || '🌊'}</span>
                <span className="uppercase leading-none">{presetConfig.slogan.split(' ').slice(-1)[0] || 'GOVT'}</span>
              </div>

              {/* Center Nigerian Coat of Arms */}
              <svg viewBox="0 0 100 100" className="w-14 h-14 text-neutral-800 fill-current">
                <path d="M50,10 L90,40 L95,80 L50,95 L5,80 L10,40 Z" fill={presetConfig.primaryColor} />
                <path d="M50,15 L15,82 L85,82 Z" fill="#ffffff" />
                <circle cx="50" cy="54" r="10" fill={presetConfig.primaryColor} />
              </svg>

              {/* Right logo: LGA mark */}
              <div className="w-13 h-13 rounded-full border bg-white flex flex-col items-center justify-center font-sans text-[5.5px] font-extrabold leading-none tracking-tight shadow-xs p-0.5" style={{ borderColor: presetConfig.primaryColor, color: presetConfig.primaryColor }}>
                <span className="uppercase text-center leading-none">{lga.toUpperCase().split(' ')[0]} LGA</span>
                <span className="text-[11px] my-0.5">🏢</span>
                <span className="uppercase leading-none font-bold">HQ-{lga.toUpperCase().split(' ')[0]}</span>
              </div>
            </div>

            {/* Local Government header exact lettering */}
            <div className="space-y-0.5 text-center">
              <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#222222] font-sans">
                {lga.toUpperCase()} LOCAL GOVERNMENT
              </h1>
              <p className="text-[9px] font-black text-neutral-600 uppercase italic tracking-wider leading-none">
                LOCAL GOVERNMENT HEADQUARTERS, {lga.toUpperCase()}
              </p>
            </div>

            {/* Gothic Script Maroon title */}
            <div className="my-3">
              <h3 className="text-2xl font-bold font-serif italic tracking-wide" style={{ color: presetConfig.primaryColor }}>
                {isBirthCert ? 'Attestation of Birth' : 'Certificate of Origin'}
              </h3>
            </div>
          </div>

          {/* Dotted line form block with blue accent heading */}
          <div className="my-2 space-y-4 text-center max-w-lg mx-auto">
            {/* Contrast Violet highlight ribbon exact replica */}
            <div className="bg-[#581c87] text-white py-1 px-4 rounded font-sans font-bold text-xs max-w-xs mx-auto shadow-sm uppercase tracking-wider" style={{ backgroundColor: presetConfig.primaryColor }}>
              This is to certify that:
            </div>

            <div className="py-1 border-b border-neutral-300">
              <b className="text-xl sm:text-2xl text-black uppercase font-royal italic font-black tracking-wide">
                {isBirthCert ? fullName : `${gender}. ${fullName}`}
              </b>
            </div>

            {isBirthCert ? (
              <div className="space-y-3.5 text-sm text-neutral-850 font-sans leading-relaxed">
                <p>was born at: <span className="font-bold underline text-[#1d3a5f]">{bornPlace}</span> on: <span className="font-bold">{inputs.dateOfBirth || docDate}</span>.</p>
                <p>Father's Name: <span className="font-bold border-b border-neutral-300">{fatherName}</span></p>
                <p>Mother's Name: <span className="font-bold border-b border-neutral-300">{motherName}</span></p>
                <p>This registration is archived under <b className="text-[#047857]" style={{ color: presetConfig.primaryColor }}>{lga} Local Government</b> of {state || 'Nigeria'}.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-md font-sans text-neutral-700 italic leading-none">
                  whose photograph appears below, is an Indigene of
                </p>

                <div className="py-1 border-b border-neutral-300 max-w-sm mx-auto">
                  <span className="text-md font-bold text-[#0f172a] font-sans underline">{townOrVillage || 'Local Town'}</span>
                </div>

                <p className="text-md text-neutral-800 font-sans">
                  in <b className="text-[#047857] uppercase font-black" style={{ color: presetConfig.primaryColor }}>{lga} Local Government Area</b> of
                </p>

                <p className="text-lg font-black font-sans" style={{ color: presetConfig.primaryColor }}>
                  {presetConfig.stateName} of Nigeria
                </p>
              </div>
            )}

            {/* Issued details line */}
            <div className="text-xs text-neutral-600 font-sans pt-1 border-t border-dotted border-neutral-200 mt-2">
              Issued this: <span className="font-bold text-neutral-900 border-b border-neutral-400 pb-0.5 px-3 font-mono">{docDate}</span>
            </div>
          </div>

          {/* Bottom Area: Waves logo left, Photograph box right, Signature right */}
          <div className="pt-4 border-t border-neutral-200 grid grid-cols-12 gap-3 items-end font-sans">
            {/* Waves branding left */}
            <div className="col-span-3 text-left">
              <div className="text-blue-900 text-[6.5px] font-sans font-black leading-tight flex flex-col items-start scale-95 origin-left">
                <span className="text-neutral-500">DESTINATION</span>
                <span className="text-cyan-600 text-[10px] leading-none my-0.5">{presetConfig.crestEmoji || '🌊'}</span>
                <span className="text-[7.5px]" style={{ color: presetConfig.primaryColor }}>{presetConfig.stateName}</span>
                <span className="text-[5.5px] italic text-neutral-500">"{presetConfig.slogan}"</span>
              </div>
            </div>

            {/* Photograph placeholder box in center bottom */}
            <div className="col-span-4 flex justify-center">
              <div className="w-20 h-24 border border-neutral-500 bg-neutral-55/75 flex flex-col items-center justify-center p-0.5 text-center relative text-neutral-500">
                <Camera className="w-4 h-4 mb-0.5 text-neutral-400" />
                <span className="text-[6.5px] font-bold uppercase leading-tight">Passport<br/>photograph</span>
                <div className="absolute inset-0.5 border border-dashed border-neutral-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Signature Area Right */}
            <div className="col-span-5 text-right">
              <div className="w-full border-t border-neutral-400 pt-1 inline-block text-center scale-95 origin-bottom">
                <b className="text-[#3b82f6] block text-xs italic font-black h-4 select-none mb-1" style={{ color: presetConfig.primaryColor }}>{officerName}</b>
                <span className="text-[9.5px] font-black text-neutral-900 block leading-tight">{officerName.toUpperCase()}</span>
                <span className="text-[8.5px] text-neutral-500 font-extrabold uppercase block tracking-wider mt-0.5">{officerTitle || 'Chairman/Secretary'}</span>
                <span className="text-[8px] text-neutral-400 block font-mono">Date: {docDate}</span>
              </div>
            </div>
          </div>

          {/* Verification Code */}
          <div className="flex justify-between items-center text-[7px] text-neutral-400 font-mono mt-1 pt-1 border-t border-neutral-100">
            <span>{presetConfig.stateName} ID CORP NETWORK CERTIFICATION</span>
            <span>QR-REFID: {presetConfig.stateName.slice(0, 2).toUpperCase()}-{doc.id.toUpperCase().slice(0,10)}</span>
          </div>
        </div>
      </div>
    );
  }

  // 5. ONDO EAST LOCAL GOVERNMENT CERTIFICATE
  // 5. ONDO EAST LOCAL GOVERNMENT CERTIFICATE (LEDGER CARD PATTERN)
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
        <div className="absolute inset-0 border-2 m-3 pointer-events-none z-10" style={{ borderColor: `${presetConfig.primaryColor}B0` }}>
          <div className="absolute inset-2 border" style={{ borderColor: `${presetConfig.primaryColor}55` }}></div>
        </div>

        {/* Highly detailed giant watermark in background */}
        {renderBackgroundWatermark("opacity-[0.09]")}
        {renderDraftWatermark()}

        <div className="relative z-20 h-full flex flex-col justify-between p-3 m-2">
          {/* Top Section */}
          <div className="text-center">
            
            {/* Top row with State Logo on left and Coat of Arms in center */}
            <div className="flex justify-between items-center w-full px-2 mb-2">
              {/* Left: State Custom Sun/Insignia logo */}
              <div className="flex items-center gap-1.5 origin-left scale-90">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-md relative shadow-xs border" style={{ borderColor: presetConfig.primaryColor }}>
                  <div className="absolute inset-0.5 rounded-full border border-dashed" style={{ borderColor: `${presetConfig.primaryColor}80` }}></div>
                  <span>{presetConfig.crestEmoji || '☀️'}</span>
                </div>
                <div className="text-left font-sans leading-none">
                  <span className="text-[10px] font-black block uppercase leading-none" style={{ color: presetConfig.primaryColor }}>{presetConfig.stateName.split(' ')[0]} State</span>
                  <span className="text-[8px] text-[#047857] font-bold block leading-none mt-0.5">{presetConfig.slogan.slice(0, 20)}...</span>
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
                <span className="block border border-neutral-200 bg-neutral-55 px-1 font-black text-black">Ref: OG-{doc.id.slice(0,6).toUpperCase()}</span>
              </div>
            </div>

            {/* LGA Thick bold header */}
            <div className="space-y-0.5 text-center mt-1">
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-900 font-sans">
                {lga.toUpperCase()} LOCAL GOVERNMENT
              </h1>
              <p className="text-[10px] sm:text-xs font-semibold text-neutral-600 italic tracking-wider leading-none">
                P.M.B. 514, {lga}, {presetConfig.stateName}
              </p>
            </div>

            {/* Certificate of Origin cursive Title */}
            <div className="my-3">
              <h3 className="text-2xl font-serif italic tracking-wide font-black" style={{ color: presetConfig.primaryColor }}>
                {isBirthCert ? 'Attestation of Birth' : 'Certificate of Origin'}
              </h3>
              {/* Blue handwritten subtitle */}
              <span className="font-sans text-xs italic text-blue-800 font-bold block leading-none">
                "This is to certify that from enquiry made"
              </span>
            </div>
          </div>

          {/* Paragraph content styled exactly as dot-spaced ledger fields in Image 5 */}
          {isBirthCert ? (
            <div className="my-2 text-left text-sm sm:text-base leading-loose max-w-lg mx-auto space-y-3 font-serif text-neutral-800 px-2">
              <p>
                of <span className="font-royal italic font-black text-black text-lg uppercase underline decoration-neutral-800 decoration-2 px-1">{fullName} ({gender})</span>
              </p>

              <p>
                was born at hospital <span className="font-bold underline text-black px-1">{bornPlace}</span> on date <span className="font-bold underline text-black px-1">{inputs.dateOfBirth || docDate}</span>
              </p>

              <p>
                whose Father is <span className="font-bold underline text-black px-1">{fatherName}</span>
              </p>

              <p>
                and Mother is <span className="font-bold underline text-black px-1">{motherName}</span>.
              </p>

              <p>
                This birth registry is registered today <span className="font-sans font-bold border-b-2 border-dashed border-red-500/50 text-neutral-900 bg-neutral-55/50 px-2 font-mono text-xs">{docDate}</span>
              </p>

              <p>
                at <span className="font-bold italic text-neutral-700">{lga} Local Government Secretariat, {state}</span>.
              </p>
            </div>
          ) : (
            <div className="my-2 text-left text-sm sm:text-base leading-loose max-w-lg mx-auto space-y-4 font-serif text-neutral-800 px-2">
              <p>
                of <span className="font-royal italic font-black text-black text-lg uppercase underline decoration-neutral-800 decoration-2 px-1">{gender}. {fullName}</span>
              </p>

              <p>
                is a native of <span className="font-bold underline text-black px-1">{townOrVillage}</span> in <b className="uppercase text-[#a21caf]" style={{ color: presetConfig.primaryColor }}>{lga}</b>
              </p>

              <p>
                Local Government of <span className="font-bold border-b border-black">{presetConfig.stateName}</span>.
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
                This certificate of origin is issued today <span className="font-sans font-bold border-b-2 border-dashed border-black/35 text-neutral-900 bg-neutral-55/50 px-2 font-mono text-xs">{docDate}</span>
              </p>

              <p>
                at <span className="font-bold italic text-neutral-700">{lga} Local Government Secretariat</span>.
              </p>
            </div>
          )}

          {/* Bottom Row Seals & Diagonal ink stamps */}
          <div className="pt-4 border-t border-neutral-200 flex justify-between items-end relative overflow-visible">
            
            {/* Spiky Red Wax Seal left */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-center text-[7px] font-black p-1 leading-none shadow-md rotate-[-6deg] select-none scale-105" style={{ backgroundColor: presetConfig.primaryColor }}>
                <span className="border-2 border-dashed border-white/50 rounded-full w-full h-full flex items-center justify-center">CHAIRMAN STAR</span>
              </div>
              <span className="text-[9px] font-bold text-neutral-500 font-sans mt-1">Chairman / Stamp</span>
            </div>

            {/* Overlaid DIAGONAL purple personnel stamp left-of-signatures */}
            <div className="absolute right-[170px] bottom-[30px] rotate-[-15deg] bg-white border-2 px-2 py-1 text-[7px] text-black font-sans font-bold leading-tight font-black shadow-sm select-none z-30 uppercase text-center scale-95 pr-2" style={{ borderColor: presetConfig.primaryColor }}>
              <div className="border border-dashed p-0.5" style={{ borderColor: `${presetConfig.primaryColor}80` }}>
                <span className="block text-[8px]">HEAD OF PERSONNEL SIGN</span>
                <span className="block" style={{ color: presetConfig.primaryColor }}>{lga.toUpperCase()} LGA</span>
                <span>DIRECTOR OF MANAGEMENT</span>
              </div>
            </div>

            {/* Signature Right */}
            <div className="text-right min-w-[180px] font-sans">
              <span className="text-[10px] text-neutral-500 italic block mb-7">for administrative clearance checks</span>
              <div className="border-t border-neutral-400 pt-1 w-full text-center">
                <span className="text-blue-800 block text-xs italic font-black h-4 mt-0.5 select-none" style={{ color: presetConfig.primaryColor }}>{officerName}</span>
                <span className="text-xs font-bold text-[#111] block leading-tight">{officerName.toUpperCase()}</span>
                <span className="text-[9px] block font-semibold leading-none" style={{ color: presetConfig.primaryColor }}>{officerTitle}</span>
              </div>
            </div>
          </div>

          {/* Stamp Date compliance record line */}
          <div className="flex justify-between items-center text-[7px] text-neutral-400 font-mono mt-1 border-t border-neutral-150 pt-1">
            <span>{presetConfig.stateName.toUpperCase()} GOVT ADMINISTRATIVE CLEARANCE</span>
            <span>ID: {presetConfig.stateName.slice(0, 3).toUpperCase()}-LGA-{doc.id.slice(0, 8).toUpperCase()}</span>
          </div>

        </div>
      </div>
    );
  }

  return null;
}
