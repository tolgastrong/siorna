import React from 'react';

export default function TermsPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px', fontFamily: 'system-ui, -apple-system, sans-serif', lineHeight: '1.6', color: '#e2e8f0' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#f8fafc', fontWeight: 'bold' }}>Terms of Service</h1>
      <p style={{ color: '#94a3b8', marginBottom: '40px' }}>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#f8fafc', fontWeight: '600' }}>1. Acceptance of Terms</h2>
          <p>By accessing and using Siorna, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#f8fafc', fontWeight: '600' }}>2. Account Responsibilities</h2>
          <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. Siorna cannot and will not be liable for any loss or damage arising from your failure to comply with this security obligation.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#f8fafc', fontWeight: '600' }}>3. Service Modifications</h2>
          <p>Siorna reserves the right at any time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. We shall not be liable to you or to any third party for any modification, suspension or discontinuance of the Service.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#f8fafc', fontWeight: '600' }}>4. Disclaimer of Warranties</h2>
          <p>Your use of the service is at your sole risk. The service is provided on an "AS IS" and "AS AVAILABLE" basis. Siorna expressly disclaims all warranties of any kind, whether express or implied.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#f8fafc', fontWeight: '600' }}>5. Contact Information</h2>
          <p>For any questions about these Terms, please reach out to us at: <strong>support@siorna.com</strong></p>
        </section>
      </div>
    </div>
  );
}