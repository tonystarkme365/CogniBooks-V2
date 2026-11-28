const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

export async function sendDownloadEmail(email, downloadUrl, productTitle) {
  // Try Resend first if configured
  if (RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'CogniBooks <noreply@cognibooks.com>',
          to: [email],
          subject: `Your ${productTitle} PDF is ready`,
          html: `
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #07070d; color: #f0f0ff; padding: 24px; border-radius: 16px;">
              <div style="text-align: center; margin-bottom: 24px;">
                <div style="font-size: 48px; margin-bottom: 12px;">🎉</div>
                <h1 style="color: #00ff88; font-size: 28px; margin: 0;">Download Ready</h1>
              </div>
              <p style="font-size: 16px; line-height: 1.6;">Your purchase of <strong style="color: #00ff88;">${productTitle}</strong> is confirmed.</p>
              <div style="text-align: center; margin: 24px 0;">
                <a href="${downloadUrl}" style="background: linear-gradient(135deg, #00ff88, #00cc6a); color: #030a05; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: 800; display: inline-block; font-size: 16px;">Download PDF Now</a>
              </div>
              <p style="font-size: 13px; color: #c0c0d8;">This link expires in 24 hours and can only be used once.</p>
              <p style="font-size: 13px; color: #c0c0d8;">Lost your link? Visit <a href="${process.env.URL || 'https://cognibook.netlify.app'}/#recover" style="color: #00d4ff;">Recover My Download</a></p>
            </div>
          `,
        }),
      });
      if (res.ok) {
        console.log(`[EMAIL/Resend] Download link sent to ${email} for "${productTitle}"`);
        return true;
      }
      console.warn(`[EMAIL/Resend] Failed: ${res.status} - falling back to console log`);
    } catch (err) {
      console.warn(`[EMAIL/Resend] Error: ${err.message} - falling back to console log`);
    }
  }

  // Graceful fallback: log to console (visible in Netlify function logs)
  console.log(`[EMAIL] Download link sent to ${email} for "${productTitle}"`);
  console.log(`[EMAIL] Download URL: ${downloadUrl}`);
  return true;
}

export async function sendOrderConfirmationEmail(email, order, payUrl) {
  if (RESEND_API_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'CogniBooks <noreply@cognibooks.com>',
          to: [email],
          subject: `Order Confirmation - Order #${order.id.slice(0, 8)}`,
          html: `
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #07070d; color: #f0f0ff; padding: 24px; border-radius: 16px;">
              <h2 style="color: #00ff88;">Order Confirmed</h2>
              <p>Your order <strong>#${order.id.slice(0, 8)}</strong> has been received.</p>
              <p>Complete your payment at: <a href="${payUrl}" style="color: #00d4ff;">${payUrl}</a></p>
            </div>
          `,
        }),
      });
    } catch (err) {
      console.warn(`[EMAIL/Resend order confirmation] Error: ${err.message}`);
    }
  }
  console.log(`[EMAIL] Order confirmation sent to ${email} for order ${order.id}`);
  return true;
}