'use client';

import { useEffect, useState } from 'react';
import { PoolCard } from './PoolCard';

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

export function PoolList() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPools = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/app/pools');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch pools');
        }

        setPools(data);
      } catch (err: any) {
        console.error('Error fetching pools:', err);
        setError(err.message || 'Failed to fetch pools');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPools();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-koala-green"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded text-red-600">
        {error}
      </div>
    );
  }

  if (pools.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No pools found. Be the first to create one!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pools.map((pool) => (
        <PoolCard key={pool.id} pool={pool} />
      ))}
    </div>
  );
} 