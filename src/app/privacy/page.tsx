import React from 'react';

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px', fontFamily: 'system-ui, -apple-system, sans-serif', lineHeight: '1.6', color: '#e2e8f0' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#f8fafc', fontWeight: 'bold' }}>Privacy Policy</h1>
      <p style={{ color: '#94a3b8', marginBottom: '40px' }}>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#f8fafc', fontWeight: '600' }}>1. Information We Collect</h2>
          <p>When you register for Siorna via Google OAuth, we collect basic profile information including your name and email address. We use this information solely to create and manage your account, and to provide you with a secure authentication experience.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#f8fafc', fontWeight: '600' }}>2. How We Use Your Information</h2>
          <p>The information we collect is used strictly to operate, maintain, and provide the features and functionality of the Siorna platform. We may use your email address to send you critical service updates, technical notices, or security alerts.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#f8fafc', fontWeight: '600' }}>3. Data Storage and Security</h2>
          <p>Your data is securely stored using industry-standard database providers (such as Supabase). We implement strict security measures to prevent unauthorized access, alteration, disclosure, or destruction of your personal information.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#f8fafc', fontWeight: '600' }}>4. Third-Party Access</h2>
          <p>We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our platform, so long as those parties agree to keep this information confidential.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#f8fafc', fontWeight: '600' }}>5. Contact Us</h2>
          <p>If you have any questions regarding this Privacy Policy, you may contact us at: <strong>support@siorna.com</strong></p>
        </section>
      </div>
    </div>
  );
}