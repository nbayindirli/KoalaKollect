'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { KOALA_KOLLECT_ADDRESS, KOALA_KOLLECT_ABI } from '@/constants/contracts';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export function RegisterButtons() {
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const [status, setStatus] = useState<{
    type: 'creator' | 'koala' | null;
    hash: string | null;
    error: string | null;
  }>({ type: null, hash: null, error: null });

  const { isLoading: isTransactionPending } = useWaitForTransactionReceipt({
    hash: status.hash as `0x${string}` | undefined,
  });

  const handleRegister = async (type: 'creator' | 'koala') => {
    if (!address) {
      setStatus(prev => ({ 
        ...prev, 
        error: 'Please connect your wallet first'
      }));
      return;
    }

    try {
      console.log('Starting registration for:', type);
      console.log('Contract address:', KOALA_KOLLECT_ADDRESS);
      console.log('User address:', address);
      
      setStatus({ type, hash: null, error: null });
      
      const hash = await writeContractAsync({
        address: KOALA_KOLLECT_ADDRESS,
        abi: KOALA_KOLLECT_ABI,
        functionName: type === 'creator' ? 'registerCreator' : 'registerKoala',
      });

      console.log('Transaction submitted:', hash);
      setStatus(prev => ({ ...prev, hash }));
      
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed';
      if (error instanceof Error) {
        errorMessage = error.message;
        // If it's a contract error, it might be nested
        if (error.cause) {
          console.error('Error cause:', error.cause);
          errorMessage = error.cause.toString();
        }
      }
      setStatus(prev => ({ 
        ...prev, 
        error: errorMessage
      }));
    }
  };

  const isDisabled = isTransactionPending || !!status.hash;

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <button
          onClick={() => handleRegister('creator')}
          disabled={isDisabled}
          className="flex-1 py-2 px-4 bg-koala-green text-white rounded-md hover:bg-koala-green/90 
                   disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {status.type === 'creator' && isTransactionPending 
            ? 'Registering...' 
            : 'Register as Creator'}
        </button>
        <button
          onClick={() => handleRegister('koala')}
          disabled={isDisabled}
          className="flex-1 py-2 px-4 bg-koala-green text-white rounded-md hover:bg-koala-green/90 
                   disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {status.type === 'koala' && isTransactionPending 
            ? 'Registering...' 
            : 'Register as Koala'}
        </button>
      </div>

      {status.error && (
        <div className="text-red-500 text-sm mt-2">
          {status.error}
        </div>
      )}

      {status.hash && !isTransactionPending && (
        <div className="text-green-500 text-sm mt-2">
          Registration successful! Please wait for the page to update.
        </div>
      )}

      <div className="text-xs text-gray-500">
        Connected address: {address || 'Not connected'}
      </div>
    </div>
  );
} 