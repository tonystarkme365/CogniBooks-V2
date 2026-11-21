import crypto from 'crypto';

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  // Your Guarda Polygon wallet address
  WALLET_ADDRESS: process.env.WALLET_ADDRESS || '0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53',
  
  // Transak configuration
  TRANSAK: {
    WEBHOOK_SECRET: process.env.TRANSAK_WEBHOOK_SECRET || '',
    API_KEY: process.env.TRANSAK_API_KEY || '',
    WIDGET_URL: 'https://global.transak.com/',
    EXPECTED_CRYPTO: 'USDC',
    EXPECTED_NETWORK: 'polygon',
    EXPECTED_ADDRESS: process.env.WALLET_ADDRESS || '0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53',
  },
  
  // MoonPay configuration
  MOONPAY: {
    WEBHOOK_SECRET: process.env.MOONPAY_WEBHOOK_SECRET || '',
    API_KEY: process.env.MOONPAY_API_KEY || '',
    SECRET_KEY: process.env.MOONPAY_SECRET_KEY || '',
    WIDGET_URL: 'https://buy.moonpay.com/',
    EXPECTED_CRYPTO: 'usdc',
    EXPECTED_NETWORK: 'polygon',
    EXPECTED_ADDRESS: process.env.WALLET_ADDRESS || '0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53',
  },
  
  // Paybis configuration
  PAYBIS: {
    WEBHOOK_SECRET: process.env.PAYBIS_WEBHOOK_SECRET || '',
    API_KEY: process.env.PAYBIS_API_KEY || '',
    WIDGET_URL: 'https://paybis.com/',
    EXPECTED_CRYPTO: 'USDC',
    EXPECTED_NETWORK: 'polygon',
    EXPECTED_ADDRESS: process.env.WALLET_ADDRESS || '0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53',
  },
  
  // Onramper configuration
  ONRAMPER: {
    WEBHOOK_SECRET: process.env.ONRAMPER_WEBHOOK_SECRET || '',
    API_KEY: process.env.ONRAMPER_API_KEY || '',
    WIDGET_URL: 'https://widget.onramper.com/',
    EXPECTED_CRYPTO: 'USDC',
    EXPECTED_NETWORK: 'polygon',
    EXPECTED_ADDRESS: process.env.WALLET_ADDRESS || '0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53',
  },
  
  // Coinbase CDP configuration
  COINBASE: {
    API_KEY_NAME: process.env.CDP_API_KEY_NAME || '',
    API_KEY_PRIVATE_KEY: process.env.CDP_API_KEY_PRIVATE_KEY || '',
    PROJECT_ID: process.env.NEXT_PUBLIC_CDP_PROJECT_ID || '',
    WIDGET_URL: 'https://coinbase.com/',
    EXPECTED_CRYPTO: 'USDC',
    EXPECTED_NETWORK: 'polygon',
    EXPECTED_ADDRESS: process.env.WALLET_ADDRESS || '0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53',
  },
  
  // Ebook delivery
  EBOOK: {
    DOWNLOAD_BASE_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://cognibook.netlify.app',
    DOWNLOAD_EXPIRY_HOURS: 24,
    MAX_DOWNLOADS: 5,
  },
  
  // JWT Secret for download tokens
  JWT_SECRET: process.env.JWT_SECRET || 'cognibooks-dev-secret-change-in-production-32chars',
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function base64urlEncode(str: string): string {
  return Buffer.from(str).toString('base64')
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64urlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = str.length % 4;
  if (pad) str += '='.repeat(4 - pad);
  return Buffer.from(str, 'base64').toString();
}

function parseDuration(str: string): number {
  const match = str.match(/^(\d+)([smhd])$/);
  if (!match) return 900;
  const value = parseInt(match[1]);
  const unit = { s: 1, m: 60, h: 3600, d: 86400 }[match[2]];
  return value * unit;
}

function signJWT(payload: object, expiresIn: string = '15m', singleUse: boolean = false): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const exp = now + parseDuration(expiresIn);
  const jti = crypto.randomUUID();
  
  const claims = { ...payload, iat: now, exp, jti };
  if (singleUse) claims.singleUse = true;
  
  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedClaims = base64urlEncode(JSON.stringify(claims));
  const signature = crypto.createHmac('sha256', CONFIG.JWT_SECRET)
    .update(`${encodedHeader}.${encodedClaims}`)
    .digest('base64');
  const encodedSig = base64urlEncode(signature);
  
  const token = `${encodedHeader}.${encodedClaims}.${encodedSig}`;
  
  return token;
}

function verifyJWT(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [header, claims, signature] = parts;
    const expectedSig = base64urlEncode(
      crypto.createHmac('sha256', CONFIG.JWT_SECRET)
        .update(`${header}.${claims}`)
        .digest('base64')
    );
    
    if (signature !== expectedSig) return null;
    
    const payload = JSON.parse(base64urlDecode(claims));
    
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (payload.singleUse) {
      // In production, use Redis/KV for token store
      return payload;
    }
    
    return payload;
  } catch {
    return null;
  }
}

// Simple in-memory token store (use Redis/KV in production)
const TOKEN_STORE = new Map();

function invalidateToken(jti: string): void {
  const entry = TOKEN_STORE.get(jti);
  if (entry) entry.used = true;
}

function isTokenValid(jti: string): boolean {
  const entry = TOKEN_STORE.get(jti);
  return entry && !entry.used && entry.exp > Math.floor(Date.now() / 1000);
}

// ============================================
// PAYMENT LINK GENERATORS
// ============================================

export const PAYMENT_LINKS = {
  /**
   * Generate Transak payment URL
   */
  transak: (params: {
    amount: number;
    currency: string;
    cryptoCurrency: string;
    network: string;
    walletAddress: string;
    redirectUrl?: string;
    email?: string;
    walletAddressUser?: string;
    themeColor?: string;
  }) => {
    const transakParams = new URLSearchParams({
      apiKey: process.env.TRANSAK_API_KEY || '',
      cryptoCurrency: 'USDC',
      network: 'polygon',
      walletAddress: process.env.WALLET_ADDRESS || '0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53',
      fiatCurrency: params.currency || 'USD',
      fiatAmount: params.amount.toFixed(2),
      ...(params.redirectUrl && { redirectURL: params.redirectUrl }),
      ...(params.email && { email: params.email }),
      ...(params.walletAddressUser && { walletAddress: params.walletAddressUser }),
      ...(params.themeColor && { themeColor: params.themeColor.replace('#', '') }),
    });
    
    return `https://global.transak.com/?${transakParams.toString()}`;
  },
  
  /**
   * Generate MoonPay payment URL
   */
  moonpay: (params: {
    amount: number;
    currency: string;
    cryptoCurrency: string;
    network: string;
    walletAddress: string;
    redirectUrl?: string;
    email?: string;
    colorCode?: string;
  }) => {
    const moonpayParams = new URLSearchParams({
      apiKey: process.env.MOONPAY_API_KEY || '',
      baseCurrencyCode: params.currency || 'usd',
      baseCurrencyAmount: params.amount.toFixed(2),
      currencyCode: params.cryptoCurrency || 'usdc',
      network: params.network || 'polygon',
      walletAddress: params.walletAddress || process.env.WALLET_ADDRESS || '0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53',
      ...(params.redirectUrl && { redirectURL: params.redirectUrl }),
      ...(params.email && { email: params.email }),
      ...(params.colorCode && { colorCode: params.colorCode.replace('#', '') }),
    });
    
    // Add signature if secret key is available
    if (process.env.MOONPAY_SECRET_KEY) {
      const crypto = require('crypto');
      const signature = crypto.createHmac('sha256', process.env.MOONPAY_SECRET_KEY)
        .update(moonpayParams.toString())
        .digest('hex');
      moonpayParams.set('signature', signature);
    }
    
    return `https://buy.moonpay.com/?${moonpayParams.toString()}`;
  },
  
  /**
   * Generate Paybis payment URL
   */
  paybis: (params: {
    amount: number;
    currency: string;
    cryptoCurrency: string;
    network: string;
    walletAddress: string;
    redirectUrl?: string;
    email?: string;
  }) => {
    const paybisParams = new URLSearchParams({
      apiKey: process.env.PAYBIS_API_KEY || '',
      cryptoCurrency: params.cryptoCurrency || 'USDC',
      network: params.network || 'polygon',
      wallet: params.walletAddress || process.env.WALLET_ADDRESS || '0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53',
      currency: params.currency || 'USD',
      amount: params.amount.toFixed(2),
      ...(params.redirectUrl && { redirectUrl: params.redirectUrl }),
      ...(params.email && { email: params.email }),
    });
    
    return `https://paybis.com/buy/usdc/polygon?${paybisParams.toString()}`;
  },
  
  /**
   * Generate Onramper (aggregator) URL
   */
  onramper: (params: {
    amount: number;
    currency: string;
    cryptoCurrency: string;
    network: string;
    walletAddress: string;
    redirectUrl?: string;
    email?: string;
  }) => {
    const onramperParams = new URLSearchParams({
      apiKey: process.env.ONRAMPER_API_KEY || '',
      cryptoCurrency: params.cryptoCurrency || 'USDC',
      network: params.network || 'polygon',
      walletAddress: params.walletAddress || process.env.WALLET_ADDRESS || '0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53',
      fiatCurrency: params.currency || 'USD',
      fiatAmount: params.amount.toFixed(2),
      ...(params.redirectUrl && { redirectUrl: params.redirectUrl }),
      ...(params.email && { email: params.email }),
    });
    
    return `https://widget.onramper.com/?${onramperParams.toString()}`;
  },
};

// ============================================
// WEBHOOK HANDLERS
// ============================================

interface WebhookPayload {
  [key: string]: any;
}

interface WebhookResult {
  statusCode: number;
  body: string;
  headers?: Record<string, string>;
}

function verifySignature(payload: string, signature: string | null, secret: string): boolean {
  if (!secret || !signature) return false;
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

function validateTransakPayload(payload: any): boolean {
  return (
    payload &&
    typeof payload.order_id === 'string' &&
    typeof payload.status === 'string' &&
    payload.crypto_currency === 'USDC' &&
    payload.network === 'polygon' &&
    payload.wallet_address?.toLowerCase() === CONFIG.WALLET_ADDRESS.toLowerCase()
  );
}

function validateMoonPayPayload(payload: any): boolean {
  return (
    payload &&
    payload.type === 'crypto_purchase_completed' &&
    payload.crypto_currency === 'usdc' &&
    payload.network === 'polygon' &&
    payload.wallet_address?.toLowerCase() === CONFIG.WALLET_ADDRESS.toLowerCase()
  );
}

function validatePaybisPayload(payload: any): boolean {
  return (
    payload &&
    payload.status === 'completed' &&
    payload.crypto_currency === 'USDC' &&
    payload.network === 'polygon' &&
    payload.wallet_address?.toLowerCase() === CONFIG.WALLET_ADDRESS.toLowerCase()
  );
}

function validateOnramperPayload(payload: any): boolean {
  return (
    payload &&
    payload.status === 'completed' &&
    payload.crypto_currency === 'USDC' &&
    payload.network === 'polygon' &&
    payload.wallet_address?.toLowerCase() === CONFIG.WALLET_ADDRESS.toLowerCase()
  );
}

async function processCompletedOrder(provider: string, payload: any): Promise<void> {
  try {
    const orderId = payload.order_id || payload.id || payload.external_id || payload.external_transaction_id;
    const email = payload.email || payload.customer_email || payload.user_email;
    const productId = payload.product_id || payload.metadata?.product_id;
    const amount = payload.fiat_amount || payload.fiat_value || payload.amount;
    const cryptoAmount = payload.crypto_amount || payload.crypto_value;
    const transactionHash = payload.transaction_hash || payload.tx_hash || payload.hash;
    
    if (!orderId || !email || !productId) {
      console.error('[WEBHOOK] Missing required fields:', { orderId, email, productId });
      return;
    }
    
    console.log(`[WEBHOOK] Processing completed order ${orderId} from ${provider}`);
    console.log(`[WEBHOOK] Email: ${email}, Product: ${productId}, Amount: ${amount}`);
    
    // TODO: Implement actual fulfillment logic:
    // 1. Generate download token
    // 2. Send email with download link
    // 3. Record order in database
    // 4. Send confirmation
    
    console.log(`[WEBHOOK] ✅ Order ${orderId} fulfillment queued for ${email}`);
    
  } catch (error) {
    console.error('[WEBHOOK] Fulfillment error:', error);
    throw error;
  }
}

export async function handleWebhook(
  provider: 'transak' | 'moonpay' | 'paybis' | 'onramper',
  rawBody: string,
  signature: string | null,
  payload: any
): Promise<WebhookResult> {
  
  // Verify signature
  let verified = false;
  let secret = '';
  
  switch (provider) {
    case 'transak':
      secret = CONFIG.TRANSAK.WEBHOOK_SECRET;
      break;
    case 'moonpay':
      secret = CONFIG.MOONPAY.WEBHOOK_SECRET;
      break;
    case 'paybis':
      secret = CONFIG.PAYBIS.WEBHOOK_SECRET;
      break;
    case 'onramper':
      secret = CONFIG.ONRAMPER.WEBHOOK_SECRET;
      break;
    default:
      return { statusCode: 400, body: JSON.stringify({ error: 'Unknown provider' }) };
  }
  
  verified = verifySignature(rawBody, signature, secret);
  
  if (!verified) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Invalid signature' }) };
  }
  
  // Validate payload
  let valid = false;
  if (provider === 'transak') valid = validateTransakPayload(payload);
  else if (provider === 'moonpay') valid = validateMoonPayPayload(payload);
  else if (provider === 'paybis') valid = validatePaybisPayload(payload);
  else if (provider === 'onramper') valid = validateOnramperPayload(payload);
  
  if (!valid) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid payload' }) };
  }
  
  // Check status
  const isCompleted = 
    payload.status === 'completed' ||
    payload.status === 'COMPLETED' ||
    payload.type === 'crypto_purchase_completed' ||
    payload.status === 'COMPLETE';
  
  if (!isCompleted) {
    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  }
  
  // Verify destination matches our wallet
  const walletMatch = 
    payload.wallet_address?.toLowerCase() === CONFIG.WALLET_ADDRESS.toLowerCase() ||
    payload.walletAddress?.toLowerCase() === CONFIG.WALLET_ADDRESS.toLowerCase() ||
    payload.destination_address?.toLowerCase() === CONFIG.WALLET_ADDRESS.toLowerCase();
  
  if (!walletMatch) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Wallet mismatch' }) };
  }
  
  // Process the completed order
  await processCompletedOrder(provider, payload);
  
  return { statusCode: 200, body: JSON.stringify({ received: true, fulfilled: true }) };
}

function verifySignature(payload: string, signature: string | null, secret: string): boolean {
  if (!secret || !signature) return false;
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

function validateTransakPayload(payload: any): boolean {
  return (
    payload &&
    typeof payload.order_id === 'string' &&
    typeof payload.status === 'string' &&
    payload.crypto_currency === 'USDC' &&
    payload.network === 'polygon' &&
    payload.wallet_address?.toLowerCase() === CONFIG.WALLET_ADDRESS.toLowerCase()
  );
}

function validateMoonPayPayload(payload: any): boolean {
  return (
    payload &&
    payload.type === 'crypto_purchase_completed' &&
    payload.crypto_currency === 'usdc' &&
    payload.network === 'polygon' &&
    payload.wallet_address?.toLowerCase() === CONFIG.WALLET_ADDRESS.toLowerCase()
  );
}

function validatePaybisPayload(payload: any): boolean {
  return (
    payload &&
    payload.status === 'completed' &&
    payload.crypto_currency === 'USDC' &&
    payload.network === 'polygon' &&
    payload.wallet_address?.toLowerCase() === CONFIG.WALLET_ADDRESS.toLowerCase()
  );
}

function validateOnramperPayload(payload: any): boolean {
  return (
    payload &&
    payload.status === 'completed' &&
    payload.crypto_currency === 'USDC' &&
    payload.network === 'polygon' &&
    payload.wallet_address?.toLowerCase() === CONFIG.WALLET_ADDRESS.toLowerCase()
  );
}

// ============================================
// COINBASE CDP SESSION TOKEN
// ============================================

function generateCDPToken(payload: object): string {
  const header = {
    alg: 'ES256',
    typ: 'JWT',
    kid: process.env.CDP_API_KEY_NAME || '',
  };
  
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 300; // 5 minutes
  const claims = { ...payload, iss: process.env.CDP_API_KEY_NAME, sub: process.env.CDP_API_KEY_NAME, aud: 'coinbase', iat: now, exp };
  
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedClaims = Buffer.from(JSON.stringify(claims)).toString('base64url');
  const signingInput = `${encodedHeader}.${encodedClaims}`;
  
  const sign = crypto.createSign('SHA256');
  sign.update(signingInput);
  sign.end();
  const signature = sign.sign(process.env.CDP_API_KEY_PRIVATE_KEY || '', 'base64url');
  
  return `${encodedHeader}.${encodedClaims}.${signature}`;
}

export async function createCoinbaseSession(amount: number): Promise<{ sessionToken: string; url: string }> {
  if (!process.env.CDP_API_KEY_NAME || !process.env.CDP_API_KEY_PRIVATE_KEY) {
    throw new Error('Coinbase CDP credentials not configured');
  }
  
  const sessionToken = generateCDPToken({
    addresses: [{
      address: '0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53',
      blockchains: ['polygon'],
    }],
    assets: ['USDC'],
    presetFiatAmount: amount,
    fiatCurrency: 'USD',
    defaultAsset: 'USDC',
    defaultNetwork: 'polygon',
    partnerUserId: `order_${Date.now()}`,
  });

  const params = new URLSearchParams({
    sessionToken,
    defaultAsset: 'USDC',
    defaultNetwork: 'polygon',
    presetFiatAmount: amount.toString(),
    fiatCurrency: 'USD',
    partnerUserId: `order_${Date.now()}`,
  });

  const url = `https://coinbase.com/buy?${params.toString()}`;
  
  return { sessionToken, url };
}

// ============================================
// EBOOK DOWNLOAD
// ============================================

interface Product {
  id: number;
  title: string;
  pdfPath: string;
  price: number;
}

const PRODUCTS: Product[] = [
  { id: 1, title: 'AI Arsenal for Entrepreneurs', pdfPath: 'AI Arsenal for Entrepreneurs.pdf', price: 29.99 },
  { id: 2, title: 'Promotion-Ready with AI Prompts', pdfPath: 'Promotion-Ready With AI Prompts.pdf', price: 27.99 },
  { id: 3, title: 'The P.A.C.E Academic Writing Toolkit', pdfPath: 'The P.A.C.E Academic Writing Toolkit.pdf', price: 24.99 },
  { id: 4, title: 'The Invisible Assistant', pdfPath: 'The Invisible Assistant.pdf', price: 24.99 },
  { id: 5, title: 'The Sovereign Sanctuary', pdfPath: 'The Sovereign Sanctuary.pdf', price: 24.99 },
];

function getProduct(id: number): Product | undefined {
  return PRODUCTS.find(p => p.id === id);
}

function pdfExists(filename: string): boolean {
  const fs = require('fs');
  const path = require('path');
  const PDF_DIR = path.join(process.cwd(), 'netlify', 'pdfs');
  const safeName = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '');
  return fs.existsSync(path.join(PDF_DIR, safeName));
}

function getPDFBuffer(filename: string): Buffer | null {
  const fs = require('fs');
  const path = require('path');
  const PDF_DIR = path.join(process.cwd(), 'netlify', 'pdfs');
  const safeName = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '');
  const filePath = path.join(PDF_DIR, safeName);
  
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath);
}

export async function downloadEbook(token: string): Promise<{
  statusCode: number;
  body: string | Buffer;
  headers?: Record<string, string>;
  isBase64Encoded?: boolean;
}> {
  if (!token) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing download token' }) };
  }

  const payload = verifyJWT(token);
  if (!payload) {
    return { statusCode: 403, body: JSON.stringify({ error: 'Invalid or expired download token' }) };
  }

  if (payload.singleUse) {
    const entry = TOKEN_STORE.get(payload.jti);
    if (entry?.used) {
      return { statusCode: 403, body: JSON.stringify({ error: 'Download token already used' }) };
    }
  }

  const product = getProduct(payload.productId);
  if (!product) {
    return { statusCode: 404, body: JSON.stringify({ error: 'Product not found' }) };
  }

  if (!pdfExists(product.pdfPath)) {
    return { statusCode: 404, body: JSON.stringify({ error: 'PDF file not found on server' }) };
  }

  if (payload.singleUse && payload.jti) {
    invalidateToken(payload.jti);
  }

  const pdfBuffer = getPDFBuffer(product.pdfPath);
  if (!pdfBuffer) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to read PDF file' }) };
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

// ============================================
// EXPORTS
// ============================================

export {
  CONFIG,
  PAYMENT_LINKS: {
    transak: (params: any) => {
      const transakParams = new URLSearchParams({
        apiKey: process.env.TRANSAK_API_KEY || '',
        cryptoCurrency: 'USDC',
        network: 'polygon',
        walletAddress: process.env.WALLET_ADDRESS || '0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53',
        fiatCurrency: params.currency || 'USD',
        fiatAmount: params.amount.toFixed(2),
        ...(params.redirectUrl && { redirectURL: params.redirectUrl }),
        ...(params.email && { email: params.email }),
        ...(params.walletAddressUser && { walletAddress: params.walletAddressUser }),
        ...(params.themeColor && { themeColor: params.themeColor.replace('#', '') }),
      });
      return `https://global.transak.com/?${transakParams.toString()}`;
    },
  moonpay: (params: any) => {
    const moonpayParams = new URLSearchParams({
      apiKey: process.env.MOONPAY_API_KEY || '',
      baseCurrencyCode: params.currency || 'usd',
      baseCurrencyAmount: params.amount.toFixed(2),
      currencyCode: params.cryptoCurrency || 'usdc',
      network: params.network || 'polygon',
      walletAddress: params.walletAddress || process.env.WALLET_ADDRESS || '0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53',
      ...(params.redirectUrl && { redirectURL: params.redirectUrl }),
      ...(params.email && { email: params.email }),
      ...(params.colorCode && { colorCode: params.colorCode.replace('#', '') }),
    });
    if (process.env.MOONPAY_SECRET_KEY) {
      const signature = crypto.createHmac('sha256', process.env.MOONPAY_SECRET_KEY)
        .update(moonpayParams.toString())
        .digest('hex');
      moonpayParams.set('signature', signature);
    }
    return `https://buy.moonpay.com/?${moonpayParams.toString()}`;
  },
  paybis: (params: any) => {
    const paybisParams = new URLSearchParams({
      apiKey: process.env.PAYBIS_API_KEY || '',
      cryptoCurrency: params.cryptoCurrency || 'USDC',
      network: params.network || 'polygon',
      wallet: params.walletAddress || process.env.WALLET_ADDRESS || '0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53',
      currency: params.currency || 'USD',
      amount: params.amount.toFixed(2),
      ...(params.redirectUrl && { redirectUrl: params.redirectUrl }),
      ...(params.email && { email: params.email }),
    });
    return `https://paybis.com/buy/usdc/polygon?${paybisParams.toString()}`;
  },
  onramper: (params: any) => {
    const onramperParams = new URLSearchParams({
      apiKey: process.env.ONRAMPER_API_KEY || '',
      cryptoCurrency: params.cryptoCurrency || 'USDC',
      network: params.network || 'polygon',
      walletAddress: params.walletAddress || process.env.WALLET_ADDRESS || '0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53',
      fiatCurrency: params.currency || 'USD',
      fiatAmount: params.amount.toFixed(2),
      ...(params.redirectUrl && { redirectUrl: params.redirectUrl }),
      ...(params.email && { email: params.email }),
    });
    return `https://widget.onramper.com/?${onramperParams.toString()}`;
  },
};

export { CONFIG, signJWT, verifyJWT, invalidateToken, isTokenValid, handleWebhook, createCoinbaseSession, downloadEbook, getProduct, getPDFBuffer, pdfExists };