import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export async function generateInvoice({ name, email, phone, plan, amount, date, invoicePath }) {
  return new Promise((resolve, reject) => {
    // Create PDF document with default font (avoiding Helvetica)
    const doc = new PDFDocument({
      font: null // Explicitly set font to null to avoid loading Helvetica by default
    });
    // Font will be set later in the try/catch block

    // Make sure the folder exists
    const dir = path.dirname(invoicePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const stream = fs.createWriteStream(invoicePath);
    doc.pipe(stream);

    try {
      // Use the available OpenSans font or fallback to built-in
      try {
        const fontPath = path.join(process.cwd(), 'public', 'fonts', 'OpenSans-Regular.ttf');
        if (fs.existsSync(fontPath)) {
          doc.font(fontPath);
        } else {
          // Don't specify a font name to avoid AFM file errors
          // Just use the default font without specifying a name
          doc.fontSize(12); // Set font size without changing font
        }
      } catch (error) {
        // Fallback without specifying a font name to avoid AFM file errors
        doc.fontSize(12); // Set font size without changing font
      }

      // ✅ Now write text
      doc.fontSize(20).text('Payment Invoice', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Name: ${name}`);
      doc.text(`Email: ${email}`);
      doc.text(`Phone: ${phone}`);
      doc.text(`Plan: ${plan} Month(s)`);
      doc.text(`Amount: ₹${amount}`);
      doc.text(`Date: ${date}`);

      doc.end();

      stream.on('finish', () => resolve());
    } catch (error) {
      reject(error);
    }
  });
}
