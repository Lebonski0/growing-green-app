'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function IntroScreen() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Small delay so CSS transition plays on mount
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="relative bg-intro grain-overlay flex flex-col items-center justify-center min-h-[100dvh] w-full max-w-[430px] mx-auto overflow-hidden">

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
          Welcome to
        </p>
        <h1
          className="type-heading text-primaryDarkest flex items-center gap-1"
          style={{ fontSize: '32px', fontWeight: 700 }}
        >
          Green Garden
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
          Get Started
        </button>
      </div>

    </main>
  );
}
