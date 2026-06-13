import React from 'react';
import { GeneratedDocument } from '../types.js';
import { Shield, QrCode } from 'lucide-react';

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

  // Helper renderers for distinct presets
  const isImoStyle = stylePreset.includes('Imo');
  const isLagosStyle = stylePreset.includes('Lagos') || stylePreset.includes('Epe');
  const isOgutaStyle = stylePreset.includes('Oguta');
  const isCrossRiverStyle = stylePreset.includes('Cross River') || stylePreset.includes('Ikom');
  const isOndoStyle = stylePreset.includes('Ondo');

  // Green alternating dynamic teeth border for Imo Style
  const renderImoTeethBorder = () => {
    return (
      <div className="absolute inset-x-0 inset-y-0 border-8 border-white pointer-events-none z-10">
        {/* Top rail */}
        <div className="absolute top-0 left-0 right-0 h-4 flex overflow-hidden bg-neutral-100">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={`top-${i}`} className="w-4 h-4 shrink-0 flex relative">
              <div className="w-2 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[16px] border-b-emerald-700"></div>
              <div className="w-2 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[16px] border-t-emerald-700 absolute left-2"></div>
            </div>
          ))}
        </div>
        {/* Bottom rail */}
        <div className="absolute bottom-0 left-0 right-0 h-4 flex overflow-hidden bg-neutral-100 rotate-180">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={`bot-${i}`} className="w-4 h-4 shrink-0 flex relative">
              <div className="w-2 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[16px] border-b-emerald-700"></div>
              <div className="w-2 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[16px] border-t-emerald-700 absolute left-2"></div>
            </div>
          ))}
        </div>
        {/* Left rail */}
        <div className="absolute top-4 bottom-4 left-0 w-4 flex flex-col overflow-hidden bg-neutral-100">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={`left-${i}`} className="w-4 h-4 shrink-0 relative flex rotate-90">
              <div className="w-2 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[16px] border-b-emerald-700"></div>
              <div className="w-2 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[16px] border-t-emerald-700 absolute left-2"></div>
            </div>
          ))}
        </div>
        {/* Right rail */}
        <div className="absolute top-4 bottom-4 right-0 w-4 flex flex-col overflow-hidden bg-neutral-100">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={`right-${i}`} className="w-4 h-4 shrink-0 relative flex -rotate-90">
              <div className="w-2 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[16px] border-b-emerald-700"></div>
              <div className="w-2 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[16px] border-t-emerald-700 absolute left-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div 
      id={`certificate-root-${doc.id}`}
      style={{
        width: '100%',
        maxWidth: isPrintMode ? '100%' : '595px',
        minHeight: isPrintMode ? '100vh' : '820px',
        aspectRatio: '1 / 1.414',
      }}
      className={`font-serif select-none p-6 sm:p-10 relative overflow-hidden bg-white shadow-xl rounded-lg flex flex-col justify-between text-[#1a1a1a] border border-gray-200 z-0 ${
        isLagosStyle ? 'bg-yellow-50/20' : ''
      }`}
    >
      {/* 1. Watermark overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none select-none z-0">
        <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 text-neutral-900 fill-current">
          {/* Detailed Coat of Arms vector outline placeholder */}
          <path d="M50 15 L75 35 L65 75 L35 75 L25 35 Z M50 20 L30 36 L38 70 L62 70 L70 36 Z" />
          <path d="M45 40 L55 40 L55 60 L45 60 Z" />
          <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {doc.addWatermark && !doc.paid && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-28deg] text-red-500/15 font-sans font-black text-4xl sm:text-5xl text-center select-none pointer-events-none uppercase tracking-widest z-30 whitespace-nowrap">
          Draft Preview - No Authority
        </div>
      )}

      {/* Style Specific Frame Borders */}
      {isImoStyle && renderImoTeethBorder()}

      {isLagosStyle && (
        <div className="absolute inset-y-0 left-0 w-8 flex flex-row shrink-0 bg-transparent z-10 border-r border-neutral-300">
          <div className="w-1/3 h-full bg-[#0ea5e9]"></div>
          <div className="w-1/3 h-full bg-[#dc2626]"></div>
          <div className="w-1/3 h-full bg-[#16a34a]"></div>
        </div>
      )}

      {isOgutaStyle && (
        <div className="absolute inset-0 border-4 border-emerald-600/60 m-3 pointer-events-none z-10">
          <div className="absolute inset-1 border border-dashed border-emerald-600/40"></div>
        </div>
      )}

      {isCrossRiverStyle && (
        <div className="absolute inset-0 border-[12px] border-double border-blue-900 m-2 pointer-events-none z-10"></div>
      )}

      {isOndoStyle && (
        <div className="absolute inset-0 border-2 border-neutral-800 m-3 pointer-events-none z-10">
          <div className="absolute inset-2 border border-neutral-300"></div>
        </div>
      )}

      {/* Main Content Area */}
      <div className={`relative z-20 h-full flex flex-col justify-between ${isLagosStyle ? 'pl-8' : ''}`}>
        
        {/* HEADER SECTION */}
        <div className="text-center pt-2">
          
          {/* Preset Custom Logo / Crest */}
          <div className="flex justify-center items-center mb-3">
            {isImoStyle && (
              <div className="relative">
                {/* Gold Coat-of-arms vector insignia */}
                <svg viewBox="0 0 100 100" className="w-16 h-16 text-amber-500 fill-current">
                  <path d="M50,5 L80,25 L80,65 L50,95 L20,65 L20,25 Z" fill="#d97706" />
                  <path d="M50,10 L75,28 L75,62 L50,88 L25,62 L25,28 Z" fill="#ffffff" />
                  <circle cx="50" cy="48" r="14" fill="#15803d" />
                  <path d="M42,48 L58,48 M50,40 L50,56" stroke="#ffffff" strokeWidth="3" />
                  {/* Miniature horses */}
                  <path d="M15,40 Q25,25 25,48 M85,40 Q75,25 75,48" stroke="#111" strokeWidth="2" fill="none" />
                </svg>
              </div>
            )}

            {isLagosStyle && (
              <div className="w-16 h-16 rounded-full border border-neutral-400 bg-amber-50 flex flex-col items-center justify-center p-1 text-center font-sans">
                <span className="text-[6px] font-bold text-emerald-800 tracking-tight">GOVERNMENT</span>
                <div className="w-10 h-6 border-y border-neutral-300 relative flex items-center justify-center my-0.5">
                  <span className="text-[12px]">🌴</span>
                </div>
                <span className="text-[6px] font-bold text-emerald-800 leading-none">EPE LGA</span>
              </div>
            )}

            {isOgutaStyle && (
              <div className="w-16 h-16 rounded-full border-4 border-dotted border-emerald-600 bg-white flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-10 h-10 text-emerald-700 fill-none stroke-current" strokeWidth="3">
                  <circle cx="50" cy="50" r="35" />
                  <path d="M30,50 Q50,20 70,50 T30,50" fill="emerald" />
                  <circle cx="50" cy="50" r="5" fill="crimson" />
                </svg>
              </div>
            )}

            {isCrossRiverStyle && (
              <div className="flex justify-between items-center w-full max-w-[280px]">
                <div className="w-10 h-10 rounded-full border border-blue-900 flex items-center justify-center font-sans text-[7px] font-bold leading-tight">CR STATE</div>
                <svg viewBox="0 0 100 100" className="w-12 h-12 text-blue-950 fill-current">
                  <path d="M50,10 L90,40 L95,80 L50,95 L5,80 L10,40 Z" />
                  <path d="M50,15 L15,82 L85,82 Z" fill="#ffffff" />
                </svg>
                <div className="w-10 h-10 rounded-full border border-blue-900 flex items-center justify-center font-sans text-[7px] font-bold leading-tight">IKOM LGA</div>
              </div>
            )}

            {isOndoStyle && (
              <div className="flex items-center gap-4">
                {/* Yellow sun motif */}
                <div className="w-12 h-12 rounded-full bg-amber-400 border border-amber-600 flex items-center justify-center relative">
                  <div className="absolute inset-1 rounded-full border border-dashed border-amber-800"></div>
                  <span className="text-lg">☀️</span>
                </div>
                <div className="text-left font-sans">
                  <span className="text-[10px] font-black text-amber-600 block uppercase leading-none">Ondo State</span>
                  <span className="text-[8px] text-gray-500 font-bold tracking-wider leading-none">Ise Loogun Ise</span>
                </div>
              </div>
            )}
          </div>

          {/* Reference serial box */}
          <div className="flex justify-between items-center px-4 mb-2">
            <span className="font-mono text-[10px] bg-neutral-100 px-2 py-0.5 border border-neutral-200 text-neutral-600 rounded">
              Ref NO: {certificateNo}
            </span>
            <span className="font-mono text-[10px] text-neutral-600">
              Date: {docDate}
            </span>
          </div>

          {/* State / Government Headers */}
          {isImoStyle && (
            <div className="space-y-0.5">
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-emerald-800">
                GOVERNMENT OF IMO STATE OF NIGERIA
              </h1>
              <p className="text-xs font-black text-red-600 uppercase tracking-widest font-sans">
                (EASTERN HEARTLAND)
              </p>
              {liaisonOffice && (
                <p className="text-[10px] text-neutral-700 italic max-w-xs mx-auto">
                  {liaisonOffice}
                </p>
              )}
            </div>
          )}

          {isLagosStyle && (
            <div className="space-y-0.5">
              <h1 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-neutral-900 border-b border-neutral-300 pb-1 max-w-md mx-auto">
                EPE LOCAL GOVERNMENT
              </h1>
              <p className="text-xs font-bold text-[#dc2626] tracking-wider uppercase font-sans">
                LAGOS STATE, NIGERIA
              </p>
            </div>
          )}

          {isOgutaStyle && (
            <div className="space-y-0.5">
              <p className="text-[10px] text-neutral-500 font-black tracking-widest uppercase">Original Reference</p>
              <h1 className="text-lg font-bold text-emerald-900 leading-tight uppercase font-sans">
                GOVERNMENT OF {state.toUpperCase()}
              </h1>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
                {lga.toUpperCase()} LOCAL GOVERNMENT AREA
              </h2>
            </div>
          )}

          {isCrossRiverStyle && (
            <div className="space-y-0.5">
              <p className="text-[10px] tracking-widest font-sans text-blue-900 uppercase font-black">CROSS RIVER STATE OF NIGERIA</p>
              <h1 className="text-lg sm:text-xl font-bold text-neutral-800 uppercase font-sans">
                {lga.toUpperCase()} LOCAL GOVERNMENT
              </h1>
              <p className="text-[9px] text-neutral-600 uppercase italic">Local Government Headquarters, {lga}</p>
            </div>
          )}

          {isOndoStyle && (
            <div className="space-y-0.5">
              <h1 className="text-lg sm:text-xl font-bold text-neutral-900 uppercase">
                {lga.toUpperCase()} LOCAL GOVERNMENT
              </h1>
              <p className="text-[10px] text-neutral-600 italic">P.M.B. 514, {lga}, {state}</p>
            </div>
          )}

          {/* MAIN DOCUMENT TITLE */}
          <div className="mt-4 mb-2">
            {isLagosStyle ? (
              <h3 className="text-2xl font-black text-[#dc2626] italic font-serif tracking-wide underline decoration-double decoration-[#dc2626]">
                Certificate of Origin
              </h3>
            ) : isOgutaStyle ? (
              <h3 className="text-2xl sm:text-3xl font-black text-red-650 uppercase tracking-tight font-sans">
                Identification Certificate
              </h3>
            ) : isCrossRiverStyle ? (
              <h3 className="text-2xl font-bold text-blue-950 tracking-tight leading-none italic">
                Certificate of Origin
              </h3>
            ) : isOndoStyle ? (
              <h3 className="text-2xl font-black text-red-600 uppercase font-sans tracking-wide">
                CERTIFICATE OF ORIGIN
              </h3>
            ) : (
              <h3 className="text-xl sm:text-2xl font-bold text-red-600 uppercase tracking-wide border-y border-red-200 py-1.5 max-w-sm mx-auto">
                CERTIFICATE OF STATE OF ORIGIN
              </h3>
            )}
          </div>
        </div>

        {/* BODY TEXT CONTAINER */}
        <div className="my-6 text-center text-sm md:text-base leading-relaxed px-4 space-y-6 text-neutral-800">
          
          <p className="font-semibold text-neutral-500 uppercase tracking-widest text-xs font-sans">
            To Whom It May Concern
          </p>

          <p className="text-lg italic font-sans text-neutral-600">
            This is to certify that
          </p>

          <div className="my-4">
            <span className="text-xl font-black block tracking-tight text-neutral-900 border-b border-neutral-300 pb-1 max-w-md mx-auto uppercase">
              {gender}. {fullName}
            </span>
            <span className="text-[10px] uppercase text-neutral-400 font-sans tracking-widest block mt-1">
              Primary Registrant Identifier
            </span>
          </div>

          <div className="space-y-3 font-serif max-w-xl mx-auto pt-2">
            <p className="text-justify leading-loose">
              whose details appear herein, hails from{' '}
              <strong className="underline text-black">{townOrVillage}</strong>{' '}
              {autonomousCommunity && (
                <>
                  in <strong className="underline text-black">{autonomousCommunity}</strong> autonomous community,{' '}
                </>
              )}
              situated in <strong className="underline text-black">{lga}</strong> Local Government Area of{' '}
              <strong className="underline text-black">{state}</strong>, Federal Republic of Nigeria.
            </p>

            {traditionalRuler && (
              <p className="text-center font-sans text-xs text-neutral-700 pt-1 mt-2 border-y border-dotted border-neutral-200 py-1.5">
                👑 The Traditional Ruler / Royal Highness is:{' '}
                <strong className="text-neutral-900">{traditionalRuler}</strong>
              </p>
            )}

            <p className="text-xs text-neutral-500 font-serif pt-1 italic">
              By implication, the registrant is an authentic indigene of the aforementioned Local Government Area. All official agencies, tertiary institutions, state selection boards, and administrative authorities are hereby requested to accord the bearer the necessary assistance and parameters they may require.
            </p>
          </div>

          {/* Verification Warning compliance stamp */}
          <div className="pt-4 border-t border-dashed border-neutral-200">
            <div className="bg-neutral-50 text-neutral-500 text-[10px] py-1 px-3 inline-block leading-tight border border-neutral-200 rounded text-center">
              🛡️ <b>ADMINISTRATIVE DRAFT:</b> Issued for information verification and origin authentication clearance.<br/>
              Not transferable. Verified via cryptographic certificate signature code above.
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: SIGNATURES, SEAL & FOOTER */}
        <div className="pt-4 border-t border-dotted border-neutral-300 flex flex-col sm:flex-row justify-between items-center gap-6">
          
          {/* Stamps Box */}
          <div className="flex gap-4 items-center pl-2 shrink-0">
            {/* Rubber Stamp */}
            <div className="relative w-20 h-20 rounded-full border-4 border-dashed border-red-500/35 flex items-center justify-center text-center font-sans text-[8px] text-red-500/40 font-bold rotate-[-12deg] select-none">
              <div className="absolute inset-1.5 rounded-full border border-red-500/35 flex flex-col justify-center items-center">
                <span>{lga.toUpperCase()} LGA</span>
                <span className="text-[5px]">APPROVED</span>
                <span className="text-[6px]">{docDate}</span>
              </div>
            </div>

            {/* Red Wax Seal representation for Epe/Ondo/Oguta preset styles */}
            {(isLagosStyle || isOndoStyle || isOgutaStyle) && (
              <div className="w-16 h-16 rounded-full bg-red-700 shadow-md border-2 border-amber-500 flex items-center justify-center text-white text-center text-[7px] font-bold p-1 leading-none select-none shrink-0 rotate-[8deg]">
                <div className="rounded-full border border-dashed border-amber-500 w-full h-full flex flex-col justify-center items-center">
                  <span>★ OFFICIAL ★</span>
                  <span className="text-[5px] mt-0.5">SEAL</span>
                </div>
              </div>
            )}
          </div>

          {/* Signature Grid */}
          <div className="text-right font-sans shrink-0 min-w-[200px]">
            <span className="block text-[11px] text-neutral-500 italic mb-8">
              for the {officerTitle.toUpperCase()}
            </span>
            <div className="w-48 border-t border-neutral-400 pt-1.5 inline-block text-center font-sans">
              <span className="text-[#3b82f6] block text-xs tracking-tight italic font-black h-4 select-none">
                {officerName}
              </span>
              <span className="text-xs font-bold text-neutral-800 block">
                {officerName}
              </span>
              <span className="text-[10px] text-neutral-500 block">
                {officerTitle}
              </span>
              <span className="text-[9px] text-neutral-400 block font-mono">
                {docDate}
              </span>
            </div>
          </div>
        </div>

        {/* Floating bottom barcode decoration for state/lga reference slip style */}
        <div className="mt-4 flex justify-between items-center text-[8px] text-neutral-400 font-mono font-bold leading-none border-t border-neutral-100 pt-1.5">
          <span>VERIFICATION COMPLIANCE SYSTEM SECURED</span>
          <div className="flex gap-1 items-center bg-white p-0.5 px-1.5 border border-neutral-200 rounded shadow-xs">
            <QrCode className="h-3 w-3 text-neutral-700" />
            <span>Ref: {doc.id.toUpperCase()}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
