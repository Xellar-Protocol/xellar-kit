/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useConnect } from 'wagmi';

import { AppleIcon, TelegramIcon, WhatsappIcon } from '@/assets/socials';
import { SpinnerIcon } from '@/assets/spinner';
import { XellarBrand } from '@/assets/xellar-brand';
import { StyledButton } from '@/components/ui/button';
import { SocialItem } from '@/components/ui/social-item';
import { TextInput } from '@/components/ui/text-input';
import { useWeb3 } from '@/providers/web3-provider';
import { useXellarContext } from '@/providers/xellar-kit';
import { styled } from '@/styles/styled';
import { isMobile, isMobileDevice } from '@/utils/is-mobile';
import { useWallets } from '@/wallets/use-wallet';

import { useSocialLogin } from '../hooks/social-login';
import { useConnectModalStore } from '../store';
import { GoogleLoginItem } from './google-login-item';
import { useXellarSDK } from './passport-content/hooks';
import { Container, IconWrapper, Title, Wrapper } from './styled';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ConnectDialogHome() {
  const {
    telegramConfig,
    googleConfig,
    whatsappConfig,
    appleConfig,
    closeModal
  } = useXellarContext();

  const {
    push,
    setDirection,
    direction,
    setCodeVerifier,
    setOtpType,
    setEmail: setEmailStore,
    email: emailStore,
    setWallet
  } = useConnectModalStore();

  const { handleTelegramLogin, handleAppleLogin, socialError, setSocialError } =
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

  const { connect } = useConnect();

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isValidEmail) {
      setIsValidEmail(true);
    }

    setEmail(e.target.value);
  };

  const wallets = useWallets();

  const { connect: web3connect } = useWeb3();

  const uri = web3connect.getUri();

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
    } catch (error: any) {
      setSocialError(
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong'
      );
      setTimeout(() => {
        setSocialError('');
      }, 3000);

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
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <XellarBrand color="white" size={100} />
        </div>
        <Title style={{ textAlign: 'center', marginTop: 32 }}>
          Login or Sign Up
        </Title>
        <Description>
          Control anything through the dashboard. Especially built for you
        </Description>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <SocialList>
            {googleConfig?.enabled && (
              <GoogleLoginItem onError={setSocialError} />
            )}
            {telegramConfig?.enabled && (
              <SocialItem
                style={{ flex: 1 }}
                onClick={() => handleTelegramLogin()}
              >
                <TelegramIcon />
              </SocialItem>
            )}
            {appleConfig?.enabled && (
              <SocialItem
                style={{ flex: 1 }}
                onClick={() => handleAppleLogin()}
              >
                <AppleIcon />
              </SocialItem>
            )}
            {whatsappConfig?.enabled && (
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

            {wallets.slice(0, 2).map(_wallet => (
              <SocialItem
                style={{ flex: 1 }}
                key={_wallet.id}
                onClick={() => {
                  if (_wallet.connector.type === 'injected') {
                    if (
                      _wallet.id.toLowerCase().includes('metamask') &&
                      _wallet.isInstalled
                    ) {
                      connect(
                        { connector: _wallet.connector },
                        {
                          onSuccess: () => {
                            closeModal();
                          }
                        }
                      );
                      return;
                    }
                  }

                  if (isMobileDevice()) {
                    if (
                      _wallet.id === 'walletConnect' ||
                      _wallet.id === 'reown'
                    ) {
                      open();
                      return;
                    }

                    const deeplink = _wallet?.getWalletConnectDeeplink
                      ? _wallet.getWalletConnectDeeplink(uri)
                      : null;

                    if (deeplink) {
                      const anchor = document.createElement('a');
                      anchor.href = deeplink;
                      anchor.click();
                    }

                    return;
                  }

                  setWallet(_wallet);
                  setTimeout(() => {
                    setDirection('forward');
                    push('qr-code');
                  }, 100);
                }}
              >
                {_wallet.icon}
              </SocialItem>
            ))}

            <SocialItem
              style={{ flex: 2 }}
              onClick={() => {
                setDirection('forward');
                push('wallet');
              }}
            >
              <p>More Options</p>
            </SocialItem>
          </SocialList>

          <Or>Or</Or>

          <TextInput
            placeholder="Enter your email"
            value={email}
            onChange={handleChangeEmail}
          />
          {!isValidEmail && <ErrorText>Invalid email</ErrorText>}
          {socialError && <ErrorText>{socialError}</ErrorText>}
          <StyledButton
            variant="primary"
            onClick={handleSignIn}
            style={{ marginTop: 8 }}
          >
            {isLoading ? <SpinnerIcon /> : 'Continue'}
          </StyledButton>
        </div>
      </Container>
    </Wrapper>
  );
}

const Description = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.TEXT_SECONDARY};
  margin-bottom: 16px;
  text-align: center;
  max-width: 200px;
  margin: 0 auto;
`;

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
  margin-top: 16px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.TEXT_SECONDARY};
`;

const ErrorText = styled.p`
  color: #ff4040;
  font-size: 12px;
  margin-left: 2px;
  margin-top: 0;
  margin-bottom: 0;
  max-width: 180px;
`;
