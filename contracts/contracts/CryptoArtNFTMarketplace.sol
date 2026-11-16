// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC721Holder} from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CryptoArtNFTMarketplace
 * @notice Minimal unaudited ERC-721 auction prototype using pull-over-push outbid refunds.
 */
contract CryptoArtNFTMarketplace is ERC721URIStorage, ERC721Holder, Ownable, ReentrancyGuard {
    struct Auction {
        uint256 tokenId;
        address seller;
        uint256 reservePrice;
        uint256 highestBid;
        address highestBidder;
        uint256 endTime;
        bool settled;
        string title;
    }

    uint256 public nextTokenId = 1;
    mapping(uint256 => Auction) public auctions;
    mapping(address => uint256) public pendingReturns;

    error InvalidAuction(uint256 tokenId);
    error AuctionEnded(uint256 endTime);
    error AuctionNotEnded(uint256 endTime);
    error AlreadySettled(uint256 tokenId);
    error BidTooLow(uint256 requiredMinimum, uint256 sent);
    error SellerCannotBid();
    error NothingToWithdraw();
    error EthTransferFailed();

    event AuctionCreated(
        uint256 indexed tokenId,
        address indexed seller,
        string title,
        uint256 reservePrice,
        uint256 endTime
    );
    event BidPlaced(uint256 indexed tokenId, address indexed bidder, uint256 amount);
    event OutbidWithdrawn(address indexed bidder, uint256 amount);
    event AuctionSettled(uint256 indexed tokenId, address indexed winner, uint256 finalPrice);

    constructor(address initialOwner)
        ERC721("CryptoArt Collectible", "CAC")
        Ownable(initialOwner)
    {}

    function mintAndList(
        string calldata title,
        string calldata uri,
        uint256 reservePrice,
        uint256 durationSeconds
    ) external returns (uint256 tokenId) {
        tokenId = nextTokenId++;
        _safeMint(address(this), tokenId);
        _setTokenURI(tokenId, uri);

        uint256 endTime = block.timestamp + (durationSeconds == 0 ? 7 days : durationSeconds);
        auctions[tokenId] = Auction({
            tokenId: tokenId,
            seller: msg.sender,
            reservePrice: reservePrice,
            highestBid: 0,
            highestBidder: address(0),
            endTime: endTime,
            settled: false,
            title: title
        });

        emit AuctionCreated(tokenId, msg.sender, title, reservePrice, endTime);
    }

    function placeBid(uint256 tokenId) external payable nonReentrant {
        Auction storage auction = auctions[tokenId];
        if (auction.seller == address(0)) revert InvalidAuction(tokenId);
        if (auction.settled) revert AlreadySettled(tokenId);
        if (block.timestamp >= auction.endTime) revert AuctionEnded(auction.endTime);
        if (msg.sender == auction.seller) revert SellerCannotBid();

        uint256 minRequired = auction.highestBid == 0
            ? auction.reservePrice
            : auction.highestBid + 0.001 ether;
        if (msg.value < minRequired) revert BidTooLow(minRequired, msg.value);

        if (auction.highestBidder != address(0)) {
            pendingReturns[auction.highestBidder] += auction.highestBid;
        }

        auction.highestBidder = msg.sender;
        auction.highestBid = msg.value;
        emit BidPlaced(tokenId, msg.sender, msg.value);
    }

    function withdrawOutbid() external nonReentrant {
        uint256 amount = pendingReturns[msg.sender];
        if (amount == 0) revert NothingToWithdraw();

        pendingReturns[msg.sender] = 0;
        (bool ok, ) = payable(msg.sender).call{value: amount}("");
        if (!ok) revert EthTransferFailed();

        emit OutbidWithdrawn(msg.sender, amount);
    }

    function settleAuction(uint256 tokenId) external nonReentrant {
        Auction storage auction = auctions[tokenId];
        if (auction.seller == address(0)) revert InvalidAuction(tokenId);
        if (auction.settled) revert AlreadySettled(tokenId);
        if (block.timestamp < auction.endTime) revert AuctionNotEnded(auction.endTime);

        auction.settled = true;

        if (auction.highestBidder != address(0)) {
            _transfer(address(this), auction.highestBidder, tokenId);
            (bool ok, ) = payable(auction.seller).call{value: auction.highestBid}("");
            if (!ok) revert EthTransferFailed();
            emit AuctionSettled(tokenId, auction.highestBidder, auction.highestBid);
        } else {
            _transfer(address(this), auction.seller, tokenId);
            emit AuctionSettled(tokenId, auction.seller, 0);
        }
    }
}
