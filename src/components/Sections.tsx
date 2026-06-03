'use client';

import { useState, useEffect, useRef } from 'react';

/* ─── useReveal hook ─────────────────────────────────────── */
export function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible');
        }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ─── HowItWorks ─────────────────────────────────────────── */
export function HowItWorks() {
  useReveal();
  return (
    <section id="how">
      <div className="section-inner">
        <span className="section-label reveal">How it works</span>
        <h2 className="section-title reveal">Set up once.<br />Reports write themselves.</h2>
        <p className="section-sub reveal">
          Connect your tools, define your team, and Siorna handles the rest. No templates. No manual entry. Ever.
        </p>

        <div className="how-grid reveal">
          {[
            { num: '01', icon: '🔗', title: 'Connect your stack', desc: 'Authorize GitHub, Linear, Jira, or Trello with read-only OAuth. Siorna only reads commit messages and ticket titles — never source code or diffs.' },
            { num: '02', icon: '👥', title: 'Add your team', desc: 'Map teammates to their GitHub usernames and project management accounts. Takes under 3 minutes for a 10-person team.' },
            { num: '03', icon: '✉️', title: 'Reports arrive automatically', desc: 'Daily standups post to Slack every morning. Weekly summaries land in your inbox every Friday. Monthly reports give leadership the full picture.' },
          ].map((card) => (
            <div className="how-card" key={card.num}>
              <span className="how-num">{card.num}</span>
              <div className="how-icon">{card.icon}</div>
              <div className="how-title">{card.title}</div>
              <p className="how-desc">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Integrations ───────────────────────────────────────── */
export function Integrations() {
  const chips = [
    { icon: '🐙', name: 'GitHub' },
    { icon: '🔷', name: 'Linear' },
    { icon: '🔵', name: 'Jira' },
    { icon: '🟦', name: 'Trello' },
    { icon: '💬', name: 'Slack' },
    { icon: '📧', name: 'Email' },
    { icon: '🟩', name: 'Asana', soon: true },
    { icon: '⬛', name: 'Notion', soon: true },
    { icon: '🟧', name: 'Monday', soon: true },
  ];
  return (
    <section className="integrations-section">
      <div className="section-inner">
        <span className="section-label reveal">Integrations</span>
        <h2 className="section-title reveal">Works with the tools<br />your team already uses.</h2>
        <div className="int-grid reveal">
          {chips.map((c) => (
            <div className="int-chip" key={c.name}>
              <span>{c.icon}</span> {c.name}
              {c.soon && <span className="int-coming">Soon</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── ReportTypes ────────────────────────────────────────── */
export function ReportTypes() {
  const cards = [
    { type: 'daily', title: 'Daily Standup', sub: 'Per team member · Last 24h', schedule: '09:00 ET · Mon–Fri', desc: 'Yesterday / Today / Blockers — pulled from real commits and ticket updates. Posted directly to your Slack standup channel.', channels: ['💬 Slack'] },
    { type: 'weekly', title: 'Weekly Summary', sub: 'Team overview · Last 7 days', schedule: 'Fri 17:00 ET', desc: 'Velocity metrics, completed work, blockers, and momentum heading into next week. Great for engineering managers and team leads.', channels: ['💬 Slack', '📧 Email'] },
    { type: 'biweekly', title: 'Sprint Review', sub: 'Biweekly · 15-day sprint', schedule: '1st & 15th', desc: 'Commitment accuracy, recurring blockers, team workload distribution, and carryover analysis. Built for sprint retrospectives.', channels: ['📧 Email'] },
    { type: 'monthly', title: 'Monthly Executive Report', sub: 'Leadership-ready · Full month', schedule: 'Last day of month', desc: 'What shipped, velocity trends, tech debt signals, and capacity insights. Ready to present to CTO or CEO without editing.', channels: ['📧 Email', '📄 PDF'] },
  ];
  return (
    <section id="reports">
      <div className="section-inner">
        <span className="section-label reveal">Report types</span>
        <h2 className="section-title reveal">Four cadences.<br />One setup.</h2>
        <p className="section-sub reveal">
          From quick morning standups to full monthly retrospectives — Siorna generates the right format for each audience.
        </p>
        <div className="reports-grid reveal">
          {cards.map((c) => (
            <div className={`report-card ${c.type}`} key={c.type}>
              <div className="report-card-header">
                <div>
                  <div className="report-type-title">{c.title}</div>
                  <div className="report-type-sub">{c.sub}</div>
                </div>
                <div className="report-schedule">{c.schedule}</div>
              </div>
              <p className="report-desc">{c.desc}</p>
              <div className="report-channels">
                {c.channels.map((ch) => (
                  <span className="channel-tag" key={ch}>{ch}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Security ───────────────────────────────────────────── */
export function Security() {
  const items = [
    { icon: '🔒', title: 'Metadata only, no diffs', desc: 'We read commit messages, PR titles, and ticket names. Source code, file contents, and diffs are never accessed or transmitted.' },
    { icon: '🔑', title: 'Minimal OAuth scope', desc: 'Our GitHub OAuth requests only read:user repo:status — the most restricted scope possible. You\'ll see exactly what we ask for.' },
    { icon: '🧠', title: 'Not used for AI training', desc: 'Your data is processed via the Anthropic API under their zero-retention policy. It is never used to train AI models.' },
    { icon: '🗑️', title: 'Auto-delete after processing', desc: 'Raw event data is deleted after reports are generated. You can configure retention windows or request immediate deletion at any time.' },
  ];
  return (
    <section id="security" style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="section-inner">
        <span className="section-label reveal">Security &amp; Privacy</span>
        <h2 className="section-title reveal">Your code never<br />leaves your repo.</h2>
        <p className="section-sub reveal">Siorna reads only the metadata your team already shares in Slack notifications. Nothing more.</p>

        <div className="security-grid">
          <ul className="security-list reveal">
            {items.map((item) => (
              <li className="security-item" key={item.title}>
                <div className="sec-icon">{item.icon}</div>
                <div>
                  <div className="sec-title">{item.title}</div>
                  <p className="sec-desc">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="security-code reveal">
            <div className="code-topbar">What Siorna sends to AI — example payload</div>
            <div className="code-body">
              <span className="code-comment">{'// ✅ What we send'}</span><br />
              {'{'}<br />
              &nbsp;&nbsp;<span className="code-key">&quot;member&quot;</span>: <span className="code-str">&quot;alex.chen&quot;</span>,<br />
              &nbsp;&nbsp;<span className="code-key">&quot;commits&quot;</span>: [{'{'}<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-key">&quot;message&quot;</span>: <span className="code-str">&quot;Fix auth timeout&quot;</span>,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-key">&quot;repo&quot;</span>: <span className="code-str">&quot;backend-api&quot;</span>,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-key">&quot;date&quot;</span>: <span className="code-str">&quot;2025-06-03&quot;</span><br />
              &nbsp;&nbsp;{'}'}],<br />
              &nbsp;&nbsp;<span className="code-key">&quot;tickets&quot;</span>: [{'{'}<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-key">&quot;title&quot;</span>: <span className="code-str">&quot;Login session expires&quot;</span>,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-key">&quot;status&quot;</span>: <span className="code-val">&quot;Done&quot;</span><br />
              &nbsp;&nbsp;{'}'}]<br />
              {'}'}<br /><br />
              <span className="code-comment">{'// ❌ What we never send'}</span><br />
              <span className="code-comment">{'// diff, patch, file contents,'}</span><br />
              <span className="code-comment">{'// comments, descriptions'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing ────────────────────────────────────────────── */
export function Pricing() {
  const plans = [
    {
      name: 'Free Trial', price: '$0', cadence: '14 days · 1 member', limit: 'Daily reports only',
      features: [
        { ok: true, text: 'Daily standup' },
        { ok: true, text: 'GitHub integration' },
        { ok: false, text: 'Weekly / monthly reports' },
        { ok: false, text: 'Jira · Linear · Trello' },
        { ok: false, text: 'Email delivery' },
      ],
      cta: 'Start free', primary: false,
    },
    {
      name: 'Starter', price: '$19', cadence: 'per month', limit: 'Up to 3 members',
      features: [
        { ok: true, text: 'Daily + weekly reports' },
        { ok: true, text: 'GitHub + 1 PM tool' },
        { ok: true, text: 'Slack delivery' },
        { ok: false, text: 'Biweekly / monthly reports' },
        { ok: false, text: 'Email delivery' },
      ],
      cta: 'Get started', primary: false,
    },
    {
      name: 'Team', price: '$49', cadence: 'per month', limit: 'Up to 10 members',
      features: [
        { ok: true, text: 'All 4 report types' },
        { ok: true, text: 'GitHub + all PM tools' },
        { ok: true, text: 'Slack + Email delivery' },
        { ok: true, text: 'Dashboard access' },
        { ok: true, text: 'PDF export' },
      ],
      cta: 'Get started', primary: true, popular: true,
    },
    {
      name: 'Growth', price: '$99', cadence: 'per month', limit: 'Up to 20 members',
      features: [
        { ok: true, text: 'Everything in Team' },
        { ok: true, text: 'Custom report times' },
        { ok: true, text: 'Priority support' },
        { ok: true, text: 'Custom AI tone' },
        { ok: true, text: '21+ → Enterprise' },
      ],
      cta: 'Get started', primary: false,
    },
  ];

  return (
    <section id="pricing" className="pricing-section">
      <div className="section-inner">
        <span className="section-label reveal">Pricing</span>
        <h2 className="section-title reveal">Simple, transparent pricing.</h2>
        <p className="section-sub reveal">Start free for 14 days. No credit card required. Cancel anytime.</p>

        <div className="pricing-grid reveal">
          {plans.map((plan) => (
            <div className={`pricing-card${plan.popular ? ' popular' : ''}`} key={plan.name}>
              {plan.popular && <div className="popular-badge">MOST POPULAR</div>}
              <div className="plan-name">{plan.name}</div>
              <div className="plan-price" style={plan.popular ? { color: 'var(--accent2)' } : {}}>
                {plan.price !== '$0' && <sup>$</sup>}
                {plan.price === '$0' ? '$0' : plan.price.replace('$', '')}
              </div>
              <div className="plan-cadence">{plan.cadence}</div>
              <div className="plan-limit">{plan.limit}</div>
              <ul className="plan-features">
                {plan.features.map((f) => (
                  <li className="plan-feat" key={f.text}>
                    <span className={f.ok ? 'feat-check' : 'feat-x'}>{f.ok ? '✓' : '–'}</span>
                    {f.text}
                  </li>
                ))}
              </ul>
              <a href="#" className={`btn ${plan.primary ? 'btn-primary' : 'btn-ghost'}`} style={{ width: '100%', justifyContent: 'center' }}>
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <div className="reveal" style={{ marginTop: '16px', padding: '20px 24px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Enterprise — 20+ members</div>
            <div style={{ fontSize: '13px', color: 'var(--text2)' }}>$4/member/month · SSO · SLA · Dedicated onboarding · Custom integrations</div>
          </div>
          <a href="#" className="btn btn-ghost">Contact sales →</a>
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ───────────────────────────────────────── */
export function Testimonials() {
  const testimonials = [
    { initials: 'DK', name: 'David Kim', role: 'Engineering Manager · Vercel', quote: 'We deleted our standup Slack bot and our weekly status update template on the same day. Siorna replaced both and does more.' },
    { initials: 'SR', name: 'Sarah Reynolds', role: 'CTO · Series A startup', quote: 'As a CTO, the monthly report alone is worth it. I was spending 2 hours every month assembling this manually. Now I just forward the email.' },
    { initials: 'MJ', name: 'Marcus Johnson', role: 'Staff Engineer · Fintech startup', quote: 'The security model is exactly right. Only commit messages and ticket titles — our InfoSec team approved it in one review cycle.' },
  ];
  return (
    <section>
      <div className="section-inner">
        <span className="section-label reveal">What teams say</span>
        <h2 className="section-title reveal">Engineers love it.<br />Managers love it more.</h2>
        <div className="testimonials-grid reveal">
          {testimonials.map((t) => (
            <div className="testi-card" key={t.initials}>
              <div className="testi-stars">★★★★★</div>
              <p className="testi-quote">&ldquo;{t.quote}&rdquo;</p>
              <div className="testi-author">
                <div className="testi-avatar">{t.initials}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ────────────────────────────────────────────────── */
export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const items = [
    { q: 'Does Siorna read our source code?', a: 'No. Siorna reads only commit messages, PR titles, and ticket names — the same text visible in your Slack notifications. We explicitly exclude diffs, file contents, comments, and descriptions. Our GitHub OAuth scope is intentionally restricted to prevent source code access.' },
    { q: 'Is my data used to train AI models?', a: 'No. Reports are generated via the Anthropic Claude API under a zero-training-use policy. Your data is processed and discarded — it is never used to train or fine-tune any AI model. You can also enable immediate post-processing deletion in your settings.' },
    { q: "What if a developer doesn't use GitHub or Linear?", a: 'Each team member can connect different tools independently. One developer can be GitHub-only, another can use Jira and Trello. Siorna merges all available data into a unified report. Members with no connected tools are simply excluded from that section.' },
    { q: 'Can we customize the report format or tone?', a: 'Yes. Growth and Enterprise plans include custom tone settings — you can specify whether reports should be brief or detailed, formal or casual, and provide specific formatting preferences. Daily and weekly reports can also be customized per team.' },
    { q: 'How do you handle weekends and holidays?', a: 'Daily standups run Monday–Friday only. On Mondays, Siorna automatically includes Friday + weekend activity so nothing is missed. Public holidays can be configured per team timezone in your settings.' },
  ];
  return (
    <section style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
      <div className="section-inner">
        <span className="section-label reveal">FAQ</span>
        <h2 className="section-title reveal">Common questions.</h2>
        <div className="faq-list reveal">
          {items.map((item, i) => (
            <div className={`faq-item${openIndex === i ? ' open' : ''}`} key={i}>
              <button className="faq-q" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                {item.q}
                <span className="faq-chevron">↓</span>
              </button>
              <div className="faq-a">{item.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ────────────────────────────────────────────────── */
export function CTA() {
  return (
    <section className="cta-section">
      <h2 className="cta-title reveal">
        Your team is already doing the work.<br />
        <em>Let Siorna write the reports.</em>
      </h2>
      <p className="cta-sub reveal">14-day free trial. No credit card. Set up in under 5 minutes.</p>
      <div className="reveal">
        <a href="#" className="btn btn-primary btn-lg">Start your free trial →</a>
        <p className="cta-note">
          or{' '}
          <a href="#" style={{ color: 'var(--text2)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
            book a 20-minute demo
          </a>
        </p>
      </div>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────── */
export function Footer() {
  return (
    <footer>
      <a href="#" className="footer-logo">Sior<span>na</span></a>
      <ul className="footer-links">
        {['Privacy', 'Security', 'Terms', 'Status', 'Docs'].map((link) => (
          <li key={link}><a href="#">{link}</a></li>
        ))}
      </ul>
      <span className="footer-copy">© 2026 Siorna</span>
    </footer>
  );
}