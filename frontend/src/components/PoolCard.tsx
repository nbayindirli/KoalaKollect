'use client';

import { formatEther } from 'viem';
import { useKoalaKollect } from '@/hooks/useKoalaKollect';
import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { KOALA_KOLLECT_ADDRESS, KOALA_KOLLECT_ABI } from '@/constants/contracts';

interface Pool {
  id: number;
  creator: string;
  goal: bigint;
  deadline: bigint;
  totalFunds: bigint;
  finalized: boolean;
}

export function PoolCard({ pool }: { pool: Pool }) {
  const [pledgeAmount, setPledgeAmount] = useState('');
  const { isKoala } = useKoalaKollect();
  
  const { writeContract, data: hash } = useWriteContract();

  const { isLoading: isPledging } = useWaitForTransactionReceipt({
    hash,
  });

  const progress = Number(pool.totalFunds) / Number(pool.goal) * 100;
  const deadline = new Date(Number(pool.deadline) * 1000);
  const isExpired = deadline < new Date();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-koala-black">
            Pool #{pool.id}
          </h3>
          <p className="text-sm text-gray-500">
            by {pool.creator.slice(0, 6)}...{pool.creator.slice(-4)}
          </p>
        </div>
        <div className={`px-2 py-1 rounded text-sm ${
          pool.finalized ? 'bg-gray-100 text-gray-600' : 
          isExpired ? 'bg-red-100 text-red-600' : 
          'bg-koala-green/10 text-koala-green'
        }`}>
          {pool.finalized ? 'Finalized' : 
           isExpired ? 'Expired' : 
           'Active'}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Progress</span>
          <span>{progress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-koala-green rounded-full h-2" 
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-gray-500">Goal</p>
          <p className="font-medium">{formatEther(pool.goal)} ETH</p>
        </div>
        <div>
          <p className="text-gray-500">Raised</p>
          <p className="font-medium">{formatEther(pool.totalFunds)} ETH</p>
        </div>
        <div>
          <p className="text-gray-500">Deadline</p>
          <p className="font-medium">{deadline.toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-gray-500">Time Left</p>
          <p className="font-medium">
            {isExpired ? 'Ended' : 
             Math.ceil((Number(pool.deadline) * 1000 - Date.now()) / (1000 * 60 * 60 * 24)) + ' days'}
          </p>
        </div>
      </div>

      {isKoala && !pool.finalized && !isExpired && (
        <div className="mt-4">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Amount in ETH"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-koala-green focus:ring-koala-green"
              value={pledgeAmount}
              onChange={(e) => setPledgeAmount(e.target.value)}
            />
            <button
              onClick={() => writeContract({
                address: KOALA_KOLLECT_ADDRESS,
                abi: KOALA_KOLLECT_ABI,
                functionName: 'pledge',
                args: [pool.id],
                value: BigInt(Number(pledgeAmount) * 1e18)
              })}
              disabled={isPledging || !pledgeAmount}
              className="px-4 py-2 bg-koala-green text-white rounded-md hover:bg-koala-green/90 
                       disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isPledging ? 'Pledging...' : 'Pledge'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 