'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import '../styles/header.css';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import { BsSun, BsMoon } from 'react-icons/bs';
import { signOut, useSession } from 'next-auth/react';
import ConnectSuiWalletButton from './ConnectSuiWalletButton';

const Header = () => {
  const { data: session } = useSession();
  const [premiumUser, setPremiumUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [siteSettings, setSiteSettings] = useState(null);
  const [categories, setCategories] = useState([]);

  const today = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/get-user-details');
        if (!res.ok) return;
        const data = await res.json();
        setPremiumUser(data);
      } catch (error) {
        console.error('Error fetching premium user:', error);
      }
    };

    if (session) fetchUser();
  }, [session]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/site-settings');
        if (!res.ok) return;
        const data = await res.json();
        setSiteSettings(data);
      } catch (error) {
        console.error('Error fetching site settings:', error);
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/admin/categories');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.categories) {
            setCategories(data.categories);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
    <header className="header">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="date">📅 {today}</div>
        <div className="top-right">
          <div className="toggle">
            <BsSun />
            <label className="switch">
              <input type="checkbox" />
              <span className="slider" />
            </label>
            <BsMoon />
          </div>
          <div className="social">
            <span>Follow Us :</span>
            <a href={siteSettings?.facebook || '#'} target="_blank"><FaFacebookF /></a>
            <a href={siteSettings?.instagram || '#'} target="_blank"><FaInstagram /></a>
            <a href={siteSettings?.linkedin || '#'} target="_blank"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      {/* Middle Bar */}
      <div className="middle-bar">
        <div className="logo">
          <Link href="/">
            <img
              src={siteSettings?.logo || '/logo.png'}
              alt="Logo"
              style={{ height: '60px', objectFit: 'contain' }}
            />
          </Link>
        </div>

        <nav className="nav-menu">
          <Link href="/">HOME</Link>
          <Link href="/about">ABOUT US</Link>
          <Link href="/live-tv">LIVE TV</Link>
          <Link href="/breaking-news">BREAKING NEWS</Link>
          <Link href="/videos">VIDEOS</Link>
          <Link href="/contact">CONTACT US</Link>
        </nav>

        <div className="actions">
          {!session ? (
            <>
              <Link href="/login" className="login-btn">Login</Link>
              <button className="google-login-btn">
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google logo"
                  className="google-logo"
                />
                Sign in with Google
              </button>
            </>
          ) : (
            <div className="profile-dropdown">
              <img
                src={session?.user?.image || '/dp.jpg'}
                alt="Profile"
                className="profile-icon"
                onClick={toggleDropdown}
              />
              {showDropdown && (
                <div className="dropdown-content">
                  <p><strong>{premiumUser?.name || session?.user?.name}</strong></p>
                  <p style={{ fontSize: '12px' }}>{premiumUser?.email || session?.user?.email}</p>
                  <hr />
                  {premiumUser && (
                    <>
                      <p style={{ fontSize: '13px' }}>
                        <b>Plan:</b> {premiumUser.plan} Months
                      </p>
                    </>
                  )}
                  <Link href="/my-account" className="my-account-link">My Account</Link>
                  <button onClick={() => signOut({ callbackUrl: '/' })}>Logout</button>
                </div>
              )}
            </div>
          )}
          <ConnectSuiWalletButton />
        </div>
      </div>

      {/* Bottom Bar (Categories) */}
      <div className="bottom-bar">
        <Link href="/category/latest">Latest News</Link>
        {categories.length > 0 ? (
          categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/category/${category.slug}`}
            >
              {category.name}
            </Link>
          ))
        ) : (
          <>
            <Link href="/category/news">News</Link>
            <Link href="/category/business">Business</Link>
            <Link href="/category/science">Science</Link>
            <Link href="/category/technology">Technology</Link>
            <Link href="/category/sports">Sports</Link>
            <Link href="/category/entertainment">Entertainment</Link>
            <Link href="/category/health">Health</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
