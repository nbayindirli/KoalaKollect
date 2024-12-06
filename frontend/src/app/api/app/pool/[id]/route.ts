import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { KOALA_KOLLECT_V1_ADDRESS, KOALA_KOLLECT_V1_ABI } from '@/constants/contracts';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const poolId = params.id;

    if (!poolId) {
      return NextResponse.json(
        { error: 'Pool ID is required' },
        { status: 400 }
      );
    }

    const publicClient = createPublicClient({
      chain: mainnet,
      transport: http(),
    });

    const pool = await publicClient.readContract({
      address: KOALA_KOLLECT_V1_ADDRESS,
      abi: KOALA_KOLLECT_V1_ABI,
      functionName: 'pools',
      args: [BigInt(poolId)],
    });

    const isActive = await publicClient.readContract({
      address: KOALA_KOLLECT_V1_ADDRESS,
      abi: KOALA_KOLLECT_V1_ABI,
      functionName: 'isActivePool',
      args: [BigInt(poolId)],
    });

    return NextResponse.json({
      id: poolId,
      ...pool,
      isActive,
    });

  } catch (error: any) {
    console.error('Error getting pool details:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get pool details' },
      { status: 500 }
    );
  }
} 