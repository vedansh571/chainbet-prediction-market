// Contract configuration for Sepolia testnet
export const CONTRACT_CONFIG = {
  // Your successfully deployed contract addresses
  CHAINBET_PREDICTION_MARKET: "0x95b7287e4cf548aaf8f67788fd48ba9356dfb0e9",
  CHAINBET_BRIDGE: "0xc58139b618db9f761732090c3ba958a12972a891",
  
  // Token addresses on Sepolia
  USDC: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  USDT: "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06",
  
  // Chain configuration
  CHAIN_ID: 11155111, // Sepolia
  RPC_URL: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
  
  // Chainlink Price Feed Oracles for Sepolia
  PRICE_FEEDS: {
    ETH_USD: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    BTC_USD: "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43",
    LINK_USD: "0xc59E3633BAAC79493d908e63626716e204A45EdF",
    USDC_USD: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", // USDC itself on Sepolia
  }
};

// ChainBetPredictionMarket ABI from Etherscan
export const PREDICTION_MARKET_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "_usdc", "type": "address"},
      {"internalType": "address", "name": "_usdt", "type": "address"}
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "marketId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "bettor", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"},
      {"indexed": false, "internalType": "bool", "name": "prediction", "type": "bool"}
    ],
    "name": "BetPlaced",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "marketId", "type": "uint256"},
      {"indexed": false, "internalType": "string", "name": "question", "type": "string"},
      {"indexed": false, "internalType": "uint256", "name": "targetPrice", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "deadline", "type": "uint256"},
      {"indexed": false, "internalType": "address", "name": "oracle", "type": "address"},
      {"indexed": false, "internalType": "address", "name": "token", "type": "address"}
    ],
    "name": "MarketCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "marketId", "type": "uint256"},
      {"indexed": false, "internalType": "bool", "name": "outcome", "type": "bool"},
      {"indexed": false, "internalType": "uint256", "name": "finalPrice", "type": "uint256"}
    ],
    "name": "MarketResolved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "previousOwner", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "newOwner", "type": "address"}
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "marketId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "bettor", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "RewardClaimed",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "FEE_DENOMINATOR",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MINIMUM_BET",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "PLATFORM_FEE",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "USDC",
    "outputs": [{"internalType": "contract IERC20", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "USDT",
    "outputs": [{"internalType": "contract IERC20", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"},
      {"internalType": "address", "name": "", "type": "address"}
    ],
    "name": "bets",
    "outputs": [
      {"internalType": "address", "name": "bettor", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"},
      {"internalType": "bool", "name": "prediction", "type": "bool"},
      {"internalType": "bool", "name": "claimed", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_marketId", "type": "uint256"}],
    "name": "claimReward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "_question", "type": "string"},
      {"internalType": "uint256", "name": "_targetPrice", "type": "uint256"},
      {"internalType": "uint256", "name": "_duration", "type": "uint256"},
      {"internalType": "address", "name": "_priceOracle", "type": "address"},
      {"internalType": "address", "name": "_tokenAddress", "type": "address"}
    ],
    "name": "createMarket",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_marketId", "type": "uint256"}],
    "name": "getMarketBettors",
    "outputs": [{"internalType": "address[]", "name": "", "type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_marketId", "type": "uint256"}],
    "name": "getMarketInfo",
    "outputs": [
      {
        "components": [
          {"internalType": "string", "name": "question", "type": "string"},
          {"internalType": "uint256", "name": "targetPrice", "type": "uint256"},
          {"internalType": "uint256", "name": "deadline", "type": "uint256"},
          {"internalType": "contract AggregatorV3Interface", "name": "priceOracle", "type": "address"},
          {"internalType": "bool", "name": "resolved", "type": "bool"},
          {"internalType": "bool", "name": "outcome", "type": "bool"},
          {"internalType": "uint256", "name": "totalYesBets", "type": "uint256"},
          {"internalType": "uint256", "name": "totalNoBets", "type": "uint256"},
          {"internalType": "uint256", "name": "totalBettors", "type": "uint256"},
          {"internalType": "address", "name": "tokenAddress", "type": "address"}
        ],
        "internalType": "struct ChainBetPredictionMarket.Market",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_marketId", "type": "uint256"},
      {"internalType": "address", "name": "_user", "type": "address"}
    ],
    "name": "getUserBet",
    "outputs": [
      {
        "components": [
          {"internalType": "address", "name": "bettor", "type": "address"},
          {"internalType": "uint256", "name": "amount", "type": "uint256"},
          {"internalType": "bool", "name": "prediction", "type": "bool"},
          {"internalType": "bool", "name": "claimed", "type": "bool"}
        ],
        "internalType": "struct ChainBetPredictionMarket.Bet",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"},
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "name": "marketBettors",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "marketCounter",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "markets",
    "outputs": [
      {"internalType": "string", "name": "question", "type": "string"},
      {"internalType": "uint256", "name": "targetPrice", "type": "uint256"},
      {"internalType": "uint256", "name": "deadline", "type": "uint256"},
      {"internalType": "contract AggregatorV3Interface", "name": "priceOracle", "type": "address"},
      {"internalType": "bool", "name": "resolved", "type": "bool"},
      {"internalType": "bool", "name": "outcome", "type": "bool"},
      {"internalType": "uint256", "name": "totalYesBets", "type": "uint256"},
      {"internalType": "uint256", "name": "totalNoBets", "type": "uint256"},
      {"internalType": "uint256", "name": "totalBettors", "type": "uint256"},
      {"internalType": "address", "name": "tokenAddress", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_marketId", "type": "uint256"},
      {"internalType": "bool", "name": "_prediction", "type": "bool"},
      {"internalType": "uint256", "name": "_amount", "type": "uint256"}
    ],
    "name": "placeBet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_marketId", "type": "uint256"}],
    "name": "resolveMarket",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "newOwner", "type": "address"}],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_marketId", "type": "uint256"}],
    "name": "withdrawPlatformFees",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const BRIDGE_ABI = [
  // Add your bridge contract ABI here
];

export const ERC20_ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{"name": "", "type": "string"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {"name": "_to", "type": "address"},
      {"name": "_value", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {"name": "_spender", "type": "address"},
      {"name": "_value", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {"name": "_owner", "type": "address"},
      {"name": "_spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
]; 