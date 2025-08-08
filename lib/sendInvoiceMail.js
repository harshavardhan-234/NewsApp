import nodemailer from 'nodemailer';

export const sendInvoiceEmail = async ({ to, subject, html, attachments = [] }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // example@gmail.com
        pass: process.env.EMAIL_PASS, // app-specific password
      },
      tls: {
        rejectUnauthorized: false, // for localhost only
      },
    });

    const mailOptions = {
      from: `"News Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent: ' + info.response);
  } catch (error) {
    console.error('❌ Email sending failed:', error);
  }
};
