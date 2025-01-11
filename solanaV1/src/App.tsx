import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { createAppKit } from '@reown/appkit/react';
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { solana } from '@reown/appkit/networks';
import { Landing } from './pages/Landing';
import { Platform } from './pages/Platform';

// Initialize Reown AppKit with persistence
const solanaAdapter = new SolanaAdapter({
  wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
  autoConnect: true // Enable auto-connection
});

createAppKit({
  projectId: 'fe015ee61a3f5d83731c3fc844d7266b',
  metadata: {
    name: 'SolanaBets',
    description: 'Decentralized Sports Prediction Platform',
    url: window.location.origin,
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  },
  networks: [solana],
  adapters: [solanaAdapter],
  enableNetworkView: true, // Show network selection in modal
  enableAccountView: true, // Show account details in modal
});

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Platform />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;