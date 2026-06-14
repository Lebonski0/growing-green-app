'use client';

import Link from 'next/link';
import Image from 'next/image';

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
  return (
    <>
      <link rel="canonical" href="https://growing-green-app.vercel.app" />
      <style dangerouslySetInnerHTML={{ __html: `
        html { scroll-behavior: smooth; }
        .nav-dropdown:hover .dropdown-menu { display: block; }
      ` }} />
      
      {/* PROFESSIONAL NAVBAR WITH LANGUAGE DROPDOWN */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#052107]/40 backdrop-blur-[24px] border-b border-[#CAF5A6]/10" style={{ WebkitBackdropFilter: 'blur(24px)' }}>
        <div className="max-w-[1200px] mx-auto px-6 h-[72px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/assets/Logo White.svg" alt="Green Garden Logo" width={28} height={28} className="group-hover:scale-105 transition-transform" />
            <span className="text-[#F5F5F0] text-[20px] font-bold tracking-wide mt-1" style={{ fontFamily: 'var(--font-playfair), serif' }}>
              Green Garden
            </span>
          </Link>
          
          <nav className="flex items-center gap-6 md:gap-10">
            <a href="#the-magic" className="hidden md:block text-[#F5F5F0]/70 hover:text-[#CAF5A6] text-[13px] font-medium transition-colors" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>The Magic</a>
            <a href="#the-promise" className="hidden md:block text-[#F5F5F0]/70 hover:text-[#CAF5A6] text-[13px] font-medium transition-colors" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>The Promise</a>
            
            {/* Language Dropdown (Universality) */}
            <div className="relative nav-dropdown py-4">
              <button className="flex items-center gap-1.5 text-[#F5F5F0]/70 hover:text-[#CAF5A6] text-[13px] font-medium transition-colors" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                <GlobeIcon /> EN <ChevronDown />
              </button>
              <div className="dropdown-menu absolute hidden right-0 top-[52px] bg-[#052107]/90 backdrop-blur-xl border border-[#CAF5A6]/20 rounded-xl overflow-hidden min-w-[120px] shadow-2xl py-2">
                <Link href="/language" className="block px-4 py-2 text-[#F5F5F0]/80 hover:bg-[#CAF5A6]/10 hover:text-[#CAF5A6] text-[13px] transition-colors" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>🇺🇸 English</Link>
                <Link href="/language" className="block px-4 py-2 text-[#F5F5F0]/80 hover:bg-[#CAF5A6]/10 hover:text-[#CAF5A6] text-[13px] transition-colors" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>🇳🇱 Nederlands</Link>
                <Link href="/language" className="block px-4 py-2 text-[#F5F5F0]/80 hover:bg-[#CAF5A6]/10 hover:text-[#CAF5A6] text-[13px] transition-colors" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>🇫🇷 Français</Link>
                <Link href="/language" className="block px-4 py-2 text-[#F5F5F0]/80 hover:bg-[#CAF5A6]/10 hover:text-[#CAF5A6] text-[13px] transition-colors" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>🇪🇸 Español</Link>
              </div>
            </div>

            <Link href="/garden" 
                  className="bg-[#FFFFFF] text-[#052107] px-6 py-2.5 rounded-full text-[13px] font-bold hover:scale-[1.03] transition-transform duration-200" 
                  style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif', minHeight: '44px', display: 'flex', alignItems: 'center' }}>
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* SECTION 1 - Hero (Emotional, Organic) */}
      <section className="relative w-full min-h-[100dvh] pt-[72px] pb-24 flex flex-col items-center justify-center text-center px-6 overflow-hidden"
        style={{ background: 'radial-gradient(circle at 50% 30%, #5ba74b 0%, #1a5c2a 50%, #052107 100%)' }}>
        
        {/* Subtle background watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none scale-150">
           <Image src="/assets/Lined Logo White.svg" alt="Watermark" width={800} height={800} priority />
        </div>

        <GrainTexture />
        
        <div className="relative z-10 flex flex-col items-center max-w-[800px]">
          <div className="mb-8 inline-flex items-center gap-2 bg-[#CAF5A6]/10 border border-[#CAF5A6]/20 px-4 py-1.5 rounded-full text-[#CAF5A6] text-[11px] font-medium tracking-[0.1em] uppercase backdrop-blur-md" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
            🏆 Hopamine Green Hackathon 2026
          </div>
          
          <h1 className="text-[#F5F5F0] mb-8 leading-[1.05]" 
              style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(48px, 9vw, 84px)', fontWeight: 700 }}>
            Your garden,<br />grown right.
          </h1>
          
          <p className="text-[18px] md:text-[20px] text-[#F5F5F0]/80 max-w-[540px] mb-12 leading-[1.6]" 
             style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
            An AI plant plan made for your climate, soil, and space. Free, private, and effortlessly tailored to you.
          </p>
          
          <Link href="/garden" 
                className="bg-[#FFFFFF] text-[#052107] text-[16px] rounded-full hover:scale-[1.03] transition-transform duration-200 ease-out flex items-center justify-center"
                style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif', fontWeight: 700, padding: '0 48px', minHeight: '56px', boxShadow: '0 8px 32px rgba(202,245,166,0.15)' }}>
            Get Started
          </Link>
          
          <p className="mt-[20px] text-[12px] text-[#CAF5A6]/80 flex items-center gap-2 bg-[#052107]/40 px-4 py-2 rounded-full backdrop-blur-md border border-white/5" 
             style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
            <span>🔒</span> Zero accounts. Zero tracking. 
          </p>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#CAF5A6]/40 animate-bounce z-10">
          <ArrowDown />
        </div>
      </section>

      {/* SECTION 2 - The Magic (Sleek 3-step visual) */}
      <section id="the-magic" className="relative w-full bg-[#052107] py-[120px] px-[24px] z-10">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="mb-[24px] text-center text-[#CAF5A6] font-medium text-[13px] tracking-[0.1em] uppercase"
              style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
            The Magic
          </h2>
          <p className="text-center text-[#F5F5F0] text-[32px] md:text-[40px] mb-[80px]" style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 700 }}>
            Visual, simple, and deleted instantly.
          </p>
          
          <div className="flex flex-col md:flex-row gap-[40px] md:gap-[24px] justify-between relative items-start">
            
            {/* Step 1 */}
            <div className="flex-1 flex flex-col items-center text-center group">
              <div className="w-[80px] h-[80px] rounded-full bg-[#CAF5A6]/5 border border-[#CAF5A6]/20 flex items-center justify-center mb-6 group-hover:bg-[#CAF5A6]/10 transition-colors">
                 <Image src="/assets/Map Icon.svg" alt="Map" width={32} height={32} className="opacity-80" />
              </div>
              <h3 className="text-[#F5F5F0] text-[20px] mb-3" style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 700 }}>1. Tap your conditions</h3>
              <p className="text-[15px] text-[#F5F5F0]/60 leading-[1.6] max-w-[280px]" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                No typing required. Just visual choices about your climate and space.
              </p>
            </div>

            <div className="hidden md:block flex-1 mt-[40px] border-t border-dashed border-[#CAF5A6]/20"></div>

            {/* Step 2 */}
            <div className="flex-1 flex flex-col items-center text-center group">
              <div className="w-[80px] h-[80px] rounded-full bg-[#CAF5A6]/5 border border-[#CAF5A6]/20 flex items-center justify-center mb-6 group-hover:bg-[#CAF5A6]/10 transition-colors">
                 <Image src="/assets/Sun.svg" alt="Sun" width={32} height={32} className="opacity-80" />
              </div>
              <h3 className="text-[#F5F5F0] text-[20px] mb-3" style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 700 }}>2. AI crafts the plan</h3>
              <p className="text-[15px] text-[#F5F5F0]/60 leading-[1.6] max-w-[280px]" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                Our intelligence engine finds native plants that genuinely thrive in your exact spot.
              </p>
            </div>

            <div className="hidden md:block flex-1 mt-[40px] border-t border-dashed border-[#CAF5A6]/20"></div>

            {/* Step 3 */}
            <div className="flex-1 flex flex-col items-center text-center group">
              <div className="w-[80px] h-[80px] rounded-full bg-[#CAF5A6]/5 border border-[#CAF5A6]/20 flex items-center justify-center mb-6 group-hover:bg-[#CAF5A6]/10 transition-colors">
                 <Image src="/assets/Send.svg" alt="Send" width={32} height={32} className="opacity-80" />
              </div>
              <h3 className="text-[#F5F5F0] text-[20px] mb-3" style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 700 }}>3. Delivered & Deleted</h3>
              <p className="text-[15px] text-[#F5F5F0]/60 leading-[1.6] max-w-[280px]" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                Your plan lands in your inbox. The moment it sends, we delete everything.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3 - The Promise (Organic layout, Hackathon Criteria) */}
      <section id="the-promise" className="relative w-full bg-[#052107] py-[120px] px-[24px] z-10 overflow-hidden">
        {/* Subtle glow behind the promise section */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#37613A]/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative max-w-[1200px] mx-auto z-10">
          <div className="flex flex-col md:flex-row gap-16 items-center mb-[80px]">
            <div className="flex-1 text-left">
              <h2 className="mb-[20px] text-[#CAF5A6] font-medium text-[13px] tracking-[0.1em] uppercase"
                  style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                The Promise
              </h2>
              <p className="text-[#F5F5F0] text-[36px] md:text-[48px] leading-[1.1]" style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 700 }}>
                Built to empower.<br/><span className="italic text-[#CAF5A6]">Never to extract.</span>
              </p>
            </div>
            <div className="flex-1">
              <p className="text-[16px] text-[#F5F5F0]/70 leading-[1.8]" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                Green Garden is built on a foundation of absolute privacy and universal access. We believe sovereignty has no age limit, and that technology should serve humans reciprocally.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* The Tiebreaker / Equitable - Spans 2 columns on desktop for prominence */}
            <div className="md:col-span-2 bg-gradient-to-br from-[#CAF5A6]/20 to-[#37613A]/20 backdrop-blur-[24px] border border-[#CAF5A6]/40 rounded-3xl p-10 flex flex-col justify-center relative overflow-hidden group"
                 style={{ WebkitBackdropFilter: 'blur(24px)' }}>
              <div className="absolute top-0 right-0 opacity-5 -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-700">
                <Image src="/assets/Logo White.svg" alt="Logo" width={300} height={300} />
              </div>
              <h3 className="text-[#F5F5F0] text-[32px] mb-4 relative z-10" style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 700 }}>Zero Extraction.</h3>
              <p className="text-[16px] text-[#F5F5F0]/80 leading-[1.7] mb-8 max-w-[500px] relative z-10" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                Your plan is yours. No data sold, no profile built, no ads. We collect nothing. We store nothing. We give you everything.
              </p>
              <div className="bg-[#052107]/50 text-[#CAF5A6] text-[12px] font-medium px-4 py-2 rounded-full inline-flex self-start backdrop-blur-md border border-[#CAF5A6]/20 relative z-10" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                Equitable Standard · Always Free
              </div>
            </div>

            {/* Universal */}
            <div className="bg-[#FFFFFF]/5 backdrop-blur-[24px] border border-[#FFFFFF]/10 rounded-3xl p-8 flex flex-col justify-between"
                 style={{ WebkitBackdropFilter: 'blur(24px)' }}>
              <div>
                <h3 className="text-[#F5F5F0] text-[24px] mb-3" style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 700 }}>Universal</h3>
                <p className="text-[15px] text-[#F5F5F0]/60 leading-[1.7] mb-8" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                  A rooftop garden in Bangkok or a rural plot in Belgium. The AI speaks your language and knows your 6 climate zones.
                </p>
              </div>
              <div className="bg-[#FFFFFF]/5 text-[#F5F5F0]/80 text-[12px] font-medium px-4 py-2 rounded-full inline-flex self-start border border-[#FFFFFF]/10" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                Works anywhere on earth
              </div>
            </div>

            {/* Scalable */}
            <div className="bg-[#FFFFFF]/5 backdrop-blur-[24px] border border-[#FFFFFF]/10 rounded-3xl p-8 flex flex-col justify-between"
                 style={{ WebkitBackdropFilter: 'blur(24px)' }}>
              <div>
                <h3 className="text-[#F5F5F0] text-[24px] mb-3" style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 700 }}>Stateless</h3>
                <p className="text-[15px] text-[#F5F5F0]/60 leading-[1.7] mb-8" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                  No database. No bottleneck. Powered by Edge functions to scale to 10,000+ simultaneous users without a sweat.
                </p>
              </div>
              <div className="bg-[#FFFFFF]/5 text-[#F5F5F0]/80 text-[12px] font-medium px-4 py-2 rounded-full inline-flex self-start border border-[#FFFFFF]/10" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                Serverless infrastructure
              </div>
            </div>

            {/* User Friendly */}
            <div className="md:col-span-2 bg-[#FFFFFF]/5 backdrop-blur-[24px] border border-[#FFFFFF]/10 rounded-3xl p-8 flex flex-col justify-between md:flex-row md:items-center gap-8"
                 style={{ WebkitBackdropFilter: 'blur(24px)' }}>
              <div className="max-w-[400px]">
                <h3 className="text-[#F5F5F0] text-[24px] mb-3" style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 700 }}>Five taps. That&apos;s it.</h3>
                <p className="text-[15px] text-[#F5F5F0]/60 leading-[1.7]" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                  Visual choices only. A child and a grandparent can both use it with zero friction.
                </p>
              </div>
              <div className="bg-[#FFFFFF]/5 text-[#F5F5F0]/80 text-[12px] font-medium px-4 py-2 rounded-full inline-flex border border-[#FFFFFF]/10 whitespace-nowrap" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                Visual-only · No expertise needed
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4 - Final CTA */}
      <section className="relative w-full py-[120px] px-[24px] flex flex-col items-center text-center overflow-hidden"
        style={{ background: 'radial-gradient(circle at 50% 50%, #37613A 0%, #052107 100%)' }}>
        <GrainTexture />
        
        <div className="relative z-10 flex flex-col items-center">
          <Image src="/assets/Logo White.svg" alt="Green Garden" width={64} height={64} className="mb-8 opacity-80" />
          
          <h2 className="text-[#F5F5F0] mb-6 leading-[1.1]" 
              style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700 }}>
            Ready to grow?
          </h2>
          
          <p className="text-[18px] text-[#F5F5F0]/70 mb-10 max-w-[400px]" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
            Get your native plant plan in exactly 5 clicks.
          </p>
          
          <Link href="/garden" 
                className="bg-[#FFFFFF] text-[#052107] text-[16px] rounded-full hover:scale-[1.03] transition-transform duration-200 ease-out flex items-center justify-center"
                style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif', fontWeight: 700, padding: '0 48px', minHeight: '56px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
            Get Started
          </Link>
        </div>
      </section>

      {/* ULTRA CLEAN FOOTER */}
      <footer className="w-full bg-[#031404] py-8 px-6 text-center border-t border-white/5">
        <p className="text-[13px] text-[#CAF5A6]/40 mb-2" style={{ fontFamily: 'var(--font-playfair), serif', fontStyle: 'italic' }}>
          &quot;Think globally, build locally.&quot;
        </p>
        <p className="text-[11px] text-[#F5F5F0]/30" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
          © 2026 Green Garden · Built in 48 hours for the Hopamine Green Hackathon
        </p>
      </footer>
    </>
  );
}
