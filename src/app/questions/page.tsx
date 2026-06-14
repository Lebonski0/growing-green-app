'use client';

import { useState } from 'react';
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
    gridCols: 2,
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

  const q = QUESTIONS[currentStep];

  const currentAnswer = (): string | null => {
    if (q.id === 'soilTest') return answers.soilTest;
    return answers[q.id as keyof Answers] as string;
  };

  const isAnswered = (): boolean => {
    const val = currentAnswer();
    return val !== '' && val !== null;
  };

  const handleSelect = (label: string) => {
    if (q.id === 'soilTest') {
      setAnswers({ ...answers, soilTest: label });
    } else {
      setAnswers({ ...answers, [q.id]: label });
    }
  };

  const isSelected = (label: string): boolean => currentAnswer() === label;

  const handleNext = () => {
    if (isAnswered() && currentStep < QUESTIONS.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
    else router.push('/');
  };

  const handleComplete = () => {
    if (isAnswered()) {
      sessionStorage.setItem('greenGardenAnswers', JSON.stringify({ ...answers, soilDetails: soilDetails || null }));
      router.push('/results');
    }
  };

  const isLast = currentStep === QUESTIONS.length - 1;

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

      {/* Page wrapper — full screen, flex column */}
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
        {/* ── SCROLLABLE CONTENT ── */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '48px 20px 16px',
          }}
        >
          {/* Question number */}
          <h1 style={{
            fontFamily: 'var(--font-charon), Georgia, serif',
            fontWeight: 700,
            fontSize: '24px',
            color: '#052107',
            marginBottom: '4px',
            lineHeight: 1.2,
          }}>
            Question {currentStep + 1}
          </h1>

          {/* Question text */}
          <p style={{
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontSize: '14px',
            color: 'rgba(5,33,7,0.75)',
            marginBottom: '24px',
            lineHeight: 1.5,
          }}>
            {q.title}
          </p>

          {/* Options grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${q.gridCols}, 1fr)`,
            gap: '12px',
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
                    padding: '8px',
                    borderRadius: '16px',
                    border: selected ? '2px solid #37613A' : '1.5px solid rgba(255,255,255,0.6)',
                    background: selected ? 'rgba(202,245,166,0.4)' : 'rgba(255,255,255,0.45)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    minHeight: '44px',
                    boxShadow: selected ? '0 2px 12px rgba(55,97,58,0.15)' : '0 1px 4px rgba(0,0,0,0.06)',
                  }}
                >
                  {/* Option image */}
                  <div style={{
                    width: '100%',
                    aspectRatio: '16/9',
                    background: 'rgba(211,222,213,0.55)',
                    borderRadius: '10px',
                    marginBottom: '8px',
                    overflow: 'hidden',
                    position: 'relative'
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
                    fontSize: '16px',
                    color: '#052107',
                    paddingLeft: '4px',
                    paddingBottom: '4px',
                    lineHeight: 1.3,
                  }}>
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Soil test input */}
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

        {/* ── BOTTOM NAV — always visible ── */}
        <div style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px 28px',
          borderTop: '1px solid rgba(255,255,255,0.25)',
        }}>
          {/* Prev arrow */}
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

          {/* Center */}
          {isLast && isAnswered() ? (
            <button
              onClick={handleComplete}
              style={{
                background: '#37613A',
                color: 'white',
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                fontWeight: 700,
                fontSize: '14px',
                borderRadius: '9999px',
                padding: '10px 36px',
                border: 'none',
                cursor: 'pointer',
                minHeight: '44px',
              }}
            >
              Complete
            </button>
          ) : (
            <span style={{
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontWeight: 700,
              fontSize: '12px',
              color: isAnswered() ? '#052107' : 'rgba(5,33,7,0.35)',
            }}>
              Question {currentStep + 1} of {QUESTIONS.length}
            </span>
          )}

          {/* Next arrow */}
          {isLast && isAnswered() ? (
            <div style={{ width: '40px' }} />
          ) : (
            <button
              onClick={handleNext}
              disabled={!isAnswered()}
              aria-label="Next"
              style={{
                padding: '8px',
                borderRadius: '9999px',
                border: 'none',
                background: 'transparent',
                cursor: isAnswered() ? 'pointer' : 'not-allowed',
                opacity: isAnswered() ? 1 : 0.3,
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Image src="/assets/Arrow right.svg" alt="Next" width={24} height={24} />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
