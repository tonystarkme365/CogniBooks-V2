import { getOrder, getProduct } from './utils/db.js';
import { verifyJWT, signJWT } from './utils/jwt.js';

const SITE_URL = process.env.URL || 'https://cognibook.netlify.app';

export async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const { orderId: queryOrderId, token } = event.queryStringParameters || {};

  // Authenticate via JWT token (from create-order response)
  let orderId = queryOrderId;
  if (token) {
    const payload = verifyJWT(token);
    if (!payload) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Invalid or expired token' }) };
    }
    if (!orderId) orderId = payload.orderId;
  }

  if (!orderId) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing orderId' }) };
  }

  const order = getOrder(orderId);
  if (!order) {
    return { statusCode: 404, body: JSON.stringify({ error: 'Order not found' }) };
  }

  const product = getProduct(order.productId);

  // Build download URL if completed with valid JWT
  let downloadUrl = null;
  if (order.status === 'completed') {
    const downloadToken = signJWT(
      { orderId: order.id, productId: order.productId, email: order.email },
      '24h',
      true
    );
    downloadUrl = `${SITE_URL}/.netlify/functions/download-pdf?token=${downloadToken}`;
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId: order.id,
      status: order.status,
      product: product ? { id: product.id, title: product.title, pdfPath: product.pdfPath } : null,
      amount: order.amount,
      email: order.email,
      paymentId: order.paymentId,
      createdAt: order.createdAt,
      completedAt: order.completedAt,
      downloadUrl,
    }),
  };
}