// File: app/api/generate-invoice/route.js
import pdf from 'html-pdf-node';

export async function POST(req) {
  const { name, email, phone, plan, paymentId } = await req.json();

  const html = `
    <h1>Invoice</h1>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Plan:</strong> ${plan} month(s)</p>
    <p><strong>Payment ID:</strong> ${paymentId}</p>
    <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
  `;

  const file = { content: html };
  const options = { format: 'A4' };

  const pdfBuffer = await pdf.generatePdf(file, options);

  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=invoice.pdf',
    },
  });
}
