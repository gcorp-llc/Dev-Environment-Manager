import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dev Environment Manager (DEM) - Web Control Hub',
  description: 'Production-ready environment provisioning framework for Debian 13 (Trixie)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0d1117] text-slate-100">
        {children}
      </body>
    </html>
  );
}
