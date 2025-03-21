import { useState } from 'react';

import { BackIcon } from '@/assets/back-icon';
import { SpinnerIcon } from '@/assets/spinner';
import { styled } from '@/styles/styled';

import { useConnectModalStore } from '../../store';
import { AnimatedContainer, Description } from '../styled';
import { useXellarSDK } from './hooks';
import {
  BackButton,
  Header,
  PassportButton,
  PassportContainer,
  RootContainer,
  TextInput,
  Title
} from './styled';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const { back, direction, setCodeVerifier, push, setOtpType } =
    useConnectModalStore();

  const handleBack = () => {
    back();
  };

  const getAnimationProps = () => ({
    initial: {
      opacity: 0,
      x: direction === 'back' ? -200 : 200
    },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: direction === 'back' ? 200 : -200 }
  });

  const { xellarSDK } = useXellarSDK();

  const [email, setEmail] = useState('');
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
      setOtpType('email');
      push('otp');
    } catch (error) {
      console.log({ error });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedContainer
      {...getAnimationProps()}
      transition={{
        duration: 0.2,
        type: 'spring',
        bounce: 0
      }}
    >
      <RootContainer>
        <Header>
          <BackButton role="button" onClick={handleBack}>
            <BackIcon width={16} height={16} />
          </BackButton>
          <Title>Email Login</Title>
        </Header>

        <Description style={{ margin: 0, marginTop: 24, textAlign: 'left' }}>
          Enter your email to sign in to your account
        </Description>

        <PassportContainer style={{ height: 200, paddingTop: 24 }}>
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}
          >
            <TextInput
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleChangeEmail}
              onKeyDown={e => {
                const isEnterKey = e.key === 'Enter';
                if (isEnterKey) {
                  handleSignIn();
                }
              }}
            />
            {!isValidEmail && <ErrorText>Invalid email</ErrorText>}{' '}
            <PassportButton
              onClick={handleSignIn}
              style={{ marginTop: 'auto' }}
              aria-disabled={isLoading}
            >
              {isLoading ? <SpinnerIcon /> : 'Sign In'}
            </PassportButton>
          </div>
        </PassportContainer>
      </RootContainer>
    </AnimatedContainer>
  );
}

export const IconWrapper = styled.div`
  width: 42px;
  height: 42px;
  border: 1px solid ${({ theme }) => theme.colors.BORDER};
  background-color: ${({ theme }) => theme.colors.BACKGROUND};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.TEXT};
  cursor: pointer;

  svg {
    width: 50% !important;
    height: auto !important;
  }
`;

IconWrapper.defaultProps = {
  role: 'button'
};

const ErrorText = styled.p`
  color: #ff0000;
  font-size: 12px;
  margin-top: 8px;
  margin-left: 2px;
  max-width: 170px;
`;
