'use client';

import WalletWrapper from './WalletWrapper';
import Header from './Header';
import Footer from './Footer';

export default function LayoutClientWrapper({ children }) {
  return (
    <WalletWrapper>
      <Header />
      {children}
      <Footer />
    </WalletWrapper>
  );
}
