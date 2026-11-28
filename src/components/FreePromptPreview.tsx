import { useState } from 'react';

interface FreePromptPreviewProps {
  productId: number;
  prompts: Array<{ id: number; title: string; preview: string }>;
}

export function FreePromptPreview({ productId, prompts }: FreePromptPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  const copyPrompt = (text: string, promptId: number) => {
    navigator.clipboard.writeText(text);
    setCopied(promptId);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 20px',
          borderRadius: 10,
          border: '1px solid rgba(0,255,136,.3)',
          background: 'rgba(0,255,136,.08)',
          color: '#00ff88',
          fontSize: 13,
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all .2s',
          marginBottom: 20,
        }}
        onMouseOver={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,255,136,.15)';
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,255,136,.5)';
        }}
        onMouseOut={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,255,136,.08)';
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,255,136,.3)';
        }}
      >
        <span style={{ fontSize: 16 }}>🎁</span>
        Try 3 Free Prompts →
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(145deg,rgba(18,18,36,.99),rgba(10,10,22,.99))',
              border: '1px solid rgba(0,255,136,.3)',
              borderRadius: 24,
              padding: 36,
              maxWidth: 560,
              width: '100%',
              boxShadow: '0 32px 80px rgba(0,0,0,.8)',
              animation: 'fadeInUp .35s cubic-bezier(.4,0,.2,1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 24,
              }}
            >
              <h2 style={{
                fontSize: 24,
                fontWeight: 800,
                color: '#ffffff',
                background: 'linear-gradient(135deg,#00ff88,#00d4ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Try 3 Free Prompts
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 24,
                  color: 'var(--clr-muted)',
                  cursor: 'pointer',
                  padding: 0,
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>

            <p style={{
              fontSize: 14,
              color: 'var(--clr-muted)',
              marginBottom: 28,
              lineHeight: 1.6,
            }}>
              Copy any prompt below and try it in your favorite AI. Full library unlocks {prompts.length * 100}+ more battle-tested prompts.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {prompts.map((prompt) => (
                <div key={prompt.id} style={{
                  background: 'rgba(255,255,255,.04)',
                  border: '1px solid var(--clr-border)',
                  borderRadius: 14,
                  padding: 16,
                  marginBottom: 8,
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}>
                    <span style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#ffffff',
                    }}>
                      {prompt.title}
                    </span>
                    <button
                      onClick={() => copyPrompt(prompt.preview, prompt.id)}
                      disabled={copied === prompt.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '6px 12px',
                        borderRadius: 8,
                        border: `1px solid ${copied === prompt.id ? 'rgba(0,255,136,.3)' : 'rgba(0,255,136,.3)'}`,
                        background: copied === prompt.id ? 'rgba(0,255,136,.15)' : 'transparent',
                        color: copied === prompt.id ? '#00ff88' : '#c0c0d8',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: copied === prompt.id ? 'default' : 'pointer',
                        transition: 'all .2s',
                      }}
                    >
                      {copied === prompt.id ? '✓ Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p style={{
                    fontSize: 13,
                    color: 'var(--clr-muted)',
                    lineHeight: 1.7,
                    whiteSpace: 'pre-wrap',
                    fontFamily: "'Inter', system-ui, sans-serif",
                  }}>
                    {prompt.preview}
                  </p>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 24,
              paddingTop: 20,
              borderTop: '1px solid var(--clr-border)',
              textAlign: 'center',
            }}>
              <p style={{
                fontSize: 12,
                color: 'var(--clr-faint)',
                marginBottom: 16,
              }}>
                Loved these? The full book has {prompts.length * 100}+ more prompts like these.
              </p>
              <button
                onClick={() => {
                  setIsOpen(false);
                  window.location.hash = `#checkout/${productId}`;
                }}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  border: 'none',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg,#00ff88,#00cc6a)',
                  color: '#030a05',
                  fontSize: 15,
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 6px 28px rgba(0,255,136,.35)',
                  transition: 'all .2s',
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 36px rgba(0,255,136,.45)';
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 28px rgba(0,255,136,.35)';
                }}
              >
                Unlock Full Library →
              </button>
            </div>

            <style>{`
              @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
          </div>
        </div>
      )}
    </>
  );
}

export default FreePromptPreview;