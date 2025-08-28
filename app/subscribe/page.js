'use client';
import { useRouter } from 'next/navigation';
import './subscribe.css';

export default function SubscribePage() {
  const router = useRouter();

  const plans = [
    { 
      duration: 1, 
      price: 99, 
      features: ['Access to all news', 'Mobile app access', 'Email support'],
      popular: false
    },
    { 
      duration: 3, 
      price: 299, 
      features: ['Access to all news', 'Mobile app access', 'Priority support', 'Ad-free experience'],
      popular: true
    },
    { 
      duration: 6, 
      price: 599, 
      features: ['Access to all news', 'Mobile app access', 'Priority support', 'Ad-free experience', 'Exclusive content'],
      popular: false
    },
  ];

  const handleSubscribe = (plan) => {
    router.push(`/subscribe/form?plan=${plan.duration}`);
  };

  return (
    <div className="subscription-container">
      <div className="subscription-wrapper">
        <div className="subscription-header fade-in-up">
          <h1 className="subscription-title">Choose Your Plan</h1>
          <p className="subscription-subtitle">
            Get unlimited access to premium news content, exclusive articles, and ad-free reading experience
          </p>
        </div>

        <div className="plans-grid">
          {plans.map((plan, index) => (
            <div 
              key={plan.duration} 
              className={`plan-card fade-in-up ${plan.popular ? 'popular' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="plan-duration">
                {plan.duration} Month{plan.duration > 1 ? 's' : ''}
              </div>
              <div className="plan-price">
                <span className="currency">₹</span>{plan.price}
              </div>
              <ul className="plan-features">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
              <button 
                onClick={() => handleSubscribe(plan)} 
                className="plan-button"
              >
                Get Started
              </button>
            </div>
          ))}
        </div>

        <div className="security-badges">
          <div className="security-badge">SSL Secured</div>
          <div className="security-badge">256-bit Encryption</div>
          <div className="security-badge">Money Back Guarantee</div>
        </div>
      </div>
    </div>
  );
}
