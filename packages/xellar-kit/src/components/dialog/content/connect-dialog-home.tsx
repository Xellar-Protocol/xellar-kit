import { useState } from 'react';

import {
  AppleIcon,
  GoogleIcon,
  TelegramIcon,
  WhatsappIcon
} from '@/assets/socials';
import { StyledButton } from '@/components/ui/button';
import { SocialItem } from '@/components/ui/social-item';
import { TextInput } from '@/components/ui/text-input';
import { useXellarContext } from '@/providers/xellar-kit';
import { styled } from '@/styles/styled';
import { isMobile } from '@/utils/is-mobile';

import { useSocialLogin } from '../hooks/social-login';
import { useConnectModalStore } from '../store';
import { useXellarSDK } from './passport-content/hooks';
import { Container, Title, Wrapper } from './styled';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ConnectDialogHome() {
  const {
    telegramConfig,
    googleClientId,
    enableWhatsappLogin,
    appleLoginConfig
  } = useXellarContext();

  const {
    push,
    setDirection,
    direction,
    setCodeVerifier,
    setOtpType,
    setEmail: setEmailStore,
    email: emailStore
  } = useConnectModalStore();

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

  const { xellarSDK } = useXellarSDK();

  const [email, setEmail] = useState(emailStore || '');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isValidEmail) {
      setIsValidEmail(true);
    }

    setEmail(e.target.value);
  };

  const handleSignIn = async () => {
    try {
      if (isLoading) return;
      if (!emailRegex.test(email)) {
        setIsValidEmail(false);
        return;
      }

      setIsLoading(true);
      const result = await xellarSDK.auth.email.login(email);
      setIsLoading(false);
      setCodeVerifier(result);
      setEmailStore(email);
      setOtpType('email');
      push('otp');
    } catch (error) {
      console.log({ error });
    } finally {
      setIsLoading(false);
    }
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
      <Container $isMobile={isMobile()}>
        <Title>Sign Up</Title>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <SocialList>
            {googleClientId && (
              <SocialItem
                style={{ flex: 1 }}
                onClick={() => handleGoogleLogin()}
              >
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
              <SocialItem
                style={{ flex: 1 }}
                onClick={() => handleAppleLogin()}
              >
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

          <TextInput
            placeholder="Enter your email"
            value={email}
            onChange={handleChangeEmail}
          />
          {!isValidEmail && <ErrorText>Invalid email</ErrorText>}
          <StyledButton
            variant="primary"
            onClick={handleSignIn}
            style={{ marginTop: 8 }}
          >
            Continue
          </StyledButton>

          <Or>Or</Or>

          <StyledButton
            variant="outline"
            onClick={() => {
              setDirection('forward');
              push('wallet');
            }}
          >
            Connect Wallet
          </StyledButton>
        </div>
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
  margin-top: 16px;
`;

const Or = styled.p`
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.TEXT_SECONDARY};
`;

const ErrorText = styled.p`
  color: #ff4040;
  font-size: 12px;
  margin-left: 2px;
  margin-top: 0;
  margin-bottom: 0;
`;
