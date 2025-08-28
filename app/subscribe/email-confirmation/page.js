'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmailConfirmationPage() {
  const [emailSent, setEmailSent] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get user data from session storage
    const storedData = sessionStorage.getItem('subscriptionData');
    if (!storedData) {
      // If no data, redirect to subscription form
      router.push('/subscribe/form');
      return;
    }

    try {
      const parsedData = JSON.parse(storedData);
      setUserData(parsedData);
      setLoading(false);
    } catch (error) {
      console.error('Error parsing stored data:', error);
      router.push('/subscribe/form');
    }
  }, [router]);

  const sendConfirmationEmail = async () => {
    if (!userData) return;

    try {
      setLoading(true);
      const res = await fetch('/api/send-confirmation-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      
      if (data.success) {
        setEmailSent(true);
      } else {
        alert('Failed to send confirmation email. Please try again.');
      }
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingSpinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {!emailSent ? (
          <>
            <h2 style={styles.heading}>Payment Successful!</h2>
            <p style={styles.text}>
              Thank you for subscribing to our service. Your payment has been processed successfully.
            </p>
            <div style={styles.userInfo}>
              <p><strong>Name:</strong> {userData?.name}</p>
              <p><strong>Email:</strong> {userData?.email}</p>
              <p><strong>Plan:</strong> {userData?.plan} Month(s)</p>
            </div>
            <p style={styles.text}>
              Click the button below to send a confirmation email with your subscription details.
            </p>
            <button 
              onClick={sendConfirmationEmail} 
              style={styles.button}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Confirmation Email'}
            </button>
          </>
        ) : (
          <>
            <div style={styles.successIcon}>✓</div>
            <h2 style={styles.heading}>Email Sent Successfully!</h2>
            <p style={styles.text}>
              A confirmation email has been sent to <strong>{userData?.email}</strong> with your subscription details.
            </p>
            <p style={styles.text}>
              Please check your inbox (and spam folder) for the email.
            </p>
            <button 
              onClick={() => router.push('/')} 
              style={styles.button}
            >
              Return to Homepage
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    padding: '20px',
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    padding: '30px',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center',
  },
  heading: {
    color: '#333',
    marginBottom: '20px',
  },
  text: {
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '15px',
  },
  userInfo: {
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '5px',
    marginBottom: '20px',
    textAlign: 'left',
  },
  button: {
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '10px',
    transition: 'background-color 0.3s',
  },
  loadingSpinner: {
    border: '4px solid rgba(0, 0, 0, 0.1)',
    borderLeft: '4px solid #0070f3',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    animation: 'spin 1s linear infinite',
    marginBottom: '15px',
  },
  successIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#4CAF50',
    color: 'white',
    fontSize: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  },
};