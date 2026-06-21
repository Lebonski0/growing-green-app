'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLang } from '@/components/LangContext';
import { t } from '@/lib/translations';

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

const ArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

export default function FoundersPage() {
  const { lang } = useLang();

  // JSON-LD for SEO
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Green Garden App",
    "url": "https://growing-green-app.vercel.app",
    "logo": "https://growing-green-app.vercel.app/assets/Logo%20White.svg",
    "foundingDate": "2026",
    "founders": [
      {
        "@type": "Person",
        "name": "Oskar Lebon",
        "jobTitle": "Lead Developer & AI Integrator"
      },
      {
        "@type": "Person",
        "name": "Nikole Morales",
        "jobTitle": "UI/UX Designer & Operations"
      },
      {
        "@type": "Person",
        "name": "Isaiah Jackson",
        "jobTitle": "Product Owner & Domain Expert"
      },
      {
        "@type": "Person",
        "name": "Ian McCulloch",
        "jobTitle": "Product Owner & Growth Lead"
      }
    ]
  };

  const founders = [
    {
      name: "Oskar Lebon",
      role: t(lang, 'fRole_Oskar'),
      desc: t(lang, 'fDesc_Oskar'),
      image: "/images/founders/oskarlebon.webp"
    },
    {
      name: "Nikole Morales",
      role: t(lang, 'fRole_Nikkie'),
      desc: t(lang, 'fDesc_Nikkie'),
      image: "/images/founders/Nikole Morales.jfif"
    },
    {
      name: "Isaiah Jackson",
      role: t(lang, 'fRole_Isaiah'),
      desc: t(lang, 'fDesc_Isaiah'),
      image: "/images/founders/Isaiah Jackson.jfif"
    },
    {
      name: "Ian McCulloch",
      role: t(lang, 'fRole_Ian'),
      desc: t(lang, 'fDesc_Ian'),
      image: "/images/founders/Ian McCulloch.jfif"
    }
  ];

  return (
    <>
      <link rel="canonical" href="https://growing-green-app.vercel.app/founders" />
      <title>Meet the Founders | Green Garden</title>
      <meta name="description" content="Meet the team behind Green Garden App. Built for scale, driven by impact." />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}} />

      <div className="relative min-h-screen bg-[#031404] overflow-hidden selection:bg-[#CAF5A6]/30">
        <GrainTexture />

        {/* Ambient Background Glow - Subtle now */}
        <div className="absolute top-[0%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#CAF5A6]/5 to-transparent blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>

        {/* HEADER */}
        <header className="absolute top-0 left-0 right-0 z-50">
          <div className="max-w-[1400px] mx-auto px-6 h-[80px] flex items-center">
            <Link href="/" className="flex items-center gap-2 text-[#F5F5F0]/70 hover:text-[#CAF5A6] transition-colors" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
              <ArrowLeft />
              <span className="text-[14px] font-medium tracking-wide uppercase">{t(lang, 'back')}</span>
            </Link>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="relative z-10 pt-[120px] pb-[160px] px-6 max-w-[1200px] mx-auto">
          
          {/* Reduced Top Padding & Subtler Typography */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-[#F5F5F0] mb-4 leading-tight drop-shadow-lg" 
                style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 700 }}>
              {t(lang, 'foundersTitle')}
            </h1>
            <p className="text-[16px] md:text-[18px] text-[#F5F5F0]/80 max-w-[640px] mx-auto leading-[1.6]" 
               style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
              {t(lang, 'foundersSub')}
            </p>
          </div>

          {/* 2x2 BALANCED GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
            {founders.map((founder, idx) => (
              <div 
                key={idx} 
                className="flex flex-col xl:flex-row items-stretch bg-[#CAF5A6]/5 border border-[#CAF5A6]/10 backdrop-blur-md rounded-[24px] overflow-hidden group hover:border-[#CAF5A6]/30 transition-colors duration-500 shadow-xl animate-fade-in-up"
                style={{ animationDelay: `${idx * 150}ms`, animationFillMode: 'both' }}
              >
                {/* Image Side (Normal Proportions) */}
                <div className="relative w-full xl:w-[45%] h-[300px] xl:h-auto xl:min-h-[350px]">
                  <Image 
                    src={founder.image} 
                    alt={founder.name} 
                    fill 
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105" 
                  />
                </div>

                {/* Text Side (Clear, Legible, Not Zoomed) */}
                <div className="w-full xl:w-[55%] p-6 lg:p-8 flex flex-col justify-center">
                  <h3 className="text-[#F5F5F0] text-[24px] md:text-[28px] mb-1" style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 700 }}>
                    {founder.name}
                  </h3>
                  <p className="text-[#CAF5A6] text-[12px] font-medium tracking-[0.15em] uppercase mb-4" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                    {founder.role}
                  </p>
                  <div className="h-[1px] w-12 bg-[#CAF5A6]/30 mb-4 transition-all duration-500 group-hover:w-16 group-hover:bg-[#CAF5A6]/60"></div>
                  <p className="text-[#F5F5F0]/80 text-[14px] md:text-[15px] leading-[1.7]" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                    {founder.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </>
  );
}
