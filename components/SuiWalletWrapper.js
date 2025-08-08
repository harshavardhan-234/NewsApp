'use client';
import { WalletKitProvider } from '@mysten/wallet-kit';

const suiDevnetChain = {
  id: 'sui:devnet',
  name: 'Sui Devnet',
  rpcUrl: 'https://fullnode.devnet.sui.io:443',
};

export default function SuiWalletWrapper({ children }) {
  return (
    <WalletKitProvider chains={[suiDevnetChain]}>
      {children}
    </WalletKitProvider>
  );
}
