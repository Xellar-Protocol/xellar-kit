import styled from 'styled-components';

import {
  AppleIcon,
  GoogleIcon,
  TelegramIcon,
  WhatsappIcon
} from '@/assets/socials';
import { StyledButton } from '@/components/ui/button';
import { SocialItem } from '@/components/ui/social-item';
import { TextInput } from '@/components/ui/text-input';
import { useWeb3 } from '@/providers/web3-provider';
import { useXellarContext } from '@/providers/xellar-kit';

import { useSocialLogin } from '../hooks/social-login';
import { useConnectModalStore } from '../store';
import { Container, Description, Separator, Title, Wrapper } from './styled';

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
        <Title>Sign Up</Title>
        <Separator />

        <Description>
          You can use social account to instantly connect with your wallet or
          use your existing web3 wallets
        </Description>
        <SocialList>
          {googleClientId && (
            <SocialItem style={{ flex: 1 }} onClick={() => handleGoogleLogin()}>
              <GoogleIcon />
            </SocialItem>
          )}
          {telegramConfig && (
            <SocialItem
              style={{ flex: 1 }}
              onClick={() => handleTelegramLogin()}
            >
              <TelegramIcon />
            </SocialItem>
          )}
          {appleLoginConfig && (
            <SocialItem style={{ flex: 1 }} onClick={() => handleAppleLogin()}>
              <AppleIcon />
            </SocialItem>
          )}
          {enableWhatsappLogin && (
            <SocialItem
              style={{ flex: 1 }}
              onClick={() => {
                setDirection('forward');
                push('whatsapp');
              }}
            >
              <WhatsappIcon />
            </SocialItem>
          )}
        </SocialList>

        <TextInput placeholder="Enter your email" />
        <StyledButton>Sign Up</StyledButton>
      </Container>
    </Wrapper>
  );
}

const SocialList = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding-bottom: 8px;
`;
