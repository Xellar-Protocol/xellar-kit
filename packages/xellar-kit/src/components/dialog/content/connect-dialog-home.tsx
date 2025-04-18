/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useConnect } from 'wagmi';

import { KeyIcon, MailIcon } from '@/assets/mail-icon';
import { AppleIcon, TelegramIcon, WhatsappIcon } from '@/assets/socials';
import { SpinnerIcon } from '@/assets/spinner';
import { XellarBrand } from '@/assets/xellar-brand';
import { StyledButton } from '@/components/ui/button';
import { SocialItem } from '@/components/ui/social-item';
import { TextInput } from '@/components/ui/text-input';
import { useConnector } from '@/hooks/connectors';
import { useWeb3 } from '@/providers/web3-provider';
import { useXellarContext } from '@/providers/xellar-kit';
import { styled } from '@/styles/styled';
import { isMobile, isMobileDevice } from '@/utils/is-mobile';
import { useWallets } from '@/wallets/use-wallet';
import { useBoundStore } from '@/xellar-connector/store';

import { useSocialLogin } from '../hooks/social-login';
import { useConnectModalStore } from '../store';
import { GoogleLoginItem } from './google-login-item';
import { useXellarSDK } from './passport-content/hooks';
import { AddressResponse } from './passport-content/otp-page';
import { Container, Title, Wrapper } from './styled';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function ConnectDialogHome() {
  const {
    telegramConfig,
    googleConfig,
    whatsappConfig,
    appleConfig,
    useEmailLogin,
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
    setWallet,
    setRecoverySecret
  } = useConnectModalStore();

  const setToken = useBoundStore(state => state.setToken);
  const setRefreshToken = useBoundStore(state => state.setRefreshToken);
  const setAddress = useBoundStore(state => state.setAddress);
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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [isEmail, setIsEmail] = useState(false);

  const { connect, connectAsync } = useConnect();

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isValidEmail) {
      setIsValidEmail(true);
    }

    setEmail(e.target.value);
  };

  const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const wallets = useWallets();
  const connector = useConnector('xellar-passport');

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

  const handleRegister = async () => {
    try {
      if (isLoading) return;
      if (!username || !password) {
        setSocialError('Please enter your username and password');
        setTimeout(() => {
          setSocialError('');
        }, 3000);
        return;
      }

      setIsLoading(true);
      const result = await xellarSDK.auth.username.register(username, password);
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

      await connectAsync({ connector });

      push('wallet-created');
      setDirection('forward');

      setIsLoading(false);
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

  const handleSignInUsernamePassword = async () => {
    try {
      if (isLoading) return;
      if (!username || !password) {
        setSocialError('Please enter your username and password');
        setTimeout(() => {
          setSocialError('');
        }, 3000);
        return;
      }

      setIsLoading(true);
      const result = await xellarSDK.auth.username.login(username, password);
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

        await connectAsync({ connector });

        push('wallet-created');
        setDirection('forward');
      } else {
        setToken(result.walletToken);
        setRefreshToken(result.refreshToken);
        await wait(500);

        const address = (
          result as unknown as { addresses: AddressResponse[] }
        ).addresses.find(n => n.network === 'evm')?.address;

        if (address) {
          setAddress(address as `0x${string}`);
        }

        await connectAsync({ connector });
        closeModal();
        window.location.reload();
      }
      setIsLoading(false);
    } catch (error: any) {
      if (
        error?.message
          ?.toLowerCase()
          ?.includes('username or password is incorrect')
      ) {
        handleRegister();
        return;
      }

      setSocialError(
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong'
      );
      setTimeout(() => {
        setSocialError('');
      }, 3000);

      console.log(error?.message);
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
            {/* {useEmailLogin && ( */}
            <SocialItem
              style={{ flex: 1 }}
              onClick={() => {
                setIsEmail(!isEmail);
              }}
            >
              {isEmail ? (
                <KeyIcon
                  style={{
                    width: isMobile() ? 16 : 24,
                    height: isMobile() ? 16 : 24
                  }}
                />
              ) : (
                <MailIcon
                  style={{
                    width: isMobile() ? 16 : 24,
                    height: isMobile() ? 16 : 24
                  }}
                />
              )}
            </SocialItem>
            {/* )} */}
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

            {!isMobile() &&
              wallets
                .filter(wallet => wallet.connector.type === 'injected')
                .slice(0, 2)
                .map(_wallet => (
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

          {!isEmail && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <TextInput
                placeholder="Enter your username"
                value={username}
                onChange={handleChangeUsername}
              />

              <TextInput
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={handleChangePassword}
              />
            </div>
          )}

          {isEmail && (
            <TextInput
              placeholder="Enter your email"
              value={email}
              onChange={handleChangeEmail}
            />
          )}
          {!isValidEmail && <ErrorText>Invalid email</ErrorText>}
          {socialError && <ErrorText>{socialError}</ErrorText>}
          <StyledButton
            variant="primary"
            onClick={() => {
              if (isEmail) {
                handleSignIn();
              } else {
                handleSignInUsernamePassword();
              }
            }}
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
  margin-top: 12px;
  margin-bottom: 0;
  text-align: center;
`;
