import { useQuery } from '@tanstack/react-query';
import { EstimateSignTransactionOptions } from '@xellar/sdk';
import { useCallback } from 'react';
import { useAccount, useSignMessage } from 'wagmi';

import { useXellarSDK } from '@/components/dialog/content/passport-content/hooks';
import { useXellarContext } from '@/providers/xellar-kit';

import { useAppConfig } from './use-app-config';

export function useSmartAccount() {
  const { useSmartAccount } = useXellarContext();
  const { xellarSDK } = useXellarSDK();
  const { address } = useAccount();
  const { data } = useAppConfig();

  const { signMessageAsync } = useSignMessage();

  const getOrCreateAccount = useCallback(async () => {
    if (!address) {
      return;
    }

    const result = await xellarSDK.accountAbstraction.auth.createAccount(
      {
        owner: {
          id: address,
          provider: 'wallet'
        }
      },
      {
        headers: {
          'x-referer': 'xellar-kit'
        }
      }
    );

    return result;
  }, [address, xellarSDK]);

  const { data: smartAccount } = useQuery({
    queryKey: ['get-smart-account', address],
    queryFn: getOrCreateAccount,
    enabled: !!address && !!data?.data?.isAAEnabled && useSmartAccount
  });

  const activateAccount = async (accountId: string) => {
    const result = await xellarSDK.accountAbstraction.create.activate(
      accountId,
      {
        headers: {
          'x-referer': 'xellar-kit'
        }
      }
    );

    const hash = result.hash;
    const opId = result.userOpId;

    const signature = await signMessageAsync({
      message: hash
    });

    const submitResult = await xellarSDK.accountAbstraction.submitUserOp(
      {
        hash,
        userOpId: opId,
        signature: signature,
        isSponsored: true
      },
      {
        headers: {
          'x-referer': 'xellar-kit'
        }
      }
    );

    return submitResult;
  };

  async function signTransaction(params: EstimateSignTransactionOptions) {
    const result = await xellarSDK.accountAbstraction.create.signTransaction(
      params,
      {
        headers: {
          'x-referer': 'xellar-kit'
        }
      }
    );

    const hash = result.hash;
    const opId = result.userOpId;

    const signature = await signMessageAsync({
      message: hash
    });

    const submitResult = await xellarSDK.accountAbstraction.submitUserOp(
      {
        hash,
        userOpId: opId,
        signature: signature,
        isSponsored: true
      },
      {
        headers: {
          'x-referer': 'xellar-kit'
        }
      }
    );

    return submitResult;
  }

  return { getOrCreateAccount, activateAccount, signTransaction, smartAccount };
}
