/**
 * EXACT PAYMENT LINK CONFIGURATIONS
 * 
 * Pre-configured for $29.99 USD → Native USDC on Polygon
 * Wallet: 0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53
 * 
 * Copy these exact URLs and replace YOUR_API_KEY with actual keys from provider dashboards.
 */

// ============================================
// ENVIRONMENT VARIABLES REQUIRED
// ============================================
/*
Add to Netlify Dashboard → Site Settings → Environment Variables:

TRANSAK_API_KEY=your_transak_api_key_here
MOONPAY_API_KEY=your_moonpay_api_key_here
PAYBIS_API_KEY=your_paybis_api_key_here
ONRAMPER_API_KEY=your_onramper_api_key_here

TRANSAK_WEBHOOK_SECRET=your_transak_webhook_secret
MOONPAY_WEBHOOK_SECRET=your_moonpay_webhook_secret
PAYBIS_WEBHOOK_SECRET=your_paybis_webhook_secret

WALLET_ADDRESS=0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53
JWT_SECRET=your_32_char_jwt_secret
NEXT_PUBLIC_APP_URL=https://cognibook.netlify.app
SENDGRID_API_KEY=your_sendgrid_key (optional)
*/

// ============================================
// EXACT PAYMENT URLS (Replace YOUR_API_KEY)
// ============================================

// -------------------------------------------
// TRANSAK - Exact URL for $29.99 USDC on Polygon
// -------------------------------------------
/*
https://global.transak.com/?
  apiKey=YOUR_TRANSAK_API_KEY
  &cryptoCurrency=USDC
  &network=polygon
  &walletAddress=0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53
  &fiatCurrency=USD
  &fiatAmount=29.99
  &redirectURL=https%3A%2F%2Fcognibook.netlify.app%2F%23success%3Fprovider%3Dtransak
  &themeColor=00ff88
  &email=
*/

// Exact string (replace YOUR_TRANSAK_API_KEY):
const TRANSAK_URL = `https://global.transak.com/?apiKey=YOUR_TRANSAK_API_KEY&cryptoCurrency=USDC&network=polygon&walletAddress=0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53&fiatCurrency=USD&fiatAmount=29.99&redirectURL=https%3A%2F%2Fcognibook.netlify.app%2F%23success%3Fprovider%3Dtransak&themeColor=00ff88`;

// -------------------------------------------
// MOONPAY - Exact URL for $29.99 USDC on Polygon
// -------------------------------------------
/*
https://buy.moonpay.com/?
  apiKey=YOUR_MOONPAY_API_KEY
  &baseCurrencyCode=usd
  &baseCurrencyAmount=29.99
  &currencyCode=usdc
  &network=polygon
  &walletAddress=0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53
  &redirectURL=https%3A%2F%2Fcognibook.netlify.app%2F%23success%3Fprovider%3Dmoonpay
  &colorCode=00ff88
  &email=
*/

// Exact string (replace YOUR_MOONPAY_API_KEY):
const MOONPAY_URL = `https://buy.moonpay.com/?apiKey=YOUR_MOONPAY_API_KEY&baseCurrencyCode=usd&baseCurrencyAmount=29.99&currencyCode=usdc&network=polygon&walletAddress=0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53&redirectURL=https%3A%2F%2Fcognibook.netlify.app%2F%23success%3Fprovider%3Dmoonpay&colorCode=00ff88`;

// -------------------------------------------
// PAYBIS - Exact URL for $29.99 USDC on Polygon
// -------------------------------------------
/*
https://paybis.com/buy/usdc/polygon?
  apiKey=YOUR_PAYBIS_API_KEY
  &cryptoCurrency=USDC
  &network=polygon
  &wallet=0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53
  &currency=USD
  &amount=29.99
  &redirectUrl=https%3A%2F%2Fcognibook.netlify.app%2F%23success%3Fprovider%3Dpaybis
  &email=
*/

// Exact string (replace YOUR_PAYBIS_API_KEY):
const PAYBIS_URL = `https://paybis.com/buy/usdc/polygon?apiKey=YOUR_PAYBIS_API_KEY&cryptoCurrency=USDC&network=polygon&wallet=0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53&currency=USD&amount=29.99&redirectUrl=https%3A%2F%2Fcognibook.netlify.app%2F%23success%3Fprovider%3Dpaybis`;

// -------------------------------------------
// ONRAMPER (Aggregator) - Exact URL for $29.99 USDC on Polygon
// -------------------------------------------
/*
https://widget.onramper.com/?
  apiKey=YOUR_ONRAMPER_API_KEY
  &cryptoCurrency=USDC
  &network=polygon
  &walletAddress=0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53
  &fiatCurrency=USD
  &fiatAmount=29.99
  &redirectUrl=https%3A%2F%2Fcognibook.netlify.app%2F%23success%3Fprovider%3Donramper
  &email=
*/

// Exact string (replace YOUR_ONRAMPER_API_KEY):
const ONRAMPER_URL = `https://widget.onramper.com/?apiKey=YOUR_ONRAMPER_API_KEY&cryptoCurrency=USDC&network=polygon&walletAddress=0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53&fiatCurrency=USD&fiatAmount=29.99&redirectUrl=https%3A%2F%2Fcognibook.netlify.app%2F%23success%3Fprovider%3Donramper`;

// ============================================
// TEST URLS (Sandbox/Test Mode)
// ============================================

// Transak Staging:
// https://global.transak.com/?apiKey=YOUR_TRANSAK_STAGING_KEY&cryptoCurrency=USDC&network=polygon&walletAddress=0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53&fiatCurrency=USD&fiatAmount=29.99&redirectURL=https%3A%2F%2Fcognibook.netlify.app%2F%23success%3Fprovider%3Dtransak&themeColor=00ff88&isTest=true

// MoonPay Sandbox:
// https://buy.moonpay.com/?apiKey=YOUR_MOONPAY_SANDBOX_KEY&baseCurrencyCode=usd&baseCurrencyAmount=29.99&currencyCode=usdc&network=polygon&walletAddress=0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53&redirectURL=https%3A%2F%2Fcognibook.netlify.app%2F%23success%3Fprovider%3Dmoonpay&colorCode=00ff88&isTest=true

// ============================================
// WEBHOOK ENDPOINTS (Configure in Provider Dashboards)
// ============================================

/*
Transak Webhook URL:
https://cognibook.netlify.app/.netlify/functions/webhooks/payments?provider=transak

MoonPay Webhook URL:
https://cognibook.netlify.app/.netlify/functions/webhooks/payments?provider=moonpay

Paybis Webhook URL:
https://cognibook.netlify.app/.netlify/functions/webhooks/payments?provider=paybis

Onramper Webhook URL:
https://cognibook.netlify.app/.netlify/functions/webhooks/payments?provider=onramper

Expected Webhook Events:
- Transak: ORDER_COMPLETED, ORDER_FAILED
- MoonPay: crypto_purchase_completed, crypto_purchase_failed
- Paybis: payment_completed, payment_failed
- Onramper: order.completed, order.failed
*/

// ============================================
// PARAMETER REFERENCE
// ============================================

/*
TRANSAK PARAMETERS:
┌──────────────────┬────────────┬──────────────────────────────────────────────┐
│ Parameter        │ Required   │ Description                                    │
├──────────────────┼────────────┼──────────────────────────────────────────────┤
│ apiKey           │ ✅ Yes     │ Your Transak API key                          │
│ cryptoCurrency   │ ✅ Yes     │ "USDC"                                        │
│ network          │ ✅ Yes     │ "polygon"                                     │
│ walletAddress    │ ✅ Yes     │ Your USDC receiving address                   │
│ fiatCurrency     │ ✅ Yes     │ "USD"                                         │
│ fiatAmount       │ ✅ Yes     │ "29.99"                                       │
│ redirectURL      │ Optional   │ Success redirect URL                          │
│ themeColor       │ Optional   │ Hex color without # (e.g., "00ff88")          │
│ email            │ Optional   │ Pre-fill customer email                       │
│ walletAddress    │ Optional   │ User's wallet (if different from merchant)   │
│ isTest           │ Optional   │ "true" for staging                           │
└──────────────────┴────────────┴──────────────────────────────────────────────┘

MOONPAY PARAMETERS:
┌──────────────────┬────────────┬──────────────────────────────────────────────┐
│ Parameter        │ Required   │ Description                                    │
├──────────────────┼────────────┼──────────────────────────────────────────────┤
│ apiKey           │ ✅ Yes     │ Your MoonPay API key                          │
│ baseCurrencyCode │ ✅ Yes     │ "usd"                                         │
│ baseCurrencyAmount│ ✅ Yes    │ "29.99"                                       │
│ currencyCode     │ ✅ Yes     │ "usdc"                                        │
│ network          │ ✅ Yes     │ "polygon"                                     │
│ walletAddress    │ ✅ Yes     │ Your USDC receiving address                   │
│ redirectURL      │ Optional   │ Success redirect URL                          │
│ colorCode        │ Optional   │ Hex color without # (e.g., "00ff88")          │
│ email            │ Optional   │ Pre-fill customer email                       │
│ isTest           │ Optional   │ "true" for sandbox                           │
└──────────────────┴────────────┴──────────────────────────────────────────────┘

PAYBIS PARAMETERS:
┌──────────────────┬────────────┬──────────────────────────────────────────────┐
│ Parameter        │ Required   │ Description                                    │
├──────────────────┼────────────┼──────────────────────────────────────────────┤
│ apiKey           │ ✅ Yes     │ Your PayBis API key                           │
│ cryptoCurrency   │ ✅ Yes     │ "USDC"                                        │
│ network          │ ✅ Yes     │ "polygon"                                     │
│ wallet           │ ✅ Yes     │ Your USDC receiving address                   │
│ currency         │ ✅ Yes     │ "USD"                                         │
│ amount           │ ✅ Yes     │ "29.99"                                       │
│ redirectUrl      │ Optional   │ Success redirect URL                          │
│ email            │ Optional   │ Pre-fill customer email                       │
└──────────────────┴────────────┴──────────────────────────────────────────────┘

ONRAMPER PARAMETERS:
┌──────────────────┬────────────┬──────────────────────────────────────────────┐
│ Parameter        │ Required   │ Description                                    │
├──────────────────┼────────────┼──────────────────────────────────────────────┤
│ apiKey           │ ✅ Yes     │ Your Onramper API key                         │
│ cryptoCurrency   │ ✅ Yes     │ "USDC"                                        │
│ network          │ ✅ Yes     │ "polygon"                                     │
│ walletAddress    │ ✅ Yes     │ Your USDC receiving address                   │
│ fiatCurrency     │ ✅ Yes     │ "USD"                                         │
│ fiatAmount       │ ✅ Yes     │ "29.99"                                       │
│ redirectUrl      │ Optional   │ Success redirect URL                          │
│ email            │ Optional   │ Pre-fill customer email                       │
└──────────────────┴────────────┴──────────────────────────────────────────────┘
*/

// ============================================
// EXPORT FOR USE IN COMPONENTS
// ============================================

export const PAYMENT_URLS = {
  transak: TRANSAK_URL,
  moonpay: MOONPAY_URL,
  paybis: PAYBIS_URL,
  onramper: ONRAMPER_URL,
};

export const WEBHOOK_URLS = {
  transak: 'https://cognibook.netlify.app/.netlify/functions/webhooks/payments?provider=transak',
  moonpay: 'https://cognibook.netlify.app/.netlify/functions/webhooks/payments?provider=moonpay',
  paybis: 'https://cognibook.netlify.app/.netlify/functions/webhooks/payments?provider=paybis',
  onramper: 'https://cognibook.netlify.app/.netlify/functions/webhooks/payments?provider=onramper',
};

export const WALLET_CONFIG = {
  address: '0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53',
  network: 'polygon',
  currency: 'USDC',
  contract: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', // Native USDC on Polygon
};

export default {
  urls: {
    transak: TRANSAK_URL,
    moonpay: MOONPAY_URL,
    paybis: PAYBIS_URL,
    onramper: ONRAMPER_URL,
  },
  webhooks: {
    transak: 'https://cognibook.netlify.app/.netlify/functions/webhooks/payments?provider=transak',
    moonpay: 'https://cognibook.netlify.app/.netlify/functions/webhooks/payments?provider=moonpay',
    paybis: 'https://cognibook.netlify.app/.netlify/functions/webhooks/payments?provider=paybis',
    onramper: 'https://cognibook.netlify.app/.netlify/functions/webhooks/payments?provider=onramper',
  },
  wallet: {
    address: '0xe4c3a86276c87bbe8b9d8a1aff199bb696b5cf53',
    network: 'polygon',
    currency: 'USDC',
    contract: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
  },
};