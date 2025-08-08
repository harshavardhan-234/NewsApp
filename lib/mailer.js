import nodemailer from 'nodemailer';

export const sendInvoiceEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // your email like 'example@gmail.com'
        pass: process.env.EMAIL_PASS, // app password (not your Gmail login password)
      },
      tls: {
        rejectUnauthorized: false, // ✅ disables SSL cert check for local testing
      },
    });

    const mailOptions = {
      from: `"News Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent: ' + info.response);
  } catch (error) {
    console.error('❌ Email sending failed:', error);
  }
};
