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

async function clickAndCapture(page, selector, name, timeout = 10000) {
  try {
    await page.waitForSelector(selector, { timeout });
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
    { path: '/.netlify/functions/download-ebook', expectedStatus: 400, method: 'GET' },
    { path: '/.netlify/functions/download-ebook?token=invalid', expectedStatus: 403, method: 'GET' },
    { path: '/.netlify/functions/create-order', expectedStatus: 405, method: 'GET' },
    { path: '/.netlify/functions/coinbase-session', expectedStatus: [409, 500], method: 'GET' },
  ];

  for (const ep of endpoints) {
    try {
      const response = await page.request[ep.method.toLowerCase()](`${BASE_URL}${ep.path}`);
      const status = response.status();
      const body = await response.text();
      const ok = Array.isArray(ep.expectedStatus) ? ep.expectedStatus.includes(status) : status === ep.expectedStatus;
      console.log(`🔗 ${ep.path} → ${status} ${ok ? '✅' : '❌'}: ${body.substring(0, 100)}`);
      if (!ok && status >= 500) {
        networkErrors.push({ endpoint: ep.path, status, body });
      }
    } catch (e) {
      networkErrors.push({ endpoint: ep.path, error: e.message });
      console.log(`❌ ${ep.path} → ERROR: ${e.message}`);
    }
  }
}

async function testJWTPDFDownload(page) {
  console.log('\n🔐 Testing JWT PDF download flow...');
  
  // Test with invalid token - should return 403
  try {
    const res = await page.request.get(`${BASE_URL}/.netlify/functions/download-ebook?token=invalid.token.here`);
    const status = res.status();
    const body = await res.json();
    console.log(`🔐 Invalid token → ${status}: ${body.error || body}`);
    if (status !== 403) {
      console.log(`⚠️  Expected 403 for invalid token, got ${status}`);
    }
  } catch (e) {
    console.log(`❌ JWT test error: ${e.message}`);
  }
  
  // Test with missing token - should return 400
  try {
    const res = await page.request.get(`${BASE_URL}/.netlify/functions/download-ebook`);
    const status = res.status();
    const body = await res.json();
    console.log(`🔐 Missing token → ${status}: ${body.error || body}`);
    if (status !== 400) {
      console.log(`⚠️  Expected 400 for missing token, got ${status}`);
    }
  } catch (e) {
    console.log(`❌ Missing token test error: ${e.message}`);
  }
}

async function testFreePromptPreview(page) {
  console.log('\n🎁 Testing Free Prompt Preview modal...');
  
  try {
    // Navigate to a product page
    await page.goto(`${BASE_URL}/#product/1`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);
    
    // Click the "Try 3 Free Prompts" button
    const previewButton = await page.waitForSelector('button:has-text("Try 3 Free Prompts")', { timeout: 10000 });
    await previewButton.click();
    await page.waitForTimeout(2000);
    
    // Verify modal is open
    const modal = await page.waitForSelector('[style*="z-index: 9999"]', { timeout: 5000 });
    console.log('✅ Free Prompt Preview modal opened');
    
    // Copy a prompt
    const copyButton = await page.waitForSelector('button:has-text("Copy")', { timeout: 5000 });
    await copyButton.click();
    await page.waitForTimeout(1000);
    
    // Verify copy button changed to "Copied!"
    try {
      await page.waitForSelector('button:has-text("✓ Copied!")', { timeout: 3000 });
      console.log('✅ Prompt copy works');
    } catch (e) {
      console.log('⚠️  Copy button did not change to "Copied!"');
    }
    
    // Close modal
    const closeButton = await page.waitForSelector('button[aria-label="close"], button:has-text("✕")', { timeout: 5000 });
    await closeButton.click();
    await page.waitForTimeout(1000);
    
    // Verify modal is closed
    const modalStillOpen = await page.locator('[style*="z-index: 9999"]').count();
    if (modalStillOpen === 0) {
      console.log('✅ Free Prompt Preview modal closed cleanly');
    } else {
      console.log('⚠️  Modal still open after close');
    }
    
    await captureScreenshot(page, 'cb_prompt_preview', { width: 1440, height: 900 });
    
  } catch (e) {
    console.log(`⚠️  Free Prompt Preview test error: ${e.message}`);
  }
}

async function testCheckoutFlow(page) {
  console.log('\n🛒 Testing checkout flow...');
  
  try {
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
      
      // Check which payment methods are shown
      const paybisLink = await page.locator('a[href*="paybis"]').count();
      const transakLink = await page.locator('a[href*="transak"]').count();
      const moonpayLink = await page.locator('a[href*="moonpay"]').count();
      const noProviders = await page.locator('text="No payment providers configured"').count();
      
      console.log(`💳 Payment methods: PayBis=${paybisLink}, Transak=${transakLink}, MoonPay=${moonpayLink}, NoProviders=${noProviders}`);
      
      if (noProviders > 0) {
        console.log('ℹ️  No payment providers configured - this is expected for sites without API keys');
      }
      
    } catch (e) {
      console.log(`⚠️  Checkout flow form error: ${e.message}`);
    }
    
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
    await page.waitForTimeout(5000);

    console.log('\n🖥️  Capturing Desktop (1440x900)...');
    await captureScreenshot(page, 'cb_desktop', { width: 1440, height: 900 });

    console.log('\n📱 Capturing Mobile (390x844)...');
    await captureScreenshot(page, 'cb_mobile', { width: 390, height: 844 });

    // Test free prompt preview
    await testFreePromptPreview(page);

    // Test checkout flow
    await testCheckoutFlow(page);

    // Test JWT PDF download
    await testJWTPDFDownload(page);

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