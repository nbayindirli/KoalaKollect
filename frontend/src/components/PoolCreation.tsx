import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Contract } from '@ethersproject/contracts';
import { ethers } from 'ethers';
import styled from 'styled-components';
import { SEPOLIA_CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/web3';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: 0 auto;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 8px;
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

const PoolCreation: React.FC = () => {
    const { account, provider } = useWeb3React();
    const [goal, setGoal] = useState('');
    const [duration, setDuration] = useState('');
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!account || !provider) {
        alert('Please connect your wallet first');
        return;
      }
  
      try {
        const signer = await provider.getSigner();
        const contract = new Contract(SEPOLIA_CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        
        const tx = await contract.createPool(
          ethers.parseEther(goal),
          parseInt(duration),
          { value: ethers.parseEther('0.01'), gasLimit: 20_000 } // Assuming a 0.01 ETH fee for pool creation
        );
  
        await tx.wait();
        alert('Pool created successfully!');
      } catch (error) {
        console.error('Error creating pool:', error);
        alert('Failed to create pool. See console for details.');
      }
    };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>Create a New Pool</h2>
      <Input 
        type="number" 
        placeholder="Goal (in ETH)" 
        value={goal} 
        onChange={(e) => setGoal(e.target.value)} 
        required 
      />
      <Input 
        type="number" 
        placeholder="Duration (in days)" 
        value={duration} 
        onChange={(e) => setDuration(e.target.value)} 
        required 
      />
      <Button type="submit">Create Pool</Button>
    </Form>
  );
};

export default PoolCreation;
