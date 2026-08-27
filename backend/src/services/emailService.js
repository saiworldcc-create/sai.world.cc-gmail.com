const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: process.env.SMTP_SECURE === 'true' || true,
  auth: {
    user: process.env.SMTP_USER || 'sai.internationals156@gmail.com',
    pass: process.env.SMTP_PASS || 'arxiqeenougribkf',
  },
});

const DEFAULT_FROM = process.env.EMAIL_FROM || '"Sai International Couriers & Cargo" <sai.internationals156@gmail.com>';
const ALERT_RECIPIENT = process.env.ALERT_EMAIL || 'sai.internationals156@gmail.com';

/**
 * Verify SMTP connection
 */
async function verifySMTP() {
  try {
    await transporter.verify();
    console.log('✅ SMTP Mailer connected successfully (sai.internationals156@gmail.com)');
    return true;
  } catch (err) {
    console.error('⚠️ SMTP Verification failed:', err.message);
    return false;
  }
}

/**
 * Send New Doorstep Pickup Booking Alert
 */
async function sendBookingAlert(booking) {
  try {
    const {
      awb,
      senderName,
      senderPhone,
      senderAddress,
      branchZone,
      pickupDate,
      pickupTimeSlot,
      destCountry,
      receiverName,
      receiverPhone,
      itemCategory,
      estimatedWeight,
      specialInstructions,
    } = booking;

    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: #1E3446; padding: 20px; text-align: center; color: #ffffff;">
          <h2 style="margin: 0; font-size: 20px; letter-spacing: 0.5px;">SAI INTERNATIONAL COURIERS & CARGO</h2>
          <p style="margin: 5px 0 0 0; font-size: 13px; color: #3C9290;">New Doorstep Pickup Booking Alert</p>
        </div>
        
        <div style="padding: 24px; color: #2D3748;">
          <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px;">
            <span style="font-size: 12px; color: #166534; font-weight: bold; text-transform: uppercase;">AWB Reference:</span>
            <div style="font-size: 22px; font-weight: 800; color: #0056B3; margin-top: 4px;">${awb}</div>
          </div>

          <h3 style="font-size: 15px; color: #1E3446; border-bottom: 2px solid #E2E8F0; padding-bottom: 6px; margin: 0 0 14px 0;">Sender Details (Pickup Location)</h3>
          <table style="width: 100%; font-size: 14px; margin-bottom: 20px; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #718096; width: 140px;"><strong>Sender Name:</strong></td><td style="padding: 6px 0; color: #1A202C;">${senderName}</td></tr>
            <tr><td style="padding: 6px 0; color: #718096;"><strong>Phone:</strong></td><td style="padding: 6px 0; color: #1A202C;"><a href="tel:${senderPhone}" style="color: #0056B3; text-decoration: none; font-weight: bold;">${senderPhone}</a></td></tr>
            <tr><td style="padding: 6px 0; color: #718096;"><strong>Pickup Address:</strong></td><td style="padding: 6px 0; color: #1A202C;">${senderAddress}</td></tr>
            <tr><td style="padding: 6px 0; color: #718096;"><strong>Branch Zone:</strong></td><td style="padding: 6px 0; color: #1A202C;">${branchZone || 'Kadapa Main'}</td></tr>
            <tr><td style="padding: 6px 0; color: #718096;"><strong>Preferred Time:</strong></td><td style="padding: 6px 0; color: #1A202C;">${pickupDate || 'Earliest available'} (${pickupTimeSlot || 'Standard'})</td></tr>
          </table>

          <h3 style="font-size: 15px; color: #1E3446; border-bottom: 2px solid #E2E8F0; padding-bottom: 6px; margin: 0 0 14px 0;">Shipment & Destination Details</h3>
          <table style="width: 100%; font-size: 14px; margin-bottom: 20px; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #718096; width: 140px;"><strong>Destination Country:</strong></td><td style="padding: 6px 0; color: #1A202C; font-weight: bold; font-size: 15px; color: #0056B3;">${destCountry}</td></tr>
            <tr><td style="padding: 6px 0; color: #718096;"><strong>Receiver Name:</strong></td><td style="padding: 6px 0; color: #1A202C;">${receiverName}</td></tr>
            <tr><td style="padding: 6px 0; color: #718096;"><strong>Receiver Phone:</strong></td><td style="padding: 6px 0; color: #1A202C;">${receiverPhone}</td></tr>
            <tr><td style="padding: 6px 0; color: #718096;"><strong>Item Category:</strong></td><td style="padding: 6px 0; color: #1A202C;">${itemCategory || 'NRI Food / Courier'}</td></tr>
            <tr><td style="padding: 6px 0; color: #718096;"><strong>Estimated Weight:</strong></td><td style="padding: 6px 0; color: #1A202C;">${estimatedWeight || 'Standard'}</td></tr>
            ${specialInstructions ? `<tr><td style="padding: 6px 0; color: #718096;"><strong>Instructions:</strong></td><td style="padding: 6px 0; color: #1A202C;">${specialInstructions}</td></tr>` : ''}
          </table>

          <div style="background: #F8FAFC; border-radius: 8px; padding: 14px; text-align: center;">
            <p style="margin: 0 0 10px 0; font-size: 13px; color: #64748B;">Dispatch pickup van or contact customer immediately:</p>
            <a href="tel:${senderPhone}" style="display: inline-block; background: #0056B3; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; margin-right: 8px;">Call Sender (${senderPhone})</a>
            <a href="https://wa.me/${senderPhone.replace(/[^0-9]/g, '')}" style="display: inline-block; background: #25D366; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px;">WhatsApp Customer</a>
          </div>
        </div>

        <div style="background: #F1F5F9; padding: 12px 20px; text-align: center; font-size: 12px; color: #94A3B8;">
          Sai International Couriers & Cargo · Kadapa, Andhra Pradesh · 24/7 Logistics Hub
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: DEFAULT_FROM,
      to: ALERT_RECIPIENT,
      subject: `🚨 New Pickup Booking [${awb}] - ${senderName} to ${destCountry}`,
      html: adminHtml,
    });

    console.log(`✉️ Booking alert email sent to ${ALERT_RECIPIENT} (MessageId: ${info.messageId})`);
    return true;
  } catch (err) {
    console.error('Failed to send booking alert email:', err.message);
    return false;
  }
}

/**
 * Send New Contact / Inquiry Alert
 */
async function sendContactAlert(contact) {
  try {
    const {
      name,
      phone,
      email,
      branch,
      destCountry,
      shipmentCategory,
      parcelWeight,
      pickupAddress,
      message,
    } = contact;

    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: #1E3446; padding: 20px; text-align: center; color: #ffffff;">
          <h2 style="margin: 0; font-size: 20px; letter-spacing: 0.5px;">SAI INTERNATIONAL COURIERS & CARGO</h2>
          <p style="margin: 5px 0 0 0; font-size: 13px; color: #3C9290;">New Customer Inquiry / Rate Quote Request</p>
        </div>
        
        <div style="padding: 24px; color: #2D3748;">
          <table style="width: 100%; font-size: 14px; margin-bottom: 20px; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #718096; width: 140px;"><strong>Customer Name:</strong></td><td style="padding: 8px 0; color: #1A202C; font-weight: bold;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #718096;"><strong>Phone Number:</strong></td><td style="padding: 8px 0; color: #1A202C;"><a href="tel:${phone}" style="color: #0056B3; text-decoration: none; font-weight: bold;">${phone}</a></td></tr>
            ${email ? `<tr><td style="padding: 8px 0; color: #718096;"><strong>Email Address:</strong></td><td style="padding: 8px 0; color: #1A202C;"><a href="mailto:${email}" style="color: #0056B3;">${email}</a></td></tr>` : ''}
            <tr><td style="padding: 8px 0; color: #718096;"><strong>Preferred Branch:</strong></td><td style="padding: 8px 0; color: #1A202C;">${branch || 'Kadapa Main'}</td></tr>
            <tr><td style="padding: 8px 0; color: #718096;"><strong>Destination Country:</strong></td><td style="padding: 8px 0; color: #1A202C; font-weight: bold; color: #0056B3;">${destCountry || 'General Inquiry'}</td></tr>
            ${shipmentCategory ? `<tr><td style="padding: 8px 0; color: #718096;"><strong>Shipment Category:</strong></td><td style="padding: 8px 0; color: #1A202C;">${shipmentCategory}</td></tr>` : ''}
            ${parcelWeight ? `<tr><td style="padding: 8px 0; color: #718096;"><strong>Estimated Weight:</strong></td><td style="padding: 8px 0; color: #1A202C;">${parcelWeight}</td></tr>` : ''}
            ${pickupAddress ? `<tr><td style="padding: 8px 0; color: #718096;"><strong>Pickup Address:</strong></td><td style="padding: 8px 0; color: #1A202C;">${pickupAddress}</td></tr>` : ''}
            ${message ? `<tr><td style="padding: 8px 0; color: #718096;"><strong>Message / Notes:</strong></td><td style="padding: 8px 0; color: #1A202C; background: #F8FAFC; padding: 10px; border-radius: 6px;">${message}</td></tr>` : ''}
          </table>

          <div style="background: #F8FAFC; border-radius: 8px; padding: 14px; text-align: center;">
            <a href="tel:${phone}" style="display: inline-block; background: #0056B3; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; margin-right: 8px;">Call Customer (${phone})</a>
            <a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}" style="display: inline-block; background: #25D366; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px;">WhatsApp Customer</a>
          </div>
        </div>

        <div style="background: #F1F5F9; padding: 12px 20px; text-align: center; font-size: 12px; color: #94A3B8;">
          Sai International Couriers & Cargo · Kadapa, Andhra Pradesh · 24/7 Logistics Hub
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: DEFAULT_FROM,
      to: ALERT_RECIPIENT,
      subject: `📬 New Website Inquiry from ${name} (${phone}) - To: ${destCountry || 'General'}`,
      html: adminHtml,
    });

    console.log(`✉️ Contact alert email sent to ${ALERT_RECIPIENT} (MessageId: ${info.messageId})`);

    // If customer provided their email, send them a courtesy receipt
    if (email && email.includes('@')) {
      const customerHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background: #1E3446; padding: 20px; text-align: center; color: #ffffff;">
            <h2 style="margin: 0; font-size: 18px;">SAI INTERNATIONAL COURIERS & CARGO</h2>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #3C9290;">Worldwide Express Courier & Cargo Solutions</p>
          </div>
          <div style="padding: 24px; color: #2D3748; line-height: 1.6;">
            <p>Dear <strong>${name}</strong>,</p>
            <p>Thank you for reaching out to Sai International Couriers & Cargo. We have successfully received your inquiry regarding international courier services to <strong>${destCountry || 'your destination'}</strong>.</p>
            <p>Our dedicated logistics manager will review your request and call you back at <strong>${phone}</strong> shortly to assist you with rates, documentation, and doorstep collection.</p>
            
            <div style="background: #F8FAFC; border-left: 4px solid #0056B3; padding: 12px 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
              <strong>Immediate Assistance:</strong><br />
              📞 Call: <a href="tel:+919059949365" style="color: #0056B3;">+91 90599 49365</a> | <a href="tel:+919603149365" style="color: #0056B3;">+91 96031 49365</a><br />
              💬 WhatsApp: <a href="https://wa.me/919059949365" style="color: #25D366;">+91 90599 49365</a><br />
              📍 Kadapa Main Hub: 41/1248, Ratna Sabhapathi Building, Co-operative Colony, Kadapa, AP
            </div>

            <p style="font-size: 13px; color: #718096;">Warm regards,<br /><strong>Customer Support Team</strong><br />Sai International Couriers & Cargo</p>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: DEFAULT_FROM,
        to: email,
        subject: `Thank you for contacting Sai International Couriers & Cargo`,
        html: customerHtml,
      }).catch(e => console.warn('Customer receipt email error:', e.message));
    }

    return true;
  } catch (err) {
    console.error('Failed to send contact alert email:', err.message);
    return false;
  }
}

module.exports = {
  transporter,
  verifySMTP,
  sendBookingAlert,
  sendContactAlert,
};
