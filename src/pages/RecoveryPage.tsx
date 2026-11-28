import { useState } from 'react';
import CONFIG from '../config.js';

const C = {
  primary: '#00ff88',
  primaryHover: '#00cc6a',
  text: '#ffffff',
  muted: '#c0c0d8',
  faint: '#6a6a88',
  border: 'rgba(255,255,255,.1)',
  card: 'rgba(16,14,32,.97)',
  rose: '#f43f5e',
};

export default function RecoveryPage() {
  const [phase, setPhase] = useState<'lookup' | 'result' | 'error'>('lookup');
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const API = '/.netlify/functions/recover-download';

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch(`${API}?email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();
      if (data.orders && data.orders.length > 0) {
        setOrders(data.orders.filter((o: any) => o.status === 'completed'));
        setPhase('result');
      } else {
        setMsg('No completed orders found for this email.');
        setPhase('error');
      }
    } catch {
      setMsg('Lookup failed. Please try again.');
      setPhase('error');
    } finally {
      setLoading(false);
    };
  };

  const handleRecover = async (oid: string) => {
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: oid }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedOrder(data.order);
        setDownloadUrl(data.downloadUrl);
        setMsg('Download link re-issued and sent to your email.');
      } else {
        setMsg(data.error || 'Recovery failed.');
      }
    } catch {
      setMsg('Recovery failed. Please try again.');
    } finally {
      setLoading(false);
    };
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-bg)', color: 'var(--clr-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="glass-strong" style={{ maxWidth: 560, width: '100%', padding: '56px 40px', textAlign: 'center', boxShadow: '0 0 60px rgba(0,255,136,.14)' }}>
        <div style={{ fontSize: 48, marginBottom: 18 }}>📥</div>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, letterSpacing: '-0.03em' }}>Recover My Download</h1>
        <p style={{ fontSize: 16, color: 'var(--clr-muted)', marginBottom: 32, lineHeight: 1.6 }}>
          Lost your download link? Enter your purchase email to re-issue it instantly.
        </p>

        {phase === 'lookup' && (
          <form onSubmit={handleLookup} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ textAlign: 'left' }}>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 6 }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="jane@example.com"
                style={{
                  background: 'rgba(255,255,255,.05)',
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 12,
                  padding: '13px 16px',
                  color: C.text,
                  fontSize: 15,
                  outline: 'none',
                  width: '100%',
                }}
              />
            </div>
            <button
              type="submit"
              onClick={(e) => { e.preventDefault(); }}
              style={{
                width: '100%',
                padding: '16px',
                border: 'none',
                borderRadius: 14,
                background: 'linear-gradient(135deg,#00ff88,#00cc6a)',
                color: '#030a05',
                fontSize: 16,
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 24px rgba(0,255,136,.35)',
              }}
            >
              {loading ? 'Looking up...' : 'Find My Orders'}
            </button>
          </form>
        )}

        {phase === 'result' && orders.length > 0 && (
          <div style={{ textAlign: 'left', marginBottom: 24 }}>
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: C.muted, marginBottom: 12 }}>Completed Orders</p>
            {orders.map((o: any) => (
              <div key={o.orderId} style={{
                background: 'rgba(255,255,255,.04)',
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: 16,
                marginBottom: 10,
                cursor: 'pointer',
                transition: 'border-color .2s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = C.primary; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = C.border; }}
              onClick={() => handleRecover(o.orderId)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{o.productId ? `eBook #${o.orderId.slice(0,8)}` : `Order #${o.orderId.slice(0,8)}`}</span>
                  <span style={{ fontSize: 11, color: C.primary, fontWeight: 800 }}>Completed</span>
                </div>
                <div style={{ fontSize: 12, color: C.muted }}>
                  {o.email} • {new Date(o.completedAt || 0).toLocaleDateString()}
                </div>
                <div style={{ marginTop: 8, fontSize: 12, color: C.primary }}>
                  📥 Re-issue Download Link
                </div>
              </div>
            ))}
          </div>
        )}

        {phase === 'result' && selectedOrder && downloadUrl && (
          <div style={{
            background: 'rgba(0,255,136,.1)',
            border: `1px solid rgba(0,255,136,.3)`,
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.primary, marginBottom: 8 }}>✅ Download Link Re-Issued</div>
            <p style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>{msg}</p>
            <a href={downloadUrl} style={{
              display: 'inline-block',
              padding: '14px 32px',
              background: 'linear-gradient(135deg,#00ff88,#00cc6a)',
              color: '#030a05',
              fontSize: 16,
              fontWeight: 800,
              borderRadius: 10,
              textDecoration: 'none',
              boxShadow: '0 4px 24px rgba(0,255,136,.35)',
            }}>Download PDF Now</a>
          </div>
        )}

        {phase === 'error' && (
          <div style={{
            background: 'rgba(255,68,85,.08)',
            border: `1px solid rgba(255,68,85,.3)`,
            borderRadius: 12,
            padding: 16,
            color: C.rose,
            marginBottom: 24,
          }}>
            {msg}
          </div>
        )}

        <p style={{ fontSize: 12, color: C.faint, marginTop: 24 }}>
          Still need help? Email support@cognibooks.com
        </p>
      </div>
    </div>
  );
}