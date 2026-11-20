'use client';

import { useState } from 'react';
import { PAYMENT_LINKS } from '@/lib/payments';

interface PaymentButtonProps {
  provider: 'transak' | 'moonpay' | 'paybis' | 'onramper';
  amount: number;
  currency?: string;
  cryptoCurrency?: string;
  network?: string;
  walletAddress?: string;
  redirectUrl?: string;
  email?: string;
  onPaymentStart?: () => void;
  onPaymentComplete?: (provider: string) => void;
}

const PROVIDER_CONFIG = {
  transak: {
    label: 'Credit/Debit Card (PayPal or Card)',
    description: 'Pay with Visa, Mastercard, PayPal, Apple Pay, Google Pay',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
        <path d="M16 14h-3v3h3v-3"/>
        <path d="M8 14H5v3h3v-3"/>
      </svg>
    ),
    color: '#00ff88',
    hoverColor: '#00cc6a',
  },
  moonpay: {
    label: 'Credit/Debit Card (Apple Pay / Google Pay)',
    description: 'Pay with Visa, Mastercard, Apple Pay, Google Pay',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
    color: '#00d4ff',
    hoverColor: '#0099cc',
  },
  paybis: {
    label: 'Credit/Debit Card (PayPal / Card)',
    description: 'Pay with Visa, Mastercard, PayPal',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.68-.35.68-.78 0-.39-.01-1.69-.01-3.33-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.69.92.69 1.85 0 1.33-.01 2.41-.01 2.74 0 .43.18.86.69.78A10.02 10.02 0 0022 12c0-5.52-4.48-10-10-10z"/>
      </svg>
    ),
    color: '#ff6b35',
    hoverColor: '#e55a2a',
  },
  onramper: {
    label: 'Best Rate (Auto-select)',
    description: 'Automatically finds the best rate across providers',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
        <path d="M12 6v6l-4 2"/>
      </svg>
    ),
    color: '#8b5cf6',
    hoverColor: '#7c3aed',
  },
};

export function PaymentButtons({
  provider = 'transak',
  amount = 29.99,
  currency = 'USD',
  cryptoCurrency = 'USDC',
  network = 'polygon',
  walletAddress = '0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53',
  redirectUrl,
  email,
  onPaymentStart,
  onPaymentComplete,
}: PaymentButtonProps) {
  const [selectedProvider, setSelectedProvider] = useState<'transak' | 'moonpay' | 'paybis' | 'onramper'>(provider);
  const [loading, setLoading] = useState<string | null>(null);

  const config = PROVIDER_CONFIG[selectedProvider];

  const handlePayment = () => {
    if (onPaymentStart) onPaymentStart();
    setLoading(selectedProvider);

    try {
      let link = '';
      
      const baseParams = {
        amount,
        currency: 'USD',
        cryptoCurrency: 'USDC',
        network: 'polygon',
        walletAddress: '0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53',
        redirectUrl: redirectUrl || `${window.location.origin}/#success?provider=${selectedProvider}`,
        email: undefined, // Will be filled from form if needed
      };

      // Import dynamically to avoid SSR issues
      const { PAYMENT_LINKS } = require('@/lib/payments');
      
      switch (selectedProvider) {
        case 'transak':
          link = PAYMENT_LINKS.transak(mountainParams);
          break;
        case 'moonpay':
          link = PAYMENT_LINKS.moonpay(mountainParams);
          break;
        case 'paybis':
          link = PAYMENT_LINKS.paybis(mountainParams);
          break;
        case 'onramper':
          link = PAYMENT_LINKS.onramper(mountainParams);
          break;
      }

      if (link) {
        // Track event
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'payment_initiated', {
            provider: selectedProvider,
            amount,
            currency: 'USD',
          });
        }
        
        window.location.href = link;
      }
    } catch (error) {
      console.error('Payment link generation failed:', error);
      alert('Failed to generate payment link. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Reassurance text */}
      <p style={{
        fontSize: 13,
        color: '#c0c0d8',
        textAlign: 'center',
        marginBottom: 8,
        lineHeight: 1.5
      }}>
        💡 <strong>No ID verification needed</strong> for purchases under $50. 
        Just email + phone verification (30 seconds).
      </p>

      {/* Provider selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['transak', 'moonpay', 'paybis', 'onramper'] as const).map((p) => {
          const c = PROVIDER_CONFIG[p];
          return (
            <button
              key={p}
              onClick={() => setSelectedProvider(p)}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: 8,
                border: `2px solid ${selectedProvider === p ? c.color : 'rgba(255,255,255,.1)'}`,
                background: selectedProvider === p ? `rgba(${parseInt(c.color.slice(1,2),16)*17},${parseInt(c.color.slice(3,4),16)*17},${parseInt(c.color.slice(5,6),16)*17},.1)` : 'rgba(255,255,255,.03)',
                color: selectedProvider === p ? c.color : '#c0c0d8',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all .2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span>{c.icon}</span>
              <span style={{fontSize: 11}}>{c.label}</span>
            </button>
          );
        })}
      </div>

      {/* Selected provider button */}
      <button
        onClick={handlePayment}
        disabled={loading !== null}
        style={{
          width: '100%',
          padding: '16px 24px',
          border: 'none',
          borderRadius: 14,
          background: loading === selectedProvider 
            ? `linear-gradient(135deg, ${config.hoverColor}, ${config.color})`
            : `linear-gradient(135deg, ${config.color}, ${config.hoverColor})`,
          color: '#030a05',
          fontSize: 16,
          fontWeight: 800,
          fontFamily: "'Inter', system-ui, sans-serif",
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          boxShadow: `0 6px 28px ${config.color}40`,
          transition: 'transform .15s, box-shadow .15s',
          opacity: loading ? 0.7 : 1,
        }}
        onMouseOver={(e) => {
          if (!loading) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 10px 36px ${config.color}60`;
          }
        }}
        onMouseOut={(e) => {
          if (!loading) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = `0 6px 28px ${config.color}40`;
          }
        }}
      >
        {loading ? (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" style={{animation: 'spin 1s linear infinite'}}>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="31.4" strokeDashoffset="15.7"/>
            </svg>
            <span>Redirecting to {config.label}...</span>
          </>
        ) : (
          <>
            {config.icon}
            <span>Pay ${amount.toFixed(2)} {currency}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </>
        )}
      </button>

      {/* Description */}
      <p style={{ fontSize: 12, color: '#6a6a88', textAlign: 'center', marginTop: 8 }}>
        {config.description}
      </p>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default PaymentButtons;