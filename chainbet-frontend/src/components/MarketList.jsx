import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useMarketCounter, useMarketInfo, formatTokenAmount } from '../hooks/useContract';
import MarketCard from './MarketCard';
import BetModal from './BetModal';
import toast from 'react-hot-toast';

const MarketList = () => {
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [showBetModal, setShowBetModal] = useState(false);
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  const { address } = useAccount();
  const { data: marketCount, isLoading: isMarketCountLoading } = useMarketCounter();

  // Fetch all markets using useMarketInfo
  useEffect(() => {
    const fetchMarkets = async () => {
      if (!marketCount || isMarketCountLoading) {
        setMarkets([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const marketPromises = [];
        for (let i = 0; i < Number(marketCount); i++) {
          // useMarketInfo is a hook, but we need to fetch all markets in a loop
          // So, we use a dynamic import of the hook function for each market
          marketPromises.push(
            import('../hooks/useContract').then(({ useMarketInfo }) => useMarketInfo(i))
          );
        }
        const marketHooks = await Promise.all(marketPromises);
        // Each marketHook is an object with a 'data' property
        const formattedMarkets = marketHooks.map((hook, index) => {
          const market = hook.data;
          if (!market) return null;
          return {
            id: index,
            question: market.question,
            targetPrice: Number(market.targetPrice),
            deadline: new Date(Number(market.deadline) * 1000),
            totalYesBets: formatTokenAmount(market.totalYesBets),
            totalNoBets: formatTokenAmount(market.totalNoBets),
            resolved: market.resolved,
            outcome: market.outcome,
            tokenAddress: market.tokenAddress,
            oracle: market.priceOracle,
            totalBettors: Number(market.totalBettors)
          };
        }).filter(Boolean);
        setMarkets(formattedMarkets);
      } catch (error) {
        console.error('Error fetching markets:', error);
        toast.error('Failed to fetch markets');
      } finally {
        setLoading(false);
      }
    };
    fetchMarkets();
  }, [marketCount, isMarketCountLoading]);

  const handleBetClick = (market) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }
    setSelectedMarket(market);
    setShowBetModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Active Markets</h2>
        <p className="text-gray-600">Place your bets on cryptocurrency price predictions</p>
      </div>

      {markets.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-gray-500 text-lg mb-4">No markets found</div>
          <p className="text-gray-400">Markets will appear here once they are created</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {markets.map((market) => (
            <MarketCard
              key={market.id}
              market={market}
              onBetClick={() => handleBetClick(market)}
            />
          ))}
        </div>
      )}

      {showBetModal && (
        <BetModal
          market={selectedMarket}
          onClose={() => setShowBetModal(false)}
          onSuccess={() => {
            setShowBetModal(false);
            // Optionally, refetch markets here
          }}
        />
      )}
    </div>
  );
};

export default MarketList;
