'use client';
import { useState } from 'react';

export default function SubscribePage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    plan: '1',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  
  const handleSubmit = async () => {
    console.log('Form data being submitted:', form);

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
    
    try {
      sessionStorage.setItem('subscriptionData', JSON.stringify(form));
      
      const res = await fetch('/api/initiate-stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: form.plan }), // send only plan
      });

      const data = await res.json();
      console.log("Stripe API response:", data);

      if (data.url) {
        window.location.href = data.url; // ✅ Redirect to Stripe checkout
      } else {
        alert('Payment initialization failed.');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      alert('Failed to initialize payment. Please try again later.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Subscribe</h2>

      <input name="name" placeholder="Name" onChange={handleChange} style={styles.input} />
      <input name="email" placeholder="Email" onChange={handleChange} style={styles.input} />
      <input name="phone" placeholder="Phone" onChange={handleChange} style={styles.input} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} style={styles.input} />

      <select name="plan" onChange={handleChange} style={styles.select}>
        <option value="1">1 Month - ₹99</option>
        <option value="2">2 Months - ₹199</option>
        <option value="3">3 Months - ₹299</option>
        <option value="6">6 Months - ₹599</option>
      </select>

      <button onClick={handleSubmit} style={styles.button}>Submit</button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '30px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '12px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  select: {
    width: '100%',
    padding: '10px',
    marginBottom: '12px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    fontSize: '16px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};
