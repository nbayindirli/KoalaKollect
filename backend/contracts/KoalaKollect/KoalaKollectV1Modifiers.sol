// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// import "hardhat/console.sol";
import "./KoalaKollectV1Storage.sol";

abstract contract KoalaKollectV1Modifiers is KoalaKollectV1Storage {
    modifier onlyRegisteredCreator() {
        if (!isRegisteredCreator[msg.sender]) revert RegisteredCreatorOnly(msg.sender);
        _;
    }

    modifier onlyRegisteredKoala() {
        if (!isRegisteredKoala[msg.sender]) revert RegisteredKoalaOnly(msg.sender);
        _;
    }
}
