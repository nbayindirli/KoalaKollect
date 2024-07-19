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
        // TODO: Implement
    }

    /**
     * Creates a new pool.
     */
    function createPool() external override onlyRegisteredCreator() {
        // TODO: Implement
    }

    /**
     * Prematurely closes a pool and refund all koalas.
     */
    function closePoolBeforeExpiry(uint256 poolId) external override {
        // TODO: Implement
    }

    /**
     * Used to register a new koala (funder).
     */
    function registerKoala() external override {
        // TODO: Implement
    }

    /**
     * Used by koalas (funders) to fund a pool.
     */
    function fundPool(
        uint256 poolId,
        uint256 fundAmount
    ) external override onlyRegisteredKoala() {
        // TODO: Implement
    }

    fallback() external payable {}
    receive() external payable {}
}
