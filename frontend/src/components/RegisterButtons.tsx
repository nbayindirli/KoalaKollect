'use client';

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { KOALA_KOLLECT_V1_ADDRESS } from '@/constants/index';
import { KOALA_KOLLECT_V1_ABI } from '@/constants/contracts';
import { useKoalaKollect } from '@/hooks/useKoalaKollect';
import { parseEther } from 'viem';

export function RegisterButtons() {
  const [error, setError] = useState<string | null>(null);
  const { isCreator, isKoala } = useKoalaKollect();
  const [showCreatePool, setShowCreatePool] = useState(false);
  const [poolData, setPoolData] = useState({
    targetAmount: '',
    duration: '',
    canOverfund: false
  });

  const { writeContract, data: txHash, isPending: isWritePending } = useWriteContract();

  const { isLoading: isTxPending } = useWaitForTransactionReceipt({
    hash: txHash,
    onSuccess: () => {
      window.location.reload();
    },
    onError: (err: Error) => {
      setError('Transaction failed. Please try again.');
    },
  });

  const handleRegisterCreator = () => {
    setError(null);
    writeContract({
      address: KOALA_KOLLECT_V1_ADDRESS,
      abi: KOALA_KOLLECT_V1_ABI,
      functionName: 'registerCreator',
    }, {
      onError: (err: Error) => {
        setError(err.message);
      }
    });
  };

  const handleRegisterKoala = () => {
    setError(null);
    writeContract({
      address: KOALA_KOLLECT_V1_ADDRESS,
      abi: KOALA_KOLLECT_V1_ABI,
      functionName: 'registerKoala',
    }, {
      onError: (err: Error) => {
        setError(err.message);
      }
    });
  };

  const handleCreatePool = () => {
    setError(null);
    const targetDate = Math.floor(Date.now() / 1000) + (Number(poolData.duration) * 24 * 60 * 60);
    
    writeContract({
      address: KOALA_KOLLECT_V1_ADDRESS,
      abi: KOALA_KOLLECT_V1_ABI,
      functionName: 'createPool',
      args: [
        parseEther(poolData.targetAmount),
        '0x0000000000000000000000000000000000000000', // ETH address
        BigInt(18), // ETH decimals
        BigInt(targetDate),
        poolData.canOverfund
      ]
    }, {
      onError: (err: Error) => {
        setError(err.message);
      }
    });
  };

  const isLoading = isWritePending || isTxPending;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        {!isCreator && !isKoala && (
          <button
            onClick={handleRegisterCreator}
            disabled={isLoading}
            className="flex-1 bg-blue-500 text-white p-3 rounded-lg disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Register as Creator'}
          </button>
        )}

        {!isKoala && !isCreator && (
          <button
            onClick={handleRegisterKoala}
            disabled={isLoading}
            className="flex-1 bg-green-500 text-white p-3 rounded-lg disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Register as Koala'}
          </button>
        )}

        {isCreator && !showCreatePool && (
          <button
            onClick={() => setShowCreatePool(true)}
            className="flex-1 bg-koala-green text-white p-3 rounded-lg"
          >
            Create New Pool
          </button>
        )}
      </div>

      {showCreatePool && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Create New Pool</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Amount (ETH)
              </label>
              <input
                type="number"
                step="0.01"
                value={poolData.targetAmount}
                onChange={(e) => setPoolData(prev => ({ ...prev, targetAmount: e.target.value }))}
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
                value={poolData.duration}
                onChange={(e) => setPoolData(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-koala-green focus:ring-koala-green"
                placeholder="e.g. 30"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="canOverfund"
                checked={poolData.canOverfund}
                onChange={(e) => setPoolData(prev => ({ ...prev, canOverfund: e.target.checked }))}
                className="rounded border-gray-300 text-koala-green focus:ring-koala-green"
              />
              <label htmlFor="canOverfund" className="ml-2 block text-sm text-gray-700">
                Allow overfunding beyond target amount
              </label>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleCreatePool}
                disabled={isLoading || !poolData.targetAmount || !poolData.duration}
                className="flex-1 bg-koala-green text-white p-3 rounded-lg disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Create Pool'}
              </button>
              <button
                onClick={() => setShowCreatePool(false)}
                className="flex-1 bg-gray-200 text-gray-700 p-3 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
          {error}
        </div>
      )}
    </div>
  );
}