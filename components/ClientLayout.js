'use client';

import SuiWalletWrapper from './SuiWalletWrapper';
import SessionWrapper from './SessionWrapper';
import Header from './Header';
import Footer from './Footer';

export default function ClientLayout({ children }) {
  return (
    <SessionWrapper>
      <SuiWalletWrapper>
        <Header />
        {children}
        <Footer />
      </SuiWalletWrapper>
    </SessionWrapper>
  );
}
