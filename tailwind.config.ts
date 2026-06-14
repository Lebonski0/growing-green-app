import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryDarkest: '#052107',
        primaryDark:    '#37613A',
        primaryLight:   '#CAF5A6',
        surfaceGrey:    '#F5F5F5',
        surfaceMuted:   '#D3DED5',
        error:          '#BB1D42',
      },
      fontFamily: {
        // heading = Charon equivalent (DM Serif Display - closest serif match on Google Fonts)
        heading: ['var(--font-charon)', 'Georgia', 'serif'],
        // body = Inter (exact match from Figma)
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card:   '16px',
        pill:   '9999px',
        option: '12px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.08)',
        btn:  '0 2px 8px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
};
export default config;
