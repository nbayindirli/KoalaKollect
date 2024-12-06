'use client';

import { useReadContract } from 'wagmi';
import { KOALA_KOLLECT_V1_ADDRESS, KOALA_KOLLECT_V1_ABI } from '@/constants/contracts';
import { useAccount } from 'wagmi';

export function useKoalaKollect() {
  const { address } = useAccount();
  
  const { data: isCreator = false } = useReadContract({
    address: KOALA_KOLLECT_V1_ADDRESS,
    abi: KOALA_KOLLECT_V1_ABI,
    functionName: 'isRegisteredCreator',
    args: [address],
    enabled: Boolean(address),
    watch: true,
  });

  const { data: isKoala = false } = useReadContract({
    address: KOALA_KOLLECT_V1_ADDRESS,
    abi: KOALA_KOLLECT_V1_ABI,
    functionName: 'isRegisteredKoala',
    args: [address],
    enabled: Boolean(address),
    watch: true,
  });

  return {
    isCreator: Boolean(isCreator),
    isKoala: Boolean(isKoala),
  };
} 