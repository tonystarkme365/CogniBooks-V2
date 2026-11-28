import { useState } from 'react';

interface PaymentMethodButtonsProps {
  paybisUrl: string | null;
  transakUrl: string | null;
  moonpayUrl: string | null;
  name: string;
  email: string;
  onBack: () => void;
  primaryColor: string;
  primaryHover: string;
  cyanColor: string;
}

const providerConfig = [
  {
    key: 'paybis',
    label: 'Credit/Debit Card (PayPal or Card)',
    color: '#00ff88',
    hoverColor: '#00cc6a',
    bg: 'rgba(0,255,136,.08)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/><path d="M16 14h-3v3h3v-3"/><path d="M8 14H5v3h3v-3"/>
      </svg>
    ),
  },
  {
    key: 'transak',
    label: 'Master Card / Visa Card / Apple Pay / Google Pay',
    color: '#00d4ff',
    hoverColor: '#0099cc',
    bg: 'rgba(0,212,255,.08)',
    border: '1.5px solid #00d4ff',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/><path d="M16 14h-3v3h3v-3"/><path d="M8 14H5v3h3v-3"/>
      </svg>
    ),
  },
  {
    key: 'moonpay',
    label: 'Apple Pay / Google Pay / Card',
    color: '#0052ff',
    hoverColor: '#0041cc',
    bg: 'rgba(0,82,255,.08)',
    border: '1.5px solid #0052ff',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-7h10v2H7v-2zm0 4h10v2H7v-2z"/>
      </svg>
    ),
  },
];

export function PaymentMethodButtons({
  paybisUrl,
  transakUrl,
  moonpayUrl,
  name,
  email,
  onBack,
  primaryColor,
  primaryHover,
  cyanColor,
}: PaymentMethodButtonsProps) {
  const urls: Record<string, string | null> = {
    paybis: paybisUrl,
    transak: transakUrl,
    moonpay: moonpayUrl,
  };

  const configured = providerConfig.filter(p => urls[p.key]);

  if (configured.length === 0) {
    return (
      <div style={{
        background: 'rgba(16,14,32,.97)',
        border: '1px solid rgba(255,68,85,.3)',
        borderRadius: 20,
        padding: '28px 24px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#ffffff', margin: 0 }}>Payment Method</h2>
          <button onClick={onBack} style={{
            padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,.1)',
            background: 'rgba(255,255,255,.04)', color: '#c0c0d8',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>← Back</button>
        </div>
        <div style={{
          background: 'rgba(255,68,85,.08)',
          border: '1px solid rgba(255,68,85,.3)',
          borderRadius: 10,
          padding: '20px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 24, marginBottom: 12 }}>⚠️</div>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ff4455', marginBottom: 8 }}>No payment providers configured</h3>
          <p style={{ fontSize: 13, color: '#c0c0d8', marginBottom: 16 }}>
            The site owner has not yet configured payment provider API keys. Please contact support@cognibooks.com to complete your purchase.
          </p>
          <button onClick={onBack} style={{
            padding: '12px 24px', borderRadius: 8, border: 'none',
            background: 'rgba(255,255,255,.06)', color: '#c0c0d8',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>Back to Store</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(16,14,32,.97)',
      border: '1px solid rgba(255,255,255,.1)',
      borderRadius: 20,
      padding: '28px 24px',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#ffffff', margin: 0 }}>Payment Method</h2>
        <button onClick={onBack} style={{
          padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,.1)',
          background: 'rgba(255,255,255,.04)', color: '#c0c0d8',
          fontSize: 12, fontWeight: 600, cursor: 'pointer',
        }}>← Back</button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,.1)' }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#00ff88' }}>
          Paying as:
        </span>
        <strong style={{ color: '#ffffff', fontSize: 13 }}>{name}</strong>
        {' · '}<span style={{ color: '#c0c0d8', fontSize: 13 }}>{email}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {configured.map((p) => {
          const url = urls[p.key];
          const isPaybis = p.key === 'paybis';
          const hasBorder = !!p.border;
          return (
            <a key={p.key} href={url} target="_blank" rel="noopener noreferrer" style={{
              width: '100%',
              padding: '18px 24px',
              border: hasBorder ? p.border : 'none',
              borderRadius: 16,
              background: isPaybis
                ? `linear-gradient(135deg, ${p.color}, ${p.hoverColor})`
                : p.bg,
              color: isPaybis ? '#030a05' : p.color,
              fontSize: 15,
              fontWeight: 800,
              fontFamily: "'Inter', system-ui, sans-serif",
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              textDecoration: 'none',
              transition: 'transform .15s, box-shadow .15s',
            }}>
              {p.icon}
              <span>{p.label}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default PaymentMethodButtons;