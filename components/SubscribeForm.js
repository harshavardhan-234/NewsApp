'use client';
import { useState } from 'react';

export default function SubscribeForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    plan: 1,
  });

  // No need to load external scripts for Stripe

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    // Basic validation
    if (!form.name || !form.email || !form.phone || !form.password) {
      alert('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Phone validation
    if (form.phone.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }

    // Password validation
    if (form.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    
    try {
      // Store form data in session storage for later retrieval
      sessionStorage.setItem('subscriptionData', JSON.stringify(form));
      
      // Call the API to initiate Stripe payment
      const res = await fetch('/api/initiate-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      
      if (!data.success) {
        alert('Payment initialization failed: ' + (data.message || 'Unknown error'));
        return;
      }

      // Redirect to Stripe checkout URL
      if (data.url) {
        window.location.href = data.url;
      } else {
        // If no direct URL is provided, redirect to payment page with session ID
        window.location.href = `/payment?session_id=${data.id}`;
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      alert('Failed to initialize payment. Please try again later.');
    }
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
