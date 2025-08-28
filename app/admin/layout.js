'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation'; // 🔑 import pathname
import './admin-global.css';
import { FiSettings, FiLogOut, FiLock, FiGlobe } from 'react-icons/fi';

export default function AdminLayout({ children }) {
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef(null);
  const menuItemsRef = useRef([]);
  const pathname = usePathname(); // 🔑 get current path

  useEffect(() => {
    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    }
    
    function handleEscKey(event) {
      if (event.key === 'Escape') {
        setShowSettings(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);
  
  useEffect(() => {
    if (showSettings && menuItemsRef.current.length > 0) {
      setTimeout(() => {
        menuItemsRef.current[0]?.focus();
      }, 10);
    }
  }, [showSettings]);

  const handleMenuKeyDown = (e, index) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % menuItemsRef.current.length;
      menuItemsRef.current[nextIndex]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (index - 1 + menuItemsRef.current.length) % menuItemsRef.current.length;
      menuItemsRef.current[prevIndex]?.focus();
    }
  };

  // 🔑 If login page, render only children (no sidebar/header)
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">Admin Panel</h1>
        </div>
        <nav>
          <ul className="sidebar-nav">
            <div className="nav-category">Content Management</div>
            <li className="nav-item">
              <a href="/admin/dashboard" className="nav-link">
                <FiSettings />
                <span>Dashboard</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="/admin/add-news" className="nav-link">
                <FiSettings />
                <span>Add News</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="/admin/manage-news" className="nav-link">
                <FiSettings />
                <span>Manage News</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="/admin/categories" className="nav-link">
                <FiSettings />
                <span>Categories</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="/admin/videos" className="nav-link">
                <FiSettings />
                <span>Videos</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="/admin/default-image" className="nav-link">
                <FiSettings />
                <span>Default Image</span>
              </a>
            </li>

          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="admin-main">
        {/* Header with Settings */}
        <div className="admin-header">
          <div className="header-title">News Admin Dashboard</div>
          <div className="header-actions">
            <div className="settings-dropdown" ref={settingsRef}>
              <span
                onClick={(e) => {
                  e.preventDefault();
                  setShowSettings(prev => !prev);
                }}
                className={`settings-icon ${showSettings ? 'active' : ''}`}
                role="button"
                tabIndex="0"
                aria-haspopup="true"
                aria-expanded={showSettings}
                id="settings-menu-button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setShowSettings(prev => !prev);
                  }
                }}
              >
                <FiSettings size={22} />
              </span>

              {showSettings && (
                <div className="settings-menu" role="menu" aria-orientation="vertical" aria-labelledby="settings-menu-button">
                  <a 
                    href="/admin/settings" 
                    className="settings-item"
                    onClick={() => setShowSettings(false)}
                    role="menuitem"
                    tabIndex="0"
                    ref={el => menuItemsRef.current[0] = el}
                    onKeyDown={(e) => handleMenuKeyDown(e, 0)}
                  >
                    <FiGlobe size={16} />
                    <span>Global Settings</span>
                  </a>
                  <a 
                    href="/admin/change-password" 
                    className="settings-item"
                    onClick={() => setShowSettings(false)}
                    role="menuitem"
                    tabIndex="0"
                    ref={el => menuItemsRef.current[1] = el}
                    onKeyDown={(e) => handleMenuKeyDown(e, 1)}
                  >
                    <FiLock size={16} />
                    <span>Change Password</span>
                  </a>
                  <a 
                    href="/api/admin/logout" 
                    className="settings-item"
                    onClick={() => setShowSettings(false)}
                    role="menuitem"
                    tabIndex="0"
                    ref={el => menuItemsRef.current[2] = el}
                    onKeyDown={(e) => handleMenuKeyDown(e, 2)}
                  >
                    <FiLogOut size={16} />
                    <span>Logout</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
}
