// app/page.tsx  (Next.js 13+ App Router)
// ─────────────────────────────────────────────
// Kurulum adımları:
//   1. styles/globals.css → mevcut globals.css içeriğini bu dosyayla değiştirin
//   2. components/Navbar.tsx + Navbar.module.css → components/ klasörüne ekleyin
//   3. components/Hero.tsx + Hero.module.css → components/ klasörüne ekleyin
//   4. components/Sections.tsx + sections.css → components/ klasörüne ekleyin
//   5. Bu page.tsx → app/page.tsx dosyasına yapıştırın
//
// layout.tsx'e şunu ekleyin:
//   import '../styles/globals.css'
//   import '../components/sections.css'
// ─────────────────────────────────────────────

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import {
  HowItWorks,
  Integrations,
  ReportTypes,
  Security,
  Pricing,
  Testimonials,
  FAQ,
  CTA,
  Footer,
} from '@/components/Sections';

export const metadata = {
  title: 'Siorna — Engineering Reports, On Autopilot',
  description:
    'Siorna pulls your GitHub commits, Linear and Jira tickets — and writes daily standups, weekly digests, and monthly reports. Automatically.',
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Integrations />
        <ReportTypes />
        <Security />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}