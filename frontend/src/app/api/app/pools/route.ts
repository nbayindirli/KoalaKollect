import { NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { KOALA_KOLLECT_V1_ADDRESS, KOALA_KOLLECT_V1_ABI } from '@/constants/contracts';

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

export async function GET() {
  try {
    const publicClient = createPublicClient({
      chain: mainnet,
      transport: http(),
    });

    // Get all CreatedPool events
    const createdPoolEvents = await publicClient.getLogs({
      address: KOALA_KOLLECT_V1_ADDRESS,
      event: {
        type: 'event',
        name: 'CreatedPool',
        inputs: [{ type: 'uint256', name: 'poolId', indexed: true }],
      },
      fromBlock: 0n,
      toBlock: 'latest'
    });

    const pools: Pool[] = [];
    
    // Get details for each pool from events
    for (const event of createdPoolEvents) {
      try {
        const poolId = event.args.poolId;
        
        const [
          creator,
          totalFundAmount,
          targetTotalFundAmount,
          fundAssetAddress,
          fundAssetDecimals,
          targetDate,
          canOverfund
        ] = await publicClient.readContract({
          address: KOALA_KOLLECT_V1_ADDRESS,
          abi: KOALA_KOLLECT_V1_ABI,
          functionName: 'pools',
          args: [poolId],
        }) as [string, bigint, bigint, string, bigint, bigint, boolean];

        const isActive = await publicClient.readContract({
          address: KOALA_KOLLECT_V1_ADDRESS,
          abi: KOALA_KOLLECT_V1_ABI,
          functionName: 'isActivePool',
          args: [poolId],
        }) as boolean;

        pools.push({
          id: Number(poolId),
          creator,
          totalFundAmount,
          targetTotalFundAmount,
          fundAssetAddress,
          fundAssetDecimals: Number(fundAssetDecimals),
          targetDate,
          canOverfund,
          isActive,
        });
      } catch (err) {
        console.error(`Error fetching pool ${event.args.poolId}:`, err);
        continue;
      }
    }

    // Sort pools by ID in descending order (newest first)
    pools.sort((a, b) => b.id - a.id);

    return NextResponse.json(pools);

  } catch (error: unknown) {
    console.error('Error getting all pools:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to get pools';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 