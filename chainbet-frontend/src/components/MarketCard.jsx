import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const MarketCard = ({ market, onBetClick }) => {
  const totalPool = parseFloat(market.formattedTotalYesBets || 0) + parseFloat(market.formattedTotalNoBets || 0);
  const yesPercentage = totalPool > 0 ? (parseFloat(market.formattedTotalYesBets || 0) / totalPool) * 100 : 50;
  const noPercentage = 100 - yesPercentage;
  
  const targetPrice = parseFloat(market.formattedTargetPrice || 0);
  const currentPrice = targetPrice * 0.8; // Mock current price for now
  const priceProgress = (currentPrice / targetPrice) * 100;
  const isCloseToTarget = priceProgress > 80;

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {market.question}
        </h3>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Market #{market.id}</span>
          <span>Ends {formatDistanceToNow(market.deadline, { addSuffix: true })}</span>
        </div>
      </div>

      {/* Current Price vs Target */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Current Price</span>
          <span className="text-lg font-bold text-gray-900">
            ${currentPrice.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Target Price</span>
          <span className="text-lg font-bold text-primary-600">
            ${targetPrice.toLocaleString()}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div 
            className={`h-2 rounded-full transition-all ${
              isCloseToTarget ? 'bg-success-500' : 'bg-primary-500'
            }`}
            style={{ width: `${Math.min(priceProgress, 100)}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500">
          {priceProgress.toFixed(1)}% to target
        </p>
      </div>

      {/* Betting Pool */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Total Pool</span>
          <span className="text-sm font-bold text-gray-900">
            ${totalPool.toLocaleString()} USDC
          </span>
        </div>
        
        {/* Yes/No Distribution */}
        <div className="flex rounded-lg overflow-hidden h-8 mb-2">
          <div 
            className="bg-success-500 flex items-center justify-center text-white text-xs font-medium"
            style={{ width: `${yesPercentage}%` }}
          >
            {yesPercentage > 15 && `${yesPercentage.toFixed(0)}% YES`}
          </div>
          <div 
            className="bg-danger-500 flex items-center justify-center text-white text-xs font-medium"
            style={{ width: `${noPercentage}%` }}
          >
            {noPercentage > 15 && `${noPercentage.toFixed(0)}% NO`}
          </div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-600">
          <span>YES: ${parseFloat(market.formattedTotalYesBets || 0).toLocaleString()}</span>
          <span>NO: ${parseFloat(market.formattedTotalNoBets || 0).toLocaleString()}</span>
        </div>
      </div>

      {/* Market Status */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            market.resolved 
              ? 'bg-gray-100 text-gray-800' 
              : market.isExpired 
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
          }`}>
            {market.resolved 
              ? 'Resolved' 
              : market.isExpired 
                ? 'Expired'
                : 'Active'
            }
          </span>
        </div>
        {market.resolved && (
          <p className="text-xs text-gray-500 mt-1">
            Outcome: {market.outcome ? 'YES' : 'NO'}
          </p>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={onBetClick}
        disabled={market.resolved || market.isExpired}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {market.resolved ? 'Market Resolved' : market.isExpired ? 'Market Expired' : 'Place Bet'}
      </button>
    </div>
  );
};

export default MarketCard;

