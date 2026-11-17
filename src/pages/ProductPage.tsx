import { useEffect, useState } from 'react';
import CONFIG from '../config.js';
import { formatPrice } from '../utils.js';

interface ProductPageProps { productId: string; }

const starStr = (n: number) => '★'.repeat(Math.floor(n)) + '☆'.repeat(5-Math.floor(n));

const SAMPLE_REVIEWS: Record<number, any[]> = {
  1: [
    { id:1, name:'Sarah M.',  rating:5, title:'Game changer for entrepreneurs', comment:'The business strategy prompts alone saved me 10+ hours of planning. Worth every penny.', date:'2024-01-15', helpful:47, verified:true },
    { id:2, name:'James K.',  rating:5, title:'Incredible ROI',                  comment:'Used the sales prompts to craft a proposal that landed a $40k client. Best $30 I ever spent.', date:'2024-01-10', helpful:39, verified:true },
    { id:3, name:'Omar S.',   rating:4, title:'Solid investment',                 comment:'Some prompts are more relevant than others but the majority are gold. Highly recommend.', date:'2024-01-05', helpful:24, verified:false },
  ],
  2: [
    { id:4, name:'Emma R.',   rating:5, title:'Got promoted within 3 months',     comment:'The performance review prompts helped me articulate my value in ways I never had before.', date:'2024-01-12', helpful:52, verified:true },
    { id:5, name:'David L.',  rating:5, title:'Executive communication leveled up', comment:'My manager literally commented on how much more strategic my communication has become.', date:'2024-01-08', helpful:31, verified:true },
  ],
  3: [
    { id:6, name:'Fatima A.', rating:5, title:'GPA went from 3.2 to 3.8',         comment:'The research and essay prompts are incredible. My professors keep asking how I improved.', date:'2024-01-14', helpful:41, verified:true },
    { id:7, name:'Alex C.',   rating:5, title:'Saved my thesis',                   comment:'Stuck on my dissertation for weeks. These prompts helped me break through and finish.', date:'2024-01-09', helpful:28, verified:true },
  ],
  4: [
    { id:8, name:'Maria G.',  rating:5, title:'Parenting transformed',              comment:'Meal planning used to take my entire Sunday. Now it takes 10 minutes. Life-changing.', date:'2024-01-11', helpful:36, verified:true },
    { id:9, name:'Ben T.',    rating:4, title:'Very helpful overall',               comment:'Some prompts are very US-specific but most work universally. Great product.', date:'2024-01-06', helpful:19, verified:false },
  ],
  5: [
    { id:10, name:'Priya S.', rating:5, title:'My home finally feels organized',    comment:'The decluttering and budgeting prompts helped me save $400/month and clear years of clutter.', date:'2024-01-13', helpful:33, verified:true },
    { id:11, name:'Liam W.',  rating:5, title:'Best lifestyle investment',           comment:'The self-care section alone is worth 5x the price. Comprehensive and actionable.', date:'2024-01-07', helpful:21, verified:true },
  ],
};

const ProductPage = ({ productId }: ProductPageProps) => {
  const [tab, setTab]         = useState<'features'|'benefits'>('features');
  const product = CONFIG.getProductById(productId);

  useEffect(() => {
    window.scrollTo({ top:0, behavior:'auto' });
  }, [productId]);

  if (!product) return (
    <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16,background:'var(--clr-bg)' }}>
      <div style={{ fontSize:40 }}>📚</div>
      <p style={{ color:'var(--clr-muted)' }}>Product not found</p>
      <a href="#home" className="btn btn-outline">← Back to Shop</a>
    </div>
  );

  const reviews = SAMPLE_REVIEWS[product.id] || [];
  const related = CONFIG.products.filter((p:any) => p.id !== product.id).slice(0,3);

  return (
    <div style={{ minHeight:'100vh',background:'var(--clr-bg)',color:'var(--clr-text)' }}>
      {/* Header */}
      <header className="site-header">
        <div className="container">
          <div className="header-inner">
            <a href="#home" className="logo-wrap">
              <img src="/logo.webp" alt="CogniBooks" className="logo-img" loading="lazy" />
              <span className="logo-name">CogniBooks</span>
            </a>
            <a href="#home" className="btn btn-ghost" style={{ padding:'8px 14px',fontSize:14 }}>← Back to Shop</a>
          </div>
        </div>
      </header>

      {/* Product hero */}
      <section style={{ padding:'60px 0 72px',position:'relative',zIndex:1 }}>
        <div className="container">
          <div className="detail-grid">
            {/* Cover */}
            <div>
              <img src={product.cover} alt={product.title} className="detail-img" loading="lazy" />
              <div style={{ display:'flex',gap:10,marginTop:18 }}>
                {[{val:product.pages,lbl:'Pages',clr:'var(--clr-primary)'},{val:product.format,lbl:'Format',clr:'var(--clr-secondary)'},{val:'∞',lbl:'Access',clr:'var(--clr-accent)'}].map(s=>(
                  <div key={s.lbl} className="glass" style={{ flex:1,padding:'12px 10px',textAlign:'center',borderRadius:10 }}>
                    <div style={{ fontSize:18,fontWeight:800,color:s.clr,fontFamily:"'Space Grotesk',sans-serif" }}>{s.val}</div>
                    <div style={{ fontSize:11,color:'var(--clr-muted)' }}>{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div>
              {product.bestseller && <div className="badge badge-hot" style={{ marginBottom:13 }}>⭐ BESTSELLER</div>}
              <div style={{ fontSize:13,color:'var(--clr-muted)',marginBottom:7 }}>{product.category} · For {product.audience}</div>
              <h1 style={{ fontSize:'clamp(24px,3.6vw,38px)',marginBottom:10 }}>{product.title}</h1>
              <p style={{ fontSize:16,color:'var(--clr-muted)',marginBottom:20,lineHeight:1.6 }}>{product.subtitle}</p>

              <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:20 }}>
                <span className="stars" style={{ fontSize:20 }}>{starStr(product.rating)}</span>
                <span style={{ fontSize:15,color:'var(--clr-muted)' }}>{product.rating} ({product.reviewCount} reviews)</span>
              </div>

              <div style={{ display:'flex',alignItems:'baseline',gap:12,marginBottom:20,flexWrap:'wrap' }}>
                <span style={{ fontSize:46,fontWeight:900,color:'var(--clr-primary)',fontFamily:"'Space Grotesk',sans-serif",lineHeight:1,letterSpacing:'-0.03em' }}>
                  {formatPrice(product.price)}
                </span>
                <span style={{ fontSize:20,color:'var(--clr-faint)',textDecoration:'line-through' }}>{formatPrice(product.originalPrice)}</span>
                <span className="price-save" style={{ fontSize:13,padding:'4px 10px' }}>SAVE {product.discount}%</span>
              </div>

              {product.stock < 10 && <div className="stock-warn" style={{ marginBottom:18 }}>⚠️ Only {product.stock} copies left at this price!</div>}

              <p style={{ fontSize:15,lineHeight:1.8,color:'var(--clr-muted)',marginBottom:22 }}>{product.description}</p>

              {/* Tabs */}
              <div style={{ marginBottom:22 }}>
                <div className="tab-btns">
                  <button className={`tab-btn${tab==='features'?' active':''}`} onClick={()=>setTab('features')}>📚 What's Inside</button>
                  <button className={`tab-btn${tab==='benefits'?' active':''}`} onClick={()=>setTab('benefits')}>✨ Benefits</button>
                </div>
                <div className="glass" style={{ padding:18 }}>
                  <ul className="feat-list">
                    {(tab==='features'?product.features:product.benefits).map((item:string,i:number)=>(
                      <li key={i}><span className="feat-icon">{tab==='features'?'✓':'🚀'}</span>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <a href={`#checkout/${product.id}`} className="btn btn-primary btn-lg"
                style={{ width:'100%',marginBottom:14,boxShadow:'0 6px 28px rgba(0,255,136,.35)' }}>
                🛒 Buy Now — {formatPrice(product.price)}
              </a>

              <div style={{ display:'flex',justifyContent:'space-around',fontSize:12,color:'var(--clr-muted)',flexWrap:'wrap',gap:8 }}>
                {CONFIG.trustBadges.map((b:any,i:number)=>(
                  <div key={i} style={{ textAlign:'center' }}>
                    <div style={{ fontSize:17,marginBottom:3 }}>{b.icon}</div>
                    <div>{b.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* Reviews */}
      <section style={{ padding:'60px 0 72px',position:'relative',zIndex:1 }}>
        <div className="container">
          <h2 className="gradient-text" style={{ fontSize:30,fontWeight:800,marginBottom:32,letterSpacing:'-0.02em' }}>
            Customer Reviews ({product.reviewCount})
          </h2>
          <div className="reviews-grid">
            {reviews.map((r:any)=>(
              <div key={r.id} className="review-card">
                <div style={{ display:'flex',justifyContent:'space-between',marginBottom:9 }}>
                  <span className="stars" style={{ fontSize:14 }}>{starStr(r.rating)}</span>
                  {r.verified && <span className="badge badge-success">✓ Verified</span>}
                </div>
                <h4 style={{ fontSize:15,fontWeight:700,marginBottom:7 }}>{r.title}</h4>
                <p style={{ fontSize:13,color:'var(--clr-muted)',lineHeight:1.7,marginBottom:13 }}>"{r.comment}"</p>
                <div style={{ display:'flex',justifyContent:'space-between',fontSize:12 }}>
                  <strong>{r.name}</strong>
                  <span style={{ color:'var(--clr-faint)' }}>👍 {r.helpful}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* Related */}
      <section style={{ padding:'44px 0 72px',position:'relative',zIndex:1 }}>
        <div className="container">
          <h2 style={{ fontSize:22,fontWeight:800,marginBottom:24 }}>You May Also Like</h2>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:18 }}>
            {related.map((p:any)=>(
              <a key={p.id} href={`#product/${p.id}`} style={{ display:'block' }}>
                <div className="glass" style={{ padding:18,borderRadius:'var(--radius-lg)',transition:'all var(--transition)',cursor:'pointer' }}>
                  <img src={p.cover} alt={p.title} style={{ width:'100%',height:190,objectFit:'cover',borderRadius:10,marginBottom:12 }} loading="lazy" />
                  <h3 style={{ fontSize:14,fontWeight:700,marginBottom:7,color:'var(--clr-text)' }}>{p.title}</h3>
                  <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                    <span style={{ fontSize:17,fontWeight:800,color:'var(--clr-primary)',fontFamily:"'Space Grotesk',sans-serif" }}>{formatPrice(p.price)}</span>
                    <span className="stars" style={{ fontSize:12 }}>{starStr(p.rating)}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
