'use client';
import { signIn } from 'next-auth/react';
import './GoogleLoginButton.css'; // CSS file link

export default function GoogleLoginButton() {
  return (
    <button className="google-login-btn" onClick={() => signIn('google')}>
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google logo"
        className="google-logo"
      />
      Sign in with Google
    </button>
  );
}
