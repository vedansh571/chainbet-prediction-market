// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ChainBetBridge is Ownable, ReentrancyGuard {
    
    IERC20 public immutable USDC;
    IERC20 public immutable USDT;
    
    uint256 public constant MINIMUM_BET = 1e6; // 1 USDC/USDT
    
    mapping(uint64 => address) public destinationContracts;
    mapping(uint64 => bool) public allowlistedChains;
    
    event CrossChainBetInitiated(
        uint256 indexed marketId,
        address indexed bettor,
        uint64 destinationChain,
        uint256 amount,
        bool prediction
    );
    
    constructor(address _usdc, address _usdt) {
        USDC = IERC20(_usdc);
        USDT = IERC20(_usdt);
    }
    
    function initiateCrossChainBet(
        uint256 _marketId,
        bool _prediction,
        uint256 _amount,
        address _token,
        uint64 _destinationChainSelector
    ) external payable nonReentrant {
        require(allowlistedChains[_destinationChainSelector], "Chain not supported");
        require(_token == address(USDC) || _token == address(USDT), "Unsupported token");
        require(_amount >= MINIMUM_BET, "Minimum bet amount required");
        require(destinationContracts[_destinationChainSelector] != address(0), "Destination not set");
        
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        
        emit CrossChainBetInitiated(_marketId, msg.sender, _destinationChainSelector, _amount, _prediction);
    }
    
    function setDestinationContract(uint64 _chainSelector, address _contract) external onlyOwner {
        require(_contract != address(0), "Invalid contract address");
        destinationContracts[_chainSelector] = _contract;
        allowlistedChains[_chainSelector] = true;
    }
    
    function removeDestinationChain(uint64 _chainSelector) external onlyOwner {
        delete destinationContracts[_chainSelector];
        allowlistedChains[_chainSelector] = false;
    }
    
    function emergencyWithdraw(address _token, uint256 _amount) external onlyOwner {
        IERC20(_token).transfer(owner(), _amount);
    }
    
    receive() external payable {}
}
