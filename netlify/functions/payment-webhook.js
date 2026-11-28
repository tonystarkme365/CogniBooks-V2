import { getOrder, getOrderByPaymentId, updateOrder, getProduct } from './utils/db.js';
import { verifyJWT, invalidateToken, signJWT } from './utils/jwt.js';
import { sendDownloadEmail, sendOrderConfirmationEmail } from './utils/email.js';

const WALLET = process.env.WALLET_ADDRESS || '0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53';
const SITE_URL = process.env.URL || 'https://cognibook.netlify.app';

// Provider webhook secrets
const TRANSAK_WEBHOOK_SECRET = process.env.TRANSAK_WEBHOOK_SECRET || '';
const MOONPAY_WEBHOOK_SECRET = process.env.MOONPAY_WEBHOOK_SECRET || '';
const PAYBIS_WEBHOOK_SECRET = process.env.PAYBIS_WEBHOOK_SECRET || '';
const ONRAMPER_WEBHOOK_SECRET = process.env.ONRAMPER_WEBHOOK_SECRET || '';

// Provider configuration: maps provider name to its webhook secret
const PROVIDER_SECRETS = {
  transak: TRANSAK_WEBHOOK_SECRET,
  moonpay: MOONPAY_WEBHOOK_SECRET,
  paybis: PAYBIS_WEBHOOK_SECRET,
  onramper: ONRAMPER_WEBHOOK_SECRET,
};

// Provider-specific header name for signature
const PROVIDER_SIG_HEADERS = {
  transak: 'x-transak-signature',
  moonpay: 'signature',
  paybis: 'x-paybis-signature',
  onramper: 'x-onramper-signature',
};

// Timing-safe HMAC comparison
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

// Compute HMAC SHA256 signature
function computeHmacSha256(secret, message) {
  return crypto.createHmac('sha256', secret).update(message).digest('hex');
}

import crypto from 'crypto';

// Verify Transak webhook signature
function verifyTransakSignature(payload, signature, secret) {
  if (!secret || !signature) return false;
  const expected = computeHmacSha256(secret, JSON.stringify(payload));
  return timingSafeEqual(expected, signature);
}

// Verify MoonPay webhook signature (signature is in the payload or header)
function verifyMoonPaySignature(payload, signature, secret) {
  if (!secret || !signature) return false;
  // MoonPay signs the raw body or a canonical string
  const message = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const expected = computeHmacSha256(secret, message);
  return timingSafeEqual(expected, signature);
}

// Verify PayBis webhook signature
function verifyPayBisSignature(payload, signature, secret) {
  if (!secret || !signature) return false;
  const message = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const expected = computeHmacSha256(secret, message);
  return timingSafeEqual(expected, signature);
}

// Verify Onramper webhook signature
function verifyOnramperSignature(payload, signature, secret) {
  if (!secret || !signature) return false;
  const message = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const expected = computeHmacSha256(secret, message);
  return timingSafeEqual(expected, signature);
}

const PROVIDER_VERIFIERS = {
  transak: verifyTransakSignature,
  moonpay: verifyMoonPaySignature,
  paybis: verifyPayBisSignature,
  onramper: verifyOnramperSignature,
};

// Extract signature from headers for a given provider
function extractSignature(headers, provider) {
  const headerName = PROVIDER_SIG_HEADERS[provider];
  if (!headerName) return null;
  return headers[headerName] || headers[headerName.toLowerCase()];
}

// Verify webhook signature for a provider
function verifyWebhookSignature(provider, payload, signature) {
  const secret = PROVIDER_SECRETS[provider];
  const verifier = PROVIDER_VERIFIERS[provider];

  // If no secret configured for provider, allow in dev mode only
  if (!secret) {
    console.warn(`[WEBHOOK] No webhook secret configured for ${provider} - allowing in dev mode`);
    return true;
  }

  if (!verifier) return false;
  return verifier(payload, signature, secret);
}

// Find order by payment reference (handles various webhook payload shapes)
function findOrderByWebhookPayload(provider, payload) {
  // Try common payment reference fields
  const candidates = [
    payload?.paymentId,
    payload?.payment_id,
    payload?.id,
    payload?.reference,
    payload?.externalTransactionId,
    payload?.transactionId,
    payload?.orderId,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const order = getOrderByPaymentId(candidate);
    if (order) return order;
  }

  return null;
}

// Core verified payment handler: mints JWT, sends email, redirects to success
async function handleVerifiedPayment(order, paymentId, provider) {
  if (order.status !== 'pending') {
    return { statusCode: 400, body: JSON.stringify({ error: `Order already ${order.status}` }) };
  }

  const updated = updateOrder(order.id, {
    status: 'completed',
    paymentId,
    completedAt: Date.now(),
  });

  if (!updated) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to update order' }) };
  }

  // Generate download token (24h expiry, single-use)
  const downloadToken = signJWT(
    { orderId: order.id, productId: order.productId, email: order.email },
    '24h',
    true // singleUse
  );

  const downloadUrl = `${SITE_URL}/.netlify/functions/download-pdf?token=${downloadToken}`;

  // Send order confirmation email with download link (Resend if configured, else graceful log)
  await sendDownloadEmail(order.email, downloadUrl, getProduct(order.productId)?.title || 'Your eBook');

  // Redirect to success page with download token
  const redirectUrl = `${SITE_URL}/#success?token=${downloadToken}`;

  return {
    statusCode: 302,
    headers: { Location: redirectUrl },
  };
}

export async function handler(event) {
  const headers = event.headers || {};
  const httpMethod = event.httpMethod || 'GET';

  // Handle webhook POST from payment providers
  if (httpMethod === 'POST') {
    const provider = event.queryStringParameters?.provider || headers['x-payment-provider'] || '';
    const providerKey = provider.toLowerCase();

    if (!PROVIDER_SECRETS[providerKey] && providerKey) {
      console.warn(`[WEBHOOK] Unknown provider: ${provider}`);
      return { statusCode: 400, body: JSON.stringify({ error: 'Unknown payment provider' }) };
    }

    let payload;
    try {
      payload = event.body ? JSON.parse(event.body) : {};
    } catch {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
    }

    // Extract and verify signature
    const signature = extractSignature(headers, providerKey);

    if (PROVIDER_SECRETS[providerKey]) {
      if (!signature) {
        return { statusCode: 401, body: JSON.stringify({ error: 'Missing webhook signature' }) };
      }
      if (!verifyWebhookSignature(providerKey, payload, signature)) {
        return { statusCode: 401, body: JSON.stringify({ error: 'Invalid webhook signature' }) };
      }
    }

    // Extract order reference and payment details from webhook payload
    const order = findOrderByWebhookPayload(providerKey, payload);
    if (!order) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Order not found for webhook payload' }) };
    }

    const paymentId = payload?.paymentId || payload?.payment_id || payload?.id || payload?.reference || `webhook_${Date.now()}`;
    const status = payload?.status || payload?.event || 'completed';

    if (status === 'failed' || status === 'cancelled' || status === 'error') {
      updateOrder(order.id, { status: 'failed', completedAt: Date.now() });
      return { statusCode: 200, body: JSON.stringify({ error: 'Payment failed or cancelled' }) };
    }

    return handleVerifiedPayment(order, paymentId, providerKey);
  }

  // Handle direct callback without token (PayBis/Transak standard flow)
  if (httpMethod === 'GET') {
    const { token, paymentId, status, amount, provider } = event.queryStringParameters || {};

    if (!token && paymentId) {
      const order = getOrderByPaymentId(paymentId);
      if (order) return handleVerifiedPayment(order, paymentId, provider);
      return { statusCode: 404, body: JSON.stringify({ error: 'Order not found for payment' }) };
    }

    // Verify our JWT token (redirect from checkout)
    if (!token) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing token' }) };
    }

    const payload = verifyJWT(token);
    if (!payload) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Invalid or expired token' }) };
    }

    const order = getOrder(payload.orderId);
    if (!order) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Order not found' }) };
    }

    if (order.status !== 'pending') {
      return { statusCode: 400, body: JSON.stringify({ error: `Order already ${order.status}` }) };
    }

    const paidAmount = amount ? parseFloat(amount) : payload.amount;
    if (Math.abs(paidAmount - order.amount) > 0.01) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Amount mismatch' }) };
    }

    return handleVerifiedPayment(order, paymentId, provider || order.provider);
  }

  return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
}