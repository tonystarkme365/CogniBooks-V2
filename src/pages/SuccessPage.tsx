import { useEffect, useState } from 'react';
import CONFIG from '../config.js';

const C = {
  primary: '#00ff88',
  text: '#ffffff',
  muted: '#c0c0d8',
};

const SuccessPage = () => {
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const orderId = sessionStorage.getItem('cognibooks_order_id');

    if (token && !downloading) {
      triggerDownload(token);
    } else if (!token && orderId) {
      pollOrderStatus(orderId);
    } else if (!token && !orderId) {
      setDownloadError('Purchase complete! Check your email for the download link.');
    }
  }, []);

  const pollOrderStatus = async (orderId: string) => {
    setPolling(true);
    try {
      const res = await fetch(`/.netlify/functions/order-status?orderId=${encodeURIComponent(orderId)}`);
      const data = await res.json();
      setStatus(data.status);
      if (data.status === 'completed' && data.downloadUrl) {
        triggerDownload(data.downloadUrl.split('token=')[1]);
      } else if (data.status === 'completed') {
        setDownloadError('Payment confirmed. Check your email for the download link.');
      } else {
        setDownloadError(`Payment status: ${data.status}. Please wait for confirmation.`);
      }
    } catch {
      setDownloadError('Unable to check payment status. Check your email for the download link.');
    } finally {
      setPolling(false);
    }
  };

  const triggerDownload = async (token: string) => {
    setDownloading(true);
    try {
      const res = await fetch(`/.netlify/functions/download-pdf?token=${encodeURIComponent(token)}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Download failed');
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ebook.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setDownloading(false);
    } catch (err) {
      console.error('Download error:', err);
      setDownloadError(err instanceof Error ? err.message : 'Download failed. Check your email.');
      setDownloading(false);
    }
  };

  const confettiEffect = () => {
    const colors = ['#00ff88','#00d4ff','#ff00ff','#ffaa00','#fff'];
    for (let i = 0; i < 80; i++) {
      const el = document.createElement('div');
      el.style.cssText = `position:fixed;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;background:${colors[i%5]};border-radius:2px;left:${Math.random()*100}%;top:-12px;pointer-events:none;z-index:9999;transform:rotate(${Math.random()*360}deg)`;
      document.body.appendChild(el);
      const anim = el.animate([
        { transform:`translateY(0) rotate(0deg)`, opacity:1 },
        { transform:`translateY(${window.innerHeight+30}px) rotate(${Math.random()*720-360}deg)`, opacity:0 }
      ], { duration: 2600+Math.random()*2000, easing:'ease-in', delay:Math.random()*700 });
      anim.onfinish = () => el.remove();
    }
  };

  useEffect(() => {
    confettiEffect();
  }, []);

  return (
    <div style={{ minHeight:'100vh',background:'var(--clr-bg)',color:'var(--clr-text)',display:'flex',alignItems:'center',justifyContent:'center',padding:24 }}>
      <div className="glass-strong" style={{ maxWidth:560,width:'100%',padding:'56px 40px',textAlign:'center',boxShadow:'0 0 60px rgba(0,255,136,.14)' }}>
        <div style={{ fontSize:72,marginBottom:18,display:'block',animation:'float 3s ease-in-out infinite' }}>🎉</div>
        <h1 className="gradient-text" style={{ fontSize:42,fontWeight:900,marginBottom:16,letterSpacing:'-0.03em' }}>Purchase Complete!</h1>
        <p style={{ fontSize:17,color:'var(--clr-muted)',marginBottom:28,lineHeight:1.7 }}>
          Thank you for your purchase!
        </p>
        
        {polling && (
          <div style={{ marginBottom: 24, padding: 16, background: 'rgba(0,255,136,.1)', border: '1px solid rgba(0,255,136,.3)', borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <div style={{ width: 20, height: 20, border: '2px solid var(--clr-primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <span style={{ color: 'var(--clr-primary)', fontWeight: 600 }}>Verifying payment...</span>
            </div>
          </div>
        )}

        {downloading && !polling && (
          <div style={{ marginBottom: 24, padding: 16, background: 'rgba(0,255,136,.1)', border: '1px solid rgba(0,255,136,.3)', borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <div style={{ width: 20, height: 20, border: '2px solid var(--clr-primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <span style={{ color: 'var(--clr-primary)', fontWeight: 600 }}>Preparing your download...</span>
            </div>
          </div>
        )}

        {downloadError && !downloading && !polling && (
          <div style={{ marginBottom: 24, padding: 16, background: 'rgba(255,170,0,.1)', border: '1px solid rgba(255,170,0,.3)', borderRadius: 12 }}>
            <p style={{ color: 'var(--clr-warn)', margin: 0 }}>⚠️ {downloadError}</p>
          </div>
        )}

        <div className="glass" style={{ padding:22,marginBottom:28,textAlign:'left' }}>
          <h3 style={{ fontSize:16,fontWeight:700,marginBottom:14,color:'var(--clr-primary)' }}>📧 What Happens Next?</h3>
          <ul style={{ listStyle:'none',padding:0,fontSize:14,lineHeight:2.2 }}>
            {[
              '✓ Check your inbox (and spam folder) for the download link',
              '✓ Your PDF is ready for instant access on any device',
              '✓ Save it offline — you own it forever',
              '✓ Lost your link? Visit Recover My Download in the footer',
              '✓ Need help? Email support@cognibooks.com'
            ].map((item,i)=>(
              <li key={i} style={{ color:'var(--clr-muted)',borderBottom:i<3?'1px solid var(--clr-border)':'none',paddingBottom:i<3?4:0 }}>{item}</li>
            ))}
          </ul>
        </div>
        <div style={{ display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',marginBottom:28 }}>
          <a href="#home" className="btn btn-primary" style={{ padding:'13px 28px' }}>Browse More eBooks</a>
          <a href="#recover" className="btn btn-ghost" style={{ padding:'13px 28px' }}>Recover My Download</a>
          <a href="mailto:support@cognibooks.com" className="btn btn-ghost" style={{ padding:'13px 28px' }}>Contact Support</a>
        </div>
        <div className="glass" style={{ padding:18,background:'rgba(255,0,255,.04)',border:'1px solid rgba(255,0,255,.14)' }}>
          <div style={{ fontSize:13,fontWeight:700,color:'var(--clr-accent)',marginBottom:8 }}>🎁 Complete Your Collection</div>
          <p style={{ fontSize:13,color:'var(--clr-muted)',marginBottom:12 }}>Get the remaining {CONFIG.products.length-1} eBooks at a 40% bundle discount!</p>
          <a href="#home" className="btn btn-secondary" style={{ fontSize:13 }}>View Bundle →</a>
        </div>
        <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );
};

export default SuccessPage;