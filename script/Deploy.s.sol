// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/ChainBetPredictionMarket.sol";
import "../src/ChainBetBridge.sol";

contract Deploy is Script {
    function run() external {
        // Load deployer private key from environment variable
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Addresses for USDC and USDT on Sepolia testnet
        address usdcAddress = 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238; // Sepolia USDC
        address usdtAddress = 0x7169D38820dfd117C3FA1f22a697dBA58d90BA06; // Sepolia USDT

        // Deploy ChainBetPredictionMarket
        ChainBetPredictionMarket predictionMarket = new ChainBetPredictionMarket(usdcAddress, usdtAddress);

        // Deploy ChainBetBridge
        ChainBetBridge bridge = new ChainBetBridge(usdcAddress, usdtAddress);

        // Log deployed addresses
        console.log("ChainBetPredictionMarket deployed at:", address(predictionMarket));
        console.log("ChainBetBridge deployed at:", address(bridge));

        vm.stopBroadcast();
    }
}