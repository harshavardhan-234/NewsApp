'use client';
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get('orderId');
  const name = searchParams.get('name');
  const email = searchParams.get('email');
  const phone = searchParams.get('phone');
  const password = searchParams.get('password');
  const plan = searchParams.get('plan');
  const amount = parseInt(plan) * 100; // Razorpay needs amount in paisa

  useEffect(() => {
    if (!orderId || !name || !email || !phone || !password || !plan) {
      alert("Missing payment details.");
      return;
    }

    const loadRazorpay = async () => {
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        alert('Razorpay SDK failed to load. Please try again.');
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency: 'INR',
        name: 'News Subscription',
        description: `Subscription Plan: ₹${plan}`,
        order_id: orderId,
        handler: async function (response) {
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name,
              email,
              phone,
              password,
              plan,
              razorpay_order_id: orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            router.push('/login');
          } else {
            alert('❌ Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name,
          email,
          contact: phone,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    };

    loadRazorpay();
  }, [orderId, name, email, phone, password, plan, amount, router]);

  // Helper to load Razorpay script
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>🟡 Please wait while we process your payment...</h2>
    </div>
  );
}
