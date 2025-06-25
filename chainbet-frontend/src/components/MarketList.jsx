import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import MarketCard from './MarketCard';
import BetModal from './BetModal';

const MarketList = () => {
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [showBetModal, setShowBetModal] = useState(false);

  // Mock data - replace with actual contract calls
  const markets = [
    {
      id: 0,
      question: "Will Bitcoin reach $100,000 by end of 2024?",
      targetPrice: 100000,
      currentPrice: 67500,
      deadline: new Date('2024-12-31'),
      totalYesBets: 15000,
      totalNoBets: 8500,
      resolved: false,
      tokenAddress: '0x...',
      oracle: 'BTC/USD'
    },
    {
      id: 1,
      question: "Will Ethereum reach $5,000 by Q2 2024?",
      targetPrice: 5000,
      currentPrice: 3200,
      deadline: new Date('2024-06-30'),
      totalYesBets: 12000,
      totalNoBets: 18000,
      resolved: false,
      tokenAddress: '0x...',
      oracle: 'ETH/USD'
    }
  ];

  const handleBetClick = (market) => {
    setSelectedMarket(market);
    setShowBetModal(true);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Active Markets</h2>
        <p className="text-gray-600">Place your bets on cryptocurrency price predictions</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {markets.map((market) => (
          <MarketCard
            key={market.id}
            market={market}
            onBetClick={() => handleBetClick(market)}
          />
        ))}
      </div>

      {showBetModal && (
        <BetModal
          market={selectedMarket}
          onClose={() => setShowBetModal(false)}
        />
      )}
    </div>
  );
};

export default MarketList;
