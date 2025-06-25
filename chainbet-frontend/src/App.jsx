import React from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { sepolia, polygonMumbai } from 'wagmi/chains';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Dashboard from './components/Dashboard';
import '@rainbow-me/rainbowkit/styles.css';
import './index.css';

const config = getDefaultConfig({
  appName: 'ChainBet',
  projectId: 'your-project-id', // Get from WalletConnect Cloud
  chains: [sepolia, polygonMumbai],
  transports: {
    [sepolia.id]: http(),
    [polygonMumbai.id]: http(),
  },
});

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Dashboard />
            <Toaster position="top-right" />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
