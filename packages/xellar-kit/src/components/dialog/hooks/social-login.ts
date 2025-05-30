/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { getAddress } from 'viem';
import { useConnect } from 'wagmi';

import { useConnector } from '@/hooks/connectors';
import { useXellarContext } from '@/providers/xellar-kit';
import { useBoundStore } from '@/xellar-connector/store';

import {
  AuthSuccessResponse,
  useXellarSDK
} from '../content/passport-content/hooks';
import { useConnectModalStore } from '../store';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useSocialLogin() {
  const setToken = useBoundStore(state => state.setToken);

  const setRefreshToken = useBoundStore(state => state.setRefreshToken);
  const setAddress = useBoundStore(state => state.setAddress);
  const { closeModal, telegramConfig, appleConfig } = useXellarContext();
  const [socialError, setSocialError] = useState('');

  const { connectAsync } = useConnect();

  const connector = useConnector('xellar-passport');

  const { push, setDirection, setIsLoading, setRecoverySecret } =
    useConnectModalStore();
  const { xellarSDK } = useXellarSDK();

  const handleTelegramLogin = () => {
    const scriptUrl = 'https://telegram.org/js/telegram-widget.js';

    if (!telegramConfig) return;
    if (!telegramConfig.enabled) return;
    if (!telegramConfig?.botId) return;
    if (!telegramConfig?.botUsername) return;
    setIsLoading(true);

    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.onload = () => {
      (window as any).Telegram.Login.auth(
        {
          bot_id: telegramConfig.botId,
          request_access: true
        },
        (
          data:
            | false
            | {
                id: number;
                first_name: string;
                last_name: string;
                username: string;
                photo_url: string;
                auth_date: number;
                hash: string;
              }
        ) => {
          if (!data) {
            setIsLoading(false);
            return;
          }

          xellarSDK.auth.telegram
            .authorize({
              botUsername: telegramConfig.botUsername,
              data: {
                auth_date: String(data.auth_date),
                first_name: data.first_name,
                hash: data.hash,
                id: String(data.id),
                last_name: data.last_name,
                photo_url: data.photo_url,
                username: data.username
              }
            })
            .then(async res => {
              const result = res as AuthSuccessResponse;

              if (!result.isWalletCreated) {
                const createWalletResult =
                  await xellarSDK.account.wallet.create({
                    accessToken: result.accessToken
                  });

                setToken(createWalletResult.walletToken);
                setRefreshToken(createWalletResult.refreshToken);
                setRecoverySecret(createWalletResult.secret0);
                setAddress(
                  createWalletResult.address.find(n => n.network === 'evm')
                    ?.address as `0x${string}`
                );

                push('wallet-created');
                setDirection('forward');
                setIsLoading(false);
              } else {
                const address = getAddress(
                  result.addresses.find(n => n.network === 'evm')
                    ?.address as `0x${string}`
                );
                setAddress(address);
                setToken(result.walletToken);
                setRefreshToken(res.refreshToken);
                await wait(200);
                await connectAsync({ connector });

                closeModal();
                closeModal();
                setIsLoading(false);
              }
            })
            .catch(err => {
              setSocialError('Something went wrong');
              setTimeout(() => {
                setSocialError('');
              }, 3000);
              console.error(err);
              setIsLoading(false);
            })
            .finally(() => {
              document.body.removeChild(script);
            });
        }
      );
    };

    document.head.appendChild(script);
  };

  const handleAppleLogin = () => {
    if (!appleConfig) return;
    if (!appleConfig.enabled) return;
    if (!appleConfig?.clientId) return;

    const script = document.createElement('script');
    script.src =
      'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
    script.async = true;
    script.defer = true;

    script.onload = async () => {
      (window as any).AppleID.auth.init({
        clientId: appleConfig.clientId,
        scope: 'name email',
        redirectURI: appleConfig.redirectUri,
        state: 'state',
        usePopup: true
      });

      try {
        setIsLoading(true);
        const result = await (window as any).AppleID.auth.signIn();
        const authorization = result.authorization;
        const idToken = authorization.idToken;

        xellarSDK.auth.apple
          .authorize(idToken)
          .then(async res => {
            const result = res as AuthSuccessResponse;

            if (!result.isWalletCreated) {
              const createWalletResult = await xellarSDK.account.wallet.create({
                accessToken: result.accessToken
              });

              setToken(createWalletResult.walletToken);
              setRefreshToken(createWalletResult.refreshToken);
              setRecoverySecret(createWalletResult.secret0);
              setAddress(
                createWalletResult.address.find(n => n.network === 'evm')
                  ?.address as `0x${string}`
              );

              push('wallet-created');
              setDirection('forward');
              setIsLoading(false);
            } else {
              const address = getAddress(
                result.addresses.find(n => n.network === 'evm')
                  ?.address as `0x${string}`
              );
              setAddress(address);
              setToken(result.walletToken);
              setRefreshToken(res.refreshToken);
              await wait(200);
              await connectAsync({ connector });

              closeModal();
              closeModal();
              setIsLoading(false);
              document.body.removeChild(script);
            }
          })
          .catch(err => {
            console.error(err);
            setSocialError('Something went wrong');
            setTimeout(() => {
              setSocialError('');
            }, 3000);
            setIsLoading(false);
          });
      } catch (error) {
        console.error('error:', error);
        setSocialError('Something went wrong');
        setTimeout(() => {
          setSocialError('');
        }, 3000);
        setIsLoading(false);
      } finally {
        document.body.removeChild(script);
        setIsLoading(false);
      }
    };

    document.body.appendChild(script);
  };

  return {
    handleTelegramLogin,
    handleAppleLogin,
    socialError,
    setSocialError
  };
}
