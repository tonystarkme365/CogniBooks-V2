import { useState } from 'react';
import CONFIG from '../config.js';
import { formatPrice } from '../utils.js';

const AdminPage = () => {
  const [auth, setAuth]         = useState(false);
  const [creds, setCreds]       = useState({ user:'', pass:'' });
  const [error, setError]       = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (creds.user === CONFIG.admin.username && creds.pass === CONFIG.admin.password) {
      setAuth(true); setError('');
    } else { setError('Invalid credentials'); }
  };

  if (!auth) return (
    <div style={{ minHeight:'100vh',background:'var(--clr-bg)',display:'flex',alignItems:'center',justifyContent:'center',padding:20 }}>
      <div className="glass" style={{ maxWidth:400,width:'100%',padding:40 }}>
        <h2 className="gradient-text" style={{ fontSize:24,fontWeight:800,marginBottom:24,textAlign:'center' }}>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="form-input" type="text" value={creds.user} onChange={e=>setCreds({...creds,user:e.target.value})} />
          </div>
          <div className="form-group" style={{ marginBottom:22 }}>
            <label className="form-label">Password</label>
            <input className="form-input" type="password" value={creds.pass} onChange={e=>setCreds({...creds,pass:e.target.value})} />
          </div>
          {error && <p style={{ color:'var(--clr-danger)',fontSize:13,marginBottom:14 }}>{error}</p>}
          <button type="submit" className="btn btn-primary" style={{ width:'100%' }}>Login</button>
        </form>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh',background:'var(--clr-bg)',color:'var(--clr-text)',padding:'40px 0' }}>
      <div className="container">
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:36 }}>
          <h1 className="gradient-text" style={{ fontSize:32,fontWeight:900 }}>Admin Dashboard</h1>
          <a href="#home" className="btn btn-ghost" style={{ fontSize:14 }}>← Back to Store</a>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ maxWidth:'100%',marginBottom:36 }}>
          <div className="stat-card"><div className="stat-val gradient-text">2,847</div><div className="stat-lbl">Total Sales</div></div>
          <div className="stat-card"><div className="stat-val gradient-text">$71,210</div><div className="stat-lbl">Total Revenue</div></div>
          <div className="stat-card"><div className="stat-val gradient-text">14,391</div><div className="stat-lbl">Page Views</div></div>
          <div className="stat-card"><div className="stat-val gradient-text">4.86</div><div className="stat-lbl">Avg Rating</div></div>
        </div>

        {/* Products table */}
        <div className="glass" style={{ padding:24 }}>
          <h3 style={{ fontSize:18,fontWeight:700,marginBottom:20 }}>Product Catalog</h3>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%',borderCollapse:'collapse',fontSize:14 }}>
              <thead>
                <tr style={{ borderBottom:'1px solid var(--clr-border)' }}>
                  {['Product','Category','Price','Stock','Rating'].map(h=>(
                    <th key={h} style={{ padding:'10px 14px',textAlign:'left',color:'var(--clr-muted)',fontWeight:600,whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CONFIG.products.map((p:any)=>(
                  <tr key={p.id} style={{ borderBottom:'1px solid var(--clr-border)' }}>
                    <td style={{ padding:'12px 14px',fontWeight:600 }}>{p.title}</td>
                    <td style={{ padding:'12px 14px',color:'var(--clr-muted)' }}>{p.category}</td>
                    <td style={{ padding:'12px 14px',color:'var(--clr-primary)',fontWeight:700 }}>{formatPrice(p.price)}</td>
                    <td style={{ padding:'12px 14px',color:p.stock<10?'var(--clr-warn)':'var(--clr-muted)' }}>{p.stock}</td>
                    <td style={{ padding:'12px 14px' }}>{'★'.repeat(Math.floor(p.rating))}{p.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
