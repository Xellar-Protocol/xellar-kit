import { AnimatePresence } from 'motion/react';
import { useState } from 'react';

import { styled } from '@/styles/styled';

import { LoginPage } from './login-page';
import { OTPPage } from './otp-page';
import { WalletCreatedPage } from './wallet-created-page';

type Content = 'LOGIN' | 'OTP' | 'WALLET_CREATED';

export function PassportContent({
  showBackButton = false,
  onBack
}: {
  showBackButton?: boolean;
  onBack?: () => void;
}) {
  const [content, setContent] = useState<Content>('LOGIN');
  const [codeVerifier, setCodeVerifier] = useState<string | null>(null);
  const [recoverySecret, setRecoverySecret] = useState<string | null>(null);

  return (
    <AnimatePresence mode="wait">
      {content === 'LOGIN' && (
        <LoginPage
          key="login"
          onComplete={c => {
            setContent('OTP');
            setCodeVerifier(c);
          }}
          onBack={onBack}
          showBackButton={showBackButton}
        />
      )}
      {content === 'OTP' && codeVerifier && (
        <OTPPage
          key="otp"
          onBack={() => setContent('LOGIN')}
          codeVerifier={codeVerifier}
          onComplete={authRes => {
            if (authRes.isNewWalletCreated && authRes.recoverySecret) {
              setContent('WALLET_CREATED');
              setRecoverySecret(authRes.recoverySecret);
            }
          }}
        />
      )}
      {content === 'WALLET_CREATED' && recoverySecret && (
        <WalletCreatedPage
          key="wallet-created"
          recoverySecret={recoverySecret}
        />
      )}
    </AnimatePresence>
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

  svg {
    width: 50% !important;
    height: auto !important;
  }
`;
