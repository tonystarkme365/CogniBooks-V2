import { useState, useId } from 'react';

interface PaymentSectionProps {
  walletAddress: string;
  defaultAmount?: number;
  productId?: string;
  onAmountChange?: (amount: number) => void;
}

const C = {
  primary: '#00ff88',
  primaryHover: '#00cc6a',
  cyan: '#00d4ff',
  cyanHover: '#0099cc',
  text: '#ffffff',
  muted: '#c0c0d8',
  faint: '#6a6a88',
  border: 'rgba(255,255,255,.1)',
  card: 'rgba(16,14,32,.97)',
  bg: '#07070d',
  rose: '#f43f5e',
};

export function PaymentSection({
  walletAddress,
  defaultAmount = 0,
  productId,
  onAmountChange,
}: PaymentSectionProps) {
  const [amount, setAmount] = useState(defaultAmount);
  const [error, setError] = useState<string | null>(null);
  const inputId = useId();

  const handleAmountChange = (value: string) => {
    const num = value === '' ? 0 : parseFloat(value);
    if (isNaN(num) || num < 0) {
      setError('Enter a valid amount');
      return;
    }
    setError(null);
    setAmount(num);
    onAmountChange?.(num);
  };

  const validateAndBuildUrls = () => {
    if (amount <= 0) {
      setError('Amount must be greater than 0');
      return null;
    }
    if (amount < 1) {
      setError('Minimum amount is $1.00');
      return null;
    }

    const usdAmount = amount.toFixed(2);
    const encodedWallet = encodeURIComponent(walletAddress);
    const encodedAmount = encodeURIComponent(usdAmount);

    const paybisUrl = `https://paybis.com/buy/usdc/polygon?amount=${encodedAmount}&currency=USD&wallet=${encodedWallet}&network=polygon`;

    const transakUrl = `https://global.transak.com/?amount=${encodedAmount}&currency=USD&walletAddress=${encodedWallet}&network=polygon&cryptoCurrency=USDC`;

    return { paybisUrl, transakUrl };
  };

  const handlePrimaryClick = () => {
    const urls = validateAndBuildUrls();
    if (urls) window.open(urls.paybisUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSecondaryClick = () => {
    const urls = validateAndBuildUrls();
    if (urls) window.open(urls.transakUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulseGlow { 0%,100% { box-shadow: 0 0 0 0 rgba(0,255,136,.4); } 50% { box-shadow: 0 0 0 8px rgba(0,255,136,0); } }
      `}</style>

      <div style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 20,
        padding: 24,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        marginBottom: 20,
      }}>
        <label htmlFor={inputId} style={{
          display: 'block',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '.1em',
          textTransform: 'uppercase',
          color: C.muted,
          marginBottom: 12,
        }}>
          Amount (USD / USDC)
        </label>

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <span style={{
            position: 'absolute',
            left: 16,
            fontSize: 18,
            fontWeight: 800,
            color: C.primary,
            fontFamily: "'Space Grotesk', sans-serif",
            pointerEvents: 'none',
          }}>
            $
          </span>
          <input
            id={inputId}
            type="number"
            step="0.01"
            min="1"
            value={amount || ''}
            onChange={e => handleAmountChange(e.target.value)}
            onBlur={() => { if (amount && amount < 1) setAmount(1); }}
            placeholder="0.00"
            style={{
              width: '100%',
              padding: '16px 16px 16px 40px',
              background: 'rgba(255,255,255,.04)',
              border: `1.5px solid ${error ? `rgba(255,68,85,.6)` : C.border}`,
              borderRadius: 14,
              color: C.text,
              fontSize: 28,
              fontWeight: 700,
              fontFamily: "'Space Grotesk', sans-serif",
              outline: 'none',
              transition: 'border-color .2s, box-shadow .2s',
              textAlign: 'right',
              MozAppearance: 'textfield',
            }}
            onFocus={e => {
              (e.target as HTMLInputElement).style.borderColor = C.primary;
              (e.target as HTMLInputElement).style.boxShadow = `0 0 0 3px rgba(0,255,136,.15)`;
            }}
            onBlur={e => {
              (e.target as HTMLInputElement).style.borderColor = error ? `rgba(255,68,85,.6)` : C.border;
              (e.target as HTMLInputElement).style.boxShadow = 'none';
            }}
          />
        </div>

        {error && (
          <p style={{ marginTop: 10, fontSize: 13, color: C.rose }}>{error}</p>
        )}

        <p style={{ marginTop: 12, fontSize: 12, color: C.faint, lineHeight: 1.5 }}>
          Paying <strong style={{ color: C.text }}>{amount.toFixed(2)} USD</strong> {'\u2192'} you receive <strong style={{ color: C.primary }}>{amount.toFixed(2)} USDC</strong> on Polygon to <code style={{ color: C.cyan, fontSize: 11 }}>{walletAddress.slice(0, 6)}\u2026{walletAddress.slice(-4)}</code>
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        <button
          onClick={handlePrimaryClick}
          disabled={amount <= 0}
          style={{
            width: '100%',
            padding: '18px 24px',
            border: 'none',
            borderRadius: 16,
            background: amount > 0
              ? `linear-gradient(135deg, ${C.primary}, ${C.primaryHover})`
              : 'rgba(255,255,255,.05)',
            color: amount > 0 ? '#030a05' : C.faint,
            fontSize: 16,
            fontWeight: 800,
            fontFamily: "'Inter', system-ui, sans-serif",
            cursor: amount > 0 ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            boxShadow: amount > 0 ? `0 6px 28px rgba(0,255,136,.35), 0 0 0 1px rgba(0,255,136,.15)` : 'none',
            transition: 'transform .15s, box-shadow .15s, background .2s',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseOver={e => {
            if (amount <= 0) return;
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.transform = 'translateY(-2px)';
            btn.style.boxShadow = `0 10px 36px rgba(0,255,136,.45), 0 0 0 1px rgba(0,255,136,.2)`;
          }}
          onMouseOut={e => {
            if (amount <= 0) return;
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = `0 6px 28px rgba(0,255,136,.35), 0 0 0 1px rgba(0,255,136,.15)`;
          }}
          onMouseDown={e => {
            if (amount <= 0) return;
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(1px) scale(.99)';
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.68-.35.68-.78 0-.39-.01-1.69-.01-3.33-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.69.92.69 1.85 0 1.33-.01 2.41-.01 2.74 0 .43.18.86.69.78A10.02 10.02 0 0022 12c0-5.52-4.48-10-10-10z"/>
          </svg>
          <span>Pay with PayPal or Card</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </button>

        <button
          onClick={handleSecondaryClick}
          disabled={amount <= 0}
          style={{
            width: '100%',
            padding: '16px 24px',
            border: `1.5px solid ${amount > 0 ? C.cyan : C.border}`,
            borderRadius: 16,
            background: amount > 0 ? 'rgba(0,212,255,.08)' : 'rgba(255,255,255,.03)',
            color: amount > 0 ? C.cyan : C.faint,
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "'Inter', system-ui, sans-serif",
            cursor: amount > 0 ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            transition: 'all .2s',
          }}
          onMouseOver={e => {
            if (amount <= 0) return;
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.background = 'rgba(0,212,255,.15)';
            btn.style.borderColor = C.cyan;
            btn.style.boxShadow = '0 0 20px rgba(0,212,255,.15)';
            btn.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={e => {
            if (amount <= 0) return;
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.background = 'rgba(0,212,255,.08)';
            btn.style.borderColor = C.cyan;
            btn.style.boxShadow = 'none';
            btn.style.transform = 'translateY(0)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/><path d="M16 14h-3v3h3v-3"/><path d="M8 14H5v3h3v-3"/>
          </svg>
          <span>Pay with Card / Apple Pay / Google Pay</span>
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
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          To: <code style={{ color: C.cyan, fontFamily: 'monospace', fontSize: 11 }}>{walletAddress}</code>
        </span>
      </div>
    </div>
  );
}

export default PaymentSection;