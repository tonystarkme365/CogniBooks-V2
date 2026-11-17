import { useState, useId } from 'react';

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
  const inputId = useId();
  const usdAmount = amount.toFixed(2);
  const encodedWallet = encodeURIComponent(walletAddress);
  const encodedAmount = encodeURIComponent(usdAmount);

  const paybisUrl = `https://paybis.com/buy/usdc/polygon?amount=${encodedAmount}&currency=USD&wallet=${encodedWallet}&network=polygon`;
  const transakUrl = `https://global.transak.com/?amount=${encodedAmount}&currency=USD&walletAddress=${encodedWallet}&network=polygon&cryptoCurrency=USDC`;

  const handlePrimaryClick = () => window.open(paybisUrl, '_blank', 'noopener,noreferrer');
  const handleSecondaryClick = () => window.open(transakUrl, '_blank', 'noopener,noreferrer');

  const maskedWallet = `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`;

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
            <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.68-.35.68-.78 0-.39-.01-1.69-.01-3.33-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.69.92.69 1.85 0 1.33-.01 2.41-.01 2.74 0 .43.18.86.69.78A10.02 10.02 0 0022 12c0-5.52-4.48-10-10-10z"/>
          </svg>
          <span>Master Card / Visa Card</span>
        </button>

      </div>

      <div style={{
        marginTop: 20,
        padding: '14px 16px',
        background: 'rgba(0,255,136,.04)',
        border: `1px solid rgba(0,255,136,.12)`,
        borderRadius: 12,
        fontSize: 12,
        color: C.muted,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: C.primary, boxShadow: `0 0 8px ${C.primary}`,
          }}></span>
          Polygon Mainnet
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/><line x1="12" y1="22" x2="12" y2="15.5"/><line x1="22" y1="8.5" x2="12" y2="15.5"/><line x1="2" y1="8.5" x2="12" y2="15.5"/></svg>
          USDC (0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174)
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          Recipient: <code style={{ color: C.cyan, fontFamily: 'monospace' }}>{maskedWallet}</code>
        </span>
      </div>
    </div>
  );
}

export default PaymentSection;