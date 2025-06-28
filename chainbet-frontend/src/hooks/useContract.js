import { useContractRead, useContractWrite } from 'wagmi';
import { CONTRACT_CONFIG, PREDICTION_MARKET_ABI, ERC20_ABI } from '../contracts/config';

// Read the number of markets
export function useMarketCounter() {
  return useContractRead({
    address: CONTRACT_CONFIG.CHAINBET_PREDICTION_MARKET,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'marketCounter',
    watch: true,
  });
}

// Read info for a specific market
export function useMarketInfo(marketId) {
  return useContractRead({
    address: CONTRACT_CONFIG.CHAINBET_PREDICTION_MARKET,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'getMarketInfo',
    args: [marketId],
    watch: true,
  });
}

// Example: Write to create a market (owner only)
export function useCreateMarket() {
  return useContractWrite({
    address: CONTRACT_CONFIG.CHAINBET_PREDICTION_MARKET,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'createMarket',
  });
}

// Example: Read USDC balance
export function useUSDCBalance(address) {
  return useContractRead({
    address: CONTRACT_CONFIG.USDC,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address],
    watch: true,
  });
}

// Helper function to format token amounts (6 decimals for USDC/USDT)
export const formatTokenAmount = (amount, decimals = 6) => {
  return (Number(amount) / Math.pow(10, decimals)).toFixed(2);
};

// Helper function to parse token amounts
export const parseTokenAmount = (amount, decimals = 6) => {
  return (Number(amount) * Math.pow(10, decimals)).toString();
}; 