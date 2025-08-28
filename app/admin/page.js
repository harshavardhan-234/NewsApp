'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminHome() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to dashboard page
    router.push('/admin/dashboard');
  }, [router]);

  return (
    <div className="admin-loading">
      <div className="loading-spinner"></div>
      <p>Loading admin dashboard...</p>
    </div>
  );
}
