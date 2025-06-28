import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useContractWrite, useAccount, useChainId } from 'wagmi';
import { CONTRACT_CONFIG, PREDICTION_MARKET_ABI } from '../contracts/config';

const ORACLE_ADDRESS_MAP = {
  'BTC/USD': CONTRACT_CONFIG.PRICE_FEEDS.BTC_USD,
  'ETH/USD': CONTRACT_CONFIG.PRICE_FEEDS.ETH_USD,
  'LINK/USD': CONTRACT_CONFIG.PRICE_FEEDS.LINK_USD,
  'MATIC/USD': CONTRACT_CONFIG.PRICE_FEEDS.MATIC_USD,
  // Add more oracles as needed
};

const TOKEN_ADDRESS_MAP = {
  'USDC': CONTRACT_CONFIG.USDC,
  'USDT': CONTRACT_CONFIG.USDT,
};

const CreateMarket = () => {
  const [formData, setFormData] = useState({
    question: '',
    targetPrice: '',
    duration: '7', // days
    oracle: 'BTC/USD',
    token: 'USDC'
  });
  const [isLoading, setIsLoading] = useState(false);

  // Add wallet and network checks
  const { address, isConnected } = useAccount();
  const { chainId } = useChainId();

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

  const { write } = useContractWrite({
    address: CONTRACT_CONFIG.CHAINBET_PREDICTION_MARKET,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'createMarket',
    onSuccess: () => {
      toast.success('Market created successfully!');
      setFormData({
        question: '',
        targetPrice: '',
        duration: '7',
        oracle: 'BTC/USD',
        token: 'USDC'
      });
      setIsLoading(false);
    },
    onError: (error) => {
      toast.error('Failed to create market');
      setIsLoading(false);
      console.error(error);
    }
  });

  // Debug logging
  console.log('Contract Config:', CONTRACT_CONFIG);
  console.log('Contract Address:', CONTRACT_CONFIG.CHAINBET_PREDICTION_MARKET);
  console.log('Write function available:', !!write);
  console.log('Oracle Address Map:', ORACLE_ADDRESS_MAP);
  console.log('Token Address Map:', TOKEN_ADDRESS_MAP);
  console.log('Wallet connected:', isConnected);
  console.log('Wallet address:', address);
  console.log('Current chain ID:', chainId);
  console.log('Expected chain ID:', CONTRACT_CONFIG.CHAIN_ID);

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
    setIsLoading(true);
    try {
      const durationInSeconds = parseInt(formData.duration) * 24 * 60 * 60;
      const oracleAddress = ORACLE_ADDRESS_MAP[formData.oracle];
      const tokenAddress = TOKEN_ADDRESS_MAP[formData.token];
      if (!oracleAddress || !tokenAddress) {
        toast.error('Invalid oracle or token selection');
        setIsLoading(false);
        return;
      }
      console.log(formData.question, parseInt(formData.targetPrice), durationInSeconds, oracleAddress, tokenAddress);
      if (!write) {
        if (!isConnected) {
          toast.error('Please connect your wallet first');
        } else if (chainId !== CONTRACT_CONFIG.CHAIN_ID) {
          toast.error(`Please switch to Sepolia network (Chain ID: ${CONTRACT_CONFIG.CHAIN_ID})`);
        } else {
          toast.error('Contract not ready. Please check your connection and try again.');
        }
        setIsLoading(false);
        return;
      }
      write({
        args: [
          formData.question,
          parseInt(formData.targetPrice),
          durationInSeconds,
          oracleAddress,
          tokenAddress
        ]
      });
    } catch (error) {
      toast.error('Failed to create market');
      setIsLoading(false);
      console.error(error);
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
            disabled={isLoading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Market...' : 'Create Market'}
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
