// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// import "hardhat/console.sol";

import "../util/AdminControl.sol";

abstract contract KoalaKollectV1Storage is AdminControl {

    struct Pool {
        uint256 id;
        address creator;
        uint256 totalFundAmount;
        uint256 targetTotalFundAmount;
        address fundAssetAddress;
        uint256 fundAssetDecimals;
        uint256 targetDate;
        mapping(address /* koalaAddress */ => uint256 /* fundAmount */) fundAmounts;
        bool canOverfund;
    }

    uint256 public nextPoolId;

    mapping(uint256 /* poolId */ => bool /* isActive */) isActivePool;
    mapping(uint256 /* poolId */ => Pool /* pool */) pools;

    struct Creator {
        uint256[] poolIds;
    }

    mapping(address /* creatorAddress */ => bool /* isRegistered */) isRegisteredCreator;
    mapping(address /* creatorAddress */ => Creator /* creator */) creators;

    struct Koala {
        uint256[] poolIds;
    }

    mapping(address /* koalaAddress */ => bool /* isRegistered */) isRegisteredKoala;
    mapping(address /* koalaAddress */ => Koala /* koala */) koalas;
}
