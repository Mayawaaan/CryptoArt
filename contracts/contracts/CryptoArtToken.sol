// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CryptoArtToken
 * @notice Unaudited prototype ERC-20 token strictly for local Hardhat and EVM testnet demos.
 */
contract CryptoArtToken is ERC20, Ownable {
    uint256 public constant FAUCET_DRIP = 1_000 ether;
    uint256 public constant MAX_FAUCET_PER_ADDRESS = 10_000 ether;

    mapping(address => uint256) public faucetClaimed;

    error FaucetCapExceeded(uint256 claimed, uint256 cap);
    error ZeroAddress();

    event FaucetClaimed(address indexed recipient, uint256 amount);

    constructor(address initialOwner)
        ERC20("CryptoArt Test Token", "CART")
        Ownable(initialOwner)
    {
        if (initialOwner == address(0)) revert ZeroAddress();
        _mint(initialOwner, 1_000_000 ether);
    }

    function faucet() external {
        uint256 claimed = faucetClaimed[msg.sender];
        if (claimed + FAUCET_DRIP > MAX_FAUCET_PER_ADDRESS) {
            revert FaucetCapExceeded(claimed, MAX_FAUCET_PER_ADDRESS);
        }
        faucetClaimed[msg.sender] = claimed + FAUCET_DRIP;
        _mint(msg.sender, FAUCET_DRIP);
        emit FaucetClaimed(msg.sender, FAUCET_DRIP);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        if (to == address(0)) revert ZeroAddress();
        _mint(to, amount);
    }
}
