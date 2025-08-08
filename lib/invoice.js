import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export async function generateInvoice({ name, email, phone, plan, paymentId }) {
  // Create PDF document with default font (avoiding Helvetica)
  const doc = new PDFDocument({ 
    size: 'A4', 
    margin: 50,
    font: null // Explicitly set font to null to avoid loading Helvetica by default
  });
  
  // Use the OpenSans font directly from the public directory
  try {
    const fontPath = path.join(process.cwd(), 'public', 'fonts', 'OpenSans-Regular.ttf');
    if (fs.existsSync(fontPath)) {
      doc.font(fontPath).fontSize(20).text('Invoice', { align: 'center' });
    } else {
      // Fallback only if file doesn't exist
      doc.fontSize(20).text('Invoice', { align: 'center' });
    }
  } catch (error) {
    // If there's any error, just use default font
    doc.fontSize(20).text('Invoice', { align: 'center' });
  }
  doc.moveDown();

  // Set font size for the details
  doc.fontSize(12);
  // No need to set the font again as it's already set above
  doc.text(`Name: ${name}`);
  doc.text(`Email: ${email}`);
  doc.text(`Phone: ${phone}`);
  doc.text(`Plan: ${plan} month(s)`);
  doc.text(`Payment ID: ${paymentId}`);
  doc.text(`Date: ${new Date().toLocaleString()}`);


  // Create a buffer from the PDF stream
  const buffers = [];
  doc.on('data', chunk => buffers.push(chunk));
  doc.on('end', () => {});
  
  doc.end();

  // Convert PDF to buffer using Buffer.concat instead of getStream
  return Buffer.concat(buffers);
}
