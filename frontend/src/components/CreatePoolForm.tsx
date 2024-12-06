'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { parseEther } from 'viem';

export function CreatePoolForm() {
  const { address } = useAccount();
  const [targetAmount, setTargetAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [canOverfund, setCanOverfund] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    try {
      setIsCreating(true);
      setError(null);

      const targetDate = Math.floor(Date.now() / 1000) + (Number(duration) * 24 * 60 * 60);
      
      const response = await fetch('/api/app/pool/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          targetTotalFundAmount: parseEther(targetAmount),
          fundAssetAddress: '0x0000000000000000000000000000000000000000', // ETH
          fundAssetDecimals: 18,
          targetDate,
          canOverfund,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create pool');
      }

      // Reset form
      setTargetAmount('');
      setDuration('');
      setCanOverfund(false);

    } catch (err: any) {
      console.error('Error creating pool:', err);
      setError(err.message || 'Failed to create pool');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-koala-black mb-6">Create New Pool</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Amount (ETH)
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
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

        <div className="flex items-center">
          <input
            type="checkbox"
            id="canOverfund"
            checked={canOverfund}
            onChange={(e) => setCanOverfund(e.target.checked)}
            className="rounded border-gray-300 text-koala-green focus:ring-koala-green"
          />
          <label htmlFor="canOverfund" className="ml-2 block text-sm text-gray-700">
            Allow overfunding beyond target amount
          </label>
        </div>

        <button
          type="submit"
          disabled={isCreating || !targetAmount || !duration || !address}
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