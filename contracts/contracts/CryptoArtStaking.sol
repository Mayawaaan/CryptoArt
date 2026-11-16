// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CryptoArtStaking
 * @notice Unaudited prototype staking vault for local Hardhat and EVM testnet evaluation.
 *         Separates principal deposits from a funded rewardReserve so rewards never touch user principal.
 */
contract CryptoArtStaking is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint256 public constant YEAR_SECONDS = 365 days;
    uint256 public constant BPS_DENOMINATOR = 10_000;

    struct Pool {
        string name;
        uint256 aprBps;
        uint256 lockSeconds;
        uint256 totalStaked;
        bool active;
    }

    struct UserPosition {
        uint256 amount;
        uint256 rewardDebt;
        uint256 lastUpdate;
        uint256 unlockAt;
    }

    IERC20 public immutable stakingToken;
    uint256 public rewardReserve;
    Pool[] public pools;

    mapping(uint256 => mapping(address => UserPosition)) public positions;

    error ZeroAmount();
    error InvalidPool(uint256 poolId);
    error PoolInactive(uint256 poolId);
    error InsufficientStake(uint256 available, uint256 requested);
    error StakeLocked(uint256 unlockAt, uint256 currentTimestamp);
    error InsufficientRewardReserve(uint256 available, uint256 requested);

    event PoolCreated(uint256 indexed poolId, string name, uint256 aprBps, uint256 lockSeconds);
    event RewardReserveFunded(address indexed funder, uint256 amount);
    event Staked(uint256 indexed poolId, address indexed user, uint256 amount, uint256 unlockAt);
    event Unstaked(uint256 indexed poolId, address indexed user, uint256 amount);
    event RewardsClaimed(uint256 indexed poolId, address indexed user, uint256 rewardAmount);

    constructor(address tokenAddress, address initialOwner) Ownable(initialOwner) {
        stakingToken = IERC20(tokenAddress);
    }

    function poolCount() external view returns (uint256) {
        return pools.length;
    }

    function createPool(
        string calldata name,
        uint256 aprBps,
        uint256 lockSeconds
    ) external onlyOwner returns (uint256 poolId) {
        poolId = pools.length;
        pools.push(
            Pool({
                name: name,
                aprBps: aprBps,
                lockSeconds: lockSeconds,
                totalStaked: 0,
                active: true
            })
        );
        emit PoolCreated(poolId, name, aprBps, lockSeconds);
    }

    function fundRewardReserve(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        rewardReserve += amount;
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        emit RewardReserveFunded(msg.sender, amount);
    }

    function pendingRewards(uint256 poolId, address user) public view returns (uint256) {
        if (poolId >= pools.length) revert InvalidPool(poolId);
        UserPosition storage pos = positions[poolId][user];
        if (pos.amount == 0 || pos.lastUpdate == 0) {
            return pos.rewardDebt;
        }
        uint256 elapsed = block.timestamp - pos.lastUpdate;
        uint256 accrued = (pos.amount * pools[poolId].aprBps * elapsed) /
            (BPS_DENOMINATOR * YEAR_SECONDS);
        return pos.rewardDebt + accrued;
    }

    function stake(uint256 poolId, uint256 amount) external nonReentrant {
        if (poolId >= pools.length) revert InvalidPool(poolId);
        if (!pools[poolId].active) revert PoolInactive(poolId);
        if (amount == 0) revert ZeroAmount();

        _accrue(poolId, msg.sender);

        UserPosition storage pos = positions[poolId][msg.sender];
        pos.amount += amount;
        pos.unlockAt = block.timestamp + pools[poolId].lockSeconds;
        pools[poolId].totalStaked += amount;

        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        emit Staked(poolId, msg.sender, amount, pos.unlockAt);
    }

    function unstake(uint256 poolId, uint256 amount) external nonReentrant {
        if (poolId >= pools.length) revert InvalidPool(poolId);
        if (amount == 0) revert ZeroAmount();

        UserPosition storage pos = positions[poolId][msg.sender];
        if (pos.amount < amount) revert InsufficientStake(pos.amount, amount);
        if (block.timestamp < pos.unlockAt) {
            revert StakeLocked(pos.unlockAt, block.timestamp);
        }

        _accrue(poolId, msg.sender);

        pos.amount -= amount;
        pools[poolId].totalStaked -= amount;

        stakingToken.safeTransfer(msg.sender, amount);
        emit Unstaked(poolId, msg.sender, amount);
    }

    function claimRewards(uint256 poolId) external nonReentrant {
        if (poolId >= pools.length) revert InvalidPool(poolId);

        _accrue(poolId, msg.sender);
        UserPosition storage pos = positions[poolId][msg.sender];
        uint256 reward = pos.rewardDebt;
        if (reward == 0) revert ZeroAmount();
        if (reward > rewardReserve) revert InsufficientRewardReserve(rewardReserve, reward);

        pos.rewardDebt = 0;
        rewardReserve -= reward;
        stakingToken.safeTransfer(msg.sender, reward);
        emit RewardsClaimed(poolId, msg.sender, reward);
    }

    function _accrue(uint256 poolId, address user) internal {
        UserPosition storage pos = positions[poolId][user];
        if (pos.amount > 0 && pos.lastUpdate > 0) {
            uint256 elapsed = block.timestamp - pos.lastUpdate;
            uint256 accrued = (pos.amount * pools[poolId].aprBps * elapsed) /
                (BPS_DENOMINATOR * YEAR_SECONDS);
            pos.rewardDebt += accrued;
        }
        pos.lastUpdate = block.timestamp;
    }
}
