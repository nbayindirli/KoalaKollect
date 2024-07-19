// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.4;

abstract contract CommonErrors {
    error AddressExpected();
    error OnlyAdmin();
    error OnlyAdminCandidate();
    error OnlyAuthority(address);
    error PoolNotActive(uint256 id);
    error RegisteredCreatorOnly(address);
    error RegisteredKoalaOnly(address);
}
