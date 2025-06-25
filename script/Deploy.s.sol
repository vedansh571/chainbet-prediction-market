// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {ChainBetPredictionMarket} from "../src/ChainBetPredictionMarket.sol";
import {ChainBetBridge} from "../src/ChainBetBridge.sol";

contract DeployScript is Script {
    // Contract addresses for different networks
    mapping(uint256 => address) public usdcAddresses;
    mapping(uint256 => address) public usdtAddresses;

    function setUp() public {
        // Sepolia testnet
        usdcAddresses[11155111] = 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238;
        usdtAddresses[11155111] = 0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0;
        
        // Mumbai testnet
        usdcAddresses[80001] = 0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747;
        usdtAddresses[80001] = 0xA02f6adc7926efeBBd59Fd43A84f4E0c0c91e832;
    }

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        uint256 chainId = block.chainid;
        
        console.log("Deploying ChainBet contracts...");
        console.log("Deployer:", deployer);
        console.log("Chain ID:", chainId);
        
        address usdcAddress = usdcAddresses[chainId];
        address usdtAddress = usdtAddresses[chainId];
        
        if (usdcAddress == address(0) || usdtAddress == address(0)) {
            revert("USDC/USDT addresses not configured for this chain");
        }
        
        console.log("USDC Address:", usdcAddress);
        console.log("USDT Address:", usdtAddress);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy ChainBetPredictionMarket
        console.log("Deploying ChainBetPredictionMarket...");
        ChainBetPredictionMarket predictionMarket = new ChainBetPredictionMarket(
            usdcAddress,
            usdtAddress
        );
        console.log("ChainBetPredictionMarket deployed to:", address(predictionMarket));
        
        // Deploy ChainBetBridge
        console.log("Deploying ChainBetBridge...");
        ChainBetBridge bridge = new ChainBetBridge(
            usdcAddress,
            usdtAddress
        );
        console.log("ChainBetBridge deployed to:", address(bridge));
        
        vm.stopBroadcast();
        
        // Save deployment info
        string memory deploymentInfo = string.concat(
            '{\n',
            '  "network": "', vm.toString(chainId), '",\n',
            '  "chainId": ', vm.toString(chainId), ',\n',
            '  "deployer": "', vm.toString(deployer), '",\n',
            '  "contracts": {\n',
            '    "ChainBetPredictionMarket": "', vm.toString(address(predictionMarket)), '",\n',
            '    "ChainBetBridge": "', vm.toString(address(bridge)), '"\n',
            '  },\n',
            '  "tokens": {\n',
            '    "USDC": "', vm.toString(usdcAddress), '",\n',
            '    "USDT": "', vm.toString(usdtAddress), '"\n',
            '  },\n',
            '  "timestamp": "', vm.toString(block.timestamp), '"\n',
            '}'
        );
        
        string memory filename = string.concat("deployments/", vm.toString(chainId), ".json");
        vm.writeFile(filename, deploymentInfo);
        console.log("Deployment info saved to:", filename);
        
        console.log("\n=== Deployment Summary ===");
        console.log("ChainBetPredictionMarket:", address(predictionMarket));
        console.log("ChainBetBridge:", address(bridge));
        console.log("USDC:", usdcAddress);
        console.log("USDT:", usdtAddress);
        
        console.log("\n=== Next Steps ===");
        console.log("1. Update the contract addresses in chainbet-frontend/src/contracts/config.js");
        console.log("2. Test the contracts with sample markets");
        console.log("3. Deploy to mainnet when ready");
    }
} 