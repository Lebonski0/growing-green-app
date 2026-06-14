'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useLang } from '@/components/LangContext';
import { t, type TranslationKey } from '@/lib/translations';

interface Plant {
  id: string;
  name: string;
  scientificName?: string;
  description: string;
  bestPractices?: string[];
  whenToPlant?: string;
  howToStart?: string;
  careLevel?: string;
  tags: string[];
  imageQuery?: string;
  imageUrl?: string;
}

interface Partner {
  name: string;
  location: string;
  imageQuery: string;
  imageUrl?: string;
}

interface RecommendResponse {
  plants: Plant[];
  partner: Partner;
}

export default function ResultsScreen() {
  const router = useRouter();
  const { lang } = useLang();
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RecommendResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Email states
  const [email, setEmail] = useState('');
  const [emailState, setEmailState] = useState<'default' | 'error' | 'sending' | 'success'>('default');
  const [emailErrorMsg, setEmailErrorMsg] = useState('');

  // Loading text timer
  const [loadingText, setLoadingText] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const stepTimers: NodeJS.Timeout[] = [];
    
    if (loading) {
      setLoadingText(t(lang, 'loadingText1'));
      
      // Step sequence animations
      stepTimers.push(setTimeout(() => setLoadingStep(1), 800));
      stepTimers.push(setTimeout(() => setLoadingStep(2), 2200));
      stepTimers.push(setTimeout(() => setLoadingStep(3), 3800));
      stepTimers.push(setTimeout(() => setLoadingStep(4), 5500));

      timer = setTimeout(() => {
        setLoadingText(t(lang, 'loadingText2'));
      }, 3000);
    }
    return () => {
      clearTimeout(timer);
      stepTimers.forEach(clearTimeout);
    };
  }, [loading, lang]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      // 1. Check if we already have results cached (e.g. came back from plant detail page)
      const cachedResults = sessionStorage.getItem('greenGardenResults');
      if (cachedResults) {
        try {
          const parsed = JSON.parse(cachedResults);
          if (parsed?.plants?.length > 0) {
            setData(parsed);
            setLoading(false);
            return; // Skip API call — use cached data
          }
        } catch {
          // Cache is corrupt, fall through to API call
          sessionStorage.removeItem('greenGardenResults');
        }
      }

      // 2. No cache — fetch from API
      const storedAnswers = sessionStorage.getItem('greenGardenAnswers');
      const answers = storedAnswers ? JSON.parse(storedAnswers) : null;

      try {
        const lang = localStorage.getItem('gg_lang') || 'en';
        
        const res = await fetch('/api/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...answers, lang }),
        });
        
        const result = await res.json();
        
        if (!res.ok) {
          // Show the REAL error message from the API so we can diagnose
          throw new Error(result?.error || `Server error ${res.status}`);
        }
        
        setData(result);
        sessionStorage.setItem('greenGardenResults', JSON.stringify(result));
      } catch (err) {
        console.error(err);
        const msg = err instanceof Error ? err.message : 'Unknown error';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const handleEmailSubmit = async () => {
    // Trim first — catches invisible whitespace / copy-paste artifacts
    const trimmedEmail = email.trim();
    
    // Robust email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      setEmailErrorMsg(t(lang, 'emailError'));
      setEmailState('error');
      return;
    }

    setEmailState('sending');

    try {
      const storedAnswers = sessionStorage.getItem('greenGardenAnswers');
      const answers = storedAnswers ? JSON.parse(storedAnswers) : {};
      
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail,
          plants: data?.plants || [],
          partner: data?.partner || null,
          answers
        })
      });

      const json = await res.json();

      if (!res.ok) {
        // Show the actual error from the server if available
        const msg = json?.error || 'Failed to send email. Please try again.';
        setEmailErrorMsg(msg);
        setEmailState('error');
        return;
      }
      
      setEmailState('success');
      setTimeout(() => {
        sessionStorage.removeItem('greenGardenAnswers');
      }, 500);
      
    } catch {
      setEmailErrorMsg('Network error. Please check your connection and try again.');
      setEmailState('error');
    }
  };

  // --- LOADING STATE ---
  if (loading) {
    return (
      <>
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundImage: "url('/assets/gradient-1.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
            animation: 'pulseBg 2s infinite ease-in-out',
          }}
        />
          <div style={{ position: 'fixed', inset: 0, zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20vh', gap: '32px' }}>
          
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes pulseBg {
              0% { opacity: 0.7; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.02); }
              100% { opacity: 0.7; transform: scale(1); }
            }
            @keyframes pulseLogo {
              0% { transform: scale(0.95); box-shadow: 0 0 20px rgba(202,245,166,0.3); }
              50% { transform: scale(1.05); box-shadow: 0 0 60px rgba(202,245,166,0.8); }
              100% { transform: scale(0.95); box-shadow: 0 0 20px rgba(202,245,166,0.3); }
            }
            @keyframes pulseDot {
              0% { opacity: 0.4; transform: scale(0.8); }
              50% { opacity: 1; transform: scale(1.2); }
              100% { opacity: 0.4; transform: scale(0.8); }
            }
          `}} />

          {/* Pulsing Leaf Icon */}
          <div style={{
            width: '80px', height: '80px', background: '#CAF5A6', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px',
            animation: 'pulseLogo 2s infinite ease-in-out'
          }}>
            🌱
          </div>

          <h2 style={{
            fontFamily: 'var(--font-charon), Georgia, serif',
            fontWeight: 700,
            fontSize: '22px',
            color: '#052107',
            marginBottom: '8px'
          }}>
            {loadingText}
          </h2>

          {/* ChatGPT-style Step Checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '320px', padding: '0 24px' }}>
            {['ls_step1', 'ls_step2', 'ls_step3', 'ls_step4'].map((key, i) => {
              const isActive = loadingStep > i;
              const isCurrent = loadingStep === i;
              return (
                <div key={key} style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  opacity: isActive || isCurrent ? 1 : 0.3,
                  transform: isActive || isCurrent ? 'translateX(0)' : 'translateX(-10px)',
                  transition: 'all 0.5s ease-out',
                }}>
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    border: isActive ? 'none' : '2px solid rgba(5,33,7,0.2)',
                    background: isActive ? '#37613A' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {isActive && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                    {isCurrent && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#37613A', animation: 'pulseDot 1.5s infinite ease-in-out' }} />}
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    fontSize: '15px',
                    fontWeight: isActive ? 700 : 500,
                    color: '#052107',
                    transition: 'all 0.3s ease'
                  }}>
                    {t(lang, key as TranslationKey)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  // --- ERROR STATE ---
  if (error || !data) {
    return (
      <>
        <div style={{ position: 'fixed', inset: 0, backgroundImage: "url('/assets/gradient-1.png')", backgroundSize: 'cover', zIndex: 0 }} />
        <div style={{ position: 'fixed', inset: 0, zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌿</div>
          <h2 style={{ fontFamily: 'var(--font-charon), Georgia, serif', fontSize: '20px', color: '#052107', marginBottom: '12px' }}>
            {t(lang, 'errorTitle')}
          </h2>
          <p style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif', fontSize: '14px', color: 'rgba(5,33,7,0.7)', marginBottom: '24px' }}>
            {error || t(lang, 'errorBody')}
          </p>
          <button
            onClick={() => router.push('/questions')}
            style={{
              background: '#37613A',
              color: 'white',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontWeight: 700,
              fontSize: '14px',
              borderRadius: '9999px',
              padding: '12px 32px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {t(lang, 'tryAgain')}
          </button>
        </div>
      </>
    );
  }

  // --- RESULTS STATE ---
  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: "url('/assets/gradient-1.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '430px',
          margin: '0 auto',
          zIndex: 2,
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '40px 20px 40px',
            WebkitOverflowScrolling: 'touch', // Smooth iOS scrolling
          }}
          className="no-scrollbar"
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '24px' }}>
            <Image src="/assets/Logo Dark.svg" alt="Leaf" width={16} height={16} style={{ marginTop: '2px', flexShrink: 0 }} />
            <p style={{
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontWeight: 400,
              fontSize: '14px',
              color: '#052107',
              lineHeight: 1.4,
            }}>
              {t(lang, 'resultsHeader')}
            </p>
          </div>

          {/* MAIN CARD */}
          {data.plants.length > 0 && (
            <button
              onClick={() => router.push(`/plant/${data.plants[0].id}`)}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.75)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.4)',
                padding: '12px',
                marginBottom: '20px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'block',
              }}
            >
              {/* Image */}
              <div style={{
                width: '100%',
                height: '160px',
                background: '#D3DED5',
                borderRadius: '12px',
                marginBottom: '12px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <Image 
                  src={data.plants[0].imageUrl || '/images/screens/Full Sun.jpg'} 
                  alt={data.plants[0].name}
                  fill 
                  style={{ objectFit: 'cover' }} 
                  unoptimized
                />
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
                {data.plants[0].tags.slice(0, 2).map(tag => (
                  <span key={tag} style={{
                    background: '#D3DED5',
                    color: '#052107',
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    fontWeight: 400,
                    fontSize: '10px',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              <h3 style={{
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                fontWeight: 700,
                fontSize: '16px',
                color: '#052107',
                marginBottom: '4px',
                textAlign: 'left',
              }}>
                {data.plants[0].name}
              </h3>
              <p style={{
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                fontWeight: 400,
                fontSize: '14px',
                color: '#052107',
                lineHeight: 1.4,
                textAlign: 'left',
              }}>
                {data.plants[0].description}
              </p>
            </button>
          )}

          {/* 2x2 GRID */}
          {data.plants.length > 1 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '32px',
            }}>
              {data.plants.slice(1, 5).map(plant => (
                <button
                  key={plant.id}
                  onClick={() => router.push(`/plant/${plant.id}`)}
                  style={{
                    background: 'rgba(255,255,255,0.75)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.4)',
                    padding: '8px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{
                    width: '100%',
                    height: '100px',
                    background: '#D3DED5',
                    borderRadius: '10px',
                    marginBottom: '8px',
                    overflow: 'hidden',
                    position: 'relative',
                    flexShrink: 0,
                  }}>
                    <Image 
                      src={plant.imageUrl || '/images/screens/Partial sun.jpg'} 
                      alt={plant.name}
                      fill 
                      style={{ objectFit: 'cover' }} 
                      unoptimized
                    />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    {plant.tags.slice(0, 1).map(tag => (
                      <span key={tag} style={{
                        background: '#D3DED5',
                        color: '#052107',
                        fontFamily: 'var(--font-inter), system-ui, sans-serif',
                        fontWeight: 400,
                        fontSize: '9px',
                        padding: '2px 7px',
                        borderRadius: '9999px',
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h4 style={{
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    fontWeight: 700,
                    fontSize: '13px',
                    color: '#052107',
                    marginBottom: '2px',
                    textAlign: 'left',
                  }}>
                    {plant.name}
                  </h4>
                  <p style={{
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    fontWeight: 400,
                    fontSize: '11px',
                    color: '#052107',
                    lineHeight: 1.3,
                    textAlign: 'left',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {plant.description}
                  </p>
                </button>
              ))}
            </div>
          )}

          {/* EMAIL SECTION */}
          <div style={{ 
            marginBottom: '20px',
            background: 'rgba(255,255,255,0.55)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.4)',
            padding: '20px',
          }}>
            <h3 style={{
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontWeight: 700,
              fontSize: '16px',
              color: '#052107',
              marginBottom: '4px',
            }}>
              {t(lang, 'saveResults')}
            </h3>
            <p style={{
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontWeight: 400,
              fontSize: '12px',
              color: '#052107',
              marginBottom: '4px',
              lineHeight: 1.4,
            }}>
              {t(lang, 'saveResultsBody')}
            </p>
            <p style={{
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontWeight: 400,
              fontSize: '10px',
              color: '#37613A',
              marginBottom: '16px',
            }}>
              {t(lang, 'privacyNote')}
            </p>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                inputMode="email"
                autoComplete="email"
                placeholder={t(lang, 'emailPlaceholder')}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailState === 'error') setEmailState('default');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleEmailSubmit();
                }}
                disabled={emailState === 'success' || emailState === 'sending'}
                style={{
                  flex: 1,
                  background: (emailState === 'success' || emailState === 'sending') ? '#F5F5F5' : '#FFFFFF',
                  borderRadius: '9999px',
                  padding: '12px 16px',
                  fontFamily: 'var(--font-inter), system-ui, sans-serif',
                  fontSize: '14px',
                  border: emailState === 'error' ? '2px solid #BB1D42' : '1.5px solid rgba(211,222,213,0.8)',
                  outline: 'none',
                  minHeight: '44px',
                  color: '#052107',
                  boxSizing: 'border-box',
                  minWidth: 0, // Prevent flex overflow
                }}
              />
              <button
                onClick={handleEmailSubmit}
                disabled={emailState === 'success' || emailState === 'sending'}
                style={{
                  background: emailState === 'success' ? '#D3DED5' : '#37613A',
                  color: emailState === 'success' ? 'rgba(5,33,7,0.5)' : '#FFFFFF',
                  fontFamily: 'var(--font-inter), system-ui, sans-serif',
                  fontWeight: 700,
                  fontSize: '13px',
                  borderRadius: '9999px',
                  padding: '0 20px',
                  border: 'none',
                  minHeight: '44px',
                  flexShrink: 0,
                  cursor: (emailState === 'success' || emailState === 'sending') ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {emailState === 'sending' ? t(lang, 'sending') : t(lang, 'send')}
              </button>
            </div>
            
            {emailState === 'error' && (
              <p style={{
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                fontWeight: 400,
                fontSize: '11px',
                color: '#BB1D42',
                marginTop: '8px',
                paddingLeft: '12px',
              }}>
                {emailErrorMsg}
              </p>
            )}
            {emailState === 'success' && (
              <p style={{
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                fontWeight: 400,
                fontSize: '11px',
                color: '#37613A',
                marginTop: '8px',
                paddingLeft: '12px',
              }}>
                {t(lang, 'emailSuccess')}
              </p>
            )}
            {emailState === 'sending' && (
              <p style={{
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                fontWeight: 400,
                fontSize: '11px',
                color: 'rgba(5,33,7,0.5)',
                marginTop: '8px',
                paddingLeft: '12px',
              }}>
                {t(lang, 'emailSending')}
              </p>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
