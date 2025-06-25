# ChainBet Frontend

A React-based frontend for the ChainBet decentralized prediction market platform, built with Vite, Wagmi, and RainbowKit.

## Features

- 🎯 **Create Prediction Markets**: Set up new markets with Chainlink price feeds
- 💰 **Place Bets**: Bet on market outcomes with USDC/USDT
- 📊 **Real-time Data**: View market statistics and betting pools
- 🔗 **Cross-chain Support**: Deploy on multiple networks (Sepolia, Mumbai)
- 🎨 **Modern UI**: Beautiful, responsive interface with Tailwind CSS
- 🔐 **Wallet Integration**: Seamless wallet connection with RainbowKit

## Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask or other Web3 wallet
- Testnet ETH for gas fees

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chainbet-prediction-market/chainbet-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the frontend directory:
   ```env
   VITE_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
   VITE_INFURA_PROJECT_ID=your_infura_project_id
   ```

4. **Update contract addresses**
   After deploying your smart contracts, update the addresses in `src/contracts/config.js`:
   ```javascript
   export const CONTRACT_ADDRESSES = {
     11155111: { // Sepolia
       CHAINBET_PREDICTION_MARKET: 'your_deployed_contract_address',
       USDC: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
       USDT: '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0',
     },
     80001: { // Mumbai
       CHAINBET_PREDICTION_MARKET: 'your_deployed_contract_address',
       USDC: '0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747',
       USDT: '0xA02f6adc7926efeBBd59Fd43A84f4E0c0c91e832',
     }
   };
   ```

## Development

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   Navigate to `http://localhost:5173`

3. **Connect your wallet**
   - Click "Connect Wallet" in the top right
   - Select your preferred wallet (MetaMask, WalletConnect, etc.)
   - Switch to a supported network (Sepolia or Mumbai)

## Usage

### Creating Markets

1. Navigate to the "Create Market" tab
2. Fill in the market details:
   - **Question**: Clear, specific prediction criteria
   - **Oracle**: Select the Chainlink price feed
   - **Target Price**: The price threshold for the prediction
   - **Duration**: How long the market stays open
   - **Token**: USDC or USDT for betting
3. Click "Create Market" and confirm the transaction

### Placing Bets

1. Browse available markets in the "Markets" tab
2. Click "Place Bet" on your chosen market
3. Select your prediction (YES/NO)
4. Enter your bet amount (minimum 1 USDC)
5. Review the odds and potential winnings
6. Click "Place Bet" and confirm the transaction

### Managing Your Bets

1. View your active bets in the "My Bets" tab
2. Track the status of your predictions
3. Claim rewards for winning bets once markets are resolved

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.jsx    # Main dashboard layout
│   ├── CreateMarket.jsx # Market creation form
│   ├── MarketList.jsx   # Market listing
│   ├── MarketCard.jsx   # Individual market display
│   ├── BetModal.jsx     # Bet placement modal
│   └── UserBets.jsx     # User bet management
├── hooks/               # Custom React hooks
│   └── useChainBet.js   # Contract interaction hook
├── contracts/           # Contract configuration
│   ├── config.js        # Network and contract addresses
│   └── abis/            # Contract ABIs
└── App.jsx              # Main application component
```

## Smart Contract Integration

The frontend integrates with two main smart contracts:

### ChainBetPredictionMarket
- **createMarket**: Create new prediction markets
- **placeBet**: Place bets on market outcomes
- **resolveMarket**: Resolve markets using Chainlink price feeds
- **claimReward**: Claim rewards for winning bets

### ChainBetBridge
- **initiateCrossChainBet**: Place bets across different networks
- **setDestinationContract**: Configure cross-chain destinations

## Supported Networks

- **Sepolia Testnet** (Chain ID: 11155111)
- **Polygon Mumbai Testnet** (Chain ID: 80001)

## Configuration

### WalletConnect Setup

1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a new project
3. Copy your Project ID
4. Add it to your `.env` file

### Infura Setup

1. Visit [Infura](https://infura.io/)
2. Create a new project
3. Copy your Project ID
4. Add it to your `.env` file

## Building for Production

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Preview the build**
   ```bash
   npm run preview
   ```

3. **Deploy to your hosting platform**
   The built files will be in the `dist/` directory

## Troubleshooting

### Common Issues

1. **"Please connect to a supported network"**
   - Switch to Sepolia or Mumbai testnet in your wallet
   - Ensure you have testnet ETH for gas fees

2. **"Contract not found"**
   - Verify contract addresses in `src/contracts/config.js`
   - Ensure contracts are deployed to the correct network

3. **"Transaction failed"**
   - Check your wallet has sufficient ETH for gas
   - Verify you have approved token spending
   - Ensure the market is still active

4. **"Price feed not available"**
   - Verify the oracle address is correct for your network
   - Check if the price feed is active on Chainlink

### Getting Testnet Tokens

- **Sepolia ETH**: [Sepolia Faucet](https://sepoliafaucet.com/)
- **Mumbai MATIC**: [Mumbai Faucet](https://faucet.polygon.technology/)
- **Testnet USDC/USDT**: Use faucets or swap ETH for tokens

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue on GitHub
- Join our Discord community
- Check the documentation

## Security

- Never share your private keys
- Always verify contract addresses
- Use hardware wallets for large amounts
- Test thoroughly on testnets before mainnet
