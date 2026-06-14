'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useLang } from '@/components/LangContext';
import { t } from '@/lib/translations';

const getOptionImage = (label: string) => {
  const map: Record<string, string> = {
    'Food Forest': '/images/screens/foodforest.jpg',
    'Pollinator Garden': '/images/screens/Pollinator Garden.jpg',
    'Vegetable Plot': '/images/screens/Vegetable Plot.jpg',
    'Lawn Replacement': '/images/screens/Lawn Replacemen.jpg',
    'Tropical': '/images/screens/Tropical.jpg',
    'Arid / Desert': '/images/screens/Arid.Desert.jpg',
    'Mediterranean': '/images/screens/Mediterranean.jpg',
    'Temperate': '/images/screens/Temperate.jpg',
    'Continental': '/images/screens/Continental.jpg',
    'Subtropical': '/images/screens/Subtropical.jpg',
    'Full Sun (6+ hours)': '/images/screens/Full Sun.jpg',
    'Partial Sun (3–6 hours)': '/images/screens/Partial sun.jpg',
    'Partial Shade (1–3 hours)': '/images/screens/Partial shade.jpg',
    'Full Shade (less than 1 hour)': '/images/screens/Full Shade.jpg',
    'Tiny – Balcony / Container': '/images/screens/Tiny.jpg',
    'Small – Up to 25m²': '/images/screens/Small.jpg',
    'Medium – 25 to 100m²': '/images/screens/Meduim.jpg',
    'Large – 100m² and above': '/images/screens/Large.jpg',
    'Yes – I have test results': '/images/screens/soiltest yes.jpg',
    'No – Use regional defaults': '/images/screens/Soil test no.jpg',
  };
  return map[label] || '';
};

// Question IDs — options are looked up via translation keys
const QUESTION_DEFS = [
  {
    id: 'gardenType',
    titleKey: 'q1Title' as const,
    optionKeys: ['foodForest', 'pollinatorGarden', 'vegetablePlot', 'lawnReplacement'] as const,
    gridCols: 2,
  },
  {
    id: 'climateZone',
    titleKey: 'q2Title' as const,
    optionKeys: ['tropical', 'aridDesert', 'mediterranean', 'temperate', 'continental', 'subtropical'] as const,
    gridCols: 3,
  },
  {
    id: 'sunExposure',
    titleKey: 'q3Title' as const,
    optionKeys: ['fullSun', 'partialSun', 'partialShade', 'fullShade'] as const,
    gridCols: 2,
  },
  {
    id: 'plotSize',
    titleKey: 'q4Title' as const,
    optionKeys: ['tiny', 'small', 'medium', 'large'] as const,
    gridCols: 2,
  },
  {
    id: 'soilTest',
    titleKey: 'q5Title' as const,
    optionKeys: ['soilYes', 'soilNo'] as const,
    gridCols: 2,
  },
];

// English option labels used as stable keys for image lookup and sessionStorage
const EN_OPTIONS: Record<string, string> = {
  foodForest: 'Food Forest',
  pollinatorGarden: 'Pollinator Garden',
  vegetablePlot: 'Vegetable Plot',
  lawnReplacement: 'Lawn Replacement',
  tropical: 'Tropical',
  aridDesert: 'Arid / Desert',
  mediterranean: 'Mediterranean',
  temperate: 'Temperate',
  continental: 'Continental',
  subtropical: 'Subtropical',
  fullSun: 'Full Sun (6+ hours)',
  partialSun: 'Partial Sun (3–6 hours)',
  partialShade: 'Partial Shade (1–3 hours)',
  fullShade: 'Full Shade (less than 1 hour)',
  tiny: 'Tiny – Balcony / Container',
  small: 'Small – Up to 25m²',
  medium: 'Medium – 25 to 100m²',
  large: 'Large – 100m² and above',
  soilYes: 'Yes – I have test results',
  soilNo: 'No – Use regional defaults',
};

const QUICK_TAGS: Record<string, string[]> = {
  en: ['Sandy', 'Clay', 'Acidic'],
  fr: ['Sableux', 'Argileux', 'Acide'],
  es: ['Arenoso', 'Arcilloso', 'Ácido'],
  zh: ['沙质', '粘土', '酸性'],
  hi: ['रेतीली', 'मिट्टी', 'अम्लीय'],
  ar: ['رملية', 'طينية', 'حمضية'],
};

type Answers = {
  gardenType: string;
  climateZone: string;
  sunExposure: string;
  plotSize: string;
  soilTest: string | null;
};

export default function QuestionsScreen() {
  const router = useRouter();
  const { lang } = useLang();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    gardenType: '',
    climateZone: '',
    sunExposure: '',
    plotSize: '',
    soilTest: null,
  });
  const [soilDetails, setSoilDetails] = useState('');
  const [animating, setAnimating] = useState(false);

  const qDef = QUESTION_DEFS[currentStep];
  // Build translated options array
  const qOptions = qDef.optionKeys.map(k => ({
    key: k,
    label: t(lang, k),      // translated display label
    enValue: EN_OPTIONS[k], // stable English value for storage & image lookup
  }));
  const isLast = currentStep === QUESTION_DEFS.length - 1;

  const currentAnswer = (): string | null => {
    if (qDef.id === 'soilTest') return answers.soilTest;
    return answers[qDef.id as keyof Answers] as string;
  };

  const isAnswered = (): boolean => {
    const val = currentAnswer();
    return val !== '' && val !== null;
  };

  const isSelected = (label: string): boolean => currentAnswer() === label;

  const advanceStep = useCallback(() => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrentStep((s) => s + 1);
      setAnimating(false);
    }, 260);
  }, [animating]);

  const handleSelect = useCallback((enValue: string) => {
    // Store the stable English value for API usage
    const newAnswers = qDef.id === 'soilTest'
      ? { ...answers, soilTest: enValue }
      : { ...answers, [qDef.id]: enValue };
    setAnswers(newAnswers);

    // Auto-advance — stay on soil test if 'Yes' selected (user needs to type)
    if (!isLast) {
      if (qDef.id === 'soilTest' && enValue === 'Yes – I have test results') {
        return;
      }
      setTimeout(() => advanceStep(), 180);
    }
  }, [answers, qDef.id, isLast, advanceStep]);

  const handleComplete = () => {
    if (isAnswered()) {
      sessionStorage.setItem('greenGardenAnswers', JSON.stringify({ ...answers, soilDetails: soilDetails || null }));
      sessionStorage.removeItem('greenGardenResults'); // Force fresh API call
      router.push('/results');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
    else router.push('/');
  };

  // Whether the question has 6 options (climate) — use compact card style
  const isCompact = qDef.optionKeys.length === 6;

  return (
    <>
      {/* Full-screen fixed background */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: "url('/assets/gradient-3.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      />

      {/* Page wrapper */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '430px',
          margin: '0 auto',
          zIndex: 1,
        }}
      >
        {/* ── TOP HEADER with progress dots ── */}
        <div style={{
          flexShrink: 0,
          padding: '20px 24px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Back arrow */}
          <button
            onClick={handlePrev}
            aria-label="Previous"
            style={{
              padding: '8px',
              borderRadius: '9999px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Image src="/assets/Arrow left.svg" alt="Previous" width={24} height={24} />
          </button>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {QUESTION_DEFS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === currentStep ? '22px' : '8px',
                  height: '8px',
                  borderRadius: '9999px',
                  background: i <= currentStep ? '#37613A' : 'rgba(5,33,7,0.18)',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>

          {/* Spacer to balance the back arrow */}
          <div style={{ width: '40px' }} />
        </div>

        {/* ── SCROLLABLE CONTENT ── */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: isCompact ? '20px 20px 12px' : '28px 20px 16px',
            opacity: animating ? 0 : 1,
            transform: animating ? 'translateY(8px)' : 'translateY(0)',
            transition: 'opacity 0.25s ease, transform 0.25s ease',
          }}
        >
          {/* Question title */}
          <h1 style={{
            fontFamily: 'var(--font-charon), Georgia, serif',
            fontWeight: 700,
            fontSize: isCompact ? '20px' : '24px',
            color: '#052107',
            marginBottom: '4px',
            lineHeight: 1.2,
          }}>
            {t(lang, qDef.titleKey)}
          </h1>

          {/* Subtle step label */}
          <p style={{
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontSize: '12px',
            color: 'rgba(5,33,7,0.5)',
            marginBottom: isCompact ? '16px' : '20px',
          }}>
            {t(lang, 'question')} {currentStep + 1} {t(lang, 'questionOf')} {QUESTION_DEFS.length}
          </p>

          {/* Options grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${qDef.gridCols}, 1fr)`,
            gap: isCompact ? '8px' : '12px',
          }}>
            {qOptions.map((opt) => {
              const selected = isSelected(opt.enValue);
              return (
                <button
                  key={opt.key}
                  onClick={() => handleSelect(opt.enValue)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    padding: isCompact ? '6px' : '8px',
                    borderRadius: '14px',
                    border: selected ? '2px solid #37613A' : '1.5px solid rgba(255,255,255,0.6)',
                    background: selected ? 'rgba(202,245,166,0.45)' : 'rgba(255,255,255,0.45)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: selected ? '0 2px 12px rgba(55,97,58,0.2)' : '0 1px 4px rgba(0,0,0,0.06)',
                  }}
                >
                  {/* Option image — always uses English key for image lookup */}
                  <div style={{
                    width: '100%',
                    aspectRatio: isCompact ? '4/3' : '16/9',
                    background: 'rgba(211,222,213,0.55)',
                    borderRadius: '8px',
                    marginBottom: '6px',
                    overflow: 'hidden',
                    position: 'relative',
                    flexShrink: 0,
                  }}>
                    <Image
                      src={getOptionImage(opt.enValue)}
                      alt={opt.label}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  {/* Translated label */}
                  <span style={{
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    fontWeight: 700,
                    fontSize: isCompact ? '11px' : '14px',
                    color: '#052107',
                    paddingLeft: '2px',
                    paddingBottom: '2px',
                    lineHeight: 1.3,
                  }}>
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Soil test textarea — only shown when "Yes" is selected */}
          {qDef.id === 'soilTest' && answers.soilTest === 'Yes – I have test results' && (
            <div style={{ marginTop: '16px' }}>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                fontWeight: 700,
                fontSize: '13px',
                color: '#052107',
                marginBottom: '8px',
              }}>
                {t(lang, 'soilInputLabel')}
              </label>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                {(QUICK_TAGS[lang] || QUICK_TAGS['en']).map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSoilDetails(prev => prev ? `${prev}, ${tag}` : tag)}
                    style={{
                      background: 'rgba(255,255,255,0.7)',
                      border: '1.5px solid rgba(255,255,255,0.9)',
                      borderRadius: '9999px',
                      padding: '6px 12px',
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                      fontSize: '12px',
                      color: '#052107',
                      cursor: 'pointer',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                    }}
                  >
                    + {tag}
                  </button>
                ))}
              </div>

              <textarea
                value={soilDetails}
                onChange={(e) => setSoilDetails(e.target.value)}
                placeholder={t(lang, 'soilInputPlaceholder')}
                rows={3}
                style={{
                  width: '100%',
                  borderRadius: '14px',
                  padding: '12px 16px',
                  fontFamily: 'var(--font-inter), system-ui, sans-serif',
                  fontSize: '13px',
                  outline: 'none',
                  border: '2px solid #D3DED5',
                  background: 'rgba(255,255,255,0.7)',
                  resize: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          )}
        </div>

        {/* ── BOTTOM — Complete button (last step) or empty spacer ── */}
        {isLast && (
          <div style={{
            flexShrink: 0,
            padding: '12px 24px 32px',
            borderTop: '1px solid rgba(255,255,255,0.25)',
            display: 'flex',
            justifyContent: 'center',
          }}>
            <button
              onClick={handleComplete}
              disabled={!isAnswered()}
              style={{
                background: isAnswered() ? '#37613A' : 'rgba(5,33,7,0.15)',
                color: isAnswered() ? 'white' : 'rgba(5,33,7,0.4)',
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                fontWeight: 700,
                fontSize: '15px',
                borderRadius: '9999px',
                padding: '14px 48px',
                border: 'none',
                cursor: isAnswered() ? 'pointer' : 'not-allowed',
                minHeight: '52px',
                transition: 'all 0.2s ease',
                width: '100%',
                maxWidth: '280px',
              }}
            >
              {t(lang, 'complete')}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
