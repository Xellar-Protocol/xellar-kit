import { useGoogleLogin } from '@react-oauth/google';
import React from 'react';
import { getAddress } from 'viem';
import { useConnect } from 'wagmi';

import { GoogleIcon } from '@/assets/socials';
import { SocialItem } from '@/components/ui/social-item';
import { useConnector } from '@/hooks/connectors';
import { useXellarContext } from '@/providers/xellar-kit';
import { useBoundStore } from '@/xellar-connector/store';

import { useConnectModalStore } from '../store';
import { useXellarSDK } from './passport-content/hooks';

interface GoogleLoginItemProps {
  onError: (error: string) => void;
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function GoogleLoginItem({ onError }: GoogleLoginItemProps) {
  const { push, setDirection, setIsLoading, setRecoverySecret } =
    useConnectModalStore();

  const { xellarSDK, verifyGoogle } = useXellarSDK();

  const setToken = useBoundStore(state => state.setToken);
  const setRefreshToken = useBoundStore(state => state.setRefreshToken);
  const setAddress = useBoundStore(state => state.setAddress);
  const { closeModal } = useXellarContext();

  const { connectAsync } = useConnect();

  const connector = useConnector('xellar-passport');

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      setIsLoading(true);
      const result = await verifyGoogle(access_token);

      if (!result.data.isWalletCreated) {
        const createWalletResult = await xellarSDK.account.wallet.create({
          accessToken: result.data.accessToken
        });

        setToken(createWalletResult.walletToken);
        setRefreshToken(createWalletResult.refreshToken);
        setRecoverySecret(createWalletResult.secret0);
        setAddress(
          createWalletResult.address.find(n => n.network === 'evm')
            ?.address as `0x${string}`
        );
        await connectAsync({ connector });

        push('wallet-created');
        setDirection('forward');
        setIsLoading(false);
      } else {
        const address = getAddress(
          result.data.addresses.find(n => n.network === 'evm')
            ?.address as `0x${string}`
        );
        setAddress(address);
        setToken(result.data.walletToken);
        setRefreshToken(result.data.refreshToken);

        await wait(200);
        await connectAsync({ connector });

        closeModal();
        closeModal();
        setIsLoading(false);
      }
    },
    onError: error => {
      onError('Something went wrong');
      setTimeout(() => {
        onError('');
      }, 3000);
      console.error(error);
      setIsLoading(false);
    }
  });

  return (
    <SocialItem style={{ flex: 1 }} onClick={() => handleGoogleLogin()}>
      <GoogleIcon />
    </SocialItem>
  );
}
