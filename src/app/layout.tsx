import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Crab's ICPC generator",
  description: "Crab's ICPC generator - Auto-generate ACM-ICPC Team Notebook directly into Overleaf",
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-blue-500/30">
        {children}
      </body>
    </html>
  );
}
