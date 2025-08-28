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
  
  // Get payment parameters from URL
  const session_id = searchParams.get('session_id');
  const razorpay_payment_id = searchParams.get('razorpay_payment_id');
  const razorpay_order_id = searchParams.get('razorpay_order_id');
  const razorpay_signature = searchParams.get('razorpay_signature');

  useEffect(() => {
    // Don't proceed if still loading or missing data
    if (isLoading) return;
    
    if (!formData || !formData.name || !formData.email || !formData.phone || !formData.password || !formData.plan) {
      alert("Missing payment details. Please return to the subscription form.");
      router.push('/subscribe/form');
      return;
    }

    // Handle payment verification based on the parameters in URL
    const handlePayment = async () => {
      try {
        // Handle Stripe payment verification
        if (session_id) {
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
            // Store user data for email confirmation page
            if (verifyData.userData) {
              sessionStorage.setItem('subscriptionData', JSON.stringify(verifyData.userData));
            }
            
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
        } 
        // Handle Razorpay payment verification
        else if (razorpay_payment_id && razorpay_order_id && razorpay_signature) {
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
              ...formData, // Include all user data
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            // Store user data for email confirmation page
            if (verifyData.userData) {
              sessionStorage.setItem('subscriptionData', JSON.stringify(verifyData.userData));
            }
            
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
        } 
        // If no payment parameters, initiate a new payment
        else {
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

          // Handle based on payment provider
          if (data.provider === 'stripe') {
            // For Stripe, redirect to the provided URL
            if (data.url) {
              window.location.href = data.url;
            } else {
              // Otherwise, use the Stripe JS library to redirect
              const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
              await stripe.redirectToCheckout({ sessionId: data.id });
            }
          } else if (data.provider === 'razorpay') {
            // For Razorpay, open the payment modal
            const options = {
              key: data.key_id,
              amount: data.amount,
              currency: data.currency,
              name: "News Portal",
              description: `Subscription - ${formData.plan} Month(s)`,
              order_id: data.order_id,
              handler: function(response) {
                // On successful payment, verify the payment
                window.location.href = `/payment?razorpay_payment_id=${response.razorpay_payment_id}&razorpay_order_id=${response.razorpay_order_id}&razorpay_signature=${response.razorpay_signature}`;
              },
              prefill: {
                name: formData.name,
                email: formData.email,
                contact: formData.phone
              },
              theme: {
                color: "#0070f3"
              }
            };
            
            // Load Razorpay script if not already loaded
            if (!window.Razorpay) {
              const script = document.createElement('script');
              script.src = 'https://checkout.razorpay.com/v1/checkout.js';
              script.async = true;
              script.onload = () => {
                const paymentObject = new window.Razorpay(options);
                paymentObject.open();
              };
              document.body.appendChild(script);
            } else {
              const paymentObject = new window.Razorpay(options);
              paymentObject.open();
            }
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
  }, [isLoading, formData, orderId, session_id, razorpay_payment_id, razorpay_order_id, razorpay_signature, router]);

  // Script loading is handled within the payment handler functions

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>🟡 Please wait while we process your payment...</h2>
    </div>
  );
}
