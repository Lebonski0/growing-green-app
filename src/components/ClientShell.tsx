'use client';

import { usePathname } from 'next/navigation';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If we are on the landing page, we don't want the mobile shell.
  // We want the landing page to be a full-width desktop experience.
  if (pathname === '/') {
    return <>{children}</>;
  }

  // By returning children directly, the botanical backgrounds 
  // (bg-intro, bg-questions, bg-results) will automatically fill 
  // the entire desktop screen, while the content remains centered 
  // at 430px via the inner wrappers.
  return <>{children}</>;
}
