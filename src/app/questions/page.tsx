'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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

const QUESTIONS = [
  {
    id: 'gardenType',
    title: 'What type of garden do you want?',
    options: ['Food Forest', 'Pollinator Garden', 'Vegetable Plot', 'Lawn Replacement'],
    gridCols: 2,
  },
  {
    id: 'climateZone',
    title: 'Where in the world are you growing?',
    options: ['Tropical', 'Arid / Desert', 'Mediterranean', 'Temperate', 'Continental', 'Subtropical'],
    gridCols: 3, // 3 columns for 6 items — no scroll needed
  },
  {
    id: 'sunExposure',
    title: 'How much sun does your space get?',
    options: ['Full Sun (6+ hours)', 'Partial Sun (3–6 hours)', 'Partial Shade (1–3 hours)', 'Full Shade (less than 1 hour)'],
    gridCols: 2,
  },
  {
    id: 'plotSize',
    title: 'How big is your growing space?',
    options: ['Tiny – Balcony / Container', 'Small – Up to 25m²', 'Medium – 25 to 100m²', 'Large – 100m² and above'],
    gridCols: 2,
  },
  {
    id: 'soilTest',
    title: 'Do you have soil test results?',
    options: ['Yes – I have test results', 'No – Use regional defaults'],
    gridCols: 2,
  },
];

type Answers = {
  gardenType: string;
  climateZone: string;
  sunExposure: string;
  plotSize: string;
  soilTest: string | null;
};

export default function QuestionsScreen() {
  const router = useRouter();
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

  const q = QUESTIONS[currentStep];
  const isLast = currentStep === QUESTIONS.length - 1;

  const currentAnswer = (): string | null => {
    if (q.id === 'soilTest') return answers.soilTest;
    return answers[q.id as keyof Answers] as string;
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

  const handleSelect = useCallback((label: string) => {
    // Update the answer first
    const newAnswers = q.id === 'soilTest'
      ? { ...answers, soilTest: label }
      : { ...answers, [q.id]: label };
    setAnswers(newAnswers);

    // Auto-advance — but on soil test only if "No" (no text input needed)
    if (!isLast) {
      if (q.id === 'soilTest' && label === 'Yes – I have test results') {
        // Stay — user needs to fill in soil details
        return;
      }
      setTimeout(() => advanceStep(), 180); // tiny delay so selection flash is visible
    }
  }, [answers, q.id, isLast, advanceStep]);

  const handleComplete = () => {
    if (isAnswered()) {
      sessionStorage.setItem('greenGardenAnswers', JSON.stringify({ ...answers, soilDetails: soilDetails || null }));
      router.push('/results');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
    else router.push('/');
  };

  // Whether the question has 6 options (climate) — use compact card style
  const isCompact = q.options.length === 6;

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
            {QUESTIONS.map((_, i) => (
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
            {q.title}
          </h1>

          {/* Subtle step label */}
          <p style={{
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontSize: '12px',
            color: 'rgba(5,33,7,0.5)',
            marginBottom: isCompact ? '16px' : '20px',
          }}>
            Question {currentStep + 1} of {QUESTIONS.length}
          </p>

          {/* Options grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${q.gridCols}, 1fr)`,
            gap: isCompact ? '8px' : '12px',
          }}>
            {q.options.map((opt) => {
              const selected = isSelected(opt);
              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
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
                  {/* Option image */}
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
                      src={getOptionImage(opt)}
                      alt={opt}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  {/* Label */}
                  <span style={{
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    fontWeight: 700,
                    fontSize: isCompact ? '11px' : '14px',
                    color: '#052107',
                    paddingLeft: '2px',
                    paddingBottom: '2px',
                    lineHeight: 1.3,
                  }}>
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Soil test textarea — only shown when "Yes" is selected */}
          {q.id === 'soilTest' && answers.soilTest === 'Yes – I have test results' && (
            <div style={{ marginTop: '16px' }}>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                fontWeight: 700,
                fontSize: '13px',
                color: '#052107',
                marginBottom: '8px',
              }}>
                Enter your test results (N-P-K, pH, etc.)
              </label>
              <textarea
                value={soilDetails}
                onChange={(e) => setSoilDetails(e.target.value)}
                placeholder="e.g. pH 6.5, low nitrogen..."
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
              Get My Garden Plan 🌱
            </button>
          </div>
        )}
      </div>
    </>
  );
}
