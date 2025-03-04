import { MailIcon } from '@/assets/mail-icon';
import {
  AppleIcon,
  GoogleIcon,
  TelegramIcon,
  WhatsappIcon
} from '@/assets/socials';
import { SpinnerIcon } from '@/assets/spinner';
import { WalletGroupLight } from '@/assets/wallet-group';
import { useWeb3 } from '@/providers/web3-provider';
import { useXellarContext } from '@/providers/xellar-kit';
import { styled } from '@/styles/styled';

import { useSocialLogin } from '../hooks/social-login';
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
  const {
    telegramConfig,
    googleClientId,
    enableWhatsappLogin,
    appleLoginConfig
  } = useXellarContext();
  const { connect } = useWeb3();

  const uri = connect.getUri();

  const { push, setDirection, direction } = useConnectModalStore();

  const { handleGoogleLogin, handleTelegramLogin, handleAppleLogin } =
    useSocialLogin();

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
          {googleClientId && (
            <WalletItem onClick={() => handleGoogleLogin()}>
              <IconWrapper $size={42} $br={12}>
                <GoogleIcon />
              </IconWrapper>
              <WalletName>Google</WalletName>
            </WalletItem>
          )}
          {telegramConfig && (
            <WalletItem onClick={() => handleTelegramLogin()}>
              <IconWrapper $size={42} $br={12}>
                <TelegramIcon />
              </IconWrapper>
              <WalletName>Telegram</WalletName>
            </WalletItem>
          )}
          {appleLoginConfig && (
            <WalletItem onClick={() => handleAppleLogin()}>
              <IconWrapper $size={42} $br={12}>
                <AppleIcon />
              </IconWrapper>
              <WalletName>Apple</WalletName>
            </WalletItem>
          )}
          {enableWhatsappLogin && (
            <WalletItem
              onClick={() => {
                setDirection('forward');
                push('whatsapp');
              }}
            >
              <IconWrapper $size={42} $br={12}>
                <WhatsappIcon />
              </IconWrapper>
              <WalletName>WhatsApp</WalletName>
            </WalletItem>
          )}

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
            {!uri && <SpinnerIcon />}
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
