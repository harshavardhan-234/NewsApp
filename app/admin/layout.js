'use client';

import { useState } from 'react';

export default function AdminLayout({ children }) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4' }}>
        {/* Sidebar */}
        <div style={{
          width: '240px',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          backgroundColor: '#1e1e2f',
          color: '#fff',
          padding: '30px 20px',
          boxSizing: 'border-box',
          overflowY: 'auto'
        }}>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '30px' }}>Admin Panel</h1>
          <nav>
            <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2.2' }}>
              <li><a href="/admin/dashboard" style={linkStyle}>📊 Dashboard</a></li>
              <li><a href="/admin/add-news" style={linkStyle}>➕ Add News</a></li>
              <li><a href="/admin/manage-news" style={linkStyle}>📰 Manage News</a></li>
              <li><a href="/admin/categories" style={linkStyle}>📂 Categories</a></li>
              <li><a href="/admin/default-image" style={linkStyle}>🖼️ Default Image</a></li>

              {/* Location Management */}
              <li><a href="/admin/add-country" style={linkStyle}>🌍 Add Country</a></li>
              <li><a href="/admin/manage-country" style={linkStyle}>🌍 Manage Countries</a></li>
              <li><a href="/admin/add-state" style={linkStyle}>🏙️ Add State</a></li>
              <li><a href="/admin/manage-state" style={linkStyle}>🏙️ Manage States</a></li>
              <li><a href="/admin/add-city" style={linkStyle}>🏘️ Add City</a></li>
              <li><a href="/admin/manage-city" style={linkStyle}>🏘️ Manage Cities</a></li>
            </ul>
          </nav>
        </div>

        {/* Floating Settings Icon + Dropdown */}
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '30px',
          zIndex: 1000
        }}>
          <span
            onClick={() => setShowSettings(prev => !prev)}
            style={{
              fontSize: '26px',
              cursor: 'pointer',
              display: 'inline-block',
              transition: 'transform 0.2s ease'
            }}
          >
            ⚙️
          </span>

          {showSettings && (
            <div style={{
              position: 'absolute',
              top: '35px',
              right: 0,
              backgroundColor: '#fff',
              color: '#000',
              borderRadius: '6px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
              padding: '10px',
              width: '180px'
            }}>
              <a href="/admin/settings" style={dropdownLink}>🌐 Global Settings</a>
              <a href="/admin/change-password" style={dropdownLink}>🔐 Change Password</a>
              <a href="/admin/logout" style={dropdownLink}>🚪 Logout</a>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div style={{
          marginLeft: '240px',
          padding: '40px',
          backgroundColor: '#fff',
          minHeight: '100vh',
        }}>
          {children}
        </div>
      </body>
    </html>
  );
}

const linkStyle = {
  textDecoration: 'none',
  color: '#ddd',
  fontSize: '1rem',
  display: 'block',
  padding: '6px 12px',
  borderRadius: '6px',
  transition: 'background 0.3s ease',
};

const dropdownLink = {
  display: 'block',
  padding: '8px 12px',
  textDecoration: 'none',
  color: '#333',
  fontSize: '14px',
  borderRadius: '4px',
  marginBottom: '6px',
  backgroundColor: '#f5f5f5',
  transition: 'background 0.2s ease',
};
