// app/layout.js (server component)
import './globals.css';
import SessionWrapper from '../components/SessionWrapper';
import SuiWalletWrapper from '@/components/SuiWalletWrapper';
import LayoutWrapper from '../components/LayoutWrapper'; // ✅ Make sure this path is correct

export const metadata = {
  title: 'News Portal',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      </head>
      <body>
        <SessionWrapper>
          <SuiWalletWrapper>
            <LayoutWrapper>{children}</LayoutWrapper>
          </SuiWalletWrapper>
        </SessionWrapper>
      </body>
    </html>
  );
}
