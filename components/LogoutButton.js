'use client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/logout'); // Clears cookies on the server
    router.push('/'); // Redirect to home after logout
  };

  return (
    <button onClick={handleLogout} className="login-btn">
      Logout
    </button>
  );
}
