import { useCallback } from 'react';
import { useAccount, useSendTransaction } from 'wagmi';

import { useXellarSDK } from '@/components/dialog/content/passport-content/hooks';
import { useBoundStore, useXellarAccountStore } from '@/xellar-connector/store';
import { showNeedPermissionConfirmation } from '@/xellar-connector/transaction-confirmation';

function getStoreState() {
  const token = useBoundStore.getState().token;
  const refreshToken = useBoundStore.getState().refreshToken;
  const chainId = useBoundStore.getState().chainId;

  if (!token || !refreshToken) {
    throw new Error('No token found');
  }

  if (!chainId) {
    throw new Error('No chainId found');
  }

  return { token, refreshToken, chainId };
}

export function useSignAuthorization() {
  const { xellarSDK } = useXellarSDK();
  const { sendTransactionAsync } = useSendTransaction();
  const { address } = useAccount();
  const signAuthorization = useCallback(
    async (
      chainId: string | number,
      contractAddress: string,
      executor?: string
    ) => {
      const { refreshToken, token } = getStoreState();

      const isPermissionGranted =
        useXellarAccountStore.getState().account?.isPermissionGranted;

      if (isPermissionGranted === false) {
        showNeedPermissionConfirmation();
        return;
      }

      const result = await xellarSDK.wallet.signAuthorization({
        walletToken: token,
        refreshToken,
        chainId,
        contractAddress,
        executor: executor ?? 'self'
      });

      useBoundStore.setState({
        refreshToken: result.refreshToken,
        token: result.walletToken
      });

      return result;
    },
    [xellarSDK]
  );

  const resetAuthorization = useCallback(
    async (chainId: string | number, executor?: string) => {
      const { refreshToken, token } = getStoreState();

      const isPermissionGranted =
        useXellarAccountStore.getState().account?.isPermissionGranted;

      if (isPermissionGranted === false) {
        showNeedPermissionConfirmation();
        return;
      }

      const authResult = await xellarSDK.wallet.signAuthorization({
        walletToken: token,
        refreshToken,
        chainId,
        contractAddress: '0x0000000000000000000000000000000000000000',
        executor: executor ?? 'self'
      });

      useBoundStore.setState({
        refreshToken: authResult.refreshToken,
        token: authResult.walletToken
      });

      await sendTransactionAsync({
        authorizationList: [
          {
            chainId: authResult.authorization.chainId,
            contractAddress: authResult.authorization.address as `0x${string}`,
            nonce: authResult.authorization.nonce,
            r: authResult.authorization.r as `0x${string}`,
            s: authResult.authorization.s as `0x${string}`,
            yParity: authResult.authorization.yParity
          }
        ],
        data: '0x',
        to: address as `0x${string}`
      });
    },
    [address, sendTransactionAsync, xellarSDK.wallet]
  );

  return {
    signAuthorization,
    resetAuthorization
  };
}
