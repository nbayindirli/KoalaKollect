// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// import "hardhat/console.sol";

interface IKoalaKollectV1 {

    /**
     * Used to register a new creator.
     */
    function registerCreator() external;

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
    ) external;

    /**
     * Prematurely closes a pool and refunds all koalas.
     */
    function closePoolBeforeExpiry(uint256 poolId) external;

    /**
     * Used to register a new koala (funder).
     */
    function registerKoala() external;

    /**
     * Used by koalas (funders) to fund a pool
     */
    function fundPool(uint256 poolId, uint256 fundAmount) external;
}
