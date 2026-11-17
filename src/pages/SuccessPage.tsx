import { useEffect } from 'react';
import CONFIG from '../config.js';

const SuccessPage = () => {
  useEffect(() => {
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
  }, []);

  return (
    <div style={{ minHeight:'100vh',background:'var(--clr-bg)',color:'var(--clr-text)',display:'flex',alignItems:'center',justifyContent:'center',padding:24 }}>
      <div className="glass-strong" style={{ maxWidth:560,width:'100%',padding:'56px 40px',textAlign:'center',boxShadow:'0 0 60px rgba(0,255,136,.14)' }}>
        <div style={{ fontSize:72,marginBottom:18,display:'block',animation:'float 3s ease-in-out infinite' }}>🎉</div>
        <h1 className="gradient-text" style={{ fontSize:42,fontWeight:900,marginBottom:16,letterSpacing:'-0.03em' }}>Purchase Complete!</h1>
        <p style={{ fontSize:17,color:'var(--clr-muted)',marginBottom:28,lineHeight:1.7 }}>
          Thank you for your purchase! Your eBook is on its way to your inbox.
        </p>
        <div className="glass" style={{ padding:22,marginBottom:28,textAlign:'left' }}>
          <h3 style={{ fontSize:16,fontWeight:700,marginBottom:14,color:'var(--clr-primary)' }}>📧 What Happens Next?</h3>
          <ul style={{ listStyle:'none',padding:0,fontSize:14,lineHeight:2.2 }}>
            {[
              '✓ Check your inbox (and spam folder) for the download link',
              '✓ Your PDF is ready for instant access on any device',
              '✓ Save it offline — you own it forever',
              '✓ Need help? Email support@cognibooks.com'
            ].map((item,i)=>(
              <li key={i} style={{ color:'var(--clr-muted)',borderBottom:i<3?'1px solid var(--clr-border)':'none',paddingBottom:i<3?4:0 }}>{item}</li>
            ))}
          </ul>
        </div>
        <div style={{ display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',marginBottom:28 }}>
          <a href="#home" className="btn btn-primary" style={{ padding:'13px 28px' }}>Browse More eBooks</a>
          <a href="mailto:support@cognibooks.com" className="btn btn-ghost" style={{ padding:'13px 28px' }}>Contact Support</a>
        </div>
        <div className="glass" style={{ padding:18,background:'rgba(255,0,255,.04)',border:'1px solid rgba(255,0,255,.14)' }}>
          <div style={{ fontSize:13,fontWeight:700,color:'var(--clr-accent)',marginBottom:8 }}>🎁 Complete Your Collection</div>
          <p style={{ fontSize:13,color:'var(--clr-muted)',marginBottom:12 }}>Get the remaining {CONFIG.products.length-1} eBooks at a 40% bundle discount!</p>
          <a href="#home" className="btn btn-secondary" style={{ fontSize:13 }}>View Bundle →</a>
        </div>
      </div>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
    </div>
  );
};

export default SuccessPage;
