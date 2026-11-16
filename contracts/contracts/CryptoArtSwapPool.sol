// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CryptoArtSwapPool
 * @notice Minimal unaudited constant-product ETH/CART prototype pool for local and testnet swaps.
 */
contract CryptoArtSwapPool is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint256 public constant FEE_BPS = 30; // 0.30%
    uint256 public constant BPS_DENOMINATOR = 10_000;

    IERC20 public immutable token;
    uint256 public ethReserve;
    uint256 public tokenReserve;

    error ZeroAmount();
    error InsufficientLiquidity();
    error InsufficientOutputAmount(uint256 amountOut, uint256 minAmountOut);
    error EthTransferFailed();

    event LiquidityAdded(address indexed provider, uint256 ethAmount, uint256 tokenAmount);
    event SwapExecuted(
        address indexed trader,
        bool ethToToken,
        uint256 amountIn,
        uint256 amountOut
    );

    constructor(address tokenAddress, address initialOwner) Ownable(initialOwner) {
        token = IERC20(tokenAddress);
    }

    function addLiquidity(uint256 tokenAmount) external payable onlyOwner nonReentrant {
        if (msg.value == 0 || tokenAmount == 0) revert ZeroAmount();
        ethReserve += msg.value;
        tokenReserve += tokenAmount;
        token.safeTransferFrom(msg.sender, address(this), tokenAmount);
        emit LiquidityAdded(msg.sender, msg.value, tokenAmount);
    }

    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) public pure returns (uint256) {
        if (amountIn == 0) revert ZeroAmount();
        if (reserveIn == 0 || reserveOut == 0) revert InsufficientLiquidity();

        uint256 amountInWithFee = amountIn * (BPS_DENOMINATOR - FEE_BPS);
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = (reserveIn * BPS_DENOMINATOR) + amountInWithFee;
        return numerator / denominator;
    }

    function swapEthForCart(uint256 minCartOut) external payable nonReentrant returns (uint256 cartOut) {
        if (msg.value == 0) revert ZeroAmount();
        cartOut = getAmountOut(msg.value, ethReserve, tokenReserve);
        if (cartOut < minCartOut) revert InsufficientOutputAmount(cartOut, minCartOut);

        ethReserve += msg.value;
        tokenReserve -= cartOut;
        token.safeTransfer(msg.sender, cartOut);
        emit SwapExecuted(msg.sender, true, msg.value, cartOut);
    }

    function swapCartForEth(uint256 cartIn, uint256 minEthOut) external nonReentrant returns (uint256 ethOut) {
        if (cartIn == 0) revert ZeroAmount();
        ethOut = getAmountOut(cartIn, tokenReserve, ethReserve);
        if (ethOut < minEthOut) revert InsufficientOutputAmount(ethOut, minEthOut);

        tokenReserve += cartIn;
        ethReserve -= ethOut;

        token.safeTransferFrom(msg.sender, address(this), cartIn);
        (bool ok, ) = payable(msg.sender).call{value: ethOut}("");
        if (!ok) revert EthTransferFailed();

        emit SwapExecuted(msg.sender, false, cartIn, ethOut);
    }
}
