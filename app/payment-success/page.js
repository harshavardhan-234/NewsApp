'use client';
import { useEffect, useState } from 'react';

export default function PaymentSuccessPage() {
  const [invoiceUrl, setInvoiceUrl] = useState(null);

  useEffect(() => {
    // You can pass this from payment route or get from localStorage/cookie
    const url = localStorage.getItem('invoiceUrl');
    if (url) setInvoiceUrl(url);
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2>✅ Payment Successful</h2>
      <p>Thank you for subscribing.</p>
      {invoiceUrl && (
        <a
          href={invoiceUrl}
          target="_blank"
          rel="noopener noreferrer"
          download
          style={{
            display: 'inline-block',
            marginTop: 20,
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: 'white',
            borderRadius: 8,
            textDecoration: 'none',
          }}
        >
          Download Invoice
        </a>
      )}
    </div>
  );
}
