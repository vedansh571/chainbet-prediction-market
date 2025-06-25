// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";

contract UpdateConfigScript is Script {
    function run() public view {
        uint256 chainId = block.chainid;
        
        // Read deployment info
        string memory deploymentFile = string.concat("deployments/", vm.toString(chainId), ".json");
        string memory deploymentInfo = vm.readFile(deploymentFile);
        
        console.log("Deployment info for chain", chainId, ":");
        console.log(deploymentInfo);
        
        // Parse the deployment info to extract contract address
        // This is a simplified version - in practice you might want to use a JSON parser
        console.log("\nTo update your frontend config:");
        console.log("1. Copy the ChainBetPredictionMarket address from above");
        console.log("2. Update chainbet-frontend/src/contracts/config.js");
        console.log("3. Replace the placeholder address with the deployed address");
        
        console.log("\nOr run: node scripts/update-config.js", vm.toString(chainId), ".json");
    }
} 