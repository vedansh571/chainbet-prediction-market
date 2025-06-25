# ChainBet Prediction Market

A decentralized prediction market platform built with Solidity smart contracts and React frontend, powered by Chainlink price feeds.

## Features

- 🎯 **Prediction Markets**: Create and bet on cryptocurrency price predictions
- 🔗 **Chainlink Integration**: Automated market resolution using price feeds
- 💰 **USDC/USDT Support**: Bet with stablecoins
- 🌉 **Cross-chain Bridge**: Place bets across different networks
- 🎨 **Modern Frontend**: Beautiful React interface with RainbowKit
- 🔐 **Secure Smart Contracts**: Built with OpenZeppelin and Foundry

## Smart Contracts

### ChainBetPredictionMarket
- Create prediction markets with Chainlink oracles
- Place bets with USDC/USDT
- Automated market resolution
- Reward distribution system

### ChainBetBridge
- Cross-chain bet placement
- Multi-network support
- Bridge fee management

## Prerequisites

- [Foundry](https://getfoundry.sh/) (latest version)
- Node.js 18+
- MetaMask or other Web3 wallet
- Testnet ETH for gas fees

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chainbet-prediction-market
   ```

2. **Install Foundry dependencies**
   ```bash
   forge install
   ```

3. **Install frontend dependencies**
   ```bash
   cd chainbet-frontend
   npm install
   ```

4. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   PRIVATE_KEY=your_private_key_here
   SEPOLIA_RPC_URL=your_sepolia_rpc_url
   MUMBAI_RPC_URL=your_mumbai_rpc_url
   ETHERSCAN_API_KEY=your_etherscan_api_key
   POLYGONSCAN_API_KEY=your_polygonscan_api_key
   ```

## Smart Contract Development

### Compile Contracts
```bash
forge build
```

### Run Tests
```bash
forge test
```

### Deploy Contracts

**To Sepolia:**
```bash
forge script script/Deploy.s.sol --rpc-url sepolia --broadcast --verify
```

**To Mumbai:**
```bash
forge script script/Deploy.s.sol --rpc-url mumbai --broadcast --verify
```

### Update Frontend Configuration
After deployment, update the frontend with the new contract addresses:
```bash
node scripts/update-config.js <chain-id>.json
```

## Frontend Development

1. **Navigate to frontend directory**
   ```bash
   cd chainbet-frontend
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open browser**
   Navigate to `http://localhost:5173`

## Usage

### Creating Markets
1. Connect your wallet to a supported network
2. Navigate to "Create Market" tab
3. Fill in market details (question, target price, duration)
4. Select Chainlink oracle and betting token
5. Confirm transaction

### Placing Bets
1. Browse available markets
2. Click "Place Bet" on your chosen market
3. Select prediction (YES/NO) and amount
4. Review odds and confirm transaction

### Managing Bets
1. View your bets in "My Bets" tab
2. Track market status and outcomes
3. Claim rewards for winning predictions

## Project Structure

```
├── src/                    # Smart contracts
│   ├── ChainBetPredictionMarket.sol
│   └── ChainBetBridge.sol
├── script/                 # Foundry deployment scripts
│   ├── Deploy.s.sol
│   └── UpdateConfig.s.sol
├── test/                   # Contract tests
├── chainbet-frontend/      # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   └── contracts/      # Contract configs
│   └── package.json
├── foundry.toml           # Foundry configuration
└── README.md
```

## Supported Networks

- **Sepolia Testnet** (Chain ID: 11155111)
- **Polygon Mumbai Testnet** (Chain ID: 80001)

## Testing

### Smart Contract Tests
```bash
forge test
```

### Frontend Tests
```bash
cd chainbet-frontend
npm test
```

## Deployment

### Local Development
```bash
# Start local node
anvil

# Deploy to local network
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast
```

### Testnet Deployment
```bash
# Deploy to Sepolia
forge script script/Deploy.s.sol --rpc-url sepolia --broadcast --verify

# Deploy to Mumbai
forge script script/Deploy.s.sol --rpc-url mumbai --broadcast --verify
```

### Mainnet Deployment
```bash
# Deploy to Ethereum mainnet
forge script script/Deploy.s.sol --rpc-url mainnet --broadcast --verify
```

## Security

- All contracts are built with OpenZeppelin libraries
- Comprehensive test coverage
- Security best practices implemented
- Reentrancy protection
- Access control mechanisms

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions and support:
- Create an issue on GitHub
- Check the documentation
- Join our community
