import PDFDocument from 'pdfkit';
import getStream from 'get-stream';
import path from 'path';
import fs from 'fs';

export async function generateInvoice({ name, email, phone, plan, paymentId }) {
  const doc = new PDFDocument();

  // ✅ Register a custom .ttf font (Roboto or any available)
  const fontPath = path.join(process.cwd(), 'public', 'fonts', 'Roboto-Regular.ttf');
  if (fs.existsSync(fontPath)) {
    doc.registerFont('Roboto', fontPath);
    doc.font('Roboto');
  } else {
    console.warn('⚠️ Font file not found. Using default font.');
  }

  doc.fontSize(20).text('🧾 Payment Invoice', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12);

  doc.text(`Name: ${name}`);
  doc.text(`Email: ${email}`);
  doc.text(`Phone: ${phone}`);
  doc.text(`Plan: ${plan} Month(s)`);
  doc.text(`Payment ID: ${paymentId}`);
  doc.text(`Date: ${new Date().toLocaleString()}`);

  doc.end();
  const pdfBuffer = await getStream.buffer(doc);
  return pdfBuffer;
}
