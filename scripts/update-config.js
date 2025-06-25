const fs = require('fs');
const path = require('path');

// Function to update the frontend config with deployed contract addresses
function updateFrontendConfig(deploymentFile) {
  try {
    // Read deployment info
    const deploymentPath = path.join(__dirname, '..', 'deployments', deploymentFile);
    const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
    
    // Read current frontend config
    const configPath = path.join(__dirname, '..', 'chainbet-frontend', 'src', 'contracts', 'config.js');
    let configContent = fs.readFileSync(configPath, 'utf8');
    
    // Extract network name and chain ID
    const networkName = deploymentInfo.network;
    const chainId = deploymentInfo.chainId;
    const contractAddress = deploymentInfo.contracts.ChainBetPredictionMarket;
    
    console.log(`Updating config for ${networkName} (Chain ID: ${chainId})`);
    console.log(`Contract Address: ${contractAddress}`);
    
    // Update the contract address in the config
    const addressRegex = new RegExp(
      `(CHAINBET_PREDICTION_MARKET:\\s*')([^']*)('\\s*,\\s*//\\s*${networkName})`,
      'g'
    );
    
    if (addressRegex.test(configContent)) {
      configContent = configContent.replace(
        addressRegex,
        `$1${contractAddress}$3`
      );
      console.log(`✅ Updated contract address for ${networkName}`);
    } else {
      console.log(`⚠️  Could not find existing entry for ${networkName}, adding new entry...`);
      
      // Add new entry if it doesn't exist
      const insertRegex = /(export const CONTRACT_ADDRESSES = {)/;
      const newEntry = `$1\n  // ${networkName} testnet\n  ${chainId}: {\n    CHAINBET_PREDICTION_MARKET: '${contractAddress}',\n    USDC: '${deploymentInfo.tokens.USDC}',\n    USDT: '${deploymentInfo.tokens.USDT}',\n  },`;
      
      configContent = configContent.replace(insertRegex, newEntry);
      console.log(`✅ Added new entry for ${networkName}`);
    }
    
    // Write updated config back to file
    fs.writeFileSync(configPath, configContent);
    console.log(`✅ Successfully updated ${configPath}`);
    
    // Create a backup of the original config
    const backupPath = configPath + '.backup';
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(configPath, backupPath);
      console.log(`✅ Created backup at ${backupPath}`);
    }
    
  } catch (error) {
    console.error('❌ Error updating frontend config:', error.message);
    process.exit(1);
  }
}

// Main execution
const deploymentFile = process.argv[2];

if (!deploymentFile) {
  console.log('Usage: node scripts/update-config.js <deployment-file>');
  console.log('Example: node scripts/update-config.js sepolia.json');
  console.log('\nAvailable deployment files:');
  
  const deploymentsDir = path.join(__dirname, '..', 'deployments');
  if (fs.existsSync(deploymentsDir)) {
    const files = fs.readdirSync(deploymentsDir).filter(f => f.endsWith('.json'));
    files.forEach(file => console.log(`  - ${file}`));
  } else {
    console.log('  No deployment files found. Run the deployment script first.');
  }
  
  process.exit(1);
}

updateFrontendConfig(deploymentFile); 