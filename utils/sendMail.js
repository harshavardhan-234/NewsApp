// utils/sendMail.js
const nodemailer = require('nodemailer');
const generateInvoice = require('./generateInvoice');

async function sendSuccessEmail({ name, phone, plan, amount, email, invoiceId }) {
  const invoicePath = generateInvoice({ name, phone, plan, amount, invoiceId });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'yourgmail@gmail.com',
      pass: 'your-app-password', // Use App Passwords, not your real Gmail password
    },
  });

  const mailOptions = {
    from: 'yourgmail@gmail.com',
    to: email,
    subject: '✅ Payment Successful - News Subscription',
    html: `
      <h2>Hi ${name},</h2>
      <p>Thank you for subscribing. Your payment was successful.</p>
      <p><strong>Plan:</strong> ${plan}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p>Your login is now active.</p>
      <br>
      <p>🧾 Your invoice is attached with this mail.</p>
    `,
    attachments: [
      {
        filename: `invoice-${invoiceId}.pdf`,
        path: invoicePath,
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Success email sent to:', email);
    return true;
  } catch (error) {
    console.error('❌ Failed to send success email:', error);
    // Log error but don't throw exception
    return false;
  }
}

module.exports = sendSuccessEmail;
