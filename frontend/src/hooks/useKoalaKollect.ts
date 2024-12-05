'use client';

import { useReadContract } from 'wagmi';
import { KOALA_KOLLECT_ADDRESS, KOALA_KOLLECT_ABI } from '@/constants/contracts';
import { useAccount } from 'wagmi';

export function useKoalaKollect() {
  const { address } = useAccount();
  
  const { data: isCreator } = useReadContract({
    address: KOALA_KOLLECT_ADDRESS,
    abi: KOALA_KOLLECT_ABI,
    functionName: 'isRegisteredCreator',
    args: [address],
    enabled: Boolean(address),
    watch: true,
  });

  const { data: isKoala } = useReadContract({
    address: KOALA_KOLLECT_ADDRESS,
    abi: KOALA_KOLLECT_ABI,
    functionName: 'isRegisteredKoala',
    args: [address],
    enabled: Boolean(address),
    watch: true,
  });

  return {
    isCreator: isCreator || false,
    isKoala: isKoala || false,
  };
} 