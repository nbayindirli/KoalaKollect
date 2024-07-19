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
     */
    function createPool() external;

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
