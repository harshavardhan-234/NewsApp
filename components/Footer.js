'use client'; // if you are using this inside app/ directory (Next.js 13+)

import Link from 'next/link';
import React from 'react';


export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-section">
        <img src="/logo.png" alt="Logo" className="footer-logo" />
        <p>Gplus News Website is an online platform delivering verified breaking news across various categories and regions in India.</p>
        <h4>Follow Us</h4>
        {/* Add your social icons here if needed */}
      </div>

      <div className="footer-section">
        <h4>Navigations</h4>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/live-tv">Live TV</Link></li>
          <li><Link href="/breaking-news">Breaking News</Link></li>
          <li><Link href="/about">About Us</Link></li>
          <li><Link href="/contact">Contact Us</Link></li>
        </ul>
      </div>

      <div className="footer-section">
        <h4>Categories</h4>
        <ul>
          <li><Link href="/category/latest-news">Latest News</Link></li>
          <li><Link href="/category/news">News</Link></li>
          <li><Link href="/category/business">Business</Link></li>
          <li><Link href="/category/technology">Technology</Link></li>
          <li><Link href="/category/sports">Sports</Link></li>
          <li><Link href="/category/entertainment">Entertainment</Link></li>
          <li><Link href="/category/health">Health</Link></li>
        </ul>
      </div>
    </footer>
  );
}
