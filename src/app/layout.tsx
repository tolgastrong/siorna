// app/layout.tsx
// CSS import'larını buraya ekleyin

import type { Metadata } from 'next';
import '../app/globals.css';          // ← Design tokens + base styles
import '../components/sections.css';     // ← Section-level styles

export const metadata: Metadata = {
  title: 'Siorna — Engineering Reports, On Autopilot',
  description: 'Automated engineering reports from your GitHub, Linear, and Jira.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}