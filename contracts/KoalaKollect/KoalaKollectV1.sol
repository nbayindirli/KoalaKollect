// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// import "hardhat/console.sol";

import "./KoalaKollectV1Admin.sol";
import "./KoalaKollectV1Events.sol";
import "./KoalaKollectV1Modifiers.sol";
import "./KoalaKollectV1Storage.sol";
import "./interfaces/IKoalaKollectV1.sol";

contract KoalaKollectV1 is
    KoalaKollectV1Admin,
    KoalaKollectV1Events,
    KoalaKollectV1Modifiers,
    KoalaKollectV1Storage,
    IKoalaKollectV1
{
    constructor() AdminControl(msg.sender) payable {}

    fallback() external payable {}
    receive() external payable {}
}
