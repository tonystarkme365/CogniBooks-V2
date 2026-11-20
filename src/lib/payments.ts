import { NextRequest, NextResponse } from 'next/server';
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
  
  // Ebook delivery
  EBOOK: {
    DOWNLOAD_BASE_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://cognibook.netlify.app',
    DOWNLOAD_EXPIRY_HOURS: 24,
    MAX_DOWNLOADS: 5,
  },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Verify webhook signature using HMAC-SHA256
 */
function verifySignature(payload: string, signature: string, secret: string): boolean {
  if (!secret || !signature) return false;
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  // Timing-safe comparison
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

/**
 * Generate a secure download token
 */
function generateDownloadToken(orderId: string, productId: number): string {
  const payload = {
    orderId,
    productId,
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
    iat: Math.floor(Date.now() / 1000),
  };
  
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', process.env.JWT_SECRET || 'cognibooks-secret')
    .update(`${header}.${payloadB64}`)
    .digest('base64url');
  
  return `${header}.${payloadB64}.${signature}`;
}

/**
 * Validate webhook payload structure
 */
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

// ============================================
// EBOOK DELIVERY FUNCTIONS
// ============================================

/**
 * Generate secure download URL with JWT token
 */
function generateDownloadUrl(productId: number, orderId: string): string {
  const token = generateDownloadToken(orderId, productId);
  return `${CONFIG.EBOOK.DOWNLOAD_BASE_URL}/.netlify/functions/download-ebook?token=${token}`;
}

/**
 * Send download email to customer
 */
async function sendDownloadEmail(email: string, productTitle: string, downloadUrl: string): Promise<boolean> {
  // TODO: Integrate with your email provider (SendGrid, Resend, Mailgun, etc.)
  console.log(`[EMAIL] Sending download link to ${email} for ${productTitle}`);
  console.log(`[EMAIL] Download URL: ${downloadUrl}`);
  
  // Example with SendGrid:
  /*
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  await sgMail.send({
    to: email,
    from: 'noreply@cognibooks.com',
    subject: `Your ${productTitle} download is ready!`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #00ff88;">Download Ready</h1>
        <p>Your purchase of <strong>${productTitle}</strong> is confirmed.</p>
        <p><a href="${downloadUrl}" style="background: #00ff88; color: #030a05; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Download PDF</a></p>
        <p style="color: #666; font-size: 14px;">This link expires in 24 hours and can only be used once.</p>
      </div>
    `,
  });
  */
  
  return true;
}

/**
 * Record successful order in database
 */
async function recordOrder(orderData: any): Promise<void> {
  // TODO: Save to your database (PostgreSQL, Supabase, Fauna, etc.)
  console.log('[DB] Recording order:', {
    orderId: orderData.orderId,
    productId: orderData.productId,
    email: orderData.email,
    amount: orderData.amount,
    cryptoAmount: orderData.crypto_amount,
    transactionHash: orderData.transaction_hash,
    provider: orderData.provider,
    status: 'completed',
    createdAt: new Date().toISOString(),
  });
}

/**
 * Process completed order - main fulfillment logic
 */
async function processCompletedOrder(provider: 'transak' | 'moonpay' | 'paybis', payload: any): Promise<void> {
  try {
    // Extract common fields
    const orderId = payload.order_id || payload.id || payload.external_id;
    const email = payload.email || payload.customer_email || payload.user_email;
    const productId = payload.product_id || payload.metadata?.product_id;
    const amount = payload.fiat_amount || payload.fiat_value || payload.amount;
    const cryptoAmount = payload.crypto_amount || payload.crypto_value;
    const transactionHash = payload.transaction_hash || payload.tx_hash || payload.hash;
    
    if (!orderId || !email || !productId) {
      console.error('[WEBHOOK] Missing required fields:', { orderId, email, productId });
      return;
    }
    
    // Generate download URL
    const downloadUrl = generateDownloadUrl(productId, orderId);
    
    // Send email
    await sendDownloadEmail(email, `Ebook #${productId}`, downloadUrl);
    
    // Record in database
    await recordOrder({
      orderId,
      productId,
      email,
      amount,
      cryptoAmount,
      transactionHash,
      provider,
      downloadUrl,
    });
    
    console.log(`[WEBHOOK] ✅ Order ${orderId} fulfilled for ${email}`);
    
  } catch (error) {
    console.error('[WEBHOOK] Fulfillment error:', error);
    throw error;
  }
}

// ============================================
// WEBHOOK HANDLERS
// ============================================

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-transak-signature') 
      || request.headers.get('x-moonpay-signature') 
      || request.headers.get('x-paybis-signature')
      || request.headers.get('x-signature');
    
    const provider = request.nextUrl.searchParams.get('provider') || 'unknown';
    
    console.log(`[WEBHOOK] Received ${provider} webhook`);
    
    // Parse payload
    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch (e) {
      console.error('[WEBHOOK] Invalid JSON:', e);
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
    
    // Verify signature
    let verified = false;
    let providerName: 'transak' | 'moonpay' | 'paybis' = 'transak';
    
    if (provider === 'transak' || payload.order_id) {
      providerName = 'transak';
      verified = verifySignature(rawBody, signature || '', CONFIG.TRANSAK.WEBHOOK_SECRET);
    } else if (provider === 'moonpay' || payload.type === 'crypto_purchase_completed') {
      providerName = 'moonpay';
      verified = verifySignature(rawBody, signature || '', CONFIG.MOONPAY.WEBHOOK_SECRET);
    } else if (provider === 'paybis' || payload.transaction_id) {
      providerName = 'paybis';
      verified = verifySignature(rawBody, signature || '', CONFIG.PAYBIS.WEBHOOK_SECRET);
    }
    
    if (!verified && process.env.NODE_ENV === 'production') {
      console.error('[WEBHOOK] Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    // Validate payload
    let valid = false;
    if (providerName === 'transak') valid = validateTransakPayload(payload);
    else if (providerName === 'moonpay') valid = validateMoonPayPayload(payload);
    else if (providerName === 'paybis') valid = validatePaybisPayload(payload);
    
    if (!valid) {
      console.error('[WEBHOOK] Invalid payload:', payload);
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    
    // Check status
    const isCompleted = 
      payload.status === 'completed' ||
      payload.status === 'COMPLETED' ||
      payload.type === 'crypto_purchase_completed' ||
      payload.status === 'COMPLETE';
    
    if (!isCompleted) {
      console.log('[WEBHOOK] Order not completed yet:', payload.status || payload.type);
      return NextResponse.json({ received: true });
    }
    
    // Verify destination matches our wallet
    const walletMatch = 
      payload.wallet_address?.toLowerCase() === CONFIG.WALLET_ADDRESS.toLowerCase() ||
      payload.walletAddress?.toLowerCase() === CONFIG.WALLET_ADDRESS.toLowerCase() ||
      payload.destination_address?.toLowerCase() === CONFIG.WALLET_ADDRESS.toLowerCase();
    
    if (!walletMatch) {
      console.error('[WEBHOOK] Wallet address mismatch:', payload.wallet_address || payload.walletAddress || payload.destination_address);
      return NextResponse.json({ error: 'Wallet mismatch' }, { status: 400 });
    }
    
    // Process the completed order
    await processCompletedOrder(providerName, payload);
    
    return NextResponse.json({ received: true, fulfilled: true });
    
  } catch (error) {
    console.error('[WEBHOOK] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ============================================
// PAYMENT LINK GENERATORS
// ============================================

export const PAYMENT_LINKS = {
  /**
   * Generate Transak payment URL
   */
  transak: (params: {
    amount: number;           // e.g., 29.99
    currency: string;         // 'USD'
    cryptoCurrency: string;   // 'USDC'
    network: string;          // 'polygon'
    walletAddress: string;    // your wallet
    redirectUrl?: string;     // success redirect
    email?: string;           // prefill email
    walletAddressUser?: string; // user's wallet (optional)
    themeColor?: string;      // '00ff88'
  }) => {
    const params = new URLSearchParams({
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
    
    return `https://global.transak.com/?${params.toString()}`;
  },
  
  /**
   * Generate MoonPay payment URL
   */
  moonpay: (params: {
    amount: number;
    currency: string;         // 'usd'
    cryptoCurrency: string;   // 'usdc'
    network: string;          // 'polygon'
    walletAddress: string;
    redirectUrl?: string;
    email?: string;
    colorCode?: string;
  }) => {
    const params = new URLSearchParams({
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
    
    return `https://buy.moonpay.com/?${params.toString()}`;
  },
  
  /**
   * Generate Paybis payment URL
   */
  paybis: (params: {
    amount: number;
    currency: string;         // 'USD'
    cryptoCurrency: string;   // 'USDC'
    network: string;          // 'polygon'
    walletAddress: string;
    redirectUrl?: string;
    email?: string;
  }) => {
    const params = new URLSearchParams({
      apiKey: process.env.PAYBIS_API_KEY || '',
      cryptoCurrency: params.cryptoCurrency || 'USDC',
      network: params.network || 'polygon',
      wallet: params.walletAddress || process.env.WALLET_ADDRESS || '0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53',
      currency: params.currency || 'USD',
      amount: params.amount.toFixed(2),
      ...(params.redirectUrl && { redirectUrl: params.redirectUrl }),
      ...(params.email && { email: params.email }),
    });
    
    return `https://paybis.com/buy/usdc/polygon?${params.toString()}`;
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
    const params = new URLSearchParams({
      apiKey: process.env.ONRAMPER_API_KEY || '',
      cryptoCurrency: params.cryptoCurrency || 'USDC',
      network: params.network || 'polygon',
      walletAddress: params.walletAddress || process.env.WALLET_ADDRESS || '0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53',
      fiatCurrency: params.currency || 'USD',
      fiatAmount: params.amount.toFixed(2),
      ...(params.redirectUrl && { redirectUrl: params.redirectUrl }),
      ...(params.email && { email: params.email }),
    });
    
    return `https://widget.onramper.com/?${params.toString()}`;
  },
};

// ============================================
// USAGE EXAMPLES
// ============================================

/*
// In your React component:
import { PAYMENT_LINKS } from '@/lib/payments';

const handlePay = (provider: 'transak' | 'moonpay' | 'paybis') => {
  const link = PAYMENT_LINKS[provider]({
    amount: 29.99,
    currency: 'USD',
    cryptoCurrency: 'USDC',
    network: 'polygon',
    walletAddress: '0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53',
    redirectUrl: `${window.location.origin}/#success?orderId=${orderId}`,
    email: userEmail,
    themeColor: '00ff88',
  });
  window.location.href = link;
};

// In your webhook route (Next.js App Router):
// app/api/webhooks/payments/route.ts
import { POST } from '@/lib/webhook-handler';
export { POST };
*/

export default {
  POST,
  PAYMENT_LINKS,
  CONFIG,
};