'use client';

import { useContractRead } from 'wagmi';
import { KOALA_KOLLECT_ADDRESS, KOALA_KOLLECT_ABI } from '@/constants/contracts';
import { PoolCard } from './PoolCard';
import { useEffect, useState } from 'react';

export function PoolList() {
  const [pools, setPools] = useState<any[]>([]);
  
  const { data: poolCount } = useContractRead({
    address: KOALA_KOLLECT_ADDRESS,
    abi: KOALA_KOLLECT_ABI,
    functionName: 'poolCount',
  });

  const { data: poolDetails, isLoading } = useContractRead({
    address: KOALA_KOLLECT_ADDRESS,
    abi: KOALA_KOLLECT_ABI,
    functionName: 'getPoolDetails',
    args: [0], // We'll fetch all pools up to poolCount
    watch: true,
  });

  useEffect(() => {
    const fetchAllPools = async () => {
      if (!poolCount) return;
      
      const poolPromises = [];
      for (let i = 0; i < Number(poolCount); i++) {
        poolPromises.push(
          fetch(`/api/pools/${i}`).then(res => res.json())
        );
      }
      
      const fetchedPools = await Promise.all(poolPromises);
      setPools(fetchedPools);
    };

    fetchAllPools();
  }, [poolCount]);

  if (isLoading) return <div>Loading pools...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pools.map((pool, index) => (
        <PoolCard key={index} pool={pool} />
      ))}
    </div>
  );
} 