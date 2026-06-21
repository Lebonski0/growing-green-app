'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLang } from '@/components/LangContext';
import { t, type Lang } from '@/lib/translations';

const GrainTexture = () => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden mix-blend-overlay">
    <svg width="100%" height="100%">
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" opacity="0.12" />
    </svg>
  </div>
);

const ArrowDown = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
);

const GlobeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
);

const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
);

export default function LandingPage() {
  const { lang, setLang } = useLang();

  const handleLanguageSelect = (e: React.MouseEvent, selectedLangCode: Lang) => {
    e.preventDefault();
    setLang(selectedLangCode);
  };

  return (
    <>
      <link rel="canonical" href="https://growing-green-app.vercel.app" />
      <style dangerouslySetInnerHTML={{ __html: `
        html { scroll-behavior: smooth; }
        .nav-dropdown:hover .dropdown-menu { display: block; }
        .svg-white { filter: brightness(0) invert(1); }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      ` }} />
      
      {/* PROFESSIONAL NAVBAR WITH LANGUAGE DROPDOWN */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#052107]/40 backdrop-blur-[24px] border-b border-[#CAF5A6]/10" style={{ WebkitBackdropFilter: 'blur(24px)' }}>
        <div className="max-w-[1200px] mx-auto px-6 h-[72px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="svg-white w-[28px] h-[28px] relative group-hover:scale-105 transition-transform">
              <Image src="/assets/Logo White.svg" alt="Green Garden Logo" fill className="object-contain" />
            </div>
            <span className="hidden sm:block text-[#F5F5F0] text-[20px] font-bold tracking-wide mt-1" style={{ fontFamily: 'var(--font-playfair), serif' }}>
              Green Garden
            </span>
          </Link>
          
          <nav className="flex items-center gap-4 md:gap-10">
            <a href="#the-magic" className="hidden md:block text-[#F5F5F0]/70 hover:text-[#CAF5A6] text-[13px] font-medium transition-colors" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>{t(lang, 'lp_howItWorks')}</a>
            <a href="#the-promise" className="hidden md:block text-[#F5F5F0]/70 hover:text-[#CAF5A6] text-[13px] font-medium transition-colors" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>{t(lang, 'lp_promiseTitle')}</a>
            
            {/* Symmetrical Language Dropdown (Universality) */}
            <div className="relative nav-dropdown py-4 cursor-pointer group">
              <div className="flex items-center gap-1.5 text-[#F5F5F0]/70 hover:text-[#CAF5A6] text-[13px] font-medium transition-colors" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                <GlobeIcon /> {lang.toUpperCase()} <ChevronDown />
              </div>
              
              {/* Invisible bridge to prevent hover loss */}
              <div className="absolute top-[100%] right-0 w-full h-[15px] hidden group-hover:block z-40" />
              
              <div className="dropdown-menu absolute hidden group-hover:block right-0 top-[calc(100%+8px)] bg-[#052107]/95 backdrop-blur-xl border border-[#CAF5A6]/20 rounded-xl overflow-hidden min-w-[200px] shadow-2xl py-2 z-50">
                {[
                  { code: 'GB', name: 'English', sub: 'English', langCode: 'en' },
                  { code: 'CN', name: '中文', sub: 'Chinese', langCode: 'zh' },
                  { code: 'IN', name: 'हिन्दी', sub: 'Hindi', langCode: 'hi' },
                  { code: 'ES', name: 'Español', sub: 'Spanish', langCode: 'es' },
                  { code: 'FR', name: 'Français', sub: 'French', langCode: 'fr' },
                  { code: 'AE', name: 'العربية', sub: 'Arabic', langCode: 'ar' },
                ].map((l) => (
                  <button key={l.code} onClick={(e) => handleLanguageSelect(e, l.langCode as Lang)} className="w-full px-5 py-3 text-left hover:bg-[#CAF5A6]/10 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <span className="text-[#CAF5A6] text-[13px] font-medium w-[20px]" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>{l.code}</span>
                      <span className="text-[#F5F5F0] text-[15px] group-hover:text-[#CAF5A6] transition-colors" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>{l.name}</span>
                    </div>
                    <span className="text-[#F5F5F0]/40 text-[11px]" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>{l.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            <Link href="/garden" 
                  className="bg-[#FFFFFF] text-[#052107] px-6 py-2.5 rounded-full text-[13px] font-bold hover:scale-[1.03] transition-transform duration-200" 
                  style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif', minHeight: '44px', display: 'flex', alignItems: 'center' }}>
              {t(lang, 'getStarted')}
            </Link>
          </nav>
        </div>
      </header>

      {/* SECTION 1 - Hero (Deep Emotional Impact with Pixabay Nature Background) */}
      <section className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-[#052107]">
        
        {/* Dynamic Lush Garden Background */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/assets/hero.jpg" 
            alt="Lush green garden" 
            fill 
            className="object-cover opacity-60"
            priority
          />
          {/* Deep green gradient overlay for text readability and emotion */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#052107]/80 via-[#052107]/60 to-[#052107]"></div>
        </div>

        <GrainTexture />
        
        <div className="relative z-10 flex flex-col items-center max-w-[800px] mt-[72px]">
          <div className="mb-8 inline-flex items-center gap-2 bg-[#CAF5A6]/10 border border-[#CAF5A6]/20 px-4 py-1.5 rounded-full text-[#CAF5A6] text-[11px] font-medium tracking-[0.1em] uppercase backdrop-blur-md" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
            🏆 Hopamine Green Hackathon 2026
          </div>
          
          <h1 className="text-[#F5F5F0] mb-6 leading-[1.05] drop-shadow-2xl" 
              style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(40px, 11vw, 84px)', fontWeight: 700 }}>
            {t(lang, 'lp_heroTitle1')}<br />{t(lang, 'lp_heroTitle2')}
          </h1>
          
          <p className="text-[18px] md:text-[20px] text-[#F5F5F0]/90 max-w-[540px] mb-10 leading-[1.6] drop-shadow-lg" 
             style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
            {t(lang, 'lp_heroSub')}
          </p>
          
          <Link href="/garden" 
                className="bg-[#FFFFFF] text-[#052107] text-[16px] rounded-full hover:scale-[1.03] transition-transform duration-200 ease-out flex items-center justify-center"
                style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif', fontWeight: 700, padding: '0 48px', minHeight: '56px', boxShadow: '0 8px 32px rgba(255,255,255,0.15)' }}>
            {t(lang, 'getStarted')}
          </Link>
          
          <p className="mt-[20px] text-[12px] text-[#CAF5A6]/90 flex items-center gap-2 bg-[#052107]/60 px-4 py-2 rounded-full backdrop-blur-md border border-white/10" 
             style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
            <span>🔒</span> Zero accounts. Zero tracking. 
          </p>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#FFFFFF]/60 animate-bounce z-10">
          <ArrowDown />
        </div>
      </section>

      {/* SECTION 2 - The Magic */}
      <section id="the-magic" className="relative w-full bg-[#052107] py-[64px] md:py-[80px] px-[24px] z-10 border-t border-[#CAF5A6]/5">
        <div className="max-w-[1000px] mx-auto">
          <div className="flex flex-col md:flex-row gap-[56px] md:gap-[40px] justify-between items-center md:items-start">
            
            {/* Step 1 */}
            <div className="flex-1 flex flex-col items-center text-center">
              <div className="w-[64px] h-[64px] rounded-full bg-[#CAF5A6]/10 border border-[#CAF5A6]/20 flex items-center justify-center mb-5 relative">
                 <Image src="/assets/Map Icon.svg" alt="Map" width={24} height={24} className="svg-white opacity-90" />
              </div>
              <h2 className="text-[#F5F5F0] text-[20px] mb-2" style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 700 }}>
                {t(lang, 'lp_step1Title')}
              </h2>
              <p className="text-[15px] text-[#F5F5F0]/70 leading-[1.6]" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                {t(lang, 'lp_step1Sub')}
              </p>
            </div>

            <div className="hidden md:block flex-1 mt-[32px] border-t border-dashed border-[#CAF5A6]/20"></div>

            {/* Step 2 */}
            <div className="flex-1 flex flex-col items-center text-center">
              <div className="w-[64px] h-[64px] rounded-full bg-[#CAF5A6]/10 border border-[#CAF5A6]/20 flex items-center justify-center mb-5 relative">
                 <Image src="/assets/Sun.svg" alt="Sun" width={24} height={24} className="svg-white opacity-90" />
              </div>
              <h2 className="text-[#F5F5F0] text-[20px] mb-2" style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 700 }}>
                {t(lang, 'lp_step2Title')}
              </h2>
              <p className="text-[15px] text-[#F5F5F0]/70 leading-[1.6]" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                {t(lang, 'lp_step2Sub')}
              </p>
            </div>

            <div className="hidden md:block flex-1 mt-[32px] border-t border-dashed border-[#CAF5A6]/20"></div>

            {/* Step 3 */}
            <div className="flex-1 flex flex-col items-center text-center">
              <div className="w-[64px] h-[64px] rounded-full bg-[#CAF5A6]/10 border border-[#CAF5A6]/20 flex items-center justify-center mb-5 relative">
                 <Image src="/assets/Send.svg" alt="Send" width={24} height={24} className="svg-white opacity-90" />
              </div>
              <h2 className="text-[#F5F5F0] text-[20px] mb-2" style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 700 }}>
                {t(lang, 'lp_step3Title')}
              </h2>
              <p className="text-[15px] text-[#F5F5F0]/70 leading-[1.6]" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                {t(lang, 'lp_step3Sub')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="the-promise" className="relative w-full bg-[#052107] pt-[80px] pb-[120px] px-[24px] z-10">
        <div className="relative max-w-[1200px] mx-auto z-10">
          <div className="text-center mb-[64px]">
            <h2 className="mb-[16px] text-[#CAF5A6] font-medium text-[12px] tracking-[0.1em] uppercase"
                style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
              {t(lang, 'lp_promiseTitle')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 bg-gradient-to-br from-[#CAF5A6]/15 to-[#37613A]/20 border border-[#CAF5A6]/30 rounded-[24px] md:rounded-[32px] p-6 md:p-12 flex flex-col justify-center relative overflow-hidden group">
              <h3 className="text-[#F5F5F0] text-[28px] md:text-[36px] mb-4 relative z-10" style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 700 }}>{t(lang, 'lp_promiseEquitable')}</h3>
              <p className="text-[16px] text-[#F5F5F0]/80 leading-[1.7] max-w-[500px] relative z-10" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                {t(lang, 'lp_promiseEquitableSub')}
              </p>
            </div>

            <div className="md:col-span-4 bg-[#FFFFFF]/5 border border-[#FFFFFF]/10 rounded-[24px] md:rounded-[32px] p-6 md:p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-[#F5F5F0] text-[22px] md:text-[24px] mb-3" style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 700 }}>{t(lang, 'lp_promiseUniversal')}</h3>
                <p className="text-[14px] text-[#F5F5F0]/60 leading-[1.6]" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                  {t(lang, 'lp_promiseUniversalSub')}
                </p>
              </div>
            </div>

            <div className="md:col-span-6 bg-[#FFFFFF]/5 border border-[#FFFFFF]/10 rounded-[24px] md:rounded-[32px] p-6 md:p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-[#F5F5F0] text-[22px] md:text-[24px] mb-3" style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 700 }}>{t(lang, 'lp_promiseStateless')}</h3>
                <p className="text-[14px] text-[#F5F5F0]/60 leading-[1.6]" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                  {t(lang, 'lp_promiseStatelessSub')}
                </p>
              </div>
            </div>

            <div className="md:col-span-6 bg-[#CAF5A6] rounded-[24px] md:rounded-[32px] p-6 md:p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-[#052107] text-[22px] md:text-[24px] mb-3" style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 700 }}>{t(lang, 'lp_promiseFriendly')}</h3>
                <p className="text-[14px] text-[#052107]/70 leading-[1.6]" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                  {t(lang, 'lp_promiseFriendlySub')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative w-full bg-[#031404] py-[80px] md:py-[100px] px-[24px] z-10 overflow-hidden">
        <GrainTexture />
        <div className="relative max-w-[1000px] mx-auto flex flex-col md:flex-row items-center justify-between gap-12 z-10">
          <div className="flex-1 max-w-[480px] text-center md:text-left">
            <h2 className="text-[#F5F5F0] mb-6 leading-[1.1]" style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(36px, 10vw, 56px)', fontWeight: 700 }}>
              {t(lang, 'lp_ctaTitle1')}<br />{t(lang, 'lp_ctaTitle2')}
            </h2>
            <p className="text-[16px] text-[#F5F5F0]/70 leading-[1.7] mb-8" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
              {t(lang, 'lp_ctaSub')}
            </p>
            <Link href="/garden" 
                  className="bg-[#FFFFFF] text-[#052107] text-[16px] rounded-full hover:scale-[1.03] transition-transform duration-200 ease-out inline-flex items-center justify-center"
                  style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif', fontWeight: 700, padding: '0 40px', minHeight: '56px', boxShadow: '0 8px 32px rgba(255,255,255,0.15)' }}>
              {t(lang, 'getStarted')}
            </Link>
          </div>

          <div className="flex-1 relative flex justify-center items-center h-[400px] md:h-[460px] w-full mt-8 md:mt-0">
            {/* The Glow Halo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] md:w-[280px] h-[320px] md:h-[400px] bg-gradient-to-tr from-[#CAF5A6] to-[#37613A] blur-[60px] md:blur-[80px] opacity-[0.35] rounded-full mix-blend-screen"></div>
            
            {/* The Phone */}
            <div className="relative z-10 w-[200px] md:w-[230px] h-[400px] md:h-[460px] animate-float">
              <Image src="/assets/phone-mockup.png" alt="App Preview" fill className="object-contain drop-shadow-2xl" />
            </div>
          </div>

        </div>
      </section>

      {/* COMPACT FOOTER */}
      <footer className="w-full bg-[#031404] py-8 px-6 flex flex-col md:flex-row items-center justify-between text-center border-t border-white/5 gap-4">
        <p className="text-[14px] text-[#CAF5A6]/60" style={{ fontFamily: 'var(--font-playfair), serif', fontStyle: 'italic' }}>
          &quot;Think globally, build locally.&quot;
        </p>
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <Link href="/founders" className="text-[13px] text-[#F5F5F0]/80 hover:text-[#CAF5A6] transition-colors" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
            {t(lang, 'foundersTitle')}
          </Link>
          <p className="text-[12px] text-[#F5F5F0]/50" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
            © 2026 Green Garden · Hopamine Green Hackathon
          </p>
        </div>
      </footer>
    </>
  );
}
