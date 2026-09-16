import type { Metadata } from 'next';
import './globals.css';
import { SimulationProvider } from '@/context/SimulationContext';
import { CommandPalette } from '@/components/common/CommandPalette';

export const metadata: Metadata = {
  title: 'IBVAP — Intelligent Border Video Analytics Platform | SIH26187',
  description: 'AI-Based Intelligent Video Analytics Platform for Border Surveillance Using Existing CCTV Infrastructure. Edge-first prototype with real-time detection, tracking, ANPR, virtual zones, and forensic evidence management.',
  keywords: ['Border Surveillance', 'Computer Vision', 'DeepSORT', 'YOLOv8', 'ANPR', 'Edge AI', 'Defense Tech', 'IBVAP', 'SIH26187'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-obsidian text-neutral-100 min-h-screen antialiased selection:bg-neutral-800 selection:text-white">
        <SimulationProvider>
          {children}
          <CommandPalette />
        </SimulationProvider>
      </body>
    </html>
  );
}
