import CONFIG from '../config.js';
const Section = ({ title, children }: { title:string; children:React.ReactNode }) => (
  <div style={{ marginBottom:36 }}>
    <h2 style={{ fontSize:20,fontWeight:700,marginBottom:14,color:'var(--clr-primary)' }}>{title}</h2>
    <div style={{ color:'var(--clr-muted)',lineHeight:1.85,fontSize:15 }}>{children}</div>
  </div>
);

const TermsPage = () => (
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
      <h1 className="gradient-text" style={{ fontSize:38,fontWeight:900,marginBottom:10 }}>Terms of Service</h1>
      <p style={{ color:'var(--clr-muted)',marginBottom:48,fontSize:14 }}>Last updated: January 1, 2024</p>

      <Section title="1. Digital Products">
        <p>All products sold by CogniBooks are <strong>digital products</strong> delivered as PDF files. No physical items are shipped. Upon successful payment, your download link will be sent to the email address provided at checkout.</p>
      </Section>
      <Section title="2. Refund Policy">
        <p>We offer a <strong>30-day satisfaction guarantee</strong>. If you are not satisfied with your purchase for any reason, contact us at <a href={`mailto:${CONFIG.contact.email}`} style={{ color:'var(--clr-primary)' }}>{CONFIG.contact.email}</a> within 30 days of purchase for a full refund.</p>
      </Section>
      <Section title="3. License & Usage">
        <p>Upon purchase, you receive a personal, non-exclusive, non-transferable license to use the eBook for your own personal use. You may not: reproduce, distribute, sell, or sublicense the content; share your copy with others; or use the content for commercial purposes without written permission.</p>
      </Section>
      <Section title="4. Payment Processing">
        <p>Payments are processed securely by <strong>Crossmint</strong>. By completing a purchase, you also agree to <a href="https://www.crossmint.com/legal/terms-of-service" target="_blank" rel="noreferrer" style={{ color:'var(--clr-primary)' }}>Crossmint's Terms of Service</a>. We accept credit/debit cards and cryptocurrency.</p>
      </Section>
      <Section title="5. Intellectual Property">
        <p>All content within CogniBooks products is owned by CogniBooks and protected by copyright law. Unauthorized reproduction or distribution is strictly prohibited and may result in legal action.</p>
      </Section>
      <Section title="6. Disclaimer">
        <p>Our eBooks are provided for informational and educational purposes only. Results may vary. We make no guarantees of specific outcomes from using our prompt collections.</p>
      </Section>
      <Section title="7. Limitation of Liability">
        <p>CogniBooks shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products. Our total liability shall not exceed the amount paid for the specific product.</p>
      </Section>
      <Section title="8. Contact">
        <p>For questions about these Terms, contact us at{' '}
          <a href={`mailto:${CONFIG.contact.email}`} style={{ color:'var(--clr-primary)' }}>{CONFIG.contact.email}</a>.
        </p>
      </Section>
    </div>
  </div>
);

export default TermsPage;
