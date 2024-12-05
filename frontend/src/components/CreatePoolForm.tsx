'use client';

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { KOALA_KOLLECT_ADDRESS, KOALA_KOLLECT_ABI } from '@/constants/contracts';
import { parseEther } from 'viem';

export function CreatePoolForm() {
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState('');
  const [fee, setFee] = useState('0.01'); // Default fee in ETH

  const { writeContract, data: hash } = useWriteContract();

  const { isLoading: isCreating } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    writeContract({
      address: KOALA_KOLLECT_ADDRESS,
      abi: KOALA_KOLLECT_ABI,
      functionName: 'createPool',
      args: [parseEther(goal), BigInt(Number(duration))],
      value: parseEther(fee)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-koala-black mb-6">Create New Pool</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Funding Goal (ETH)
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-koala-green focus:ring-koala-green"
            placeholder="e.g. 1.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration (Days)
          </label>
          <input
            type="number"
            required
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-koala-green focus:ring-koala-green"
            placeholder="e.g. 30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Creation Fee (ETH)
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-koala-green focus:ring-koala-green"
            disabled
          />
          <p className="mt-1 text-sm text-gray-500">
            This fee is required to create a pool
          </p>
        </div>

        <button
          type="submit"
          disabled={isCreating || !goal || !duration}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white 
                   bg-koala-green hover:bg-koala-green/90 focus:outline-none focus:ring-2 
                   focus:ring-offset-2 focus:ring-koala-green disabled:bg-gray-300 
                   disabled:cursor-not-allowed"
        >
          {isCreating ? 'Creating...' : 'Create Pool'}
        </button>
      </div>
    </form>
  );
} 