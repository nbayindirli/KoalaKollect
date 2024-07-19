// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// import "hardhat/console.sol";
import "./KoalaKollectV1Modifiers.sol";

abstract contract KoalaKollectV1Admin is KoalaKollectV1Modifiers {
    function setAuthority(address newAuthority) external onlyAuthority() {
        if (newAuthority == address(0)) revert AddressExpected();
        authority = newAuthority;
    }
}
