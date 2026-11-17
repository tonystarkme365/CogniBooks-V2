import { useState } from 'react';

interface PaymentSectionProps {
  walletAddress: string;
  amount: number;
  productId?: string;
}

const C = {
  primary: '#00ff88',
  primaryHover: '#00cc6a',
  cyan: '#00d4ff',
  text: '#ffffff',
  muted: '#c0c0d8',
  faint: '#6a6a88',
  border: 'rgba(255,255,255,.1)',
  card: 'rgba(16,14,32,.97)',
  rose: '#f43f5e',
};

export function PaymentSection({
  walletAddress,
  amount,
  productId,
}: PaymentSectionProps) {
  const usdAmount = amount.toFixed(2);
  const encodedWallet = encodeURIComponent(walletAddress);
  const encodedAmount = encodeURIComponent(usdAmount);

  const paybisUrl = `https://paybis.com/buy/usdc/polygon?amount=${encodedAmount}&currency=USD&wallet=${encodedWallet}&network=polygon`;
  const transakUrl = `https://global.transak.com/?amount=${encodedAmount}&currency=USD&walletAddress=${encodedWallet}&network=polygon&cryptoCurrency=USDC`;

  const handlePrimaryClick = () => window.open(paybisUrl, '_blank', 'noopener,noreferrer');
  const handleSecondaryClick = () => window.open(transakUrl, '_blank', 'noopener,noreferrer');

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 20,
        padding: 24,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        marginBottom: 20,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 16,
        }}>
          <span style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            color: C.muted,
          }}>
            Amount (USD / USDC)
          </span>
          <span style={{
            fontSize: 32,
            fontWeight: 900,
            color: C.primary,
            fontFamily: "'Space Grotesk', sans-serif",
            letterSpacing: '-0.02em',
          }}>
            ${usdAmount}
          </span>
        </div>

        <p style={{
          marginTop: 0,
          fontSize: 12,
          color: C.faint,
          lineHeight: 1.5,
        }}>
          You pay <strong style={{ color: C.text }}>${usdAmount} USD</strong> → you receive <strong style={{ color: C.primary }}>{usdAmount} USDC</strong> on Polygon Mainnet
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        <button
          onClick={handlePrimaryClick}
          style={{
            width: '100%',
            padding: '18px 24px',
            border: 'none',
            borderRadius: 16,
            background: `linear-gradient(135deg, ${C.primary}, ${C.primaryHover})`,
            color: '#030a05',
            fontSize: 16,
            fontWeight: 800,
            fontFamily: "'Inter', system-ui, sans-serif",
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            boxShadow: `0 6px 28px rgba(0,255,136,.35)`,
            transition: 'transform .15s, box-shadow .15s',
          }}
          onMouseOver={e => {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.transform = 'translateY(-2px)';
            btn.style.boxShadow = `0 10px 36px rgba(0,255,136,.45)`;
          }}
          onMouseOut={e => {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = `0 6px 28px rgba(0,255,136,.35)`;
          }}
          onMouseDown={e => {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.transform = 'translateY(1px) scale(.99)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/><path d="M16 14h-3v3h3v-3"/><path d="M8 14H5v3h3v-3"/>
          </svg>
          <span>Credit/Debit Card (PayPal or Card)</span>
        </button>

        <button
          onClick={handleSecondaryClick}
          style={{
            width: '100%',
            padding: '16px 24px',
            border: `1.5px solid ${C.cyan}`,
            borderRadius: 16,
            background: 'rgba(0,212,255,.08)',
            color: C.cyan,
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "'Inter', system-ui, sans-serif",
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            transition: 'all .2s',
          }}
          onMouseOver={e => {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.background = 'rgba(0,212,255,.15)';
            btn.style.boxShadow = '0 0 20px rgba(0,212,255,.15)';
            btn.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={e => {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.background = 'rgba(0,212,255,.08)';
            btn.style.boxShadow = 'none';
            btn.style.transform = 'translateY(0)';
          }}
        >
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/><path d="M16 14h-3v3h3v-3"/><path d="M8 14H5v3h3v-3"/>
          </svg>
          <span>Master Card / Visa Card / Apple Pay / Google Pay</span>
        </button>

      </div>

      </div>
    </div>
  );
}

export default PaymentSection;