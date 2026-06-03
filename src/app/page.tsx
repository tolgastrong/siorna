import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans selection:bg-zinc-900 selection:text-white dark:bg-zinc-950 dark:selection:bg-white dark:selection:text-zinc-900">
      
      {/* Background Grid Pattern for a technical SaaS look */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Hero Section */}
      <main className="relative z-10 flex w-full max-w-5xl flex-col items-center justify-center px-6 text-center">
        
        {/* Security & Trust Badge */}
        <div className="mb-8 inline-flex items-center rounded-full border border-zinc-200 bg-white/60 px-4 py-1.5 text-sm font-medium text-zinc-900 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-100">
          <span className="mr-2 flex h-2 w-2 items-center justify-center rounded-full bg-emerald-500"></span>
          <span className="tracking-tight">
            <strong>Zero-Code Access:</strong> We read your metadata, never your source code.
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-zinc-900 sm:text-7xl dark:text-zinc-50">
          Engineering Standups, <br className="hidden sm:inline" />
          <span className="text-zinc-500 dark:text-zinc-400">on Autopilot.</span>
        </h1>

        {/* Sub-headline */}
        <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Siorna analyzes your GitHub commits and Linear/Jira tickets overnight. 
          Get perfectly summarized daily standups delivered directly to Slack every morning at 9:00 AM. 
          Zero manual input required.
        </p>

        {/* Call to Action (CTA) Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-x-6">
          <Button size="lg" className="h-12 px-8 text-base font-semibold shadow-lg transition-all hover:scale-105">
            Join the Waitlist
          </Button>
          <Button variant="outline" size="lg" className="h-12 px-8 text-base font-semibold transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800">
            View Live Demo
          </Button>
        </div>

        {/* Social Proof & Integrations */}
        <div className="mt-16 flex flex-col items-center justify-center space-y-4 border-t border-zinc-200 pt-8 dark:border-zinc-800 sm:flex-row sm:space-x-8 sm:space-y-0">
          <div className="flex items-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
            <svg className="mr-2 h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            GitHub Integration
          </div>
          <div className="flex items-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
            <svg className="mr-2 h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Linear & Jira Support
          </div>
          <div className="flex items-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
            <svg className="mr-2 h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Slack Delivery
          </div>
        </div>

      </main>
      
    </div>
  );
}