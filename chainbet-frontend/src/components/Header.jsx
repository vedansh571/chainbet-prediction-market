import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary-600">
                🎯 ChainBet
              </h1>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">
                Decentralized Prediction Markets
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Sepolia Testnet
              </div>
            </div>
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
