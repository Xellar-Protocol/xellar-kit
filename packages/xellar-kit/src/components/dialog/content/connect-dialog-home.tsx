import { useGoogleLogin } from '@react-oauth/google';
import styled from 'styled-components';

import { MailIcon } from '@/assets/mail-icon';
import { AppleIcon, GoogleIcon, TelegramIcon } from '@/assets/socials';
import { WalletGroupLight } from '@/assets/wallet-group';
import { useConnector } from '@/hooks/connectors';
import { useXellarContext } from '@/providers/xellar-kit';
import { useBoundStore } from '@/xellar-connector/store';

import { useConnectModalStore } from '../store';
import { useXellarSDK } from './passport-content/hooks';
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

export function ConnectDialogHome() {
  const setToken = useBoundStore(state => state.setToken);
  const setRefreshToken = useBoundStore(state => state.setRefreshToken);
  const setAddress = useBoundStore(state => state.setAddress);
  const { closeModal } = useXellarContext();

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

        await connector.connect();

        push('wallet-created');
        setDirection('forward');
        setIsLoading(false);

        return;
      }

      const address = result.data.addresses.find(n => n.network === 'evm')
        ?.address as `0x${string}`;

      if (address) {
        setAddress(address);
      }

      setToken(result.data.walletToken);
      setRefreshToken(result.data.refreshToken);

      await connector.connect();

      closeModal();

      setIsLoading(false);
    }
  });

  return (
    <Wrapper
      {...getAnimationProps()}
      transition={{
        duration: 0.3,
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
          <WalletItem>
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
