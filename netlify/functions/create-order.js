import { createOrder, getProduct } from './utils/db.js';
import { signJWT } from './utils/jwt.js';

const WALLET = process.env.WALLET_ADDRESS || '0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53';
const SITE_URL = process.env.URL || 'https://cognibook.netlify.app';

function buildPayBisUrl({ amount, orderId, token }) {
  const params = new URLSearchParams({
    amount: amount.toFixed(2),
    currency: 'USD',
    wallet: WALLET,
    network: 'polygon',
    // Note: PayBis doesn't support custom callback URLs in standard flow
    // For production, use their API webhook configuration
  });
  return `https://paybis.com/buy/usdc/polygon?${params.toString()}&order_id=${orderId}`;
}

function buildTransakUrl({ amount, orderId, token }) {
  const params = new URLSearchParams({
    amount: amount.toFixed(2),
    currency: 'USD',
    walletAddress: WALLET,
    network: 'polygon',
    cryptoCurrency: 'USDC',
  });
  return `https://global.transak.com/?${params.toString()}`;
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const { productId, email, name } = JSON.parse(event.body || '{}');
    
    if (!productId || !email || !name) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields: productId, email, name' }) };
    }

    const product = getProduct(productId);
    if (!product) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Product not found' }) };
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid email address' }) };
    }

    // Create order
    const order = createOrder({
      productId,
      email,
      name: name.trim(),
      amount: product.price,
      provider: 'paybis', // default, user chooses on checkout page
    });

    // Generate JWT for payment session (15 min expiry)
    const paymentToken = signJWT({ orderId: order.id, productId: product.id, amount: product.price }, '15m');

    // Build payment URLs
    const paybisUrl = buildPayBisUrl({ amount: product.price, orderId: order.id, token: paymentToken });
    const transakUrl = buildTransakUrl({ amount: product.price, orderId: order.id, token: paymentToken });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: order.id,
        amount: product.price,
        product: { id: product.id, title: product.title },
        paybisUrl,
        transakUrl,
        paymentToken,
      }),
    };
  } catch (err) {
    console.error('Create order error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error' }) };
  }
}