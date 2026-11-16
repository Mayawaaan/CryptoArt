const { expect } = require("chai")
const { ethers } = require("hardhat")
const { time } = require("@nomicfoundation/hardhat-toolbox/network-helpers")

describe("CryptoArt Unaudited Testnet Prototype Contracts", function () {
  async function deployFixture() {
    const [owner, alice, bob] = await ethers.getSigners()

    const Token = await ethers.getContractFactory("CryptoArtToken")
    const token = await Token.deploy(owner.address)

    const Staking = await ethers.getContractFactory("CryptoArtStaking")
    const staking = await Staking.deploy(await token.getAddress(), owner.address)

    const SwapPool = await ethers.getContractFactory("CryptoArtSwapPool")
    const swapPool = await SwapPool.deploy(await token.getAddress(), owner.address)

    const Marketplace = await ethers.getContractFactory("CryptoArtNFTMarketplace")
    const marketplace = await Marketplace.deploy(owner.address)

    return { owner, alice, bob, token, staking, swapPool, marketplace }
  }

  describe("CryptoArtToken", function () {
    it("allows faucet drips up to cap and enforces onlyOwner on mint", async function () {
      const { alice, token } = await deployFixture()

      await expect(token.connect(alice).faucet())
        .to.emit(token, "FaucetClaimed")
        .withArgs(alice.address, ethers.parseEther("1000"))

      expect(await token.balanceOf(alice.address)).to.equal(ethers.parseEther("1000"))

      await expect(
        token.connect(alice).mint(alice.address, ethers.parseEther("1"))
      ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount")

      for (let i = 0; i < 9; i++) {
        await token.connect(alice).faucet()
      }
      await expect(token.connect(alice).faucet()).to.be.revertedWithCustomError(
        token,
        "FaucetCapExceeded"
      )
    })
  })

  describe("CryptoArtStaking", function () {
    it("enforces pool validation, lock period, zero amounts, and keeps principal separated from rewards", async function () {
      const { alice, token, staking } = await deployFixture()

      await expect(
        staking.connect(alice).createPool("Unauthorized", 1000, 0)
      ).to.be.revertedWithCustomError(staking, "OwnableUnauthorizedAccount")

      await staking.createPool("Locked 30D", 1000, 30 * 24 * 3600) // 10% APR
      await token.approve(await staking.getAddress(), ethers.parseEther("50000"))
      await staking.fundRewardReserve(ethers.parseEther("50000"))

      await token.connect(alice).faucet()
      const stakeAmt = ethers.parseEther("1000")
      await token.connect(alice).approve(await staking.getAddress(), stakeAmt)

      await expect(staking.connect(alice).stake(99, stakeAmt)).to.be.revertedWithCustomError(
        staking,
        "InvalidPool"
      )
      await expect(staking.connect(alice).stake(0, 0)).to.be.revertedWithCustomError(
        staking,
        "ZeroAmount"
      )

      await expect(staking.connect(alice).stake(0, stakeAmt)).to.emit(staking, "Staked")

      // Cannot unstake before lock period expires
      await expect(
        staking.connect(alice).unstake(0, stakeAmt)
      ).to.be.revertedWithCustomError(staking, "StakeLocked")

      // Advance time by 365 days -> should earn ~100 CART (10% of 1000)
      await time.increase(365 * 24 * 3600)

      const pending = await staking.pendingRewards(0, alice.address)
      expect(pending).to.be.closeTo(ethers.parseEther("100"), ethers.parseEther("0.01"))

      await expect(staking.connect(alice).claimRewards(0)).to.emit(staking, "RewardsClaimed")
      await expect(staking.connect(alice).unstake(0, stakeAmt)).to.emit(staking, "Unstaked")

      // Reward reserve invariant: reserve decreased by reward paid, staking contract holds 0 principal
      const poolInfo = await staking.pools(0)
      expect(poolInfo.totalStaked).to.equal(0n)
      expect(await token.balanceOf(await staking.getAddress())).to.equal(await staking.rewardReserve())
    })
  })

  describe("CryptoArtSwapPool", function () {
    it("swaps ETH <-> CART accurately with slippage and zero checks", async function () {
      const { alice, token, swapPool } = await deployFixture()

      const cartLiq = ethers.parseEther("10000")
      const ethLiq = ethers.parseEther("10")
      await token.approve(await swapPool.getAddress(), cartLiq)
      await swapPool.addLiquidity(cartLiq, { value: ethLiq })

      await expect(
        swapPool.connect(alice).swapEthForCart(0, { value: 0 })
      ).to.be.revertedWithCustomError(swapPool, "ZeroAmount")

      const ethIn = ethers.parseEther("1")
      const expectedCart = await swapPool.getAmountOut(ethIn, ethLiq, cartLiq)

      await expect(
        swapPool.connect(alice).swapEthForCart(expectedCart + 1n, { value: ethIn })
      ).to.be.revertedWithCustomError(swapPool, "InsufficientOutputAmount")

      await expect(
        swapPool.connect(alice).swapEthForCart(expectedCart, { value: ethIn })
      ).to.emit(swapPool, "SwapExecuted")

      const aliceCart = await token.balanceOf(alice.address)
      expect(aliceCart).to.equal(expectedCart)

      await token.connect(alice).approve(await swapPool.getAddress(), aliceCart)
      await expect(swapPool.connect(alice).swapCartForEth(aliceCart, 1n)).to.emit(
        swapPool,
        "SwapExecuted"
      )
    })
  })

  describe("CryptoArtNFTMarketplace", function () {
    it("supports auction mint, outbid pull-refunds, and settlement", async function () {
      const { owner, alice, bob, marketplace } = await deployFixture()

      const reserve = ethers.parseEther("0.1")
      await expect(
        marketplace.connect(owner).mintAndList("Genesis", "ipfs://test", reserve, 3600)
      ).to.emit(marketplace, "AuctionCreated")

      // Seller cannot bid
      await expect(
        marketplace.connect(owner).placeBid(1, { value: reserve })
      ).to.be.revertedWithCustomError(marketplace, "SellerCannotBid")

      // Below reserve reverts
      await expect(
        marketplace.connect(alice).placeBid(1, { value: ethers.parseEther("0.05") })
      ).to.be.revertedWithCustomError(marketplace, "BidTooLow")

      // Alice bids 0.1 ETH
      await expect(marketplace.connect(alice).placeBid(1, { value: reserve })).to.emit(
        marketplace,
        "BidPlaced"
      )

      // Bob outbids with 0.2 ETH
      const bobBid = ethers.parseEther("0.2")
      await marketplace.connect(bob).placeBid(1, { value: bobBid })

      expect(await marketplace.pendingReturns(alice.address)).to.equal(reserve)
      await expect(marketplace.connect(alice).withdrawOutbid())
        .to.emit(marketplace, "OutbidWithdrawn")
        .withArgs(alice.address, reserve)

      // Cannot settle before endTime
      await expect(marketplace.settleAuction(1)).to.be.revertedWithCustomError(
        marketplace,
        "AuctionNotEnded"
      )

      await time.increase(3601)
      await expect(marketplace.settleAuction(1))
        .to.emit(marketplace, "AuctionSettled")
        .withArgs(1, bob.address, bobBid)

      expect(await marketplace.ownerOf(1)).to.equal(bob.address)
    })
  })
})
