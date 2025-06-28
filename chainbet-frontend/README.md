# ChainBet Frontend

A React-based frontend for the ChainBet prediction market DApp.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MetaMask or any Web3 wallet
- Sepolia testnet ETH

### Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
   - Get a **WalletConnect Project ID** from [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Get an **Infura API key** from [Infura](https://infura.io/)
   - Update `src/App.jsx` with your keys:
     ```javascript
     projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
     [sepolia.id]: http('https://sepolia.infura.io/v3/YOUR_INFURA_API_KEY'),
     ```

3. **Start the development server:**
```bash
npm run dev
```

4. **Open your browser:**
   - Navigate to `http://localhost:5173`
   - Connect your wallet (MetaMask recommended)
   - Switch to Sepolia testnet

## 📋 Features

- **Connect Wallet**: Seamless wallet connection with RainbowKit
- **View Markets**: Browse active prediction markets
- **Place Bets**: Bet on market outcomes with USDC/USDT
- **Create Markets**: Create new prediction markets (owner only)
- **Claim Rewards**: Claim winnings from resolved markets

## 🔗 Contract Addresses

**Sepolia Testnet:**
- **ChainBetPredictionMarket**: `0x95b7287e4cf548aaf8f67788fd48ba9356dfb0e9`
- **ChainBetBridge**: `0xc58139b618db9f761732090c3ba958a12972a891`
- **USDC**: `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`
- **USDT**: `0x7169D38820dfd117C3FA1f22a697dBA58d90BA06`

## 🛠️ Tech Stack

- **React** - UI framework
- **Vite** - Build tool
- **Wagmi** - React hooks for Ethereum
- **RainbowKit** - Wallet connection
- **Tailwind CSS** - Styling
- **React Hot Toast** - Notifications

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.jsx   # Main dashboard
│   ├── MarketList.jsx  # Market listing
│   ├── MarketCard.jsx  # Individual market card
│   ├── BetModal.jsx    # Betting modal
│   └── ...
├── hooks/              # Custom hooks
│   └── useContract.js  # Contract interaction hooks
├── contracts/          # Contract configuration
│   └── config.js       # Addresses and ABIs
└── App.jsx            # Main app component
```

## 🔧 Configuration

### Adding New Networks
Update `src/App.jsx` to add new networks:
```javascript
import { sepolia, polygonMumbai, mainnet } from 'wagmi/chains';

const config = getDefaultConfig({
  chains: [sepolia, polygonMumbai, mainnet],
  // ...
});
```

### Updating Contract Addresses
Update `src/contracts/config.js` with new contract addresses:
```javascript
export const CONTRACT_CONFIG = {
  CHAINBET_PREDICTION_MARKET: "NEW_ADDRESS",
  CHAINBET_BRIDGE: "NEW_ADDRESS",
  // ...
};
```

## 🧪 Testing

1. **Get Sepolia testnet ETH** from a faucet
2. **Get test USDC/USDT** tokens
3. **Create a test market** (if you're the contract owner)
4. **Place test bets** on markets
5. **Test market resolution** and reward claiming

## 🚨 Troubleshooting

### Common Issues

1. **"Failed to fetch markets"**
   - Check if you're connected to Sepolia network
   - Verify contract addresses are correct
   - Ensure you have internet connection

2. **"Please connect your wallet first"**
   - Install MetaMask or another Web3 wallet
   - Connect your wallet to the site
   - Switch to Sepolia testnet

3. **Transaction fails**
   - Ensure you have enough Sepolia ETH for gas
   - Check if you have enough tokens to bet
   - Verify market is still active (not expired)

### Getting Help

- Check the browser console for error messages
- Verify your wallet is connected to Sepolia testnet
- Ensure you have sufficient testnet tokens

## 📄 License

MIT License
