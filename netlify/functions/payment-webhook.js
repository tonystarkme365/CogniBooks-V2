import { getOrder, getOrderByPaymentId, updateOrder, getProduct } from '../../utils/db.js';
import { verifyJWT, invalidateToken, signJWT } from '../../utils/jwt.js';
import { sendDownloadEmail } from '../../utils/email.js';

const WALLET = process.env.WALLET_ADDRESS || '0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53';
const SITE_URL = process.env.URL || 'https://cognibook.netlify.app';

// Mock provider verification - replace with actual PayBis/Transak API calls
async function verifyPaymentWithProvider(provider, paymentId, expectedAmount) {
  // In production, call PayBis/Transak API to verify payment
  // Example for PayBis: GET https://api.paybis.com/v1/orders/{paymentId}
  // Example for Transak: GET https://api.transak.com/v1/orders/{paymentId}
  
  console.log(`[WEBHOOK] Verifying payment ${paymentId} for provider ${provider}, amount ${expectedAmount}`);
  
  // For now, simulate successful verification
  // In production, implement actual API calls:
  // const response = await fetch(`https://api.paybis.com/v1/orders/${paymentId}`, {
  //   headers: { 'Authorization': `Bearer ${process.env.PAYBIS_API_KEY}` }
  // });
  // const data = await response.json();
  // return data.status === 'completed' && data.amount === expectedAmount;
  
  return true; // Mock: always verify for demo
}

export async function handler(event) {
  const { token, paymentId, status, amount, provider } = event.queryStringParameters || {};
  
  // Handle direct callback without token (PayBis/Transak standard flow)
  if (!token && paymentId) {
    // Try to find order by paymentId
    const order = getOrderByPaymentId(paymentId);
    if (order) return handleVerifiedPayment(order, paymentId, provider);
    return { statusCode: 404, body: JSON.stringify({ error: 'Order not found for payment' }) };
  }

  // Verify our JWT token
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

  // Verify amount matches
  const paidAmount = amount ? parseFloat(amount) : payload.amount;
  if (Math.abs(paidAmount - order.amount) > 0.01) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Amount mismatch' }) };
  }

  // Verify with provider if paymentId provided
  if (paymentId) {
    const verified = await verifyPaymentWithProvider(provider || order.provider, paymentId, order.amount);
    if (!verified) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Payment verification failed' }) };
    }
  }

  return handleVerifiedPayment(order, paymentId, provider || order.provider);
}

async function handleVerifiedPayment(order, paymentId, provider) {
  // Update order
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
    { orderId: order.id, productId: order.productId },
    '24h',
    true // singleUse
  );

  const downloadUrl = `${SITE_URL}/.netlify/functions/download-pdf?token=${downloadToken}`;

  // Send email with download link
  await sendDownloadEmail(order.email, downloadUrl, getProduct(order.productId)?.title || 'Your eBook');

  // Redirect to success page with download token
  const redirectUrl = `${SITE_URL}/#success?token=${downloadToken}`;
  
  return {
    statusCode: 302,
    headers: { Location: redirectUrl },
  };
}