import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { sendInvoiceEmail } from '@/lib/sendInvoiceMail';
import { generateInvoice } from '@/lib/generateInvoice';

export async function POST(req) {
  try {
    const body = await req.json();
    const { 
      name, 
      email, 
      phone, 
      plan, 
      paymentId, 
      session_id 
    } = body;

    // 💾 Save to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db('test');
    await db.collection('subscribers').insertOne({
      name,
      email,
      phone,
      plan,
      paymentId,
      session_id,
      paymentStatus: 'success',
      createdAt: new Date(),
    });
    await client.close();

    // 📄 Generate PDF invoice
    const pdfBuffer = await generateInvoice({ name, email, phone, plan, paymentId });

    // 📧 Send email with invoice PDF
    await sendInvoiceEmail({
      to: email,
      subject: 'Subscription Invoice',
      html: `
        <p>Dear ${name},</p>
        <p>Thank you for subscribing to our ${plan}-month plan.</p>
        <p>Your payment ID is <strong>${paymentId}</strong>.</p>
        <p>Please find the attached invoice.</p>
      `,
      attachments: [
        {
          filename: 'invoice.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    return NextResponse.json({ 
      success: true,
      redirectUrl: '/payment-success'
    });
  } catch (err) {
    console.error('❌ Error in /api/payment-success:', err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
