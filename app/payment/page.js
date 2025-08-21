'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get data from URL params or session storage
  const orderId = searchParams.get('orderId');
  let name = searchParams.get('name');
  let email = searchParams.get('email');
  let phone = searchParams.get('phone');
  let password = searchParams.get('password');
  let plan = searchParams.get('plan');
  
  useEffect(() => {
    // Try to get data from session storage if not in URL
    if (!name || !email || !phone || !password || !plan) {
      const storedData = sessionStorage.getItem('subscriptionData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        name = parsedData.name;
        email = parsedData.email;
        phone = parsedData.phone;
        password = parsedData.password;
        plan = parsedData.plan;
        setFormData(parsedData);
      }
    } else {
      setFormData({ name, email, phone, password, plan });
    }
    setIsLoading(false);
  }, [name, email, phone, password, plan]);
  
  // Get session_id from URL if available
  const session_id = searchParams.get('session_id');

  useEffect(() => {
    // Don't proceed if still loading or missing data
    if (isLoading) return;
    
    if (!formData || !formData.name || !formData.email || !formData.phone || !formData.password || !formData.plan) {
      alert("Missing payment details. Please return to the subscription form.");
      router.push('/subscribe/form');
      return;
    }

    // If we have a session_id, we need to check its status
    // If not, we need to initiate a new payment
    const handlePayment = async () => {
      try {
        if (session_id) {
          // If we have a session_id, verify the payment
          const verifyRes = await fetch('/api/verify-stripe-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              session_id,
              password: formData.password, // Pass password for user creation
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            // Clear session storage
            sessionStorage.removeItem('subscriptionData');
            
            // Redirect to success page
            if (verifyData.redirectUrl) {
              window.location.href = verifyData.redirectUrl;
            } else {
              router.push('/payment-success');
            }
          } else {
            alert('❌ Payment verification failed: ' + (verifyData.message || 'Please contact support.'));
            router.push('/subscribe/form');
          }
        } else {
          // If no session_id, initiate a new payment
          const res = await fetch('/api/initiate-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });

          const data = await res.json();
          
          if (!data.success) {
            alert('Payment initialization failed: ' + (data.message || 'Unknown error'));
            router.push('/subscribe/form');
            return;
          }

          // If we have a direct URL to Stripe checkout, use it
          if (data.url) {
            window.location.href = data.url;
          } else {
            // Otherwise, use the Stripe JS library to redirect
            const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
            await stripe.redirectToCheckout({ sessionId: data.id });
          }
        }
      } catch (error) {
        console.error('Payment processing error:', error);
        alert('Failed to process payment. Please try again later.');
        router.push('/subscribe/form');
      }
    };

    // Process the payment
    handlePayment();
  }, [isLoading, formData, orderId, amount, router]);

  // No need for script loading helper with Stripe

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>🟡 Please wait while we process your payment...</h2>
    </div>
  );
}
