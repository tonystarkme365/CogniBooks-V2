import crypto from 'crypto';

// Coinbase CDP configuration
const CDP_API_KEY_NAME = process.env.CDP_API_KEY_NAME || '';
const CDP_API_KEY_PRIVATE_KEY = process.env.CDP_API_KEY_PRIVATE_KEY || '';
const CDP_PROJECT_ID = process.env.NEXT_PUBLIC_CDP_PROJECT_ID || '';
const WALLET_ADDRESS = process.env.WALLET_ADDRESS || '0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53';
const SITE_URL = process.env.URL || 'https://cognibook.netlify.app';

/**
 * Generate ES256 JWT for Coinbase CDP authentication
 */
function generateCDPToken(payload: object): string {
  const header = {
    alg: 'ES256',
    typ: 'JWT',
    kid: CDP_API_KEY_NAME,
  };
  
  const now = Math.floor(Date.now() / 1000);
  const claims = {
    ...payload,
    iss: CDP_API_KEY_NAME,
    sub: CDP_API_KEY_NAME,
    aud: 'coinbase',
    iat: now,
    exp: now + 300, // 5 minutes
  };
  
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedClaims = Buffer.from(JSON.stringify(claims)).toString('base64url');
  const signingInput = `${encodedHeader}.${encodedClaims}`;
  
  // Sign with ES256 (ECDSA with P-256 and SHA-256)
  const sign = crypto.createSign('SHA256');
  sign.update(signingInput);
  sign.end();
  const signature = sign.sign(CDP_API_KEY_PRIVATE_KEY, 'base64url');
  
  return `${encodedHeader}.${encodedClaims}.${signature}`;
}

export async function handler(event) {
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    // Validate required environment variables
    if (!CDP_API_KEY_NAME || !CDP_API_KEY_PRIVATE_KEY) {
      console.error('Coinbase CDP credentials not configured');
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: 'Coinbase CDP not configured. Set CDP_API_KEY_NAME and CDP_API_KEY_PRIVATE_KEY environment variables.' }) 
      };
    }

    const { amount, redirectUrl } = event.queryStringParameters || {};
    
    if (!amount) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing amount parameter' }) };
    }

    const amountUsd = parseFloat(amount);
    if (isNaN(amountUsd) || amountUsd <= 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid amount' }) };
    }

    // Generate CDP session token
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

    // Build Coinbase Onramp URL
    const params = new URLSearchParams({
      sessionToken: sessionToken,
      defaultAsset: 'USDC',
      defaultNetwork: 'polygon',
      presetFiatAmount: amount,
      fiatCurrency: 'USD',
      partnerUserId: `order_${Date.now()}`,
    });

    const coinbaseUrl = `https://coinbase.com/buy?${params.toString()}`;

    // Redirect to Coinbase Onramp
    return {
      statusCode: 302,
      headers: {
        Location: coinbaseUrl,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
      body: '',
    };
  } catch (err) {
    console.error('Coinbase session error:', err);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: 'Failed to create Coinbase session' }) 
    };
  }
}