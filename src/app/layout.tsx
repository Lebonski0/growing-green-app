import type { Metadata, Viewport } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/components/LangContext";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-inter",
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-charon",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#052107",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Green Garden — Your AI Plant Plan, Free & Private',
  description: 'Answer 5 questions about your garden and get an AI-powered native plant plan tailored to your climate, soil, and sun. Free, private, no account needed. Your data is deleted after your plan is sent.',
  keywords: ['sustainable garden', 'native plants', 'AI garden planner', 'free garden plan', 'organic gardening'],
  openGraph: {
    title: 'Green Garden — Your AI Plant Plan',
    description: 'Free. Private. 5 questions. Your personalized garden plan, emailed to you and then deleted forever.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Green Garden — Your AI Plant Plan',
    description: 'Free. Private. 5 questions. Your personalized garden plan, emailed to you and then deleted forever.',
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌱</text></svg>"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${dmSerifDisplay.variable} antialiased font-body`}>
        <LangProvider>
          {/* Desktop shell — centers the mobile app with a botanical background on large screens */}
          <div className="desktop-shell">
            <div className="app-container">
              {children}
            </div>
          </div>
        </LangProvider>
      </body>
    </html>
  );
}
