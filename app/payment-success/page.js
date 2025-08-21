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
    <div style={{ padding: 40, textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ color: '#4CAF50', fontSize: '2.5rem' }}>✅ Payment Successful!</h1>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '50%', 
          backgroundColor: '#E8F5E9', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '20px auto',
          fontSize: '40px'
        }}>
          ✓
        </div>
      </div>
      
      <div style={{ backgroundColor: '#F5F5F5', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h2 style={{ color: '#333', marginBottom: '15px' }}>Thank You for Your Subscription!</h2>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#555' }}>
          Your payment has been processed successfully. You now have access to premium content.
          A confirmation email with your invoice has been sent to your registered email address.
        </p>
      </div>
      
      {invoiceUrl && (
        <a
          href={invoiceUrl}
          target="_blank"
          rel="noopener noreferrer"
          download
          style={{
            display: 'inline-block',
            marginTop: 20,
            padding: '12px 25px',
            backgroundColor: '#0070f3',
            color: 'white',
            borderRadius: 8,
            textDecoration: 'none',
            fontWeight: 'bold',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease'
          }}
        >
          Download Invoice
        </a>
      )}
      
      <div style={{ marginTop: '30px' }}>
        <a 
          href="/"
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            color: '#333',
            textDecoration: 'none',
            borderBottom: '2px solid #0070f3'
          }}
        >
          Return to Homepage
        </a>
      </div>
    </div>
  );
}
