// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// import "hardhat/console.sol";

abstract contract KoalaKollectV1Events {
    event RegisteredCreator(address indexed creator);
    event CreatedPool(uint256 indexed poolId);
    event ClosedPoolBeforeExpiry(uint256 indexed poolId);
    event RegisteredKoala(address indexed koala);
    event FundedPool(uint256 indexed poolId, address indexed koala, uint256 fundAmount);
    event OverfundedPool(uint256 indexed poolId, address indexed koala, uint256 fundAmount);
    event SetAuthority(address indexed authority);
}
