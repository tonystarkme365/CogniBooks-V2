import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const JWT_SECRET = process.env.JWT_SECRET || 'cognibooks-dev-secret-change-in-production-32chars';
const WALLET_ADDRESS = process.env.WALLET_ADDRESS || '0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOKEN_STORE = new Map();

const PRODUCTS = [
  { id: 1, title: 'AI Arsenal for Entrepreneurs', pdfPath: 'AI Arsenal for Entrepreneurs.pdf', price: 29.99 },
  { id: 2, title: 'Promotion-Ready with AI Prompts', pdfPath: 'Promotion-Ready With AI Prompts.pdf', price: 27.99 },
  { id: 3, title: 'The P.A.C.E Academic Writing Toolkit', pdfPath: 'The P.A.C.E Academic Writing Toolkit.pdf', price: 24.99 },
  { id: 4, title: 'The Invisible Assistant', pdfPath: 'The Invisible Assistant.pdf', price: 24.99 },
  { id: 5, title: 'The Sovereign Sanctuary', pdfPath: 'The Sovereign Sanctuary.pdf', price: 24.99 },
];

const JWT_SECRET = process.env.JWT_SECRET || 'cognibooks-dev-secret-change-in-production-32chars';

const TOKEN_STORE = new Map();

function base64urlEncode(str) {
  return Buffer.from(str).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
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

function signJWT(payload, expiresIn = '15m', singleUse = false) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const exp = now + parseDuration(expiresIn);
  const jti = crypto.randomUUID();
  
  const claims = { ...payload, iat: now, exp, jti };
  if (singleUse) claims.singleUse = true;
  
  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedClaims = base64urlEncode(JSON.stringify(claims));
  const signature = crypto.createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedClaims}`)
    .digest('base64');
  const encodedSig = base64urlEncode(signature);
  
  const token = `${encodedHeader}.${encodedClaims}.${encodedSig}`;
  
  if (singleUse) {
    TOKEN_STORE.set(jti, { used: false, exp });
    if (TOKEN_STORE.size > 10000) {
      const nowSec = Math.floor(Date.now() / 1000);
      for (const [key, val] of TOKEN_STORE.entries()) {
        if (val.exp < nowSec) TOKEN_STORE.delete(key);
      }
    }
  }
  
  return token;
}

function verifyJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [header, claims, signature] = parts;
    const expectedSig = base64urlEncode(
      crypto.createHmac('sha256', JWT_SECRET)
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

function invalidateToken(jti) {
  const entry = TOKEN_STORE.get(jti);
  if (entry) entry.used = true;
}

function isTokenValid(jti) {
  const entry = TOKEN_STORE.get(jti);
  return entry && !entry.used && entry.exp > Math.floor(Date.now() / 1000);
}

const PRODUCTS = [
  { id: 1, title: 'AI Arsenal for Entrepreneurs', pdfPath: 'AI Arsenal for Entrepreneurs.pdf', price: 29.99 },
  { id: 2, title: 'Promotion-Ready with AI Prompts', pdfPath: 'Promotion-Ready With AI Prompts.pdf', price: 27.99 },
  { id: 3, title: 'The P.A.C.E Academic Writing Toolkit', pdfPath: 'The P.A.C.E Academic Writing Toolkit.pdf', price: 24.99 },
  { id: 4, title: 'The Invisible Assistant', pdfPath: 'The Invisible Assistant.pdf', price: 24.99 },
  { id: 5, title: 'The Sovereign Sanctuary', pdfPath: 'The Sovereign Sanctuary.pdf', price: 24.99 },
];

function getProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}

function getPDFBuffer(filename) {
  const safeName = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '');
  const filePath = path.join(process.cwd(), 'netlify', 'pdfs', safeName);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath);
}

function pdfExists(filename) {
  const safeName = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '');
  const filePath = path.join(process.cwd(), 'netlify', 'pdfs', safeName);
  return fs.existsSync(filePath);
}

const TOKEN_STORE = new Map();

function invalidateToken(jti) {
  const entry = TOKEN_STORE.get(jti);
  if (entry) entry.used = true;
}

function isTokenValid(jti) {
  const entry = TOKEN_STORE.get(jti);
  return entry && !entry.used && entry.exp > Math.floor(Date.now() / 1000);
}

const JWT_SECRET = process.env.JWT_SECRET || 'cognibooks-dev-secret-change-in-production-32chars';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function base64urlEncode(str) {
  return Buffer.from(str).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
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

function signJWT(payload, expiresIn = '15m', singleUse = false) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const exp = now + parseDuration(expiresIn);
  const jti = crypto.randomUUID();
  
  const claims = { ...payload, iat: now, exp, jti };
  if (singleUse) claims.singleUse = true;
  
  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedClaims = base64urlEncode(JSON.stringify(claims));
  const signature = crypto.createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedClaims}`)
    .digest('base64');
  const encodedSig = base64urlEncode(signature);
  
  const token = `${encodedHeader}.${encodedClaims}.${encodedSig}`;
  
  if (singleUse) {
    TOKEN_STORE.set(jti, { used: false, exp });
    if (TOKEN_STORE.size > 10000) {
      const nowSec = Math.floor(Date.now() / 1000);
      for (const [key, val] of TOKEN_STORE.entries()) {
        if (val.exp < nowSec) TOKEN_STORE.delete(key);
      }
    }
  }
  
  return token;
}

function verifyJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [header, claims, signature] = parts;
    const expectedSig = base64urlEncode(
      crypto.createHmac('sha256', JWT_SECRET)
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

function invalidateToken(jti) {
  const entry = TOKEN_STORE.get(jti);
  if (entry) entry.used = true;
}

function isTokenValid(jti) {
  const entry = TOKEN_STORE.get(jti);
  return entry && !entry.used && entry.exp > Math.floor(Date.now() / 1000);
}

const PRODUCTS = [
  { id: 1, title: 'AI Arsenal for Entrepreneurs', pdfPath: 'AI Arsenal for Entrepreneurs.pdf', price: 29.99 },
  { id: 2, title: 'Promotion-Ready with AI Prompts', pdfPath: 'Promotion-Ready With AI Prompts.pdf', price: 27.99 },
  { id: 3, title: 'The P.A.C.E Academic Writing Toolkit', pdfPath: 'The P.A.C.E Academic Writing Toolkit.pdf', price: 24.99 },
  { id: 4, title: 'The Invisible Assistant', pdfPath: 'The Invisible Assistant.pdf', price: 24.99 },
  { id: 5, title: 'The Sovereign Sanctuary', pdfPath: 'The Sovereign Sanctuary.pdf', price: 24.99 },
];

function getProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}

function getPDFBuffer(filename) {
  const safeName = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '');
  const filePath = path.join(process.cwd(), 'netlify', 'pdfs', safeName);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath);
}

function pdfExists(filename) {
  const safeName = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '');
  const filePath = path.join(process.cwd(), 'netlify', 'pdfs', safeName);
  return fs.existsSync(filePath);
}

const TOKEN_STORE = new Map();

function invalidateToken(jti) {
  const entry = TOKEN_STORE.get(jti);
  if (entry) entry.used = true;
}

function isTokenValid(jti) {
  const entry = TOKEN_STORE.get(jti);
  return entry && !entry.used && entry.exp > Math.floor(Date.now() / 1000);
}

const JWT_SECRET = process.env.JWT_SECRET || 'cognibooks-dev-secret-change-in-production-32chars';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function base64urlEncode(str) {
  return Buffer.from(str).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
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

function signJWT(payload, expiresIn = '15m', singleUse = false) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const exp = now + parseDuration(expiresIn);
  const jti = crypto.randomUUID();
  
  const claims = { ...payload, iat: now, exp, jti };
  if (singleUse) claims.singleUse = true;
  
  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedClaims = base64urlEncode(JSON.stringify(claims));
  const signature = crypto.createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedClaims}`)
    .digest('base64');
  const encodedSig = base64urlEncode(signature);
  
  const token = `${encodedHeader}.${encodedClaims}.${encodedSig}`;
  
  if (singleUse) {
    TOKEN_STORE.set(jti, { used: false, exp });
    if (TOKEN_STORE.size > 10000) {
      const nowSec = Math.floor(Date.now() / 1000);
      for (const [key, val] of TOKEN_STORE.entries()) {
        if (val.exp < nowSec) TOKEN_STORE.delete(key);
      }
    }
  }
  
  return token;
}

function verifyJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [header, claims, signature] = parts;
    const expectedSig = base64urlEncode(
      crypto.createHmac('sha256', JWT_SECRET)
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

function invalidateToken(jti) {
  const entry = TOKEN_STORE.get(jti);
  if (entry) entry.used = true;
}

function isTokenValid(jti) {
  const entry = TOKEN_STORE.get(jti);
  return entry && !entry.used && entry.exp > Math.floor(Date.now() / 1000);
}

const PRODUCTS = [
  { id: 1, title: 'AI Arsenal for Entrepreneurs', pdfPath: 'AI Arsenal for Entrepreneurs.pdf', price: 29.99 },
  { id: 2, title: 'Promotion-Ready with AI Prompts', pdfPath: 'Promotion-Ready With AI Prompts.pdf', price: 27.99 },
  { id: 3, title: 'The P.A.C.E Academic Writing Toolkit', pdfPath: 'The P.A.C.E Academic Writing Toolkit.pdf', price: 24.99 },
  { id: 4, title: 'The Invisible Assistant', pdfPath: 'The Invisible Assistant.pdf', price: 24.99 },
  { id: 5, title: 'The Sovereign Sanctuary', pdfPath: 'The Sovereign Sanctuary.pdf', price: 24.99 },
];

function getProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}

function getPDFBuffer(filename) {
  const safeName = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '');
  const filePath = path.join(process.cwd(), 'netlify', 'pdfs', safeName);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath);
}

function pdfExists(filename) {
  const safeName = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '');
  const filePath = path.join(process.cwd(), 'netlify', 'pdfs', safeName);
  return fs.existsSync(filePath);
}

const TOKEN_STORE = new Map();

function invalidateToken(jti) {
  const entry = TOKEN_STORE.get(jti);
  if (entry) entry.used = true;
}

function isTokenValid(jti) {
  const entry = TOKEN_STORE.get(jti);
  return entry && !entry.used && entry.exp > Math.floor(Date.now() / 1000);
}

const JWT_SECRET = process.env.JWT_SECRET || 'cognibooks-dev-secret-change-in-production-32chars';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function base64urlEncode(str) {
  return Buffer.from(str).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
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

function signJWT(payload, expiresIn = '15m', singleUse = false) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const exp = now + parseDuration(expiresIn);
  const jti = crypto.randomUUID();
  
  const claims = { ...payload, iat: now, exp, jti };
  if (singleUse) claims.singleUse = true;
  
  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedClaims = base64urlEncode(JSON.stringify(claims));
  const signature = crypto.createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedClaims}`)
    .digest('base64');
  const encodedSig = base64urlEncode(signature);
  
  const token = `${encodedHeader}.${encodedClaims}.${encodedSig}`;
  
  if (singleUse) {
    TOKEN_STORE.set(jti, { used: false, exp });
    if (TOKEN_STORE.size > 10000) {
      const nowSec = Math.floor(Date.now() / 1000);
      for (const [key, val] of TOKEN_STORE.entries()) {
        if (val.exp < nowSec) TOKEN_STORE.delete(key);
      }
    }
  }
  
  return token;
}

function verifyJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [header, claims, signature] = parts;
    const expectedSig = base64urlEncode(
      crypto.createHmac('sha256', JWT_SECRET)
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

function invalidateToken(jti) {
  const entry = TOKEN_STORE.get(jti);
  if (entry) entry.used = true;
}

function isTokenValid(jti) {
  const entry = TOKEN_STORE.get(jti);
  return entry && !entry.used && entry.exp > Math.floor(Date.now() / 1000);
}

const PRODUCTS = [
  { id: 1, title: 'AI Arsenal for Entrepreneurs', pdfPath: 'AI Arsenal for Entrepreneurs.pdf', price: 29.99 },
  { id: 2, title: 'Promotion-Ready with AI Prompts', pdfPath: 'Promotion-Ready With AI Prompts.pdf', price: 27.99 },
  { id: 3, title: 'The P.A.C.E Academic Writing Toolkit', pdfPath: 'The P.A.C.E Academic Writing Toolkit.pdf', price: 24.99 },
  { id: 4, title: 'The Invisible Assistant', pdfPath: 'The Invisible Assistant.pdf', price: 24.99 },
  { id: 5, title: 'The Sovereign Sanctuary', pdfPath: 'The Sovereign Sanctuary.pdf', price: 24.99 },
];

function getProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}

function getPDFBuffer(filename) {
  const safeName = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '');
  const filePath = path.join(process.cwd(), 'netlify', 'pdfs', safeName);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath);
}

function pdfExists(filename) {
  const safeName = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '');
  const filePath = path.join(process.cwd(), 'netlify', 'pdfs', safeName);
  return fs.existsSync(filePath);
}

const TOKEN_STORE = new Map();

function invalidateToken(jti) {
  const entry = TOKEN_STORE.get(jti);
  if (entry) entry.used = true;
}

function isTokenValid(jti) {
  const entry = TOKEN_STORE.get(jti);
  return entry && !entry.used && entry.exp > Math.floor(Date.now() / 1000);
}

export async function handler(event) {
  const { token } = event.queryStringParameters || {};

  if (!token) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Missing download token' }),
    };
  }

  const payload = verifyJWT(token);
  if (!payload) {
    return {
      statusCode: 403,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid or expired download token' }),
    };
  }

  if (payload.singleUse) {
    const entry = TOKEN_STORE.get(payload.jti);
    if (entry?.used) {
      return {
        statusCode: 403,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Download token already used' }),
      };
    }
  }

  const product = getProduct(payload.productId);
  if (!product) {
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Product not found' }),
    };
  }

  if (!pdfExists(product.pdfPath)) {
    console.error(`PDF not found: ${product.pdfPath}`);
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'PDF file not found on server' }),
    };
  }

  if (payload.singleUse && payload.jti) {
    invalidateToken(payload.jti);
  }

  const pdfBuffer = getPDFBuffer(product.pdfPath);
  if (!pdfBuffer) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to read PDF file' }),
    };
  }

  const filename = `${product.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdfBuffer.length.toString(),
      'Cache-Control': 'no-store, must-revalidate, private',
      'X-Content-Type-Options': 'nosniff',
    },
    body: pdfBuffer.toString('base64'),
    isBase64Encoded: true,
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'cognibooks-dev-secret-change-in-production-32chars';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOKEN_STORE = new Map();

function base64urlEncode(str) {
  return Buffer.from(str).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
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

function signJWT(payload, expiresIn = '15m', singleUse = false) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const exp = now + parseDuration(expiresIn);
  const jti = crypto.randomUUID();
  
  const claims = { ...payload, iat: now, exp, jti };
  if (singleUse) claims.singleUse = true;
  
  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedClaims = base64urlEncode(JSON.stringify(claims));
  const signature = crypto.createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedClaims}`)
    .digest('base64');
  const encodedSig = base64urlEncode(signature);
  
  const token = `${encodedHeader}.${encodedClaims}.${encodedSig}`;
  
  if (singleUse) {
    TOKEN_STORE.set(jti, { used: false, exp });
    if (TOKEN_STORE.size > 10000) {
      const nowSec = Math.floor(Date.now() / 1000);
      for (const [key, val] of TOKEN_STORE.entries()) {
        if (val.exp < nowSec) TOKEN_STORE.delete(key);
      }
    }
  }
  
  return token;
}

function verifyJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [header, claims, signature] = parts;
    const expectedSig = base64urlEncode(
      crypto.createHmac('sha256', JWT_SECRET)
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

function invalidateToken(jti) {
  const entry = TOKEN_STORE.get(jti);
  if (entry) entry.used = true;
}

function isTokenValid(jti) {
  const entry = TOKEN_STORE.get(jti);
  return entry && !entry.used && entry.exp > Math.floor(Date.now() / 1000);
}

const PRODUCTS = [
  { id: 1, title: 'AI Arsenal for Entrepreneurs', pdfPath: 'AI Arsenal for Entrepreneurs.pdf', price: 29.99 },
  { id: 2, title: 'Promotion-Ready with AI Prompts', pdfPath: 'Promotion-Ready With AI Prompts.pdf', price: 27.99 },
  { id: 3, title: 'The P.A.C.E Academic Writing Toolkit', pdfPath: 'The P.A.C.E Academic Writing Toolkit.pdf', price: 24.99 },
  { id: 4, title: 'The Invisible Assistant', pdfPath: 'The Invisible Assistant.pdf', price: 24.99 },
  { id: 5, title: 'The Sovereign Sanctuary', pdfPath: 'The Sovereign Sanctuary.pdf', price: 24.99 },
];

function getProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}

function getPDFBuffer(filename) {
  const safeName = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '');
  const filePath = path.join(process.cwd(), 'netlify', 'pdfs', safeName);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath);
}

function pdfExists(filename) {
  const safeName = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '');
  const filePath = path.join(process.cwd(), 'netlify', 'pdfs', safeName);
  return fs.existsSync(filePath);
}

const TOKEN_STORE = new Map();

function invalidateToken(jti) {
  const entry = TOKEN_STORE.get(jti);
  if (entry) entry.used = true;
}

function isTokenValid(jti) {
  const entry = TOKEN_STORE.get(jti);
  return entry && !entry.used && entry.exp > Math.floor(Date.now() / 1000);
}

export async function handler(event) {
  const { token } = event.queryStringParameters || {};

  if (!token) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Missing download token' }),
    };
  }

  const payload = verifyJWT(token);
  if (!payload) {
    return {
      statusCode: 403,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid or expired download token' }),
    };
  }

  if (payload.singleUse) {
    const entry = TOKEN_STORE.get(payload.jti);
    if (entry?.used) {
      return {
        statusCode: 403,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Download token already used' }),
      };
    }
  }

  const product = getProduct(payload.productId);
  if (!product) {
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Product not found' }),
    };
  }

  if (!pdfExists(product.pdfPath)) {
    console.error(`PDF not found: ${product.pdfPath}`);
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'PDF file not found on server' }),
    };
  }

  if (payload.singleUse && payload.jti) {
    invalidateToken(payload.jti);
  }

  const pdfBuffer = getPDFBuffer(product.pdfPath);
  if (!pdfBuffer) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to read PDF file' }),
    };
  }

  const filename = `${product.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdfBuffer.length.toString(),
      'Cache-Control': 'no-store, must-revalidate, private',
      'X-Content-Type-Options': 'nosniff',
    },
    body: pdfBuffer.toString('base64'),
    isBase64Encoded: true,
  };
}