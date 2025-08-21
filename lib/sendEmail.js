// lib/sendEmail.js
import nodemailer from 'nodemailer';

export async function sendEmailWithInvoice(toEmail, pdfBuffer) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      // Do not fail on invalid certificates
      rejectUnauthorized: false
    },
  });

  await transporter.sendMail({
    from: `"News Portal" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Your Subscription Invoice',
    text: 'Thanks for subscribing! Find your invoice attached.',
    attachments: [
      {
        filename: 'invoice.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });
}
