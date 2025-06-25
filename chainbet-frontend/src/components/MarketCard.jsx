import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const MarketCard = ({ market, onBetClick }) => {
  const totalPool = market.totalYesBets + market.totalNoBets;
  const yesPercentage = totalPool > 0 ? (market.totalYesBets / totalPool) * 100 : 50;
  const noPercentage = 100 - yesPercentage;
  
  const priceProgress = (market.currentPrice / market.targetPrice) * 100;
  const isCloseToTarget = priceProgress > 80;

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {market.question}
        </h3>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Oracle: {market.oracle}</span>
          <span>Ends {formatDistanceToNow(market.deadline, { addSuffix: true })}</span>
        </div>
      </div>

      {/* Current Price vs Target */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Current Price</span>
          <span className="text-lg font-bold text-gray-900">
            ${market.currentPrice.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Target Price</span>
          <span className="text-lg font-bold text-primary-600">
            ${market.targetPrice.toLocaleString()}
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
          <span>YES: ${market.totalYesBets.toLocaleString()}</span>
          <span>NO: ${market.totalNoBets.toLocaleString()}</span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onBetClick}
        className="w-full btn-primary"
      >
        Place Bet
      </button>
    </div>
  );
};

export default MarketCard;

