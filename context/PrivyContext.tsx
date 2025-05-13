'use client';

import {PrivyProvider} from '@privy-io/react-auth';

export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <PrivyProvider
        appId="cmalij5sn01y9le0m7quxehsa"
        clientId="client-WY6LHzT4NsXZ49noUhiedu3ZVgXVD3bVtJK598WqPFAuQ"
        config={{
            // Create embedded wallets for users who don't have a wallet
            embeddedWallets: {
            createOnLogin: 'users-without-wallets'
            }
        }}
    >
      {children}
    </PrivyProvider>
  );
}