import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import Header from './Header';
import MarketList from './MarketList';
import CreateMarket from './CreateMarket';
import UserBets from './UserBets';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('markets');
  const { isConnected } = useAccount();

  const tabs = [
    { id: 'markets', name: 'Markets', icon: '📊' },
    { id: 'my-bets', name: 'My Bets', icon: '🎯' },
    { id: 'create', name: 'Create Market', icon: '➕' }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isConnected ? (
          <div className="text-center py-20">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome to ChainBet
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Decentralized prediction markets powered by Chainlink
              </p>
            </div>
            <ConnectButton />
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'markets' && <MarketList />}
              {activeTab === 'my-bets' && <UserBets />}
              {activeTab === 'create' && <CreateMarket />}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
