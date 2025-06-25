import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useChainBet } from '../hooks/useChainBet';

const CreateMarket = () => {
  const { createMarket, isCreatingMarket } = useChainBet();
  const [formData, setFormData] = useState({
    question: '',
    targetPrice: '',
    duration: '7', // days
    oracle: 'BTC/USD',
    token: 'USDC'
  });

  const oracles = [
    { value: 'BTC/USD', label: 'Bitcoin (BTC/USD)' },
    { value: 'ETH/USD', label: 'Ethereum (ETH/USD)' },
    { value: 'LINK/USD', label: 'Chainlink (LINK/USD)' },
    { value: 'MATIC/USD', label: 'Polygon (MATIC/USD)' }
  ];

  const durations = [
    { value: '1', label: '1 Day' },
    { value: '7', label: '1 Week' },
    { value: '30', label: '1 Month' },
    { value: '90', label: '3 Months' },
    { value: '365', label: '1 Year' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.question || !formData.targetPrice) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (parseFloat(formData.targetPrice) <= 0) {
      toast.error('Target price must be greater than 0');
      return;
    }

    try {
      await createMarket(formData);
      
      // Reset form on success
      setFormData({
        question: '',
        targetPrice: '',
        duration: '7',
        oracle: 'BTC/USD',
        token: 'USDC'
      });
    } catch (error) {
      console.error('Error creating market:', error);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create New Market</h2>
        <p className="text-gray-600">Set up a new prediction market for others to bet on</p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="card">
          {/* Market Question */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Market Question *
            </label>
            <textarea
              name="question"
              value={formData.question}
              onChange={handleInputChange}
              placeholder="e.g., Will Bitcoin reach $100,000 by end of 2024?"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Be specific and clear about the prediction criteria
            </p>
          </div>

          {/* Oracle Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Oracle *
            </label>
            <select
              name="oracle"
              value={formData.oracle}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            >
              {oracles.map((oracle) => (
                <option key={oracle.value} value={oracle.value}>
                  {oracle.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Chainlink price feed to determine the outcome
            </p>
          </div>

          {/* Target Price */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Price (USD) *
            </label>
            <input
              type="number"
              name="targetPrice"
              value={formData.targetPrice}
              onChange={handleInputChange}
              placeholder="e.g., 100000"
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              The price threshold for the prediction
            </p>
          </div>

          {/* Duration */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Market Duration *
            </label>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            >
              {durations.map((duration) => (
                <option key={duration.value} value={duration.value}>
                  {duration.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              How long the market will remain open for betting
            </p>
          </div>

          {/* Token Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Betting Token *
            </label>
            <select
              name="token"
              value={formData.token}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="USDC">USDC</option>
              <option value="USDT">USDT</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Token that users will bet with
            </p>
          </div>

          {/* Market Preview */}
          {formData.question && formData.targetPrice && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Market Preview:</h4>
              <p className="text-sm text-gray-700 mb-2">{formData.question}</p>
              <div className="text-xs text-gray-600 space-y-1">
                <p>Target: ${parseFloat(formData.targetPrice || 0).toLocaleString()} USD</p>
                <p>Oracle: {oracles.find(o => o.value === formData.oracle)?.label}</p>
                <p>Duration: {durations.find(d => d.value === formData.duration)?.label}</p>
                <p>Token: {formData.token}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isCreatingMarket}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreatingMarket ? 'Creating Market...' : 'Create Market'}
          </button>
        </form>

        {/* Info Card */}
        <div className="mt-6 card bg-blue-50 border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">📋 Market Creation Guidelines</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Markets are resolved automatically using Chainlink price feeds</li>
            <li>• A 3% platform fee is charged on losing bets</li>
            <li>• Markets cannot be modified once created</li>
            <li>• Ensure your question is clear and unambiguous</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateMarket;
