import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'AI Startup Co-Founder — Instant Actionable Startup Blueprints',
  description: 'Transform your startup idea into a validated business model, competitor analysis, MVP feature set, tech stack, and 30-day roadmap.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-ink text-paper min-height-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
