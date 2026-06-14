'use client';

import { usePathname } from 'next/navigation';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If we are on the landing page, we don't want the mobile shell.
  // We want the landing page to be a full-width desktop experience.
  if (pathname === '/') {
    return <>{children}</>;
  }

  // For the actual app flow (/garden, /questions, /results, etc.), 
  // wrap it in the botanical mobile shell for desktop users.
  return (
    <div className="desktop-shell">
      <div className="app-container">
        {children}
      </div>
    </div>
  );
}
