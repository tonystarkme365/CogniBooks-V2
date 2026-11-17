export async function sendDownloadEmail(email, downloadUrl, productTitle) {
  // In production, integrate with SendGrid, Resend, Mailgun, etc.
  // For now, log to console (visible in Netlify function logs)
  console.log(`[EMAIL] Download link sent to ${email} for "${productTitle}"`);
  console.log(`[EMAIL] Download URL: ${downloadUrl}`);
  
  // Example SendGrid integration (uncomment and add @sendgrid/mail):
  /*
  import sgMail from '@sendgrid/mail';
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  await sgMail.send({
    to: email,
    from: 'noreply@cognibooks.com',
    subject: `Your ${productTitle} PDF is ready`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #00ff88;">Download Ready</h1>
        <p>Your purchase of <strong>${productTitle}</strong> is confirmed.</p>
        <p><a href="${downloadUrl}" style="background: #00ff88; color: #030a05; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Download PDF</a></p>
        <p style="color: #666; font-size: 14px;">This link expires in 24 hours and can only be used once.</p>
      </div>
    `,
  });
  */
  
  return true;
}

export async function sendOrderConfirmationEmail(email, order, payUrl) {
  console.log(`[EMAIL] Order confirmation sent to ${email} for order ${order.id}`);
  console.log(`[EMAIL] Payment URL: ${payUrl}`);
  return true;
}