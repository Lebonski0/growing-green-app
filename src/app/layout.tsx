import type { Metadata, Viewport } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/components/LangContext";
import ClientShell from "@/components/ClientShell";

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
};

export const metadata: Metadata = {
  metadataBase: new URL('https://growing-green-app.vercel.app'),
  title: 'Green Garden: Build your perfect sustainable garden with AI.',
  description: 'Answer 7 questions to get a hyper-local blueprint of native plants perfectly matched to your climate and soil. 100% free, private, and zero accounts required.',
  keywords: ['sustainable garden', 'native plants', 'AI garden planner', 'free garden plan', 'organic gardening', 'permaculture'],
  openGraph: {
    title: 'Green Garden: Build your perfect sustainable garden with AI.',
    description: 'Answer 7 questions to get a hyper-local blueprint of native plants perfectly matched to your climate and soil. 100% free, private, and zero accounts required.',
    siteName: 'Green Garden',
    type: 'website',
    locale: 'en_US',
    url: 'https://growing-green-app.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Green Garden: Build your perfect sustainable garden with AI.',
    description: 'Answer 7 questions to get a hyper-local blueprint of native plants perfectly matched to your climate and soil. 100% free, private, and zero accounts required.',
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/assets/Logo Dark.svg', media: '(prefers-color-scheme: light)' },
      { url: '/assets/Logo White.svg', media: '(prefers-color-scheme: dark)' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
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
          <ClientShell>
            {children}
          </ClientShell>
        </LangProvider>
      </body>
    </html>
  );
}
