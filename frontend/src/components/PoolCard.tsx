'use client';

import { formatEther } from 'viem';
import { useKoalaKollect } from '@/hooks/useKoalaKollect';
import { useAccount } from 'wagmi';
import { useState } from 'react';

interface Pool {
  id: number;
  creator: string;
  totalFundAmount: bigint;
  targetTotalFundAmount: bigint;
  fundAssetAddress: string;
  fundAssetDecimals: number;
  targetDate: bigint;
  canOverfund: boolean;
  isActive: boolean;
}

export function PoolCard({ pool }: { pool: Pool }) {
  const { address } = useAccount();
  const [fundAmount, setFundAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isKoala } = useKoalaKollect();

  const progress = Number(pool.totalFundAmount) / Number(pool.targetTotalFundAmount) * 100;
  const deadline = new Date(Number(pool.targetDate) * 1000);
  const isExpired = deadline < new Date();

  const handleFund = async () => {
    if (!address || !fundAmount) return;

    try {
      setIsProcessing(true);
      setError(null);

      const response = await fetch(`/api/app/pool/fund/${pool.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          fundAmount: formatEther(fundAmount),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fund pool');
      }

      setFundAmount('');

    } catch (err: any) {
      console.error('Error funding pool:', err);
      setError(err.message || 'Failed to fund pool');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = async () => {
    if (!address) return;

    try {
      setIsProcessing(true);
      setError(null);

      const response = await fetch(`/api/app/pool/close/${pool.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to close pool');
      }

    } catch (err: any) {
      console.error('Error closing pool:', err);
      setError(err.message || 'Failed to close pool');
    } finally {
      setIsProcessing(false);
    }
  };

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
          !pool.isActive ? 'bg-gray-100 text-gray-600' : 
          isExpired ? 'bg-red-100 text-red-600' : 
          'bg-koala-green/10 text-koala-green'
        }`}>
          {!pool.isActive ? 'Closed' : 
           isExpired ? 'Expired' : 
           'Active'}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {error}
        </div>
      )}

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
          <p className="text-gray-500">Target</p>
          <p className="font-medium">{formatEther(pool.targetTotalFundAmount)} ETH</p>
        </div>
        <div>
          <p className="text-gray-500">Raised</p>
          <p className="font-medium">{formatEther(pool.totalFundAmount)} ETH</p>
        </div>
        <div>
          <p className="text-gray-500">Deadline</p>
          <p className="font-medium">{deadline.toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-gray-500">Time Left</p>
          <p className="font-medium">
            {isExpired ? 'Ended' : 
             Math.ceil((Number(pool.targetDate) * 1000 - Date.now()) / (1000 * 60 * 60 * 24)) + ' days'}
          </p>
        </div>
      </div>

      {isKoala && pool.isActive && !isExpired && (
        <div className="mt-4">
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              placeholder="Amount in ETH"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-koala-green focus:ring-koala-green"
              value={fundAmount}
              onChange={(e) => setFundAmount(e.target.value)}
            />
            <button
              onClick={handleFund}
              disabled={isProcessing || !fundAmount || !address}
              className="px-4 py-2 bg-koala-green text-white rounded-md hover:bg-koala-green/90 
                       disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Fund'}
            </button>
          </div>
        </div>
      )}

      {address === pool.creator && pool.isActive && !isExpired && (
        <div className="mt-4">
          <button
            onClick={handleClose}
            disabled={isProcessing}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 
                     disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Close Pool'}
          </button>
        </div>
      )}
    </div>
  );
} 