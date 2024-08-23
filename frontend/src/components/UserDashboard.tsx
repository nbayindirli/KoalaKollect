import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Contract } from '@ethersproject/contracts';
import { ethers } from 'ethers';
import styled from 'styled-components';
import { SEPOLIA_CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/web3';

const DashboardContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Section = styled.div`
  margin-bottom: 30px;
`;

const PoolList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const PoolCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background-color: white;
`;

interface Pool {
  id: number;
  goal: string;
  deadline: string;
  totalFunds: string;
  finalized: boolean;
  pledgeAmount?: string;
}

const UserDashboard: React.FC = () => {
  const { account, provider } = useWeb3React();
  const [createdPools, setCreatedPools] = useState<Pool[]>([]);
  const [pledgedPools, setPledgedPools] = useState<Pool[]>([]);

  useEffect(() => {
    const fetchUserPools = async () => {
      if (!account || !provider) return;

      const contract = new Contract(SEPOLIA_CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      // Fetch created pools
      const creatorPools = await contract.getCreatorPools(account);
      const fetchedCreatedPools = await Promise.all(
        creatorPools.map(async (poolId: number) => {
          const poolDetails = await contract.getPoolDetails(poolId);
          return {
            id: poolId,
            goal: ethers.formatEther(poolDetails[1]),
            deadline: new Date(poolDetails[2].toNumber() * 1000).toLocaleString(),
            totalFunds: ethers.formatEther(poolDetails[3]),
            finalized: poolDetails[4]
          };
        })
      );
      setCreatedPools(fetchedCreatedPools);

      // Fetch pledged pools
      const koalaPools = await contract.getKoalaPools(account);
      const fetchedPledgedPools = await Promise.all(
        koalaPools.map(async (poolId: number) => {
          const poolDetails = await contract.getPoolDetails(poolId);
          const pledgeAmount = await contract.getPledgeAmount(poolId, account);
          return {
            id: poolId,
            goal: ethers.formatEther(poolDetails[1]),
            deadline: new Date(poolDetails[2].toNumber() * 1000).toLocaleString(),
            totalFunds: ethers.formatEther(poolDetails[3]),
            finalized: poolDetails[4],
            pledgeAmount: ethers.formatEther(pledgeAmount)
          };
        })
      );
      setPledgedPools(fetchedPledgedPools);
    };

    fetchUserPools();
  }, [account, provider]);

  if (!account) return <div>Please connect your wallet to view your dashboard.</div>;

  return (
    <DashboardContainer>
      <h1>User Dashboard</h1>

      <Section>
        <h2>Pools You Created</h2>
        <PoolList>
          {createdPools.map((pool) => (
            <PoolCard key={pool.id}>
              <h3>Pool #{pool.id}</h3>
              <p>Goal: {pool.goal} ETH</p>
              <p>Deadline: {pool.deadline}</p>
              <p>Total Funds: {pool.totalFunds} ETH</p>
              <p>Status: {pool.finalized ? 'Finalized' : 'Active'}</p>
            </PoolCard>
          ))}
        </PoolList>
      </Section>

      <Section>
        <h2>Pools You Pledged To</h2>
        <PoolList>
          {pledgedPools.map((pool) => (
            <PoolCard key={pool.id}>
              <h3>Pool #{pool.id}</h3>
              <p>Your Pledge: {pool.pledgeAmount} ETH</p>
              <p>Pool Goal: {pool.goal} ETH</p>
              <p>Deadline: {pool.deadline}</p>
              <p>Total Funds: {pool.totalFunds} ETH</p>
              <p>Status: {pool.finalized ? 'Finalized' : 'Active'}</p>
            </PoolCard>
          ))}
        </PoolList>
      </Section>
    </DashboardContainer>
  );
};

export default UserDashboard;
