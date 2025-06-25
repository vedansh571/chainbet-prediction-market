import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import MarketCard from './MarketCard';
import BetModal from './BetModal';
import { useChainBet } from '../hooks/useChainBet';

const MarketList = () => {
  const { markets, isLoading } = useChainBet();
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [showBetModal, setShowBetModal] = useState(false);

  const handleBetClick = (market) => {
    setSelectedMarket(market);
    setShowBetModal(true);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading markets...</p>
      </div>
    );
  }

  if (markets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📊</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Markets Available</h3>
        <p className="text-gray-600">Be the first to create a prediction market!</p>
      </div>
    );
  }

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
