import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const UserBets = () => {
  // Mock data - replace with actual contract calls
  const userBets = [
    {
      id: 1,
      marketId: 0,
      question: "Will Bitcoin reach $100,000 by end of 2024?",
      prediction: true,
      amount: 500,
      potentialWin: 750,
      status: 'active',
      placedAt: new Date('2024-01-15'),
      deadline: new Date('2024-12-31')
    },
    {
      id: 2,
      marketId: 1,
      question: "Will Ethereum reach $5,000 by Q2 2024?",
      prediction: false,
      amount: 300,
      potentialWin: 420,
      status: 'won',
      placedAt: new Date('2024-02-01'),
      deadline: new Date('2024-06-30'),
      finalPrice: 4200
    }
  ];

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

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Bets</h2>
        <p className="text-gray-600">Track your prediction market positions</p>
      </div>

      {userBets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bets yet</h3>
          <p className="text-gray-600">Start by placing your first prediction!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {userBets.map((bet) => (
            <div key={bet.id} className="card">
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
                      <p className="font-medium">${bet.amount} USDC</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-600">Potential Win</p>
                      <p className="font-medium text-success-600">
                        ${bet.potentialWin} USDC
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-gray-600">Placed</p>
                      <p className="font-medium">
                        {formatDistanceToNow(bet.placedAt, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  
                  {bet.status === 'active' && (
                    <p className="text-xs text-gray-500 mt-2">
                      Ends {formatDistanceToNow(bet.deadline, { addSuffix: true })}
                    </p>
                  )}
                  
                  {bet.finalPrice && (
                    <p className="text-xs text-gray-500 mt-2">
                      Final price: ${bet.finalPrice.toLocaleString()}
                    </p>
                  )}
                </div>
                
                <div className="ml-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bet.status)}`}>
                    {getStatusText(bet.status)}
                  </span>
                  
                  {bet.status === 'won' && (
                    <button className="block mt-2 text-xs text-primary-600 hover:text-primary-700 font-medium">
                      Claim Reward
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
