import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dev Environment Manager (DEM) v2.5.0 LTS | Debian 13 Trixie',
  description: 'Production-grade Linux developer environment provisioning, editing, and diagnostic web application for Debian 13 (Trixie).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0d1117] text-slate-200 antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}
