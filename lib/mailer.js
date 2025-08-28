import nodemailer from "nodemailer";

// General email sending function for all types of emails
export const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  try {
    // ✅ Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // 465 for secure, 587 for TLS
      secure: true, // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER, // your Gmail address
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
    });

    // ✅ Email options
    const mailOptions = {
      from: `"News Portal 📰" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments,
    };

    // ✅ Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    return { success: false, error: error.message };
  }
};

// Specific function for sending invoice emails
export const sendInvoiceEmail = async ({ to, subject, html, attachments = [] }) => {
  return sendEmail({ to, subject, html, attachments });
};
