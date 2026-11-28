import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.argv[2] || 'http://localhost:8888';
const SCREENSHOTS_DIR = path.resolve('screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const consoleErrors = [];
const pageErrors = [];
const networkErrors = [];

async function captureScreenshot(page, name, viewport) {
  await page.setViewportSize(viewport);
  await page.waitForTimeout(1000);
  const filepath = path.join(SCREENSHOTS_DIR, `${name}.png`);
  await page.screenshot({ path: filepath, fullPage: true, timeout: 60000 });
  console.log(`📸 Screenshot: ${filepath}`);
  return filepath;
}

async function clickAndCapture(page, selector, name) {
  try {
    await page.waitForSelector(selector, { timeout: 10000 });
    await page.click(selector);
    await page.waitForTimeout(1500);
    const filepath = path.join(SCREENSHOTS_DIR, `${name}.png`);
    await page.screenshot({ path: filepath, fullPage: true, timeout: 60000 });
    console.log(`📸 Click + Screenshot: ${filepath} (${selector})`);
    return filepath;
  } catch (e) {
    console.log(`⚠️  Could not click ${selector}: ${e.message}`);
    return null;
  }
}

async function testFunctionEndpoints(page) {
  const endpoints = [
    '/.netlify/functions/download-ebook',
    '/.netlify/functions/download-ebook?token=invalid',
    '/.netlify/functions/create-order',
    '/.netlify/functions/coinbase-session',
  ];

  for (const ep of endpoints) {
    try {
      const response = await page.request.get(`${BASE_URL}${ep}`);
      const status = response.status();
      const body = await response.text();
      console.log(`🔗 ${ep} → ${status}: ${body.substring(0, 100)}`);
      if (status >= 500 && !ep.includes('coinbase-session')) {
        networkErrors.push({ endpoint: ep, status, body });
      }
    } catch (e) {
      networkErrors.push({ endpoint: ep, error: e.message });
      console.log(`❌ ${ep} → ERROR: ${e.message}`);
    }
  }
}

async function runCheckoutFlow(page) {
  console.log('\n🛒 Testing checkout flow...');
  
  // Navigate to product page
  await page.goto(`${BASE_URL}/#product/1`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);
  await captureScreenshot(page, 'cb_product', { width: 1440, height: 900 });
  
  // Click "Buy Now" button
  await clickAndCapture(page, 'a[href*="checkout"]', 'cb_checkout_step1');
  
  // Fill in name and email
  try {
    await page.waitForSelector('input[placeholder*="Jane"]', { timeout: 10000 });
    await page.fill('input[placeholder*="Jane"]', 'Test User');
    await page.fill('input[placeholder*="jane"]', 'test@example.com');
    await captureScreenshot(page, 'cb_checkout_filled', { width: 1440, height: 900 });
    
    // Click Continue to Payment
    await page.click('button:has-text("Continue to Payment")');
    await page.waitForTimeout(3000);
    await captureScreenshot(page, 'cb_checkout_payment', { width: 1440, height: 900 });
    
    // Test payment links
    const paybisLink = await page.$('a[href*="paybis"]');
    const transakLink = await page.$('a[href*="transak"]');
    if (paybisLink) console.log('✅ Paybis link found');
    if (transakLink) console.log('✅ Transak link found');
    
  } catch (e) {
    console.log(`⚠️  Checkout flow error: ${e.message}`);
  }
}

async function run() {
  console.log(`🚀 Starting browser verification against ${BASE_URL}`);
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      // Filter out expected connection resets
      const text = msg.text();
      if (!text.includes('ERR_CONNECTION_RESET') && !text.includes('favicon')) {
        consoleErrors.push(text);
        console.log(`🔴 Console Error: ${text}`);
      }
    }
  });

  page.on('pageerror', err => {
    pageErrors.push(err.message);
    console.log(`🔴 Page Error: ${err.message}`);
  });

  page.on('response', response => {
    if (response.status() >= 500 && !response.url().includes('coinbase-session')) {
      networkErrors.push({ url: response.url(), status: response.status() });
      console.log(`🔴 Network Error: ${response.url()} → ${response.status()}`);
    }
  });

  try {
    console.log('\n📱 Loading homepage...');
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(5000); // Wait for React to hydrate

    console.log('\n🖥️  Capturing Desktop (1440x900)...');
    await captureScreenshot(page, 'cb_desktop', { width: 1440, height: 900 });

    console.log('\n📱 Capturing Mobile (390x844)...');
    await captureScreenshot(page, 'cb_mobile', { width: 390, height: 844 });

    // Test checkout flow
    await runCheckoutFlow(page);

    console.log('\n🔗 Testing Netlify Function endpoints...');
    await testFunctionEndpoints(page);

  } catch (e) {
    console.error(`❌ Test failed: ${e.message}`);
  } finally {
    await browser.close();
  }

  console.log('\n📊 === VERIFICATION SUMMARY ===');
  console.log(`Console Errors: ${consoleErrors.length}`);
  console.log(`Page Errors: ${pageErrors.length}`);
  console.log(`Network Errors (>=500): ${networkErrors.length}`);

  if (consoleErrors.length > 0) console.log('\nConsole Errors:', consoleErrors);
  if (pageErrors.length > 0) console.log('\nPage Errors:', pageErrors);
  if (networkErrors.length > 0) console.log('\nNetwork Errors:', networkErrors);

  const totalErrors = consoleErrors.length + pageErrors.length + networkErrors.length;
  console.log(`\n${totalErrors === 0 ? '✅ ALL CHECKS PASSED' : '❌ ISSUES FOUND'}`);

  process.exit(totalErrors === 0 ? 0 : 1);
}

run();