// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract KoalaKollect {
    struct Pool {
        address creator;
        uint256 goal;
        uint256 deadline;
        uint256 totalFunds;
        bool finalized;
        mapping(address => uint256) pledges;
    }

    struct Creator {
        bool isRegistered;
        uint256[] poolIds;
    }

    struct Koala {
        bool isRegistered;
        uint256[] poolIds;
    }

    mapping(uint256 => Pool) public pools;
    mapping(address => Creator) public creators;
    mapping(address => Koala) public koalas;
    uint256 public poolCount;

    address public authority;

    event PoolCreated(uint256 poolId, address creator, uint256 goal, uint256 deadline);
    event Pledged(uint256 poolId, address koala, uint256 amount);
    event PoolFinalized(uint256 poolId, bool successful);
    event Refunded(uint256 poolId, address koala, uint256 amount);
    event CreatorRegistered(address creator);
    event KoalaRegistered(address koala);

    constructor() {
        authority = msg.sender;
    }

    modifier onlyAuthority() {
        require(msg.sender == authority, "Only the authority can perform this action");
        _;
    }

    modifier onlyRegisteredCreator() {
        require(creators[msg.sender].isRegistered, "Only registered creators can perform this action");
        _;
    }

    modifier onlyRegisteredKoala() {
        require(koalas[msg.sender].isRegistered, "Only registered koalas can perform this action");
        _;
    }

    function registerCreator(address _creator) external onlyAuthority {
        require(!creators[_creator].isRegistered, "Creator already registered");
        creators[_creator].isRegistered = true;
        emit CreatorRegistered(_creator);
    }

    function registerKoala(address _koala) external onlyAuthority {
        require(!koalas[_koala].isRegistered, "Koala already registered");
        koalas[_koala].isRegistered = true;
        emit KoalaRegistered(_koala);
    }

    function createPool(uint256 _goal, uint256 _durationInDays) external payable onlyRegisteredCreator {
        require(msg.value > 0, "Must pay a fee to create a pool");

        uint256 poolId = poolCount++;
        Pool storage newPool = pools[poolId];
        newPool.creator = msg.sender;
        newPool.goal = _goal;
        newPool.deadline = block.timestamp + (_durationInDays * 1 days);

        creators[msg.sender].poolIds.push(poolId);

        emit PoolCreated(poolId, msg.sender, _goal, newPool.deadline);
    }

    function pledge(uint256 _poolId) external payable onlyRegisteredKoala {
        Pool storage pool = pools[_poolId];
        require(block.timestamp < pool.deadline, "Pool has expired");
        require(!pool.finalized, "Pool is already finalized");

        pool.pledges[msg.sender] += msg.value;
        pool.totalFunds += msg.value;

        if (pool.pledges[msg.sender] == msg.value) {
            // This is the first pledge from this Koala for this pool
            koalas[msg.sender].poolIds.push(_poolId);
        }

        emit Pledged(_poolId, msg.sender, msg.value);
    }

    function finalizePool(uint256 _poolId) external {
        Pool storage pool = pools[_poolId];
        require(msg.sender == pool.creator, "Only pool creator can finalize");
        require(block.timestamp >= pool.deadline, "Pool deadline not reached");
        require(!pool.finalized, "Pool already finalized");

        pool.finalized = true;
        bool successful = pool.totalFunds >= pool.goal;

        if (successful) {
            payable(pool.creator).transfer(pool.totalFunds);
        }

        emit PoolFinalized(_poolId, successful);
    }

    function withdrawPledge(uint256 _poolId) external {
        Pool storage pool = pools[_poolId];
        require(!pool.finalized, "Pool is finalized");

        uint256 amount = pool.pledges[msg.sender];
        require(amount > 0, "No funds to withdraw");

        pool.pledges[msg.sender] = 0;
        pool.totalFunds -= amount;
        payable(msg.sender).transfer(amount);

        emit Refunded(_poolId, msg.sender, amount);
    }

    function getPoolDetails(uint256 _poolId) external view returns (
        address creator,
        uint256 goal,
        uint256 deadline,
        uint256 totalFunds,
        bool finalized
    ) {
        Pool storage pool = pools[_poolId];
        return (pool.creator, pool.goal, pool.deadline, pool.totalFunds, pool.finalized);
    }

    function getPledgeAmount(uint256 _poolId, address _koala) external view returns (uint256) {
        return pools[_poolId].pledges[_koala];
    }

    function getCreatorPools(address _creator) external view returns (uint256[] memory) {
        return creators[_creator].poolIds;
    }

    function getKoalaPools(address _koala) external view returns (uint256[] memory) {
        return koalas[_koala].poolIds;
    }

    function setAuthority(address _newAuthority) external onlyAuthority {
        authority = _newAuthority;
    }
}
