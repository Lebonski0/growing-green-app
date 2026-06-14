'use client';

import { useRouter } from 'next/navigation';
import { useLang } from '@/components/LangContext';
import type { Lang } from '@/lib/translations';
import { useEffect, useState } from 'react';

const LANGUAGES: { code: Lang; flag: string; name: string; native: string }[] = [
  { code: 'en', flag: '🇬🇧', name: 'English', native: 'English' },
  { code: 'zh', flag: '🇨🇳', name: 'Chinese', native: '中文' },
  { code: 'hi', flag: '🇮🇳', name: 'Hindi', native: 'हिन्दी' },
  { code: 'es', flag: '🇪🇸', name: 'Spanish', native: 'Español' },
  { code: 'fr', flag: '🇫🇷', name: 'French', native: 'Français' },
  { code: 'ar', flag: '🇦🇪', name: 'Arabic', native: 'العربية' },
];

export default function LanguageScreen() {
  const router = useRouter();
  const { setLang } = useLang();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleSelect = (code: Lang) => {
    setLang(code);
    router.push('/garden');
  };

  return (
    <>
      {/* Background */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: "url('/assets/gradient-2.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 24px',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        {/* Logo & tagline */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🌱</div>
          <h1 style={{
            fontFamily: 'var(--font-charon), Georgia, serif',
            fontWeight: 700,
            fontSize: '28px',
            color: '#052107',
            marginBottom: '8px',
          }}>
            Green Garden
          </h1>
            <p style={{
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontSize: '13px',
            color: 'rgba(5,33,7,0.6)',
          }}>
            Choose your language · 选择您的语言 · अपनी भाषा चुनें
          </p>
        </div>

        {/* Language buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          width: '100%',
          maxWidth: '320px',
        }}>
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => handleSelect(l.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px 20px',
                borderRadius: '16px',
                border: '1.5px solid rgba(255,255,255,0.65)',
                background: 'rgba(255,255,255,0.55)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                minHeight: '64px',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.75)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.55)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              }}
            >
              <span style={{ fontSize: '28px', flexShrink: 0 }}>{l.flag}</span>
              <span style={{
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                fontWeight: 700,
                fontSize: '16px',
                color: '#052107',
              }}>
                {l.native}
              </span>
              <span style={{
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                fontWeight: 400,
                fontSize: '13px',
                color: 'rgba(5,33,7,0.5)',
                marginLeft: 'auto',
              }}>
                {l.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
