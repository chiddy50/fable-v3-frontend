'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useWallet } from '@solana/wallet-adapter-react';

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const WalletIndicator = () => {
  const wallet = useWallet();

  return (
    <div>
      <WalletMultiButtonDynamic>
        {wallet.publicKey
          ? `${wallet.publicKey.toBase58().substring(0, 7)}...`
          : 'Connect Wallet'}
      </WalletMultiButtonDynamic>
    </div>
  );
};

export default WalletIndicator;