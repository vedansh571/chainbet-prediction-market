import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useChainBet } from '../hooks/useChainBet';

const BetModal = ({ market, onClose }) => {
  const { placeBet, isPlacingBet } = useChainBet();
  const [prediction, setPrediction] = useState(true); // true = YES, false = NO
  const [amount, setAmount] = useState('');

  const handlePlaceBet = async () => {
    if (!amount || parseFloat(amount) < 1) {
      toast.error('Minimum bet is 1 USDC');
      return;
    }

    try {
      await placeBet(market.id, prediction, amount, 'USDC');
      onClose();
    } catch (error) {
      console.error('Error placing bet:', error);
    }
  };

  const totalPool = market.totalYesBets + market.totalNoBets;
  const currentOdds = prediction 
    ? totalPool > 0 ? (market.totalNoBets / market.totalYesBets || 1) : 1
    : totalPool > 0 ? (market.totalYesBets / market.totalNoBets || 1) : 1;

  const potentialWin = parseFloat(amount || 0) * currentOdds;

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded-xl bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Place Your Bet
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Market Question:</p>
            <p className="font-medium text-gray-900">{market.question}</p>
          </div>

          {/* Prediction Selection */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Your Prediction:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPrediction(true)}
                className={`p-3 rounded-lg border-2 font-medium transition-colors ${
                  prediction
                    ? 'border-success-500 bg-success-50 text-success-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                YES 👍
              </button>
              <button
                onClick={() => setPrediction(false)}
                className={`p-3 rounded-lg border-2 font-medium transition-colors ${
                  !prediction
                    ? 'border-danger-500 bg-danger-50 text-danger-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                NO 👎
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bet Amount (USDC)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="1"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Betting Info */}
          {amount && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm mb-1">
                <span>Your Bet:</span>
                <span className="font-medium">${amount} USDC</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span>Current Odds:</span>
                <span className="font-medium">{currentOdds.toFixed(2)}x</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Potential Win:</span>
                <span className="font-medium text-success-600">
                  ${potentialWin.toFixed(2)} USDC
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handlePlaceBet}
              disabled={isPlacingBet || !amount}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlacingBet ? 'Placing Bet...' : 'Place Bet'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default BetModal;
