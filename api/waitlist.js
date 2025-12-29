import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Send confirmation email via Brevo
async function sendConfirmationEmail(email, name) {
  const brevoApiKey = process.env.BREVO_API_KEY;

  console.log('sendConfirmationEmail called for:', email);
  console.log('Brevo API key exists:', !!brevoApiKey);

  if (!brevoApiKey) {
    console.warn('BREVO_API_KEY not set - skipping email');
    return;
  }

  try {
    console.log('Sending email via Brevo API...');
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: 'VerkView',
          email: 'info@verkview.eu'
        },
        to: [
          {
            email: email,
            name: name || email.split('@')[0]
          }
        ],
        subject: "You're on the VerkView waitlist! 🎉",
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">Welcome to VerkView!</h1>
            </div>
            <div class="content">
              <p>Hi ${name || 'there'},</p>

              <p>Thanks for joining the VerkView waitlist! We're building the next generation of issue tracking, designed for speed and flow state.</p>

              <p><strong>What's next?</strong></p>
              <ul>
                <li>We'll notify you as soon as we launch</li>
                <li>Early access for waitlist members</li>
                <li>Exclusive beta features</li>
              </ul>

              <p>In the meantime, you can follow our progress and updates.</p>

              <p>Questions? Just reply to this email - we'd love to hear from you!</p>

              <p>Best,<br>The VerkView Team</p>
            </div>
            <div class="footer">
              <p>VerkView - Issue tracking, reimagined for speed</p>
              <p><a href="https://www.verkview.eu" style="color: #667eea;">www.verkview.eu</a></p>
            </div>
          </body>
          </html>
        `
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Brevo API error:', error);
      throw new Error(`Brevo API error: ${response.status}`);
    }

    console.log('Confirmation email sent to:', email);
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    // Don't throw - email failure shouldn't prevent signup
  }
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed',
      message: 'Only POST requests are allowed'
    });
  }

  try {
    const { email, name } = req.body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Email is required'
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Invalid email format'
      });
    }

    if (trimmedEmail.length > 255) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Email too long'
      });
    }

    // Validate name (optional)
    let trimmedName = null;
    if (name && typeof name === 'string') {
      trimmedName = name.trim();
      if (trimmedName.length > 100) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: 'Name too long'
        });
      }
      if (trimmedName.length === 0) {
        trimmedName = null;
      }
    }

    // Get IP and User Agent for security tracking
    const ipAddress = req.headers['x-forwarded-for'] ||
                     req.headers['x-real-ip'] ||
                     req.socket?.remoteAddress ||
                     'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Insert into Supabase
    const { data, error } = await supabase
      .from('waitlist')
      .insert([{
        email: trimmedEmail,
        name: trimmedName,
        ip_address: ipAddress,
        user_agent: userAgent
      }])
      .select();

    // Handle duplicate email (unique constraint violation)
    if (error && error.code === '23505') {
      // Return success anyway to prevent email enumeration
      return res.status(200).json({
        success: true,
        message: "You're on the waitlist! We'll notify you when we launch."
      });
    }

    // Handle other database errors
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to join waitlist. Please try again later.'
      });
    }

    // Send confirmation email (await it to complete before responding)
    console.log('Attempting to send email to:', trimmedEmail);
    try {
      await sendConfirmationEmail(trimmedEmail, trimmedName);
      console.log('Email sent successfully');
    } catch (emailError) {
      // Log but don't fail the signup if email fails
      console.error('Email send error:', emailError);
    }

    // Return success
    return res.status(201).json({
      success: true,
      message: "You're on the waitlist! Check your email for confirmation."
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred. Please try again later.'
    });
  }
}
// Updated Mon Dec 29 10:31:57 CET 2025
// Updated Mon Dec 29 10:32:13 CET 2025
