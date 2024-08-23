import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Contract } from '@ethersproject/contracts';
import { ethers } from 'ethers';
import styled from 'styled-components';
import { SEPOLIA_CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/web3';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: #98D8AA;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #7BC5AE;
  }
`;

interface PoolDetailsProps {
    poolId: number;
  }
  
  const PoolDetailsAndPledging: React.FC<PoolDetailsProps> = ({ poolId }) => {
    const { account, provider } = useWeb3React();
    const [pool, setPool] = useState<any>(null);
    const [pledgeAmount, setPledgeAmount] = useState('');
  
    useEffect(() => {
      const fetchPoolDetails = async () => {
        if (!provider) return;
  
        const contract = new Contract(SEPOLIA_CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        const poolDetails = await contract.getPoolDetails(poolId);
  
        setPool({
          creator: poolDetails[0],
          goal: ethers.formatEther(poolDetails[1]),
          deadline: new Date(poolDetails[2].toNumber() * 1000).toLocaleString(),
          totalFunds: ethers.formatEther(poolDetails[3]),
          finalized: poolDetails[4]
        });
      };
  
      fetchPoolDetails();
    }, [provider, poolId]);
  
    const handlePledge = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!account || !provider) {
        alert('Please connect your wallet first');
        return;
      }
  
      try {
        const signer = await provider.getSigner();
        const contract = new Contract(SEPOLIA_CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        
        const tx = await contract.pledge(poolId, {
          value: ethers.parseEther(pledgeAmount)
        });
  
        await tx.wait();
        alert('Pledge successful!');
        // Refresh pool details
        const updatedPool = await contract.getPoolDetails(poolId);
        setPool({
          ...pool,
          totalFunds: ethers.formatEther(updatedPool[3])
        });
      } catch (error) {
        console.error('Error pledging:', error);
        alert('Failed to pledge. See console for details.');
      }
    };

  return (
    <Container>
      <h2>Pool #{poolId} Details</h2>
      <p>Creator: {pool.creator}</p>
      <p>Goal: {pool.goal} ETH</p>
      <p>Deadline: {pool.deadline}</p>
      <p>Total Funds: {pool.totalFunds} ETH</p>
      <p>Status: {pool.finalized ? 'Finalized' : 'Active'}</p>

      {!pool.finalized && (
        <form onSubmit={handlePledge}>
          <h3>Make a Pledge</h3>
          <Input 
            type="number" 
            placeholder="Amount to pledge (ETH)" 
            value={pledgeAmount} 
            onChange={(e) => setPledgeAmount(e.target.value)} 
            required 
          />
          <Button type="submit">Pledge</Button>
        </form>
      )}
    </Container>
  );
};

export default PoolDetailsAndPledging;
