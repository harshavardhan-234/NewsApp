'use client';
import { useEffect, useState } from 'react';

export default function PaymentSuccessPage() {
  const [invoiceUrl, setInvoiceUrl] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('payment_id'); // optional if you pass it
    if (id) {
      setInvoiceUrl(`/invoices/${id}.pdf`);
    }
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2>✅ Payment Successful</h2>
      <p>Thank you for subscribing!</p>
      {invoiceUrl && (
        <a
          href={invoiceUrl}
          download
          style={{
            marginTop: 20,
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: 'white',
            textDecoration: 'none',
            borderRadius: 8,
          }}
        >
          Download Invoice
        </a>
      )}
    </div>
  );
}
