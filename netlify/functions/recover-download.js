import { getOrdersByEmail, getOrder, getProduct } from './utils/db.js';
import { verifyJWT, signJWT } from './utils/jwt.js';
import { sendDownloadEmail } from './utils/email.js';

const SITE_URL = process.env.URL || 'https://cognibook.netlify.app';

export async function handler(event) {
  if (event.httpMethod === 'GET') {
    // Check recovery status for an order
    const { orderId, email } = event.queryStringParameters || {};

    if (orderId) {
      const order = getOrder(orderId);
      if (!order) {
        return { statusCode: 404, body: JSON.stringify({ error: 'Order not found' }) };
      }
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          status: order.status,
          email: order.email,
          productId: order.productId,
          completedAt: order.completedAt,
          paymentId: order.paymentId,
        }),
      };
    }

    if (email) {
      const orders = getOrdersByEmail(email);
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          orders: orders.map(o => ({
            orderId: o.id,
            status: o.status,
            productId: o.productId,
            completedAt: o.completedAt,
            paymentId: o.paymentId,
          })),
        }),
      };
    }

    return { statusCode: 400, body: JSON.stringify({ error: 'Missing orderId or email' }) };
  }

  if (event.httpMethod === 'POST') {
    // Re-issue download link for a completed order
    const { orderId, email, token } = JSON.parse(event.body || '{}');

    // Authenticate via JWT (optional, for recover modal)
    if (token) {
      const payload = verifyJWT(token);
      if (!payload) {
        return { statusCode: 401, body: JSON.stringify({ error: 'Invalid or expired token' }) };
      }
    }

    if (!orderId && !email) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing orderId or email' }) };
    }

    let order;
    if (orderId) {
      order = getOrder(orderId);
    } else if (email) {
      const orders = getOrdersByEmail(email);
      const completed = orders.find(o => o.status === 'completed');
      if (!completed) {
        return { statusCode: 404, body: JSON.stringify({ error: 'No completed order found for this email' }) };
      }
      order = completed;
    }

    if (!order) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Order not found' }) };
    }

    if (order.status !== 'completed') {
      return { statusCode: 400, body: JSON.stringify({ error: `Order is ${order.status}, not completed` }) };
    }

    const product = getProduct(order.productId);
    const downloadToken = signJWT(
      { orderId: order.id, productId: order.productId, email: order.email },
      '24h',
      true
    );

    const downloadUrl = `${SITE_URL}/.netlify/functions/download-pdf?token=${downloadToken}`;

    // Re-send email with download link
    await sendDownloadEmail(order.email, downloadUrl, product?.title || 'Your eBook');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        orderId: order.id,
        product: product ? { id: product.id, title: product.title } : null,
        downloadUrl,
        email: order.email,
        message: 'Download link re-issued and sent to your email',
      }),
    };
  }

  return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
}