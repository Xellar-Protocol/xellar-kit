import styled from 'styled-components';

import { MailIcon } from '@/assets/mail-icon';
import { AppleIcon, GoogleIcon, TelegramIcon } from '@/assets/socials';
import { WalletGroupLight } from '@/assets/wallet-group';

import { useConnectModalStore } from '../store';
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
  const { push, setDirection, direction } = useConnectModalStore();

  const getAnimationProps = () => ({
    initial: {
      opacity: 0,
      x: direction === 'back' ? -200 : 200
    },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: direction === 'back' ? 200 : -200 }
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
          <WalletItem>
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
