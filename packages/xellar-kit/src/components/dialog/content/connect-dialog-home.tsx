/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGoogleLogin } from '@react-oauth/google';
import styled from 'styled-components';
import { getAddress } from 'viem';
import { useConnect } from 'wagmi';

import { MailIcon } from '@/assets/mail-icon';
import {
  AppleIcon,
  GoogleIcon,
  TelegramIcon,
  WhatsappIcon
} from '@/assets/socials';
import { WalletGroupLight } from '@/assets/wallet-group';
import { useConnector } from '@/hooks/connectors';
import { useWeb3 } from '@/providers/web3-provider';
import { useXellarContext } from '@/providers/xellar-kit';
import { useBoundStore } from '@/xellar-connector/store';

import { useConnectModalStore } from '../store';
import { AuthSuccessResponse, useXellarSDK } from './passport-content/hooks';
import {
  Container,
  Description,
  IconWrapper,
  Separator,
  Title,
  TitleSpan,
  WalletItem,
  WalletName,
  Wrapper
} from './styled';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function ConnectDialogHome() {
  const setToken = useBoundStore(state => state.setToken);
  const setRefreshToken = useBoundStore(state => state.setRefreshToken);
  const setAddress = useBoundStore(state => state.setAddress);
  const { closeModal, telegramConfig } = useXellarContext();
  const { connect } = useWeb3();

  const uri = connect.getUri();

  const { connectAsync } = useConnect();

  const connector = useConnector('xellar-passport');

  const { push, setDirection, direction, setIsLoading, setRecoverySecret } =
    useConnectModalStore();
  const { xellarSDK, verifyGoogle } = useXellarSDK();

  const getAnimationProps = () => ({
    initial: {
      opacity: 0,
      x: direction === 'back' ? -200 : 200
    },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: direction === 'back' ? 200 : -200 }
  });

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
    }
  });

  const handleTelegramLogin = () => {
    const scriptUrl = 'https://telegram.org/js/telegram-widget.js';

    if (!telegramConfig) return;
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
                await connectAsync({ connector });

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
              console.error(err);
              setIsLoading(false);
            });
        }
      );
    };

    document.head.appendChild(script);
  };

  return (
    <Wrapper
      {...getAnimationProps()}
      transition={{
        duration: 0.2,
        type: 'spring',
        bounce: 0
      }}
    >
      <Container $isMobile={false}>
        <Title>
          Connect <TitleSpan>Wallet</TitleSpan>
        </Title>
        <Separator />

        <Description>
          You can use social account to instantly connect with your wallet or
          use your existing web3 wallets
        </Description>

        <ConnectorList>
          <WalletItem
            onClick={() => {
              setDirection('forward');
              push('mail');
            }}
          >
            <IconWrapper $size={42} $br={12}>
              <MailIcon />
            </IconWrapper>
            <WalletName>Email</WalletName>
          </WalletItem>
          <WalletItem onClick={() => handleGoogleLogin()}>
            <IconWrapper $size={42} $br={12}>
              <GoogleIcon />
            </IconWrapper>
            <WalletName>Google</WalletName>
          </WalletItem>
          <WalletItem onClick={() => handleTelegramLogin()}>
            <IconWrapper $size={42} $br={12}>
              <TelegramIcon />
            </IconWrapper>
            <WalletName>Telegram</WalletName>
          </WalletItem>
          <WalletItem>
            <IconWrapper $size={42} $br={12}>
              <AppleIcon />
            </IconWrapper>
            <WalletName>Apple</WalletName>
          </WalletItem>
          <WalletItem>
            <IconWrapper $size={42} $br={12}>
              <WhatsappIcon />
            </IconWrapper>
            <WalletName>WhatsApp</WalletName>
          </WalletItem>

          <WalletItem
            style={{
              opacity: !uri ? 0.5 : 1
            }}
            onClick={() => {
              if (!uri) {
                return;
              }
              setDirection('forward');
              push('wallet');
            }}
          >
            <IconWrapper $size={42} $br={12}>
              <WalletGroupLight width={20} height={20} />
            </IconWrapper>
            <WalletName>Web3 Wallets</WalletName>
          </WalletItem>
        </ConnectorList>
      </Container>
    </Wrapper>
  );
}

const ConnectorList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;
