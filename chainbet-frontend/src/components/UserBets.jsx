import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useChainBet } from '../hooks/useChainBet';

const UserBets = () => {
  const { userBets, markets, claimReward, isClaimingReward } = useChainBet();

  const getStatusColor = (status) => {
    switch (status) {
      case 'won': return 'text-success-600 bg-success-50';
      case 'lost': return 'text-danger-600 bg-danger-50';
      case 'active': return 'text-primary-600 bg-primary-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'won': return '🎉 Won';
      case 'lost': return '😞 Lost';
      case 'active': return '⏳ Active';
      default: return 'Unknown';
    }
  };

  const handleClaimReward = async (marketId) => {
    try {
      await claimReward(marketId);
    } catch (error) {
      console.error('Error claiming reward:', error);
    }
  };

  // Combine user bets with market data
  const enrichedBets = userBets.map(bet => {
    const market = markets.find(m => m.id === bet.marketId);
    return {
      ...bet,
      question: market?.question || 'Unknown Market',
      deadline: market?.deadline,
      resolved: market?.resolved,
      outcome: market?.outcome,
      status: market?.resolved 
        ? (bet.prediction === market.outcome ? 'won' : 'lost')
        : 'active'
    };
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Bets</h2>
        <p className="text-gray-600">Track your prediction market positions</p>
      </div>

      {enrichedBets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bets yet</h3>
          <p className="text-gray-600">Start by placing your first prediction!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {enrichedBets.map((bet) => (
            <div key={`${bet.marketId}-${bet.bettor}`} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {bet.question}
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Prediction</p>
                      <p className={`font-medium ${
                        bet.prediction ? 'text-success-600' : 'text-danger-600'
                      }`}>
                        {bet.prediction ? 'YES 👍' : 'NO 👎'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-gray-600">Bet Amount</p>
                      <p className="font-medium">${bet.formattedAmount} USDC</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-600">Status</p>
                      <p className="font-medium">
                        {bet.status === 'active' ? 'Active' : bet.status === 'won' ? 'Won' : 'Lost'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-gray-600">Market ID</p>
                      <p className="font-medium">#{bet.marketId}</p>
                    </div>
                  </div>
                  
                  {bet.status === 'active' && bet.deadline && (
                    <p className="text-xs text-gray-500 mt-2">
                      Ends {formatDistanceToNow(bet.deadline, { addSuffix: true })}
                    </p>
                  )}
                  
                  {bet.resolved && (
                    <p className="text-xs text-gray-500 mt-2">
                      Outcome: {bet.outcome ? 'YES' : 'NO'}
                    </p>
                  )}
                </div>
                
                <div className="ml-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bet.status)}`}>
                    {getStatusText(bet.status)}
                  </span>
                  
                  {bet.status === 'won' && !bet.claimed && (
                    <button 
                      onClick={() => handleClaimReward(bet.marketId)}
                      disabled={isClaimingReward}
                      className="block mt-2 text-xs text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
                    >
                      {isClaimingReward ? 'Claiming...' : 'Claim Reward'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBets;
