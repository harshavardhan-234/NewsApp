// This tells Next.js that this is a client-side component (because we're using useSession)
'use client';

// We import the useSession hook from next-auth to check login status and get user data
import { useSession } from 'next-auth/react';

// This is your "My Account" page component
export default function MyAccountPage() {
  // useSession hook returns session data and status ('loading', 'authenticated', or 'unauthenticated')
  const { data: session, status } = useSession();

  // While session is loading, show a loading message
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  // If user is not logged in, show login link
  if (!session) {
    return (
      <div>
        Please <a href="/login">login</a> to view your account.
      </div>
    );
  }

  // Destructure user details from the session object
  const { name, email, phone, plan, expiresAt } = session.user;

  // Return account information UI
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>My Account</h1>

      {/* Display user's name */}
      <p><strong>Name:</strong> {name}</p>

      {/* Display user's email */}
      <p><strong>Email:</strong> {email}</p>

      {/* Display phone number or fallback message */}
      <p><strong>Phone:</strong> {phone || 'Not Provided'}</p>

      {/* Show subscription plan months or fallback if no plan */}
      <p><strong>Plan:</strong> {plan ? `${plan} Months` : 'No Active Plan'}</p>

      {/* Show subscription expiry date in readable format or fallback */}
      <p><strong>Subscription Expires At:</strong> 
        {expiresAt ? new Date(expiresAt).toLocaleString() : 'N/A'}
      </p>
    </div>
  );
}
