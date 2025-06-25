// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ChainBetPredictionMarket is Ownable, ReentrancyGuard {
    
    struct Market {
        string question;
        uint256 targetPrice;
        uint256 deadline;
        AggregatorV3Interface priceOracle;
        bool resolved;
        bool outcome;
        uint256 totalYesBets;
        uint256 totalNoBets;
        uint256 totalBettors;
        address tokenAddress;
    }
    
    struct Bet {
        address bettor;
        uint256 amount;
        bool prediction;
        bool claimed;
    }
    
    IERC20 public immutable USDC;
    IERC20 public immutable USDT;
    
    uint256 public marketCounter;
    uint256 public constant MINIMUM_BET = 1e6; // 1 USDC/USDT
    uint256 public constant PLATFORM_FEE = 300; // 3%
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(address => Bet)) public bets;
    mapping(uint256 => address[]) public marketBettors;
    
    event MarketCreated(
        uint256 indexed marketId,
        string question,
        uint256 targetPrice,
        uint256 deadline,
        address oracle,
        address token
    );
    
    event BetPlaced(
        uint256 indexed marketId,
        address indexed bettor,
        uint256 amount,
        bool prediction
    );
    
    event MarketResolved(
        uint256 indexed marketId,
        bool outcome,
        uint256 finalPrice
    );
    
    event RewardClaimed(
        uint256 indexed marketId,
        address indexed bettor,
        uint256 amount
    );
    
    constructor(address _usdc, address _usdt) {
        USDC = IERC20(_usdc);
        USDT = IERC20(_usdt);
    }
    
    function createMarket(
        string memory _question,
        uint256 _targetPrice,
        uint256 _duration,
        address _priceOracle,
        address _tokenAddress
    ) external onlyOwner {
        require(_duration > 0, "Invalid duration");
        require(_priceOracle != address(0), "Invalid oracle");
        require(_tokenAddress == address(USDC) || _tokenAddress == address(USDT), "Unsupported token");
        
        uint256 marketId = marketCounter++;
        uint256 deadline = block.timestamp + _duration;
        
        markets[marketId] = Market({
            question: _question,
            targetPrice: _targetPrice,
            deadline: deadline,
            priceOracle: AggregatorV3Interface(_priceOracle),
            resolved: false,
            outcome: false,
            totalYesBets: 0,
            totalNoBets: 0,
            totalBettors: 0,
            tokenAddress: _tokenAddress
        });
        
        emit MarketCreated(marketId, _question, _targetPrice, deadline, _priceOracle, _tokenAddress);
    }
    
    function placeBet(uint256 _marketId, bool _prediction, uint256 _amount) external nonReentrant {
        Market storage market = markets[_marketId];
        require(market.deadline > block.timestamp, "Market expired");
        require(!market.resolved, "Market already resolved");
        require(_amount >= MINIMUM_BET, "Amount below minimum");
        
        IERC20(market.tokenAddress).transferFrom(msg.sender, address(this), _amount);
        
        Bet storage existingBet = bets[_marketId][msg.sender];
        
        if (existingBet.amount == 0) {
            marketBettors[_marketId].push(msg.sender);
            market.totalBettors++;
        }
        
        existingBet.bettor = msg.sender;
        existingBet.amount += _amount;
        existingBet.prediction = _prediction;
        
        if (_prediction) {
            market.totalYesBets += _amount;
        } else {
            market.totalNoBets += _amount;
        }
        
        emit BetPlaced(_marketId, msg.sender, _amount, _prediction);
    }
    
    function resolveMarket(uint256 _marketId) external {
        Market storage market = markets[_marketId];
        require(!market.resolved, "Already resolved");
        require(block.timestamp >= market.deadline, "Market not expired");
        
        (, int256 price, , uint256 updatedAt, ) = market.priceOracle.latestRoundData();
        require(updatedAt > 0, "Invalid price data");
        require(block.timestamp - updatedAt <= 3600, "Price data too old");
        
        uint256 currentPrice = uint256(price);
        bool outcome = currentPrice >= market.targetPrice;
        
        market.resolved = true;
        market.outcome = outcome;
        
        emit MarketResolved(_marketId, outcome, currentPrice);
    }
    
    function claimReward(uint256 _marketId) external nonReentrant {
        Market storage market = markets[_marketId];
        Bet storage userBet = bets[_marketId][msg.sender];
        
        require(market.resolved, "Market not resolved");
        require(userBet.amount > 0, "No bet found");
        require(!userBet.claimed, "Already claimed");
        require(userBet.prediction == market.outcome, "Incorrect prediction");
        
        userBet.claimed = true;
        
        uint256 totalWinningPool = market.outcome ? market.totalYesBets : market.totalNoBets;
        uint256 totalLosingPool = market.outcome ? market.totalNoBets : market.totalYesBets;
        
        if (totalWinningPool == 0) {
            return;
        }
        
        uint256 platformFee = (totalLosingPool * PLATFORM_FEE) / FEE_DENOMINATOR;
        uint256 distributionPool = totalLosingPool - platformFee;
        
        uint256 userShare = (userBet.amount * distributionPool) / totalWinningPool;
        uint256 totalReward = userBet.amount + userShare;
        
        IERC20(market.tokenAddress).transfer(msg.sender, totalReward);
        
        emit RewardClaimed(_marketId, msg.sender, totalReward);
    }
    
    function withdrawPlatformFees(uint256 _marketId) external onlyOwner {
        Market storage market = markets[_marketId];
        require(market.resolved, "Market not resolved");
        
        uint256 totalLosingPool = market.outcome ? market.totalNoBets : market.totalYesBets;
        uint256 platformFee = (totalLosingPool * PLATFORM_FEE) / FEE_DENOMINATOR;
        
        if (platformFee > 0) {
            IERC20(market.tokenAddress).transfer(owner(), platformFee);
        }
    }
    
    function getMarketInfo(uint256 _marketId) external view returns (Market memory) {
        return markets[_marketId];
    }
    
    function getUserBet(uint256 _marketId, address _user) external view returns (Bet memory) {
        return bets[_marketId][_user];
    }
    
    function getMarketBettors(uint256 _marketId) external view returns (address[] memory) {
        return marketBettors[_marketId];
    }
}
