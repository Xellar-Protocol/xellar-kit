import { AnimatePresence, motion } from 'motion/react';
import React from 'react';
import styled from 'styled-components';

import { SpinnerIcon } from '@/assets/spinner';

import { useConnectModalStore } from '../store';
import { WalletCreatedPage } from './passport-content/wallet-created-page';
const ConnectDialogHome = React.lazy(() =>
  import('./connect-dialog-home').then(module => ({
    default: module.ConnectDialogHome
  }))
);

const LoginPage = React.lazy(() =>
  import('./passport-content/login-page').then(module => ({
    default: module.LoginPage
  }))
);

const OTPPage = React.lazy(() =>
  import('./passport-content/otp-page').then(module => ({
    default: module.OTPPage
  }))
);

export function ConnectDialogContent() {
  const { page, isLoading } = useConnectModalStore();

  return (
    <Cointainer>
      <AnimatePresence mode="wait" initial={false}>
        {page === 'home' && <ConnectDialogHome />}
        {page === 'mail' && <LoginPage />}
        {page === 'otp' && <OTPPage />}
        {page === 'wallet-created' && <WalletCreatedPage />}
      </AnimatePresence>

      <AnimatePresence>
        {isLoading && (
          <LoadingContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SpinnerIcon />
          </LoadingContainer>
        )}
      </AnimatePresence>
    </Cointainer>
  );
}

const Cointainer = styled.div`
  position: relative;
`;

const LoadingContainer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(1px);
  display: flex;
  align-items: center;
  justify-content: center;
`;
