'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import '../subscribe.css';

export default function SubscribePage() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    plan: searchParams.get('plan') || '1',
    paymentMethod: 'stripe', // Default to Stripe
  });
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autoSubmit, setAutoSubmit] = useState(false);

  const planPrices = {
    '1': 99,
    '2': 199,
    '3': 299,
    '4': 399,
    '5': 499,
    '6': 599
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Auto-trigger Stripe when email is entered and valid
    if (name === 'email' && value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setForm(prev => ({ ...prev, paymentMethod: 'stripe' }));
      // Check if all required fields are filled for auto-submit
      checkAutoSubmit({ ...form, [name]: value, paymentMethod: 'stripe' });
    }
  };

  const checkAutoSubmit = (currentForm) => {
    if (currentForm.name && currentForm.email && currentForm.phone && currentForm.password) {
      setAutoSubmit(true);
      // Auto-submit after a short delay
      setTimeout(() => {
        handleSubmit();
      }, 1000);
    }
  };
  
  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone || !form.password) {
      alert('Please fill in all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert('Please enter a valid email address');
      return;
    }

    if (form.phone.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }

    if (form.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    
    if (form.paymentMethod === 'razorpay' && !razorpayLoaded && !window.Razorpay) {
      alert('Razorpay is still loading. Please try again in a moment.');
      return;
    }
    
    setLoading(true);
    
    try {
      sessionStorage.setItem('subscriptionData', JSON.stringify(form));
      
      const res = await fetch('/api/initiate-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        const errorMessage = data.message || 'Unknown error';
        const errorDetails = data.error_type ? ` (Type: ${data.error_type}, Code: ${data.error_code})` : '';
        alert(`Payment initialization failed: ${errorMessage}${errorDetails}`);
        return;
      }

      if (data.provider === 'stripe') {
        if (data.url) {
          window.location.href = data.url;
        } else {
          window.location.href = `/payment?session_id=${data.id}`;
        }
      } else if (data.provider === 'razorpay') {
        const options = {
          key: data.key_id,
          amount: data.amount,
          currency: data.currency,
          name: "News Portal",
          description: `Subscription - ${form.plan} Month(s)`,
          order_id: data.order_id,
          handler: function(response) {
            window.location.href = `/payment?razorpay_payment_id=${response.razorpay_payment_id}&razorpay_order_id=${response.razorpay_order_id}&razorpay_signature=${response.razorpay_signature}`;
          },
          prefill: {
            name: form.name,
            email: form.email,
            contact: form.phone
          },
          theme: {
            color: "#667eea"
          }
        };
        
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      alert('Failed to initialize payment. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Load Razorpay script when component mounts
  const handleRazorpayLoad = () => {
    setRazorpayLoaded(true);
    console.log('Razorpay script loaded successfully');
  };

  // Load Razorpay script dynamically
  useEffect(() => {
    if (form.paymentMethod === 'razorpay' && !window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => setRazorpayLoaded(true);
      document.body.appendChild(script);
    }
  }, [form.paymentMethod]);

  return (
    <div className="subscription-container">
      {autoSubmit && (
        <div className="auto-submit-notification">
          🚀 Auto-submitting with Stripe...
        </div>
      )}
      <div className="subscription-form fade-in-up">
        <h2 className="form-title">Complete Your Subscription</h2>
        
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input 
            name="name" 
            placeholder="Enter your full name"
            value={form.name}
            onChange={handleChange} 
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address *</label>
          <input 
            name="email" 
            type="email"
            placeholder="Enter your email address"
            value={form.email}
            onChange={handleChange} 
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number *</label>
          <input 
            name="phone" 
            type="tel"
            placeholder="Enter your phone number"
            value={form.phone}
            onChange={handleChange} 
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password *</label>
          <input 
            name="password" 
            type="password" 
            placeholder="Create a secure password"
            value={form.password}
            onChange={handleChange} 
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Subscription Plan</label>
          <select 
            name="plan" 
            value={form.plan}
            onChange={handleChange} 
            className="form-select"
          >
            <option value="1">1 Month - ₹{planPrices['1']}</option>
            <option value="2">2 Months - ₹{planPrices['2']}</option>
            <option value="3">3 Months - ₹{planPrices['3']}</option>
            <option value="4">4 Months - ₹{planPrices['4']}</option>
            <option value="5">5 Months - ₹{planPrices['5']}</option>
            <option value="6">6 Months - ₹{planPrices['6']}</option>
          </select>
        </div>
        
        <div className="payment-methods">
          <h3 className="payment-title">Choose Payment Method</h3>
          <div className="payment-options">
            <label className={`payment-option ${form.paymentMethod === 'stripe' ? 'selected' : ''}`}>
              <input 
                type="radio" 
                name="paymentMethod" 
                value="stripe" 
                checked={form.paymentMethod === 'stripe'}
                onChange={handleChange}
                className="payment-radio"
              />
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" 
                alt="Stripe" 
                className="payment-logo"
              />
            </label>
            <label className={`payment-option ${form.paymentMethod === 'razorpay' ? 'selected' : ''}`}>
              <input 
                type="radio" 
                name="paymentMethod" 
                value="razorpay" 
                checked={form.paymentMethod === 'razorpay'}
                onChange={handleChange}
                className="payment-radio"
              />
              <img 
                src="https://razorpay.com/assets/razorpay-glyph.svg" 
                alt="Razorpay" 
                className="payment-logo"
              />
            </label>
          </div>
        </div>

        <button 
          onClick={handleSubmit} 
          className={`submit-button ${loading || autoSubmit ? 'loading' : ''}`}
          disabled={loading || autoSubmit}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Processing...
            </>
          ) : autoSubmit ? (
            <>
              <span className="spinner"></span>
              Auto-submitting...
            </>
          ) : (
            `Pay ₹${planPrices[form.plan]} Now`
          )}
        </button>

        <div className="security-badges">
          <div className="security-badge">SSL Secured</div>
          <div className="security-badge">256-bit Encryption</div>
        </div>
      </div>
    </div>
  );
}
