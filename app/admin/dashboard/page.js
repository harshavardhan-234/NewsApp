'use client';

import { useEffect, useState } from 'react';
import { FiFileText, FiClock } from 'react-icons/fi';
import './dashboard.css';

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
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>📊 Admin Dashboard</h1>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card primary">
          <h3>Total News</h3>
          <p className="stat-value">{totalNews}</p>
          <div className="stat-icon">
            <FiFileText />
          </div>
          <div className="stat-period">All time</div>
        </div>

        <div className="stat-card warning">
          <h3>Today's News</h3>
          <p className="stat-value">{todayNews}</p>
          <div className="stat-icon">
            <FiClock />
          </div>
          <div className="stat-period">Last 24 hours</div>
        </div>
      </div>
      
      <div className="activity-section">
        <div className="section-header">
          <h2 className="section-title">Recent Activity</h2>
          <a href="/admin/manage-news" className="view-all">View All</a>
        </div>
        <p>No recent activity to display.</p>
      </div>
    </div>
  );
}
