'use client';

import { useEffect, useState } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <a href="#" className={styles.logo}>
        Sior<span>na</span>
      </a>

      <ul className={styles.links}>
        <li><a href="#how">How it works</a></li>
        <li><a href="#reports">Reports</a></li>
        <li><a href="#security">Security</a></li>
        <li><a href="#pricing">Pricing</a></li>
      </ul>

      <div className={styles.cta}>
        <a href="#" className="btn btn-ghost">Sign in</a>
        <a href="#" className="btn btn-primary">Start free trial</a>
      </div>
    </nav>
  );
}