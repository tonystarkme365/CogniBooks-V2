/**
 * CogniBooks – CheckoutPage  v5.0
 * ─────────────────────────────────────────────────────────
 * Single-column layout (no split screen)
 * Step 1 → capture name + email
 * Step 2 → PaymentSection with PayBis (PayPal/Card) & Transak (Card/Apple Pay/Google Pay)
 * Redirects to external providers; USDC sent to wallet on Polygon
 * ─────────────────────────────────────────────────────────
 */

import { useState, useEffect, useId } from 'react';
import CONFIG from '../config.js';
import { formatPrice } from '../utils.js';

// ── Config ────────────────────────────────────────────────────────────────
const C = {
  primary:  '#00ff88',
  cyan:     '#00d4ff',
  rose:     '#f43f5e',
  text:     '#ffffff',
  muted:    '#c0c0d8',
  faint:    '#6a6a88',
  border:   'rgba(255,255,255,.1)',
  card:     'rgba(16,14,32,.97)',
};

type Phase = 'info' | 'payment';

// ── Step indicator ────────────────────────────────────────────────────────
function Steps({ phase }: { phase: Phase }) {
  const idx = phase === 'info' ? 0 : 1;
  return (
    <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:0,marginBottom:8 }}>
      {(['Details','Payment'] as const).map((s, i) => (
        <div key={s} style={{ display:'flex',alignItems:'center' }}>
          <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:5 }}>
            <div style={{
              width:34,height:34,borderRadius:'50%',
              display:'flex',alignItems:'center',justifyContent:'center',
              fontSize: i < idx ? 14 : 12, fontWeight:800,
              background: i === idx
                ? 'linear-gradient(135deg,#00ff88,#00cc6a)'
                : i < idx ? 'linear-gradient(135deg,#00d4ff,#0099cc)' : 'rgba(255,255,255,.06)',
              color: i <= idx ? '#030a05' : C.faint,
              boxShadow: i === idx ? '0 4px 16px rgba(0,255,136,.45)' : 'none',
              transition:'all .3s',
            }}>
              {i < idx ? '✓' : `0${i+1}`}
            </div>
            <span style={{
              fontSize:10,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',
              color: i === idx ? C.primary : i < idx ? C.cyan : C.faint,
            }}>{s}</span>
          </div>
          {i < 1 && (
            <div style={{
              width:72,height:2,
              background: idx > 0
                ? 'linear-gradient(90deg,#00d4ff,#00ff88)'
                : 'rgba(255,255,255,.06)',
              borderRadius:2,margin:'0 12px 18px',
              transition:'background .4s',
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Input field ───────────────────────────────────────────────────────────
function Field({
  label, type = 'text', value, onChange, error, placeholder, autoComplete
}: {
  label:string; type?:string; value:string;
  onChange:(v:string)=>void; error?:string;
  placeholder?:string; autoComplete?:string;
}) {
  const [focused, setFocused] = useState(false);
  const inputId = useId();
  const errorId = `${inputId}-error`;
  return (
    <div style={{ display:'flex',flexDirection:'column',gap:6,marginBottom:18 }}>
      <label htmlFor={inputId} style={{
        fontSize:11,fontWeight:700,letterSpacing:'.05em',textTransform:'uppercase',
        color: error ? C.rose : focused ? C.primary : C.muted,
        transition:'color .2s',
      }}>{label}</label>
      <input
        id={inputId} type={type} value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          background:'rgba(255,255,255,.05)',
          border:`1.5px solid ${error ? 'rgba(255,68,85,.6)' : focused ? 'rgba(0,255,136,.5)' : C.border}`,
          borderRadius:12,padding:'13px 16px',
          color:C.text,fontSize:15,outline:'none',
          transition:'border-color .2s',width:'100%',
        }}
      />
      {error && <span id={errorId} style={{ fontSize:12,color:C.rose }}>{error}</span>}
    </div>
  );
}

// ── Order Summary (used in both steps) ───────────────────────────────────
function OrderSummary({
  product, total, discount, appliedCoupon, couponCode,
  setCouponCode, onApply, couponMsg, locked
}: any) {
  const discount_amt = product.originalPrice - product.price;
  return (
    <div style={{ display:'flex',flexDirection:'column',gap:0 }}>
      {/* Product row */}
      <div style={{ display:'flex',gap:14,alignItems:'flex-start',marginBottom:18 }}>
        {/* 9:16 thumbnail */}
        <div style={{
          width:64,flexShrink:0,borderRadius:10,overflow:'hidden',
          boxShadow:'0 4px 18px rgba(0,0,0,.55)',
          aspectRatio:'9/16',
        }}>
          <img src={product.cover} alt={product.title}
            style={{ width:'100%',height:'100%',objectFit:'cover',display:'block' }} />
        </div>
        <div style={{ flex:1,minWidth:0 }}>
          <h3 style={{ fontSize:14,fontWeight:700,color:C.text,marginBottom:5,lineHeight:1.35 }}>{product.title}</h3>
          <p style={{ fontSize:12,color:C.muted,marginBottom:8,lineHeight:1.5 }}>{product.subtitle}</p>
          <div style={{ display:'flex',gap:5,flexWrap:'wrap' }}>
            <span style={{ fontSize:10,background:'rgba(0,255,136,.08)',border:'1px solid rgba(0,255,136,.2)',
              color:C.primary,padding:'2px 8px',borderRadius:100,fontWeight:700 }}>PDF</span>
            <span style={{ fontSize:10,background:'rgba(0,212,255,.08)',border:'1px solid rgba(0,212,255,.2)',
              color:C.cyan,padding:'2px 8px',borderRadius:100,fontWeight:700 }}>⚡ Instant</span>
          </div>
        </div>
      </div>

      {/* Price breakdown */}
      <div style={{ borderTop:`1px solid ${C.border}`,paddingTop:14,display:'flex',flexDirection:'column',gap:9 }}>
        <div style={{ display:'flex',justifyContent:'space-between',fontSize:13 }}>
          <span style={{ color:C.muted }}>List price</span>
          <span style={{ color:C.faint,textDecoration:'line-through' }}>{formatPrice(product.originalPrice)}</span>
        </div>
        <div style={{ display:'flex',justifyContent:'space-between',fontSize:13 }}>
          <span style={{ color:C.muted }}>Sale discount</span>
          <span style={{ color:C.rose,fontWeight:600 }}>−{formatPrice(discount_amt)}</span>
        </div>
        {appliedCoupon && (
          <div style={{ display:'flex',justifyContent:'space-between',fontSize:13 }}>
            <span style={{ color:C.primary }}>Coupon ({appliedCoupon.code})</span>
            <span style={{ color:C.primary,fontWeight:600 }}>−{formatPrice(discount)}</span>
          </div>
        )}
        <div style={{
          marginTop:4,padding:'12px 14px',borderRadius:12,
          background:'rgba(0,255,136,.06)',border:'1px solid rgba(0,255,136,.18)',
          display:'flex',justifyContent:'space-between',alignItems:'center',
        }}>
          <span style={{ fontSize:14,fontWeight:700,color:C.text }}>Total</span>
          <span style={{ fontSize:26,fontWeight:900,color:C.primary,
            letterSpacing:'-.02em',fontFamily:"'Space Grotesk',sans-serif" }}>
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {/* Coupon */}
      {!locked && (
        <div style={{ marginTop:16 }}>
          <p style={{ fontSize:10,fontWeight:700,color:C.muted,marginBottom:10,
            letterSpacing:'.06em',textTransform:'uppercase' }}>Coupon Code</p>
          <div style={{ display:'flex',gap:8 }}>
            <input
              value={couponCode}
              onChange={e => setCouponCode(e.target.value.toUpperCase())}
              onKeyDown={(e:any) => e.key === 'Enter' && onApply()}
              placeholder="e.g. COGNIBOOKS20"
              style={{
                flex:1,background:'rgba(255,255,255,.05)',
                border:`1px solid ${C.border}`,borderRadius:10,
                padding:'9px 12px',color:C.text,fontSize:13,outline:'none',
              }}
            />
            <button onClick={onApply} style={{
              padding:'9px 16px',borderRadius:10,border:'none',
              background:'rgba(0,255,136,.15)',color:C.primary,
              fontSize:12,fontWeight:700,cursor:'pointer',whiteSpace:'nowrap',
            }}>Apply</button>
          </div>
          {couponMsg && (
            <p style={{ fontSize:12,marginTop:8,
              color: couponMsg.startsWith('✅') ? C.primary : C.rose }}>
              {couponMsg}
            </p>
          )}
        </div>
      )}

      {/* Trust badges */}
      <div style={{ display:'flex',gap:8,flexWrap:'wrap',justifyContent:'center',marginTop:16 }}>
        {['🔒 Secure','⚡ Instant','✅ Guaranteed'].map(t => (
          <span key={t} style={{
            fontSize:11,color:C.muted,
            background:'rgba(255,255,255,.04)',border:`1px solid ${C.border}`,
            padding:'4px 10px',borderRadius:20,
          }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

// ── Main CheckoutPage ─────────────────────────────────────────────────────
const CheckoutPage = ({ productId }: { productId: string }) => {
  const product = CONFIG.getProductById(productId);

  const [phase, setPhase] = useState<Phase>('info');
  const [name,      setName]      = useState('');
  const [email,     setEmail]     = useState('');
  const [nameErr,   setNameErr]   = useState('');
  const [emailErr,  setEmailErr]  = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponMsg,  setCouponMsg]  = useState('');
  const [appliedCoupon, setApplied] = useState<any>(null);
  const [paymentData, setPaymentData] = useState<{ paybisUrl: string; transakUrl: string; orderId: string } | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [phase]);

  if (!product) {
    return (
      <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',
        justifyContent:'center',flexDirection:'column',gap:16 }}>
        <p style={{ color:C.muted,fontSize:16 }}>Product not found.</p>
        <a href="#home" style={{ color:C.primary,fontWeight:700 }}>← Back to store</a>
      </div>
    );
  }

  const discountAmt = CONFIG.calculateDiscount(product.price, appliedCoupon);
  const total       = Math.max(0.75, product.price - discountAmt); // Crossmint minimum $0.75

  const applyCoupon = () => {
    if (!couponCode.trim()) { setCouponMsg('Please enter a coupon code.'); return; }
    const c = CONFIG.validateCoupon(couponCode);
    if (c) {
      setApplied(c);
      setCouponMsg(`✅ "${c.code}" applied — ${c.discount}% off!`);
    } else {
      setApplied(null);
      setCouponMsg('❌ Invalid or expired coupon code.');
    }
  };

const handleContinue = async () => {
    let valid = true;
    if (!name.trim() || name.trim().length < 2) {
      setNameErr('Full name is required'); valid = false;
    } else { setNameErr(''); }
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(email.trim())) {
      setEmailErr('Enter a valid email address'); valid = false;
    } else { setEmailErr(''); }
    if (!valid) return;

    // Show loading state
    const btn = document.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Creating order...';
    }

    try {
      const res = await fetch('/.netlify/functions/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, email: email.trim(), name: name.trim() }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      // Store order ID and payment URLs for reference
      sessionStorage.setItem('cognibooks_order_id', data.orderId);
      setPaymentData({ paybisUrl: data.paybisUrl, transakUrl: data.transakUrl, orderId: data.orderId });
      setPhase('payment');
    } catch (err) {
      console.error('Order creation failed:', err);
      alert(err.message || 'Failed to create order. Please try again.');
      
      // Reset button
      const btn = document.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Continue to Payment →';
      }
    }
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--clr-bg)', position:'relative' }}>

      {/* Ambient blobs */}
      <div style={{ position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden' }} aria-hidden="true">
        <div style={{ position:'absolute',width:440,height:440,borderRadius:'50%',
          background:'#00ff88',filter:'blur(140px)',opacity:.03,top:-120,right:-80 }} />
        <div style={{ position:'absolute',width:380,height:380,borderRadius:'50%',
          background:'#00d4ff',filter:'blur(130px)',opacity:.028,bottom:'10%',left:-60 }} />
      </div>

      {/* Header */}
      <header style={{
        position:'sticky',top:0,zIndex:100,
        background:'rgba(7,7,13,.92)',
        backdropFilter:'blur(20px)',
        WebkitBackdropFilter:'blur(20px)',
        borderBottom:`1px solid ${C.border}`,
        padding:'14px 24px',
        display:'flex',alignItems:'center',justifyContent:'space-between',
      }}>
        <a href="#home" style={{ display:'flex',alignItems:'center',gap:10,textDecoration:'none' }}>
          <img src="/logo.webp" alt="CogniBooks" style={{
            width:40,height:40,borderRadius:'50%',objectFit:'cover',
            border:`2px solid ${C.primary}`,
            boxShadow:'0 0 14px rgba(0,255,136,.4)',
          }} />
          <span style={{ fontSize:18,fontWeight:800,color:C.text }}>CogniBooks</span>
        </a>
        <span style={{ fontSize:13,color:C.muted,display:'flex',alignItems:'center',gap:6 }}>
          🔒 Secure Checkout
        </span>
      </header>

      {/* Single-column body */}
      <div style={{
        maxWidth:560,margin:'0 auto',
        padding:'32px 20px 60px',
        display:'flex',flexDirection:'column',gap:20,
        position:'relative',zIndex:1,
      }}>

        {/* Steps */}
        <Steps phase={phase} />

        {/* ── ORDER SUMMARY CARD (always visible) ── */}
        <div style={{
          background:C.card,border:`1px solid ${C.border}`,
          borderRadius:20,padding:22,
          backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',
        }}>
          <p style={{ fontSize:10,fontWeight:700,letterSpacing:'.1em',
            textTransform:'uppercase',color:C.muted,marginBottom:16 }}>Order Summary</p>
          <OrderSummary
            product={product}
            total={total}
            discount={discountAmt}
            appliedCoupon={appliedCoupon}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            onApply={applyCoupon}
            couponMsg={couponMsg}
            locked={false}
          />
        </div>

        {/* ── STEP 1: Your Details ── */}
        <div style={{
          background:C.card,border:`1px solid ${C.border}`,
          borderRadius:20,padding:'28px 24px',
          backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',
        }}>
            <h2 style={{ fontSize:22,fontWeight:800,color:C.text,marginBottom:6 }}>Your Details</h2>
            <p style={{ fontSize:13,color:C.muted,marginBottom:24 }}>
              We'll send your download link to this email instantly after purchase.
            </p>

            <Field
              label="Full Name"
              value={name}
              onChange={setName}
              error={nameErr}
              placeholder="Jane Smith"
              autoComplete="name"
            />
            <Field
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              error={emailErr}
              placeholder="jane@example.com"
              autoComplete="email"
            />

<button onClick={handleContinue} style={{
              width:'100%',padding:'16px',border:'none',borderRadius:14,
              background:'linear-gradient(135deg,#00ff88,#00cc6a)',
              color:'#030a05',fontSize:16,fontWeight:800,cursor:'pointer',
              boxShadow:'0 4px 24px rgba(0,255,136,.35)',
              transition:'transform .2s,box-shadow .2s',
              marginTop:4,
            }}
            onMouseOver={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 32px rgba(0,255,136,.5)';
            }}
            onMouseOut={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 24px rgba(0,255,136,.35)';
            }}
          >
            Continue to Payment →
          </button>

          <p style={{ textAlign:'center',fontSize:12,color:C.faint,marginTop:12 }}>
            🔒 256-bit SSL encrypted · Your info is never sold or shared
          </p>
        </div>
      </div>

      {/* ── STEP 2: Payment Method ── */}
      {phase === 'payment' && paymentData && (
        <div style={{
          background:C.card,border:`1px solid ${C.border}`,
          borderRadius:20,padding:'28px 24px',
          backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',
        }}>
          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20 }}>
            <h2 style={{ fontSize:20,fontWeight:800,color:C.text,margin:0 }}>Payment Method</h2>
            <button onClick={() => setPhase('info')} style={{
              padding:'6px 14px',borderRadius:8,border:`1px solid ${C.border}`,
              background:'rgba(255,255,255,.04)',color:C.muted,
              fontSize:12,fontWeight:600,cursor:'pointer',
            }}>← Back</button>
          </div>

          <div style={{
            background:'rgba(255,255,255,.03)',border:`1px solid ${C.border}`,
            borderRadius:10,padding:'10px 14px',marginBottom:20,
            fontSize:13,color:C.muted,
          }}>
            Paying as: <strong style={{ color:C.text }}>{name}</strong>
            {' · '}<span style={{ color:C.muted }}>{email}</span>
          </div>

          <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
            <a href={paymentData.paybisUrl} target="_blank" rel="noopener noreferrer" style={{
              width:'100%',padding:'18px 24px',border:'none',borderRadius:16,
              background:`linear-gradient(135deg,${C.primary},${C.primaryHover})`,
              color:'#030a05',fontSize:16,fontWeight:800,
              fontFamily:"'Inter', system-ui, sans-serif",
              cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:12,
              boxShadow:`0 6px 28px rgba(0,255,136,.35), 0 0 0 1px rgba(0,255,136,.15)`,
              textDecoration:'none',transition:'transform .15s, box-shadow .15s',
            }}
            onMouseOver={e => {
              const btn = e.currentTarget as HTMLAnchorElement;
              btn.style.transform = 'translateY(-2px)';
              btn.style.boxShadow = `0 10px 36px rgba(0,255,136,.45), 0 0 0 1px rgba(0,255,136,.2)`;
            }}
            onMouseOut={e => {
              const btn = e.currentTarget as HTMLAnchorElement;
              btn.style.transform = 'translateY(0)';
              btn.style.boxShadow = `0 6px 28px rgba(0,255,136,.35), 0 0 0 1px rgba(0,255,136,.15)`;
            }}
            onMouseDown={e => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(1px) scale(.99)';
            }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.68-.35.68-.78 0-.39-.01-1.69-.01-3.33-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.69.92.69 1.85 0 1.33-.01 2.41-.01 2.74 0 .43.18.86.69.78A10.02 10.02 0 0022 12c0-5.52-4.48-10-10-10z"/>
              </svg>
              <span>Credit/Debit Card (PayPal or Card)</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>

            <a href={paymentData.transakUrl} target="_blank" rel="noopener noreferrer" style={{
              width:'100%',padding:'16px 24px',
              border:`1.5px solid ${C.cyan}`,borderRadius:16,
              background:'rgba(0,212,255,.08)',color:C.cyan,
              fontSize:15,fontWeight:700,fontFamily:"'Inter', system-ui, sans-serif",
              cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:10,
              textDecoration:'none',transition:'all .2s',
            }}
            onMouseOver={e => {
              const btn = e.currentTarget as HTMLAnchorElement;
              btn.style.background = 'rgba(0,212,255,.15)';
              btn.style.borderColor = C.cyan;
              btn.style.boxShadow = '0 0 20px rgba(0,212,255,.15)';
              btn.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={e => {
              const btn = e.currentTarget as HTMLAnchorElement;
              btn.style.background = 'rgba(0,212,255,.08)';
              btn.style.borderColor = C.cyan;
              btn.style.boxShadow = 'none';
              btn.style.transform = 'translateY(0)';
            }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/><path d="M16 14h-3v3h3v-3"/><path d="M8 14H5v3h3v-3"/>
              </svg>
              <span>Master Card / Visa Card / Apple Pay / Google Pay</span>
            </a>
          </div>
        </div>
      )}

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
