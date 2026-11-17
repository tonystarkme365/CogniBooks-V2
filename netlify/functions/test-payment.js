import { getOrder, updateOrder, getProduct } from './utils/db.js';
import { verifyJWT, signJWT } from './utils/jwt.js';
import { sendDownloadEmail } from './utils/email.js';

const SITE_URL = process.env.URL || 'https://cognibook.netlify.app';

export async function handler(event) {
  // Simple secret for test mode - falls back to hardcoded default if env not set
  const TEST_SECRET = process.env.TEST_SECRET || 'cognibooks-test-2024';
  const { secret, orderId } = event.queryStringParameters || {};

  // Skip secret check if TEST_SECRET env var is not configured
  const allowNoSecret = !process.env.TEST_SECRET;

  if (!allowNoSecret && secret !== TEST_SECRET) {
    return { statusCode: 403, body: JSON.stringify({ error: 'Invalid test secret' }) };
  }

  if (!orderId) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing orderId' }) };
  }

  const order = getOrder(orderId);
  if (!order) {
    return { statusCode: 404, body: JSON.stringify({ error: 'Order not found' }) };
  }

  if (order.status !== 'pending') {
    return { statusCode: 400, body: JSON.stringify({ error: `Order already ${order.status}` }) };
  }

  // Simulate successful payment
  const updated = updateOrder(order.id, {
    status: 'completed',
    paymentId: `test_${Date.now()}`,
    completedAt: Date.now(),
  });

  if (!updated) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to update order' }) };
  }

  // Generate download token (24h expiry, single-use)
  const downloadToken = signJWT(
    { orderId: order.id, productId: order.productId },
    '24h',
    true
  );

  const downloadUrl = `${SITE_URL}/.netlify/functions/download-pdf?token=${downloadToken}`;

  // Send email
  await sendDownloadEmail(order.email, downloadUrl, getProduct(order.productId)?.title || 'Your eBook');

  const redirectUrl = `${SITE_URL}/#success?token=${downloadToken}`;
  
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      success: true,
      message: 'Test payment completed',
      downloadUrl,
      redirectUrl,
      token: downloadToken,
    }),
  };
}