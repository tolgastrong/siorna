import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.eyebrow}>
        <span className={styles.dot}></span>
        Now in early access — join 200+ engineering teams
      </div>

      <h1 className={styles.title}>
        Engineering reports,<br />
        <em>on autopilot.</em>
      </h1>

      <p className={styles.sub}>
        Siorna pulls your GitHub commits, Linear and Jira tickets — and writes
        daily standups, weekly digests, and monthly reports. Automatically.
      </p>

      <div className={styles.actions}>
        <a href="#" className="btn btn-primary btn-lg">Start 14-day free trial</a>
        <a href="#" className="btn btn-ghost btn-lg">See a live demo →</a>
      </div>

      <div className={styles.socialProof}>
        <div className={styles.avatars}>
          <div className={styles.avatar} style={{ background: '#1e1e2e', color: '#a89ff8' }}>A</div>
          <div className={styles.avatar} style={{ background: '#1a2e1e', color: '#3dd68c' }}>M</div>
          <div className={styles.avatar} style={{ background: '#2e1e1e', color: '#f26b6b' }}>S</div>
          <div className={styles.avatar} style={{ background: '#2e2a1e', color: '#f5a623' }}>J</div>
        </div>
        <p className={styles.socialText}>
          <strong>200+ teams</strong> saving 3+ hours/week
        </p>
      </div>

      {/* Demo Terminal */}
      <div className={styles.demo}>
        <div className={styles.demoTopbar}>
          <div className={styles.demoDot} style={{ background: '#F26B6B' }}></div>
          <div className={styles.demoDot} style={{ background: '#F5A623' }}></div>
          <div className={styles.demoDot} style={{ background: '#3DD68C' }}></div>
          <span className={styles.demoTitle}>siorna — Daily Standup · Monday, Jun 3</span>
        </div>

        <div className={styles.demoBody}>
          <div className={styles.reportHeader}>
            <span className={styles.reportLabel}>Daily Standup Report</span>
            <span className={styles.reportDate}>Generated 09:00 ET</span>
          </div>

          <div className={`${styles.standupItem} ${styles.item1}`}>
            <span className={styles.standupName}>@alex</span>
            <span className={styles.standupText}>
              Merged auth timeout fix PR — resolved 3 related tickets{' '}
              <span className={`${styles.tag} ${styles.tagDone}`}>done</span>. Today: working on rate limiting middleware.
            </span>
          </div>

          <div className={`${styles.standupItem} ${styles.item2}`}>
            <span className={styles.standupName}>@mia</span>
            <span className={styles.standupText}>
              Completed dashboard redesign specs{' '}
              <span className={`${styles.tag} ${styles.tagDone}`}>done</span>. Today: frontend implementation.{' '}
              <span className={`${styles.tag} ${styles.tagWip}`}>in progress</span>
            </span>
          </div>

          <div className={`${styles.standupItem} ${styles.item3}`}>
            <span className={styles.standupName}>@sam</span>
            <span className={styles.standupText}>
              Blocked on DB migration script — Postgres version conflict.{' '}
              <span className={`${styles.tag} ${styles.tagBlock}`}>blocker</span> Need DevOps access.
            </span>
          </div>
        </div>

        <div className={styles.demoFooter}>
          <span className={styles.demoMeta}>3 members · 7 commits · 4 tickets · GitHub + Linear</span>
          <span className={styles.demoBadge}>
            <span className={styles.greenDot}></span>
            Sent to #standup
          </span>
        </div>
      </div>
    </section>
  );
}