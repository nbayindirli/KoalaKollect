// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// import "hardhat/console.sol";

import "./KoalaKollectV1Admin.sol";
import "./KoalaKollectV1Events.sol";
import "./interfaces/IKoalaKollectV1.sol";

contract KoalaKollectV1 is
    KoalaKollectV1Admin,
    KoalaKollectV1Events,
    IKoalaKollectV1
{
    constructor() AdminControl(msg.sender) payable {}

    /**
     * Used to register a new creator.
     */
    function registerCreator() external override {
        require(!_creators[msg.sender].isRegistered, "Already registered as creator");
        require(!_koalas[msg.sender].isRegistered, "Already registered as koala");
        
        _creators[msg.sender] = Creator({
            isRegistered: true,
            createdAt: block.timestamp,
            poolIds: new uint256[](0)
        });
        
        isRegisteredCreator[msg.sender] = true;
        creators[msg.sender] = _creators[msg.sender];
        
        emit CreatorRegistered(msg.sender, block.timestamp);
    }

    /**
     * Creates a new pool.
     * @param targetTotalFundAmount The target amount to raise
     * @param fundAssetAddress The token address (use address(0) for native ETH)
     * @param fundAssetDecimals The decimals of the fund asset
     * @param targetDate The deadline timestamp for the pool
     * @param canOverfund Whether the pool can accept funds beyond the target
     */
    function createPool(
        uint256 targetTotalFundAmount,
        address fundAssetAddress,
        uint256 fundAssetDecimals,
        uint256 targetDate,
        bool canOverfund
    ) external override onlyRegisteredCreator() {
        if (targetTotalFundAmount == 0) revert("Target amount must be greater than 0");
        if (targetDate <= block.timestamp) revert("Target date must be in the future");

        uint256 poolId = nextPoolId++;
        Pool storage pool = pools[poolId];

        pool.id = poolId;
        pool.creator = msg.sender;
        pool.totalFundAmount = 0;
        pool.targetTotalFundAmount = targetTotalFundAmount;
        pool.fundAssetAddress = fundAssetAddress;
        pool.fundAssetDecimals = fundAssetDecimals;
        pool.targetDate = targetDate;
        pool.canOverfund = canOverfund;

        isActivePool[poolId] = true;
        creators[msg.sender].poolIds.push(poolId);

        emit CreatedPool(poolId);
    }

    /**
     * Prematurely closes a pool and refunds all koalas.
     */
    function closePoolBeforeExpiry(uint256 poolId) external override {
        Pool storage pool = pools[poolId];
        if (!isActivePool[poolId]) revert PoolNotActive(poolId);
        if (msg.sender != pool.creator && msg.sender != authority) revert("Not authorized");
        if (block.timestamp >= pool.targetDate) revert("Pool already expired");

        isActivePool[poolId] = false;

        emit ClosedPoolBeforeExpiry(poolId);
    }

    /**
     * Used to register a new koala (funder).
     */
    function registerKoala() external override {
        if (isRegisteredKoala[msg.sender]) revert("Already registered as koala");
        if (isRegisteredCreator[msg.sender]) revert("Already registered as creator");

        isRegisteredKoala[msg.sender] = true;
        koalas[msg.sender].poolIds = new uint256[](0);

        emit RegisteredKoala(msg.sender);
    }

    /**
     * Used by koalas (funders) to fund a pool.
     */
    function fundPool(
        uint256 poolId,
        uint256 fundAmount
    ) external override onlyRegisteredKoala() {
        Pool storage pool = pools[poolId];
        if (!isActivePool[poolId]) revert PoolNotActive(poolId);
        if (block.timestamp >= pool.targetDate) revert("Pool expired");
        if (fundAmount == 0) revert("Fund amount must be greater than 0");

        uint256 newTotalFundAmount = pool.totalFundAmount + fundAmount;

        // Check if this would exceed the target amount when overfunding is not allowed
        if (!pool.canOverfund && newTotalFundAmount > pool.targetTotalFundAmount) {
            revert("Cannot exceed target amount");
        }

        // Update pool state
        pool.totalFundAmount = newTotalFundAmount;
        pool.fundAmounts[msg.sender] += fundAmount;

        // Add pool to koala's list if it's their first time funding this pool
        if (pool.fundAmounts[msg.sender] == fundAmount) {
            koalas[msg.sender].poolIds.push(poolId);
        }

        // Emit appropriate event based on whether this caused an overfund
        if (newTotalFundAmount > pool.targetTotalFundAmount) {
            emit OverfundedPool(poolId, msg.sender, fundAmount);
        } else {
            emit FundedPool(poolId, msg.sender, fundAmount);
        }
    }

    fallback() external payable {}
    receive() external payable {}
}
