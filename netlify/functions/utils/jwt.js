import crypto from 'crypto';

const SECRET = process.env.JWT_SECRET || 'cognibooks-dev-secret-change-in-production-32chars';
const TOKEN_STORE = new Map();

function base64urlEncode(str) {
  return Buffer.from(str).toString('base64')
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64urlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = str.length % 4;
  if (pad) str += '='.repeat(4 - pad);
  return Buffer.from(str, 'base64').toString();
}

function parseDuration(str) {
  const match = str.match(/^(\d+)([smhd])$/);
  if (!match) return 900;
  const value = parseInt(match[1]);
  const unit = { s: 1, m: 60, h: 3600, d: 86400 }[match[2]];
  return value * unit;
}

export function signJWT(payload, expiresIn = '15m', singleUse = false) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const exp = now + parseDuration(expiresIn);
  const jti = crypto.randomUUID();
  
  const claims = { ...payload, iat: now, exp, jti };
  if (singleUse) claims.singleUse = true;
  
  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedClaims = base64urlEncode(JSON.stringify(claims));
  const signature = crypto.createHmac('sha256', SECRET)
    .update(`${encodedHeader}.${encodedClaims}`)
    .digest('base64');
  const encodedSig = base64urlEncode(signature);
  
  const token = `${encodedHeader}.${encodedClaims}.${encodedSig}`;
  
  if (singleUse) {
    TOKEN_STORE.set(jti, { used: false, exp });
    // Cleanup expired tokens periodically
    if (TOKEN_STORE.size > 10000) {
      const nowSec = Math.floor(Date.now() / 1000);
      for (const [key, val] of TOKEN_STORE.entries()) {
        if (val.exp < nowSec) TOKEN_STORE.delete(key);
      }
    }
  }
  
  return token;
}

export function verifyJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [header, claims, signature] = parts;
    const expectedSig = base64urlEncode(
      crypto.createHmac('sha256', SECRET)
        .update(`${header}.${claims}`)
        .digest('base64')
    );
    
    if (signature !== expectedSig) return null;
    
    const payload = JSON.parse(base64urlDecode(claims));
    
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (payload.singleUse) {
      const entry = TOKEN_STORE.get(payload.jti);
      if (!entry || entry.used) return null;
    }
    
    return payload;
  } catch {
    return null;
  }
}

export function invalidateToken(jti) {
  const entry = TOKEN_STORE.get(jti);
  if (entry) entry.used = true;
}

export function isTokenValid(jti) {
  const entry = TOKEN_STORE.get(jti);
  return entry && !entry.used && entry.exp > Math.floor(Date.now() / 1000);
}