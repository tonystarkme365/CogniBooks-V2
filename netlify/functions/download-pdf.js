import { verifyJWT, invalidateToken } from './utils/jwt.js';
import { getProduct } from './utils/db.js';
import { getPDFStream, getPDFBuffer, pdfExists } from './utils/storage.js';

const FILENAME_SANITIZE_REGEX = /[^a-zA-Z0-9]/g;

export async function handler(event) {
  const { token } = event.queryStringParameters || {};

  if (!token) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Missing download token' }),
    };
  }

  // Verify JWT token
  const payload = verifyJWT(token);
  if (!payload) {
    return {
      statusCode: 403,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid or expired download token' }),
    };
  }

  // Check single-use token
  if (payload.singleUse) {
    const entry = TOKEN_STORE?.get?.(payload.jti);
    if (entry?.used) {
      return {
        statusCode: 403,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Download token already used' }),
      };
    }
  }

  // Get product info
  const product = getProduct(payload.productId);
  if (!product) {
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Product not found' }),
    };
  }

  // Check if PDF exists
  if (!pdfExists(product.pdfPath)) {
    console.error(`PDF not found: ${product.pdfPath}`);
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'PDF file not found on server' }),
    };
  }

  // Mark token as used (single-use)
  if (payload.singleUse && payload.jti) {
    invalidateToken(payload.jti);
  }

  // Get PDF buffer
  const pdfBuffer = getPDFBuffer(product.pdfPath);
  if (!pdfBuffer) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to read PDF file' }),
    };
  }

  const filename = `${product.title.replace(FILENAME_SANITIZE_REGEX, '_')}.pdf`;

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

// Simple in-memory token store for single-use validation (also in jwt.js)
// This is duplicated here for function isolation - in production use Redis/KV
const TOKEN_STORE = new Map();