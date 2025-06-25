// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  // Sepolia testnet
  11155111: {
    CHAINBET_PREDICTION_MARKET: '0x0000000000000000000000000000000000000000', // Replace with deployed address
    USDC: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // Sepolia USDC
    USDT: '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0', // Sepolia USDT
  },
  // Polygon Mumbai testnet
  80001: {
    CHAINBET_PREDICTION_MARKET: '0x0000000000000000000000000000000000000000', // Replace with deployed address
    USDC: '0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747', // Mumbai USDC
    USDT: '0xA02f6adc7926efeBBd59Fd43A84f4E0c0c91e832', // Mumbai USDT
  }
};

// Chainlink Price Feed addresses
export const PRICE_FEEDS = {
  // Sepolia
  11155111: {
    'BTC/USD': '0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43',
    'ETH/USD': '0x694AA1769357215DE4FAC081bf1f309aDC325306',
    'LINK/USD': '0xc59E3633BAAC79493d908e63626716e204A45EdF',
    'MATIC/USD': '0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada'
  },
  // Mumbai
  80001: {
    'BTC/USD': '0x007A22900a3B98143368Bd5906f8E17e9867581b',
    'ETH/USD': '0x0715A7794a1dc8e42615F059dD6e406A6594651A',
    'LINK/USD': '0x12162c3E810393dEC58762A6C1B6E66C4e4d1C3C',
    'MATIC/USD': '0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada'
  }
};

// Token configurations
export const TOKENS = {
  USDC: {
    symbol: 'USDC',
    decimals: 6,
    name: 'USD Coin'
  },
  USDT: {
    symbol: 'USDT',
    decimals: 6,
    name: 'Tether USD'
  }
};

// Network configurations
export const NETWORKS = {
  11155111: {
    name: 'Sepolia',
    chainId: 11155111,
    rpcUrl: 'https://sepolia.infura.io/v3/your-project-id',
    explorer: 'https://sepolia.etherscan.io'
  },
  80001: {
    name: 'Mumbai',
    chainId: 80001,
    rpcUrl: 'https://polygon-mumbai.infura.io/v3/your-project-id',
    explorer: 'https://mumbai.polygonscan.com'
  }
};

// Helper function to get contract address for current network
export const getContractAddress = (contractName, chainId) => {
  return CONTRACT_ADDRESSES[chainId]?.[contractName];
};

// Helper function to get price feed address
export const getPriceFeedAddress = (pair, chainId) => {
  return PRICE_FEEDS[chainId]?.[pair];
};

// Helper function to get token info
export const getTokenInfo = (tokenSymbol) => {
  return TOKENS[tokenSymbol];
}; 