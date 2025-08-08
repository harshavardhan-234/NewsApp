'use client';

import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [totalNews, setTotalNews] = useState(0);
  const [todayNews, setTodayNews] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch('/api/admin/news-count');
        const data = await res.json();

        setTotalNews(data.total || 0);
        setTodayNews(data.today || 0);
      } catch (err) {
        console.error('Error fetching news counts:', err);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>📊 Admin Dashboard</h1>
      <div style={{
        display: 'flex',
        gap: '30px',
        flexWrap: 'wrap'
      }}>
        <div style={{
          flex: '1',
          minWidth: '250px',
          backgroundColor: '#e3f2fd',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)'
        }}>
          <h3>Total News</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{totalNews}</p>
        </div>

        <div style={{
          flex: '1',
          minWidth: '250px',
          backgroundColor: '#fff3e0',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)'
        }}>
          <h3>Today's News</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{todayNews}</p>
        </div>
      </div>
    </div>
  );
}
