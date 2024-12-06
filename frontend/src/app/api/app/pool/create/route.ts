import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { mainnet } from 'viem/chains';
import { KOALA_KOLLECT_V1_ADDRESS, KOALA_KOLLECT_V1_ABI } from '@/constants/contracts';

export async function POST(req: NextRequest) {
  try {
    const { 
      address,
      targetTotalFundAmount,
      fundAssetAddress,
      fundAssetDecimals,
      targetDate,
      canOverfund 
    } = await req.json();

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    if (!targetTotalFundAmount || !targetDate) {
      return NextResponse.json(
        { error: 'Target amount and target date are required' },
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
      functionName: 'createPool',
      args: [
        targetTotalFundAmount,
        fundAssetAddress || '0x0000000000000000000000000000000000000000', // ETH by default
        fundAssetDecimals || 18n, // ETH decimals by default
        targetDate,
        canOverfund || false
      ],
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    return NextResponse.json({ 
      success: true,
      hash: receipt.transactionHash,
    });

  } catch (error: any) {
    console.error('Error creating pool:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create pool' },
      { status: 500 }
    );
  }
} 