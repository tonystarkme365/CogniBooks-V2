import CONFIG from '../config.js';
const Section = ({ title, children }: { title:string; children:React.ReactNode }) => (
  <div style={{ marginBottom:36 }}>
    <h2 style={{ fontSize:20,fontWeight:700,marginBottom:14,color:'var(--clr-primary)' }}>{title}</h2>
    <div style={{ color:'var(--clr-muted)',lineHeight:1.85,fontSize:15 }}>{children}</div>
  </div>
);

const PrivacyPage = () => (
  <div style={{ minHeight:'100vh',background:'var(--clr-bg)',color:'var(--clr-text)' }}>
    <header className="site-header">
      <div className="container">
        <div className="header-inner">
          <a href="#home" className="logo-wrap">
            <img src="/logo.webp" alt="CogniBooks" className="logo-img" loading="lazy" />
            <span className="logo-name">CogniBooks</span>
          </a>
          <a href="#home" className="btn btn-ghost" style={{ padding:'8px 14px',fontSize:14 }}>← Home</a>
        </div>
      </div>
    </header>
    <div className="container" style={{ maxWidth:800,padding:'64px 20px 80px' }}>
      <h1 className="gradient-text" style={{ fontSize:38,fontWeight:900,marginBottom:10 }}>Privacy Policy</h1>
      <p style={{ color:'var(--clr-muted)',marginBottom:48,fontSize:14 }}>Last updated: January 1, 2024</p>

      <Section title="1. Information We Collect">
        <p>We collect information you provide directly to us, including: your name, email address, and country when you make a purchase. We also collect payment information through our payment processor <strong>Crossmint</strong> — we do not store your credit card details directly.</p>
      </Section>
      <Section title="2. How We Use Your Information">
        <p>We use the information we collect to: process your orders and deliver your digital products, send you transactional emails and receipts, respond to your inquiries and provide customer support, and improve our products and services.</p>
      </Section>
      <Section title="3. Information Sharing">
        <p>We do not sell, trade, or otherwise transfer your personal information to outside parties except: to our trusted payment processor Crossmint (necessary to process payments), to comply with the law, and to protect our rights.</p>
      </Section>
      <Section title="4. Data Security">
        <p>We implement industry-standard security measures including 256-bit SSL encryption to protect your personal information. All payment transactions are processed through Crossmint's secure platform.</p>
      </Section>
      <Section title="5. Digital Product Delivery">
        <p>After a successful purchase, your eBook download link will be sent to the email address you provided. We retain your email to provide customer support and deliver your purchased products.</p>
      </Section>
      <Section title="6. Cookies">
        <p>We use minimal cookies necessary for the functioning of our store. We do not use advertising cookies or share cookie data with third parties.</p>
      </Section>
      <Section title="7. Your Rights">
        <p>You have the right to access, correct, or delete your personal data. To make such a request, please contact us at{' '}
          <a href={`mailto:${CONFIG.contact.email}`} style={{ color:'var(--clr-primary)' }}>{CONFIG.contact.email}</a>.
        </p>
      </Section>
      <Section title="8. Contact">
        <p>If you have any questions about this Privacy Policy, contact us at{' '}
          <a href={`mailto:${CONFIG.contact.email}`} style={{ color:'var(--clr-primary)' }}>{CONFIG.contact.email}</a>.
        </p>
      </Section>
    </div>
  </div>
);

export default PrivacyPage;
