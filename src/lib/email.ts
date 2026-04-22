import nodemailer from 'nodemailer';
import { CONTACT_INFO } from '@/config/contact';

// Debug log for environment variables (safely)
console.log('Email Config Check:', {
    hasUser: !!process.env.EMAIL_USER,
    hasPass: !!process.env.EMAIL_PASSWORD,
    userEmail: process.env.EMAIL_USER ? `${process.env.EMAIL_USER.substring(0, 3)}...` : 'N/A'
});

// Email configuration
// Using explicit host/port for better production reliability
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Verify transporter configuration
export async function verifyEmailConfig() {
    try {
        await transporter.verify();
        console.log('Email server is ready to send messages');
        return true;
    } catch (error) {
        console.error('Email configuration error:', error);
        return false;
    }
}

interface ContactEmailData {
    name: string;
    email: string;
    phone?: string;
    message: string;
}

/**
 * Send contact form email notification
 */
export async function sendContactEmail(data: ContactEmailData) {
    const { name, email, phone, message } = data;

    // Email to admin (you)
    const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: CONTACT_INFO.email, // Your email from config
        subject: `New Contact Form Submission from ${name}`,
        html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .field { margin-bottom: 20px; }
            .label { font-weight: bold; color: #9333ea; margin-bottom: 5px; }
            .value { background: white; padding: 10px; border-radius: 5px; border-left: 3px solid #9333ea; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">📧 New Contact Form Submission</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">👤 Name:</div>
                <div class="value">${name}</div>
              </div>
              
              <div class="field">
                <div class="label">📧 Email:</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              
              ${phone ? `
              <div class="field">
                <div class="label">📱 Phone:</div>
                <div class="value"><a href="tel:${phone}">${phone}</a></div>
              </div>
              ` : ''}
              
              <div class="field">
                <div class="label">💬 Message:</div>
                <div class="value">${message.replace(/\n/g, '<br>')}</div>
              </div>
              
              <div class="footer">
                <p>This email was sent from the ${CONTACT_INFO.company.name} contact form.</p>
                <p>Received on ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    };

    // Auto-reply email to customer
    const customerMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Thank you for contacting ${CONTACT_INFO.company.name}`,
        html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">✅ Message Received!</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${name}</strong>,</p>
              
              <p>Thank you for contacting <strong>${CONTACT_INFO.company.name}</strong>! We have received your message and will get back to you as soon as possible.</p>
              
              <p><strong>Your message:</strong></p>
              <div style="background: white; padding: 15px; border-radius: 5px; border-left: 3px solid #9333ea; margin: 15px 0;">
                ${message.replace(/\n/g, '<br>')}
              </div>
              
              <p>If you have any urgent questions, feel free to contact us directly at:</p>
              <p>📧 Email: <a href="mailto:${CONTACT_INFO.email}">${CONTACT_INFO.email}</a></p>
              ${CONTACT_INFO.phone ? `<p>📱 Phone: <a href="tel:${CONTACT_INFO.phone}">${CONTACT_INFO.phone}</a></p>` : ''}
              
              <div class="footer">
                <p>Best regards,<br><strong>${CONTACT_INFO.company.name} Team</strong></p>
                <p style="margin-top: 20px;">${CONTACT_INFO.company.tagline}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    };

    try {
        // Send both emails
        await Promise.all([
            transporter.sendMail(adminMailOptions),
            transporter.sendMail(customerMailOptions),
        ]);

        console.log('Contact emails sent successfully');
        return { success: true };
    } catch (error) {
        console.error('Error sending contact email:', error);
        throw error;
    }
}
