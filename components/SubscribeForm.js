'use client';
import { useState, useEffect } from 'react';

export default function SubscribeForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    plan: 1,
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    const res = await fetch('/api/initiate-payment', {
      method: 'POST',
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!data.success) return alert('Payment failed');

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: 'INR',
      name: 'News Portal',
      description: 'Subscription Payment',
      order_id: data.orderId,
      handler: async function () {
        const r = await fetch('/api/payment-success', {
          method: 'POST',
          body: JSON.stringify(form),
        });
        const result = await r.json();

        if (result.success) {
          alert('✅ Payment Successful. You are now a Premium User!');
          window.location.href = '/';
        } else {
          alert('Error: ' + result.message);
        }
      },
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      theme: {
        color: '#3399cc',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="payment-form">
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="phone" placeholder="Phone" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <select name="plan" onChange={handleChange}>
        <option value="1">1 Month - ₹99</option>
        <option value="2">2 Months - ₹199</option>
        <option value="3">3 Months - ₹299</option>
        <option value="6">6 Months - ₹599</option>
      </select>
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
}
