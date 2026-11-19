import { useState } from 'react';

interface PaymentMethodButtonsProps {
  paybisUrl: string;
  transakUrl: string;
  name: string;
  email: string;
  onBack: () => void;
  primaryColor: string;
  primaryHover: string;
  cyanColor: string;
}

export function PaymentMethodButtons({
  paybisUrl,
  transakUrl,
  name,
  email,
  onBack,
  primaryColor,
  primaryHover,
  cyanColor,
}: PaymentMethodButtonsProps) {
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

      <div style={{
        background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.1)',
        borderRadius: 10, padding: '10px 14px', marginBottom: 20,
        fontSize: 13, color: '#c0c0d8',
      }}>
        Paying as: <strong style={{ color: '#ffffff' }}>{name}</strong>
        {' · '}<span style={{ color: '#c0c0d8' }}>{email}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <a href={paybisUrl} target="_blank" rel="noopener noreferrer" style={{
          width: '100%', padding: '18px 24px', border: 'none', borderRadius: 16,
          background: `linear-gradient(135deg, ${primaryColor}, ${primaryHover})`,
          color: '#030a05', fontSize: 16, fontWeight: 800,
          fontFamily: "'Inter', system-ui, sans-serif",
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
          boxShadow: '0 6px 28px rgba(0,255,136,.35), 0 0 0 1px rgba(0,255,136,.15)',
          textDecoration: 'none', transition: 'transform .15s, box-shadow .15s',
        }}>
          <CreditCardIcon />
          <span>Credit/Debit Card (PayPal or Card)</span>
          <ExternalLinkIcon />
        </a>

        <a href={transakUrl} target="_blank" rel="noopener noreferrer" style={{
          width: '100%', padding: '16px 24px',
          border: '1.5px solid #00d4ff', borderRadius: 16,
          background: 'rgba(0,212,255,.08)', color: '#00d4ff',
          fontSize: 15, fontWeight: 700, fontFamily: "'Inter', system-ui, sans-serif",
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          textDecoration: 'none', transition: 'all .2s',
        }}>
          <CardIcon />
          <span>Master Card / Visa Card / Apple Pay / Google Pay</span>
        </a>
      </div>
    </div>
  );
}

function CreditCardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
      <path d="M16 14h-3v3h3v-3"/>
      <path d="M8 14H5v3h3v-3"/>
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  );
}

function CardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
      <path d="M16 14h-3v3h3v-3"/>
      <path d="M8 14H5v3h3v-3"/>
    </svg>
  );
}