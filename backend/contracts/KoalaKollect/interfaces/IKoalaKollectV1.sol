// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// import "hardhat/console.sol";

interface IKoalaKollectV1 {

    function createPool() external;

    /**
     * Prematurely closes a pool and refunds all koalas.
     */
    function closePoolBeforeExpiry() external;

    /**
     * Used to register a new koala (funder).
     */
    function register() external;
}
