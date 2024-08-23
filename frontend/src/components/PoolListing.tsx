import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Contract } from '@ethersproject/contracts';
import { ethers } from 'ethers';
import styled from 'styled-components';
import { SEPOLIA_CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/web3';

const PoolList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const PoolCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background-color: white;
`;

const ClickablePoolCard = styled(PoolCard)`
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

interface Pool {
  id: number;
  creator: string;
  goal: string;
  deadline: string;
  totalFunds: string;
}

interface PoolListingProps {
    onPoolClick: (poolId: number) => void;
}

const PoolListing: React.FC<PoolListingProps> = ({ onPoolClick }) => {
    const { provider } = useWeb3React();
    const [pools, setPools] = useState<Pool[]>([]);
  
    useEffect(() => {
      const fetchPools = async () => {
        if (!provider) return;
  
        const contract = new Contract(SEPOLIA_CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        const poolCount = await contract.poolCount();
  
        const fetchedPools = [];
        for (let i = 0; i < poolCount; i++) {
          const poolDetails = await contract.getPoolDetails(i);
          fetchedPools.push({
            id: i,
            creator: poolDetails[0],
            goal: ethers.formatEther(poolDetails[1]),
            deadline: new Date(poolDetails[2].toNumber() * 1000).toLocaleString(),
            totalFunds: ethers.formatEther(poolDetails[3])
          });
        }
  
        setPools(fetchedPools);
      };
  
      fetchPools();
    }, [provider]);

    return (
        <div>
          <h2>Available Pools</h2>
          <PoolList>
            {pools.map((pool) => (
              <ClickablePoolCard key={pool.id} onClick={() => onPoolClick(pool.id)}>
                <h3>Pool #{pool.id}</h3>
                <p>Creator: {pool.creator.slice(0, 6)}...{pool.creator.slice(-4)}</p>
                <p>Goal: {pool.goal} ETH</p>
                <p>Deadline: {pool.deadline}</p>
                <p>Total Funds: {pool.totalFunds} ETH</p>
              </ClickablePoolCard>
            ))}
          </PoolList>
        </div>
    );
};

export default PoolListing;
