// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// import "hardhat/console.sol";

import "../util/AdminControl.sol";

abstract contract KoalaKollectV1Storage is AdminControl {

    struct Pool {
        uint256 id;
        address creator;
        uint256 targetTotalFundAmount;
        address fundAssetAddress;
        uint256 fundAssetDecimals;
        bool canOverfund;
    }

    mapping(uint256 /* id */ => bool /* isActive */) isActivePool;

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
