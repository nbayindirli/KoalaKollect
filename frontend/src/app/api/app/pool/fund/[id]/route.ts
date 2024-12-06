import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { mainnet } from 'viem/chains';
import { KOALA_KOLLECT_V1_ADDRESS, KOALA_KOLLECT_V1_ABI } from '@/constants/contracts';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { address, fundAmount } = await req.json();
    const poolId = params.id;

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    if (!poolId) {
      return NextResponse.json(
        { error: 'Pool ID is required' },
        { status: 400 }
      );
    }

    if (!fundAmount) {
      return NextResponse.json(
        { error: 'Fund amount is required' },
        { status: 400 }
      );
    }

    const publicClient = createPublicClient({
      chain: mainnet,
      transport: http(),
    });

    const walletClient = createWalletClient({
      chain: mainnet,
      transport: custom(window.ethereum),
    });

    const hash = await walletClient.writeContract({
      address: KOALA_KOLLECT_V1_ADDRESS,
      abi: KOALA_KOLLECT_V1_ABI,
      functionName: 'fundPool',
      args: [BigInt(poolId), BigInt(fundAmount)],
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    return NextResponse.json({ 
      success: true,
      hash: receipt.transactionHash,
    });

  } catch (error: any) {
    console.error('Error funding pool:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fund pool' },
      { status: 500 }
    );
  }
} 