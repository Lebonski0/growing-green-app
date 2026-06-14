'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useLang } from '@/components/LangContext';
import { t } from '@/lib/translations';

export default function IntroScreen() {
  const router = useRouter();
  const { lang, setLang } = useLang();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const flagMap = { en: '🇬🇧', fr: '🇫🇷', es: '🇪🇸', zh: '🇨🇳', hi: '🇮🇳', ar: '🇦🇪' };

  return (
    <main className="relative bg-intro grain-overlay flex flex-col items-center justify-center min-h-[100dvh] w-full max-w-[430px] mx-auto overflow-hidden">

      {/* Language switcher — top right */}
      <button
        onClick={() => router.push('/language')}
        aria-label="Change language"
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.7)',
          borderRadius: '9999px',
          padding: '6px 14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '14px',
          fontFamily: 'var(--font-inter), system-ui, sans-serif',
          fontWeight: 700,
          color: '#052107',
          zIndex: 10,
          transition: 'all 0.15s ease',
        }}
      >
        <span>{flagMap[lang]}</span>
        <span style={{ textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>{lang}</span>
      </button>

      {/* Center Content */}
      <div
        className="flex flex-col items-center justify-center flex-1 text-center px-8"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s',
        }}
      >
        <p className="type-body text-primaryDarkest mb-1" style={{ color: '#37613A' }}>
          {t(lang, 'welcomeTo')}
        </p>
        <h1
          className="type-heading text-primaryDarkest flex items-center gap-1"
          style={{ fontSize: '32px', fontWeight: 700 }}
        >
          {t(lang, 'appName')}
          <Image
            src="/assets/Logo Dark.svg"
            alt="Green Garden logo"
            width={28}
            height={28}
            className="inline-block"
          />
        </h1>
      </div>

      {/* Bottom CTA Button */}
      <div
        className="w-full px-8 pb-14 flex justify-center"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.6s ease-out 0.5s, transform 0.6s ease-out 0.5s',
        }}
      >
        <button
          id="get-started-btn"
          onClick={() => router.push('/questions')}
          className="btn-white"
        >
          {t(lang, 'getStarted')}
        </button>
      </div>

    </main>
  );
}
