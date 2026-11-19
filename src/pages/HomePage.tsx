import { useEffect, useState, useCallback } from 'react';
import CONFIG from '../config.js';
import { formatPrice, formatRelativeTime, copyToClipboard } from '../utils.js';

function buildStars(count: number) {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;--dur:${2+Math.random()*5}s;animation-delay:${Math.random()*4}s`;
    frag.appendChild(s);
  }
  return frag;
}

const REVIEWS = [
  { id:1, name:"Sarah M.", rating:5, title:"Game changer!", comment:"I've saved at least 15 hours per week since using AI Arsenal. The prompts are so specific and effective.", verified:true, helpful:47 },
  { id:2, name:"James K.", rating:5, title:"Worth every penny", comment:"My career trajectory changed after Promotion-Ready. I got the promotion I'd been chasing for 2 years.", verified:true, helpful:39 },
  { id:3, name:"Fatima A.", rating:5, title:"My kids love it too", comment:"The Invisible Assistant turned dinner time chaos into a smooth routine. Even my 8-year-old is eating vegetables!", verified:true, helpful:31 },
  { id:4, name:"David L.", rating:5, title:"A+ on every essay", comment:"PACE Toolkit is incredible. My GPA jumped from 3.2 to 3.8 in one semester.", verified:true, helpful:28 },
  { id:5, name:"Emma R.", rating:5, title:"My home is a sanctuary", comment:"Sovereign Sanctuary gave me a complete system for my home. Never felt so organized.", verified:false, helpful:19 },
  { id:6, name:"Omar S.", rating:4, title:"Solid investment", comment:"The business prompts alone paid for the entire collection many times over. Highly recommend.", verified:true, helpful:24 },
];

const starStr = (n: number) => '★'.repeat(Math.floor(n)) + '☆'.repeat(5-Math.floor(n));

const HomePage = () => {
  const [viewers, setViewers] = useState(42);
  const [showPopup, setShowPopup] = useState(false);
  const [countdown, setCountdown] = useState(3600);
  const [copied, setCopied] = useState(false);
  const [sales] = useState(2847);
  const [views, setViews] = useState(0);

  const initStars = useCallback(() => {
    const el = document.getElementById('hero-stars');
    if (!el || el.children.length > 0) return;
    el.appendChild(buildStars(110));
  }, []);

  useEffect(() => {
    initStars();
    let v = 0;
    const iv = setInterval(() => {
      v += 290;
      if (v >= 14391) { setViews(14391); clearInterval(iv); }
      else setViews(Math.floor(v));
    }, 30);
    const viv = setInterval(() => {
      setViewers(p => Math.max(28, Math.min(80, p + Math.floor(Math.random()*7)-3)));
    }, 4000);
    const t = setTimeout(() => {
      if (!sessionStorage.getItem('cb_popup')) {
        setShowPopup(true);
        sessionStorage.setItem('cb_popup','1');
      }
    }, 2500);
    return () => { clearInterval(iv); clearInterval(viv); clearTimeout(t); };
  }, [initStars]);

  useEffect(() => {
    if (!showPopup) return;
    const t = setInterval(() => setCountdown(p => Math.max(0,p-1)), 1000);
    return () => clearInterval(t);
  }, [showPopup]);

  const fmtCD = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = String(s % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard('COGNIBOOKS20');
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2200); }
  };

  return (
    <div style={{ minHeight:'100vh', position:'relative' }}>
      <div id="hero-stars" className="stars-bg" />

      {/* Ambient blobs */}
      <div style={{ position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden' }} aria-hidden="true">
        <div style={{ position:'absolute',width:500,height:500,borderRadius:'50%',background:'var(--clr-primary)',filter:'blur(140px)',opacity:.045,top:-160,left:-120 }} />
        <div style={{ position:'absolute',width:420,height:420,borderRadius:'50%',background:'var(--clr-accent)',filter:'blur(130px)',opacity:.038,top:'38%',right:-100 }} />
        <div style={{ position:'absolute',width:360,height:360,borderRadius:'50%',background:'var(--clr-secondary)',filter:'blur(130px)',opacity:.038,bottom:'6%',left:'40%' }} />
      </div>

      {/* HEADER */}
      <header className="site-header">
        <div className="container">
          <div className="header-inner">
            <a href="#home" className="logo-wrap">
              <img src="/logo.webp" alt="CogniBooks" className="logo-img" loading="lazy" />
              <span className="logo-name">CogniBooks</span>
            </a>
            <nav className="site-nav">
              <a href="#home" className="nav-link">Home</a>
              <a href="#products" className="nav-link">Shop</a>
              <a href="#reviews" className="nav-link">Reviews</a>
              <a href="#privacy" className="nav-link">Privacy</a>
              <a href="#terms" className="nav-link">Terms</a>
            </nav>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-eyebrow">✨ Premium AI Prompt Collections</div>
          <h1 className="gradient-text">Master AI.<br />Transform Your Life.</h1>
          <p className="hero-sub">{CONFIG.description}</p>
          <div style={{ display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',marginBottom:40 }}>
            <a href="#products" className="btn btn-primary btn-lg">Shop Now →</a>
            <a href="#reviews" className="btn btn-ghost btn-lg">Read Reviews</a>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-val">{views.toLocaleString()}+</div>
              <div className="stat-lbl">🌍 Happy Customers</div>
            </div>
            <div className="stat-item">
              <div className="stat-val">{sales.toLocaleString()}</div>
              <div className="stat-lbl">📦 Total Sales</div>
            </div>
            <div className="stat-item">
              <div className="stat-val" style={{ color:'var(--clr-primary)' }}>{viewers}</div>
              <div className="stat-lbl">👁️ Viewing Now</div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="products-section">
        <div className="container">
          <h2 className="section-title gradient-text">Our Premium Collection</h2>
          <p className="section-sub">Expertly crafted AI prompt libraries that actually deliver results</p>
          <div className="products-grid">
            {CONFIG.products.map((p: any) => (
              /*
               * FIX 1: The entire card is now a clickable link — no separate "View Details" button.
               * User can tap/click anywhere on the card to go to the product page.
               */
              <a
                key={p.id}
                href={`#product/${p.id}`}
                className="product-card-link"
                aria-label={`View details for ${p.title}`}
              >
                <article className="product-card">
                  {p.bestseller && <div className="product-badge">⭐ BESTSELLER</div>}
                  <div className="product-img-wrap">
                    <img src={p.cover} alt={p.title} className="product-img" loading="lazy" decoding="async" />
                    {/* Hover overlay — replaces the button */}
                    <div className="product-img-overlay" aria-hidden="true">
                      <span className="product-img-cta">View Details →</span>
                    </div>
                  </div>
                  <div className="product-body">
                    <div className="product-category-tag">{p.category}</div>
                    <h3 className="product-title">{p.title}</h3>
                    <p className="product-subtitle">{p.subtitle}</p>
                    <div className="rating-wrap">
                      <span className="stars" style={{ fontSize:14 }}>{starStr(p.rating)}</span>
                      <span>{p.rating} ({p.reviewCount})</span>
                    </div>
                    <div className="price-wrap">
                      <span className="price-current">{formatPrice(p.price)}</span>
                      <span className="price-original">{formatPrice(p.originalPrice)}</span>
                      <span className="price-save">-{p.discount}%</span>
                    </div>
                    {p.stock < 10 && (
                      <div className="stock-warn">⚠️ Only {p.stock} left!</div>
                    )}
                    {/* Bottom meta row */}
                    <div className="product-meta-row">
                      <span className="product-meta-item">📄 {p.pages}p PDF</span>
                      <span className="product-meta-item">⚡ Instant</span>
                    </div>
                  </div>
                </article>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* REVIEWS */}
      <section id="reviews" style={{ padding:'68px 0',position:'relative',zIndex:1 }}>
        <div className="container">
          <h2 className="section-title gradient-text">What Customers Say</h2>
          <p className="section-sub">Thousands of professionals already transforming their work with AI</p>
          <div className="reviews-grid">
            {REVIEWS.map(r => (
              <div key={r.id} className="review-card">
                <div style={{ display:'flex',justifyContent:'space-between',marginBottom:10 }}>
                  <span className="stars" style={{ fontSize:14 }}>{starStr(r.rating)}</span>
                  {r.verified && <span className="badge badge-success">✓ Verified</span>}
                </div>
                <h4 style={{ fontSize:15,fontWeight:700,marginBottom:7 }}>{r.title}</h4>
                <p style={{ fontSize:13,color:'var(--clr-muted)',lineHeight:1.7,marginBottom:14 }}>"{r.comment}"</p>
                <div style={{ display:'flex',justifyContent:'space-between',fontSize:12,color:'var(--clr-faint)' }}>
                  <strong style={{ color:'var(--clr-text)' }}>{r.name}</strong>
                  <span>👍 {r.helpful}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* TRUST STRIP */}
      <section style={{ padding:'36px 0',position:'relative',zIndex:1 }}>
        <div className="container">
          <div className="trust-strip">
            {CONFIG.trustBadges.map((b: any, i: number) => (
              <div key={i} className="trust-item">
                <span className="trust-icon">{b.icon}</span>
                <span className="trust-text">{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* FOOTER */}
      <footer style={{ padding:'40px 0 24px',position:'relative',zIndex:1 }}>
        <div className="container">
          <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:16,textAlign:'center' }}>
            <a href="#home" className="logo-wrap" style={{ marginBottom:4 }}>
              <img src="/logo.webp" alt="CogniBooks" className="logo-img" loading="lazy" />
              <span className="logo-name">CogniBooks</span>
            </a>
            <p style={{ fontSize:13,color:'var(--clr-muted)',maxWidth:460,lineHeight:1.7 }}>
              Premium AI prompt collections for professionals who want to unlock AI's full potential.
            </p>
            <div style={{ display:'flex',gap:20,flexWrap:'wrap',justifyContent:'center',fontSize:13 }}>
              <a href="#privacy" className="nav-link">Privacy Policy</a>
              <a href="#terms" className="nav-link">Terms of Service</a>
            </div>
            <p style={{ fontSize:12,color:'var(--clr-faint)',marginTop:8 }}>
              © {new Date().getFullYear()} CogniBooks. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* COUPON POPUP */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <button className="popup-close" onClick={() => setShowPopup(false)} aria-label="Close">✕</button>
            <div style={{ fontSize:42,marginBottom:12 }}>🎁</div>
            <h3 style={{ fontSize:22,fontWeight:800,marginBottom:8,color:'var(--clr-text)' }}>
              Exclusive 20% Off!
            </h3>
            <p style={{ color:'var(--clr-muted)',fontSize:14,marginBottom:20,lineHeight:1.6 }}>
              Use code at checkout. Offer expires in:
            </p>
            <div className="popup-timer">{fmtCD(countdown)}</div>
            <div className="popup-code-wrap">
              <span className="popup-code">COGNIBOOKS20</span>
              <button
                className={`btn btn-outline btn-sm ${copied ? 'btn-success' : ''}`}
                onClick={handleCopy}
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
            <a href="#products" className="btn btn-primary" style={{ width:'100%',marginTop:18 }} onClick={() => setShowPopup(false)}>
              Shop Now →
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
