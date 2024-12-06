import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { KOALA_KOLLECT_V1_ADDRESS, KOALA_KOLLECT_V1_ABI } from '@/constants/contracts';

export async function GET(
  req: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const koalaAddress = params.address;

    if (!koalaAddress) {
      return NextResponse.json(
        { error: 'Koala address is required' },
        { status: 400 }
      );
    }

    const publicClient = createPublicClient({
      chain: mainnet,
      transport: http(),
    });

    const poolIds = await publicClient.readContract({
      address: KOALA_KOLLECT_V1_ADDRESS,
      abi: KOALA_KOLLECT_V1_ABI,
      functionName: 'koalas',
      args: [koalaAddress],
    });

    const pools = await Promise.all(
      poolIds.map(async (poolId: bigint) => {
        const pool = await publicClient.readContract({
          address: KOALA_KOLLECT_V1_ADDRESS,
          abi: KOALA_KOLLECT_V1_ABI,
          functionName: 'pools',
          args: [poolId],
        });

        const isActive = await publicClient.readContract({
          address: KOALA_KOLLECT_V1_ADDRESS,
          abi: KOALA_KOLLECT_V1_ABI,
          functionName: 'isActivePool',
          args: [poolId],
        });

        const fundAmount = await publicClient.readContract({
          address: KOALA_KOLLECT_V1_ADDRESS,
          abi: KOALA_KOLLECT_V1_ABI,
          functionName: 'fundAmounts',
          args: [poolId, koalaAddress],
        });

        return {
          id: Number(poolId),
          ...pool,
          isActive,
          fundAmount,
        };
      })
    );

    return NextResponse.json(pools);

  } catch (error: any) {
    console.error('Error getting koala pools:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get koala pools' },
      { status: 500 }
    );
  }
} 