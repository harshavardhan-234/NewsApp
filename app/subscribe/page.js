// app/subscribe/page.js
'use client';
import { useRouter } from 'next/navigation';

export default function SubscribePage() {
  const router = useRouter();

  const plans = [
    { duration: 1, price: 99 },
    { duration: 2, price: 199 },
    { duration: 3, price: 299 },
    { duration: 4, price: 399 },
    { duration: 5, price: 499 },
    { duration: 6, price: 599 },
  ];

  const handleSubscribe = (plan) => {
    router.push(`/subscribe/form?plan=${plan.duration}`);
  };

  return (
    <div style={{ padding: '40px' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '30px' }}>Choose Your Subscription Plan</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {plans.map(plan => (
          <div key={plan.duration} style={{
            border: '1px solid #ccc',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '22px' }}>{plan.duration} Month{plan.duration > 1 ? 's' : ''}</h2>
            <p style={{ fontSize: '18px', margin: '10px 0' }}>₹{plan.price}</p>
            <button onClick={() => handleSubscribe(plan)} style={{
              background: '#0070f3',
              color: '#fff',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}>
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
