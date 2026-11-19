/**
 * CogniBooks – CheckoutPage  v6.0
 * ─────────────────────────────────────────────────────────
 * Single-column layout
 * Step 1 → capture name + email
 * Step 2 → PaymentMethodButtons (PayBis & Transak)
 * ─────────────────────────────────────────────────────────
 */

import { useState, useEffect, useId } from 'react';
import CONFIG from '../config.js';
import { formatPrice } from '../utils.js';
import { PaymentMethodButtons } from '@/components/PaymentMethodButtons';

// Module-level constants (no regex, no division, no forward slashes)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const API_PATH = ".netlify/functions/create-order";
const ASPECT_RATIO = 0.5625;

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

// ── Order Summary ─────────────────────────────────────────────────────────
function OrderSummary({
  product, total, discount, appliedCoupon, couponCode,
  setCouponCode, onApply, couponMsg, locked
}: any) {
  const discount_amt = product.originalPrice - product.price;
  return (
    <div style={{ display:'flex',flexDirection:'column',gap:0 }}>
      <div style={{ display:'flex',gap:14,alignItems:'flex-start',marginBottom:18 }}>
        <div style={{
          width:64,flexShrink:0,borderRadius:10,overflow:'hidden',
          boxShadow:'0 4px 18px rgba(0,0,0,.55)',
          aspectRatio: ASPECT_RATIO,
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
  const total       = Math.max(0.75, product.price - discountAmt);

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
    if (!EMAIL_REGEX.test(email.trim())) {
      setEmailErr('Enter a valid email address'); valid = false;
    } else { setEmailErr(''); }
    if (!valid) return;

    const btn = document.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Creating order...';
    }

    try {
      const res = await fetch(API_PATH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, email: email.trim(), name: name.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      sessionStorage.setItem('cognibooks_order_id', data.orderId);
      setPaymentData({ paybisUrl: data.paybisUrl, transakUrl: data.transakUrl, orderId: data.orderId });
      setPhase('payment');
    } catch (err) {
      console.error('Order creation failed:', err);
      alert(err.message || 'Failed to create order. Please try again.');

      const btn = document.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Continue to Payment →';
      }
    }
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--clr-bg)', position:'relative' }}>

      <div style={{ position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden' }} aria-hidden="true">
        <div style={{ position:'absolute',width:440,height:440,borderRadius:'50%',
          background:'#00ff88',filter:'blur(140px)',opacity:.03,top:-120,right:-80 }} />
        <div style={{ position:'absolute',width:380,height:380,borderRadius:'50%',
          background:'#00d4ff',filter:'blur(130px)',opacity:.028,bottom:'10%',left:-60 }} />
      </div>

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

      <div style={{
        maxWidth:560,margin:'0 auto',
        padding:'32px 20px 60px',
        display:'flex',flexDirection:'column',gap:20,
        position:'relative',zIndex:1,
      }}>

        <Steps phase={phase} />

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

        {phase === 'payment' && paymentData && (
          <PaymentMethodButtons
            paybisUrl={paymentData.paybisUrl}
            transakUrl={paymentData.transakUrl}
            name={name}
            email={email}
            onBack={() => setPhase('info')}
            primaryColor={C.primary}
            primaryHover={C.primary}
            cyanColor={C.cyan}
          />
        )}

      </div>
    </div>
  );
};

export default CheckoutPage;