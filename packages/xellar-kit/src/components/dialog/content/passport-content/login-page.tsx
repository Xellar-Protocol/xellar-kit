import { useState } from 'react';
import styled from 'styled-components';

import { BackIcon } from '@/assets/back-icon';
import { SpinnerIcon } from '@/assets/spinner';

import { AnimatedContainer } from '../styled';
import { useXellarSDK } from './hooks';
import {
  BackButton,
  Header,
  // IconsContainer,
  InnerContainer,
  PassportButton,
  PassportContainer,
  PassportTitle,
  RootContainer,
  TextInput
} from './styled';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface LoginPageProps {
  onComplete: (codeVerifier: string) => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

export function LoginPage({
  onComplete,
  onBack,
  showBackButton = false
}: LoginPageProps) {
  const xellarSDK = useXellarSDK();

  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  // const

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
      onComplete(result);
    } catch (error) {
      console.log({ error });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedContainer
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      <RootContainer>
        {showBackButton && (
          <Header>
            <BackButton role="button" onClick={onBack}>
              <BackIcon width={16} height={16} />
            </BackButton>
          </Header>
        )}

        <PassportContainer>
          <PassportTitle style={{ textAlign: 'center', maxWidth: 240 }}>
            The gateway to <span style={{ color: '#01CFEA' }}>manage</span>{' '}
            everything in your <span style={{ color: '#FF1CF7' }}>wallet</span>
          </PassportTitle>

          <InnerContainer>
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <TextInput
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleChangeEmail}
              />
              {!isValidEmail && <ErrorText>Invalid email</ErrorText>}{' '}
              <PassportButton
                onClick={handleSignIn}
                style={{ marginTop: 12 }}
                aria-disabled={isLoading}
              >
                {isLoading ? <SpinnerIcon /> : 'Sign In'}
              </PassportButton>
            </div>
          </InnerContainer>
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
  margin-top: 4px;
`;
