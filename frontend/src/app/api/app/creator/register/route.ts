import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

export async function POST(req: NextRequest) {
  try {
    const { address, hash } = await req.json();

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    if (!hash) {
      return NextResponse.json(
        { error: 'Transaction hash is required' },
        { status: 400 }
      );
    }

    const publicClient = createPublicClient({
      chain: mainnet,
      transport: http(),
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    return NextResponse.json({ 
      success: true,
      hash: receipt.transactionHash,
    });

  } catch (error: any) {
    console.error('Error registering creator:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to register creator' },
      { status: 500 }
    );
  }
} 