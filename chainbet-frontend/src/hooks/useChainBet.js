import { useState, useEffect, useCallback } from 'react';
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction, useNetwork } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import toast from 'react-hot-toast';
import { 
  getContractAddress, 
  getPriceFeedAddress, 
  getTokenInfo 
} from '../contracts/config';
import ChainBetPredictionMarketABI from '../contracts/abis/ChainBetPredictionMarket.json';

export const useChainBet = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const [markets, setMarkets] = useState([]);
  const [userBets, setUserBets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get contract address for current network
  const contractAddress = getContractAddress('CHAINBET_PREDICTION_MARKET', chain?.id);

  // Read market counter
  const { data: marketCounter = 0n } = useContractRead({
    address: contractAddress,
    abi: ChainBetPredictionMarketABI,
    functionName: 'marketCounter',
    watch: true,
  });

  // Contract write functions
  const { write: createMarketWrite, data: createMarketData } = useContractWrite({
    address: contractAddress,
    abi: ChainBetPredictionMarketABI,
    functionName: 'createMarket',
  });

  const { write: placeBetWrite, data: placeBetData } = useContractWrite({
    address: contractAddress,
    abi: ChainBetPredictionMarketABI,
    functionName: 'placeBet',
  });

  const { write: resolveMarketWrite, data: resolveMarketData } = useContractWrite({
    address: contractAddress,
    abi: ChainBetPredictionMarketABI,
    functionName: 'resolveMarket',
  });

  const { write: claimRewardWrite, data: claimRewardData } = useContractWrite({
    address: contractAddress,
    abi: ChainBetPredictionMarketABI,
    functionName: 'claimReward',
  });

  // Wait for transactions
  const { isLoading: isCreatingMarket } = useWaitForTransaction({
    hash: createMarketData?.hash,
    onSuccess: () => {
      toast.success('Market created successfully!');
      fetchMarkets();
    },
    onError: () => {
      toast.error('Failed to create market');
    },
  });

  const { isLoading: isPlacingBet } = useWaitForTransaction({
    hash: placeBetData?.hash,
    onSuccess: () => {
      toast.success('Bet placed successfully!');
      fetchMarkets();
      fetchUserBets();
    },
    onError: () => {
      toast.error('Failed to place bet');
    },
  });

  const { isLoading: isResolvingMarket } = useWaitForTransaction({
    hash: resolveMarketData?.hash,
    onSuccess: () => {
      toast.success('Market resolved successfully!');
      fetchMarkets();
    },
    onError: () => {
      toast.error('Failed to resolve market');
    },
  });

  const { isLoading: isClaimingReward } = useWaitForTransaction({
    hash: claimRewardData?.hash,
    onSuccess: () => {
      toast.success('Reward claimed successfully!');
      fetchUserBets();
    },
    onError: () => {
      toast.error('Failed to claim reward');
    },
  });

  // Fetch all markets using direct contract calls
  const fetchMarkets = useCallback(async () => {
    if (!contractAddress || !marketCounter) return;

    setIsLoading(true);
    try {
      const marketPromises = [];
      for (let i = 0; i < Number(marketCounter); i++) {
        marketPromises.push(
          // Use a mock market for now - in production you'd call the contract
          Promise.resolve({
            question: `Sample Market ${i + 1}`,
            targetPrice: parseUnits('50000', 8), // $50,000
            deadline: BigInt(Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60), // 7 days from now
            priceOracle: '0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43',
            resolved: false,
            outcome: false,
            totalYesBets: parseUnits('1000', 6), // 1000 USDC
            totalNoBets: parseUnits('800', 6), // 800 USDC
            totalBettors: 15n,
            tokenAddress: getContractAddress('USDC', chain?.id),
          })
        );
      }
      
      const marketResults = await Promise.all(marketPromises);
      const validMarkets = marketResults
        .filter(market => market !== null)
        .map((market, index) => ({
          ...market,
          id: index,
          formattedTargetPrice: formatUnits(market.targetPrice, 8),
          formattedTotalYesBets: formatUnits(market.totalYesBets, 6),
          formattedTotalNoBets: formatUnits(market.totalNoBets, 6),
          deadline: new Date(Number(market.deadline) * 1000),
          isExpired: Date.now() > Number(market.deadline) * 1000,
        }));

      setMarkets(validMarkets);
    } catch (error) {
      console.error('Error fetching markets:', error);
      toast.error('Failed to fetch markets');
    } finally {
      setIsLoading(false);
    }
  }, [contractAddress, marketCounter, chain?.id]);

  // Fetch user bets using direct contract calls
  const fetchUserBets = useCallback(async () => {
    if (!contractAddress || !address || !marketCounter) return;

    try {
      const betPromises = [];
      for (let i = 0; i < Number(marketCounter); i++) {
        betPromises.push(
          // Use a mock bet for now - in production you'd call the contract
          Promise.resolve({
            bettor: address,
            amount: parseUnits('100', 6), // 100 USDC
            prediction: true,
            claimed: false,
          })
        );
      }
      
      const betResults = await Promise.all(betPromises);
      const validBets = betResults
        .filter(bet => bet !== null && bet.amount > 0n)
        .map((bet, index) => ({
          ...bet,
          marketId: index,
          formattedAmount: formatUnits(bet.amount, 6),
        }));

      setUserBets(validBets);
    } catch (error) {
      console.error('Error fetching user bets:', error);
    }
  }, [contractAddress, address, marketCounter]);

  // Create market function
  const createMarket = useCallback(async (marketData) => {
    if (!contractAddress) {
      toast.error('Please connect to a supported network');
      return;
    }

    try {
      const {
        question,
        targetPrice,
        duration,
        oracle,
        token
      } = marketData;

      const priceFeedAddress = getPriceFeedAddress(oracle, chain?.id);
      const tokenAddress = getContractAddress(token, chain?.id);
      const tokenInfo = getTokenInfo(token);

      if (!priceFeedAddress) {
        toast.error('Price feed not available for this network');
        return;
      }

      if (!tokenAddress) {
        toast.error('Token not available for this network');
        return;
      }

      const durationInSeconds = BigInt(parseInt(duration) * 24 * 60 * 60);
      const targetPriceInWei = parseUnits(targetPrice.toString(), 8); // Chainlink uses 8 decimals

      createMarketWrite({
        args: [
          question,
          targetPriceInWei,
          durationInSeconds,
          priceFeedAddress,
          tokenAddress
        ],
      });
    } catch (error) {
      console.error('Error creating market:', error);
      toast.error('Failed to create market');
    }
  }, [contractAddress, chain?.id, createMarketWrite]);

  // Place bet function
  const placeBet = useCallback(async (marketId, prediction, amount, token) => {
    if (!contractAddress) {
      toast.error('Please connect to a supported network');
      return;
    }

    try {
      const tokenInfo = getTokenInfo(token);
      const amountInWei = parseUnits(amount.toString(), tokenInfo.decimals);

      placeBetWrite({
        args: [BigInt(marketId), prediction, amountInWei],
      });
    } catch (error) {
      console.error('Error placing bet:', error);
      toast.error('Failed to place bet');
    }
  }, [contractAddress, placeBetWrite]);

  // Resolve market function
  const resolveMarket = useCallback(async (marketId) => {
    if (!contractAddress) {
      toast.error('Please connect to a supported network');
      return;
    }

    try {
      resolveMarketWrite({
        args: [BigInt(marketId)],
      });
    } catch (error) {
      console.error('Error resolving market:', error);
      toast.error('Failed to resolve market');
    }
  }, [contractAddress, resolveMarketWrite]);

  // Claim reward function
  const claimReward = useCallback(async (marketId) => {
    if (!contractAddress) {
      toast.error('Please connect to a supported network');
      return;
    }

    try {
      claimRewardWrite({
        args: [BigInt(marketId)],
      });
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast.error('Failed to claim reward');
    }
  }, [contractAddress, claimRewardWrite]);

  // Get market info
  const getMarketInfo = useCallback(async (marketId) => {
    if (!contractAddress) return null;

    try {
      // Mock market info for now
      return {
        question: `Sample Market ${marketId + 1}`,
        targetPrice: parseUnits('50000', 8),
        deadline: BigInt(Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60),
        priceOracle: '0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43',
        resolved: false,
        outcome: false,
        totalYesBets: parseUnits('1000', 6),
        totalNoBets: parseUnits('800', 6),
        totalBettors: 15n,
        tokenAddress: getContractAddress('USDC', chain?.id),
      };
    } catch (error) {
      console.error('Error fetching market info:', error);
      return null;
    }
  }, [contractAddress, chain?.id]);

  // Get user bet
  const getUserBet = useCallback(async (marketId, userAddress) => {
    if (!contractAddress || !userAddress) return null;

    try {
      // Mock user bet for now
      return {
        bettor: userAddress,
        amount: parseUnits('100', 6),
        prediction: true,
        claimed: false,
      };
    } catch (error) {
      console.error('Error fetching user bet:', error);
      return null;
    }
  }, [contractAddress]);

  // Load data on mount and when dependencies change
  useEffect(() => {
    if (isConnected && contractAddress) {
      fetchMarkets();
      fetchUserBets();
    }
  }, [isConnected, contractAddress, fetchMarkets, fetchUserBets]);

  return {
    // State
    markets,
    userBets,
    isLoading,
    isCreatingMarket,
    isPlacingBet,
    isResolvingMarket,
    isClaimingReward,
    
    // Functions
    createMarket,
    placeBet,
    resolveMarket,
    claimReward,
    getMarketInfo,
    getUserBet,
    fetchMarkets,
    fetchUserBets,
    
    // Contract info
    contractAddress,
    marketCounter: Number(marketCounter),
  };
}; 