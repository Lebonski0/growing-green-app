'use client';

import Link from 'next/link';

// Reusable SVG Grain component (static, no animation for performance)
const GrainTexture = () => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
    <svg width="100%" height="100%">
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" opacity="0.12" />
    </svg>
  </div>
);

// SVGs for icons
const ServerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
);
const GlobeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
);
const TapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5c0 .83-.67 1.5-1.5 1.5H8.5c-.83 0-1.5-.67-1.5-1.5v-2C7 4.67 6.33 4 5.5 4S4 4.67 4 5.5v5c0 3.87 3.13 7 7 7h3c3.87 0 7-3.13 7-7v-3c0-.83-.67-1.5-1.5-1.5h-5z"></path></svg>
);
const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M12 11v6"></path><path d="M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path></svg>
);
const ArrowDown = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
);

export default function LandingPage() {
  return (
    <>
      <link rel="canonical" href="https://growing-green-app.vercel.app" />
      <style dangerouslySetInnerHTML={{ __html: `html { scroll-behavior: smooth; }` }} />
      
      {/* SECTION 1 - Hero */}
      {/* Added pb-24 to ensure the CTA never hits the bottom of the screen on small mobiles */}
      <section className="relative min-h-[100dvh] pb-24 flex flex-col items-center justify-center text-center px-6 overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 30% 40%, #d4e84a 0%, #7bc96f 35%, #1a5c2a 70%, #052107 100%)' }}>
        <GrainTexture />
        
        <div className="relative z-10 flex flex-col items-center">
          <span className="mb-6 uppercase tracking-[0.1em] text-[#CAF5A6] font-medium text-[11px]" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
            Hopamine Green Hackathon 2026
          </span>
          
          <h1 className="text-[#F5F5F0] mb-6 leading-[1.1]" 
              style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(32px, 6vw, 52px)', fontWeight: 700 }}>
            Your garden,<br />grown right.
          </h1>
          
          <p className="text-[16px] text-[#F5F5F0]/75 max-w-[480px] mb-10 leading-relaxed" 
             style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
            5 questions. An AI plant plan made for your climate, soil, and space. Emailed to you. Then deleted forever.
          </p>
          
          <Link href="/garden" 
                className="bg-[#FFFFFF] text-[#052107] text-[14px] rounded-full hover:scale-[1.03] transition-transform duration-200 ease-out flex items-center justify-center"
                style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif', fontWeight: 700, padding: '16px 40px', minHeight: '44px', boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
            Get my free garden plan
          </Link>
          
          <p className="mt-[12px] text-[11px] text-[#CAF5A6]/80 flex items-center gap-1.5" 
             style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
            <span>🔒</span> No account. No tracking. Your data is deleted after your plan is sent.
          </p>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 animate-bounce z-10">
          <ArrowDown />
        </div>
      </section>

      {/* SECTION 2 - How it works */}
      {/* flex-col md:flex-row handles stacking correctly on mobile */}
      <section className="relative bg-[#052107] py-[80px] px-[24px] z-10">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="mb-[64px] text-center uppercase tracking-[0.1em] text-[#CAF5A6] font-medium text-[11px]"
              style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
            How it works
          </h2>
          
          <div className="flex flex-col md:flex-row gap-[64px] md:gap-0 justify-between relative">
            {[
              { num: '1', title: 'Answer 5 questions', desc: 'Garden type, climate zone, sun exposure, and plot size. All visual — no typing, no expertise needed.' },
              { num: '2', title: 'AI builds your plan', desc: 'Our AI recommends native plants that genuinely thrive in your exact conditions. When to plant. How to start.' },
              { num: '3', title: 'It lands in your inbox', desc: 'Your personalized plan is emailed to you. The moment it sends, we delete everything. Nothing stored.' }
            ].map((step, idx) => (
              <div key={idx} className="flex-1 relative flex flex-col px-0 md:px-8 first:md:pl-0 last:md:pr-0">
                {/* Vertical line on desktop between steps */}
                {idx !== 0 && (
                  <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-3/4 bg-[#37613A]"></div>
                )}
                
                <div className="relative">
                  {/* Numbers resized: 48px on mobile, 64px on desktop */}
                  <span className="absolute -top-[36px] md:-top-[40px] -left-[12px] md:-left-[16px] text-[48px] md:text-[64px] text-[#CAF5A6]/15 select-none"
                        style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 700 }}>
                    {step.num}
                  </span>
                  <h3 className="relative text-[#F5F5F0] text-[22px] mb-3"
                      style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 700 }}>
                    {step.title}
                  </h3>
                  <p className="relative text-[14px] text-[#F5F5F0]/60 leading-[1.7]"
                     style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 - Judging criteria */}
      <section className="relative bg-[#052107] py-[80px] px-[24px] z-10">
        <div className="absolute inset-0 bg-[#FFFFFF]/[0.03] pointer-events-none"></div>
        <div className="relative max-w-[1000px] mx-auto z-10">
          <h2 className="mb-[64px] text-center uppercase tracking-[0.1em] text-[#CAF5A6] font-medium text-[11px]"
              style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
            Built to the highest standard
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="bg-[#FFFFFF]/[0.12] backdrop-blur-[16px] border border-[#FFFFFF]/20 rounded-2xl p-8 flex flex-col"
                 style={{ WebkitBackdropFilter: 'blur(16px)' }}>
              <div className="text-[#CAF5A6] mb-4"><ServerIcon /></div>
              <h3 className="text-[#F5F5F0] text-[22px] mb-3" style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 700 }}>Scales to 10,000+ users</h3>
              <p className="text-[14px] text-[#F5F5F0]/60 leading-[1.7] mb-6 flex-1" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                Stateless by design. No database, no bottleneck. Vercel Edge handles any load automatically.
              </p>
              <div className="bg-[#37613A]/30 text-[#CAF5A6] text-[11px] font-medium px-3 py-1.5 rounded-full inline-flex self-start" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                Serverless · Zero infrastructure
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#FFFFFF]/[0.12] backdrop-blur-[16px] border border-[#FFFFFF]/20 rounded-2xl p-8 flex flex-col"
                 style={{ WebkitBackdropFilter: 'blur(16px)' }}>
              <div className="text-[#CAF5A6] mb-4"><GlobeIcon /></div>
              <h3 className="text-[#F5F5F0] text-[22px] mb-3" style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 700 }}>Works anywhere on earth</h3>
              <p className="text-[14px] text-[#F5F5F0]/60 leading-[1.7] mb-6 flex-1" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                6 climate zones covering every region. A rooftop garden in Bangkok or a plot in rural Belgium — the AI adapts.
              </p>
              <div className="bg-[#37613A]/30 text-[#CAF5A6] text-[11px] font-medium px-3 py-1.5 rounded-full inline-flex self-start" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                6 climate zones · No language barrier
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#FFFFFF]/[0.12] backdrop-blur-[16px] border border-[#FFFFFF]/20 rounded-2xl p-8 flex flex-col"
                 style={{ WebkitBackdropFilter: 'blur(16px)' }}>
              <div className="text-[#CAF5A6] mb-4"><TapIcon /></div>
              <h3 className="text-[#F5F5F0] text-[22px] mb-3" style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 700 }}>Five taps. That&apos;s it.</h3>
              <p className="text-[14px] text-[#F5F5F0]/60 leading-[1.7] mb-6 flex-1" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                No account. No form. No expertise needed. Visual choices only — a child and a grandparent can both use it.
              </p>
              <div className="bg-[#37613A]/30 text-[#CAF5A6] text-[11px] font-medium px-3 py-1.5 rounded-full inline-flex self-start" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                Visual-only · No typing required
              </div>
            </div>

            {/* Card 4 - Equitable (Tiebreaker, Prominent) */}
            <div className="bg-[#FFFFFF]/[0.16] backdrop-blur-[16px] border border-[#CAF5A6]/40 rounded-2xl p-8 flex flex-col relative overflow-hidden"
                 style={{ boxShadow: '0 0 40px rgba(202,245,166,0.05)', WebkitBackdropFilter: 'blur(16px)' }}>
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldIcon />
              </div>
              <div className="text-[#CAF5A6] mb-4 relative z-10"><ShieldIcon /></div>
              <h3 className="text-[#F5F5F0] text-[22px] mb-3 relative z-10" style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 700 }}>We take nothing back</h3>
              <p className="text-[14px] text-[#F5F5F0]/80 leading-[1.7] mb-6 flex-1 relative z-10" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                Your plan is yours. No data sold, no profile built, no ads. We collect nothing. We store nothing. We give you everything.
              </p>
              <div className="bg-[#CAF5A6]/20 text-[#CAF5A6] text-[11px] font-medium px-3 py-1.5 rounded-full inline-flex self-start relative z-10 border border-[#CAF5A6]/30" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                Zero data retention · Always free
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 - Social proof */}
      <section className="relative bg-[#052107] py-[60px] px-[24px] z-10 flex flex-col items-center text-center">
        <div className="max-w-[600px] w-full">
          <p className="text-[#CAF5A6] text-[28px] italic mb-6" style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 700 }}>
            &quot;Think globally, build locally.&quot;
          </p>
          <p className="text-[13px] text-[#F5F5F0]/50 mb-8" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif', lineHeight: 1.6 }}>
            Built in 48 hours at the Hopamine Green Hackathon · June 2026<br/>
            For every gardener, in every climate, on every budget.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              '6 climate zones',
              '5-minute setup',
              'Zero data stored'
            ].map((badge, i) => (
              <div key={i} className="rounded-full border border-[#CAF5A6]/30 text-[#CAF5A6] text-[11px] font-medium px-4 py-1.5"
                   style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                {badge}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 - Final CTA */}
      <section className="relative py-[100px] px-[24px] flex flex-col items-center text-center overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 30% 40%, #d4e84a 0%, #7bc96f 35%, #1a5c2a 70%, #052107 100%)' }}>
        <GrainTexture />
        
        <div className="relative z-10 flex flex-col items-center">
          <h2 className="text-[#F5F5F0] mb-4 leading-[1.1]" 
              style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 700 }}>
            Your garden is waiting.
          </h2>
          
          <p className="text-[16px] text-[#F5F5F0]/70 mb-10" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
            Free. Private. Ready in 5 minutes.
          </p>
          
          <Link href="/garden" 
                className="bg-[#FFFFFF] text-[#052107] text-[14px] rounded-full hover:scale-[1.03] transition-transform duration-200 ease-out flex items-center justify-center"
                style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif', fontWeight: 700, padding: '16px 40px', minHeight: '44px', boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
            Get my free garden plan
          </Link>
          
          <p className="mt-[48px] text-[10px] text-[#CAF5A6]/40" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
            Green Garden · Hopamine Green Hackathon 2026 · Think Globally, Build Locally
          </p>
        </div>
      </section>
    </>
  );
}
