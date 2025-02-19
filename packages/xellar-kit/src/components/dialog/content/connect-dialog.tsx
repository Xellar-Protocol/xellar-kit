import { AnimatePresence } from 'motion/react';
import React from 'react';

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
  const { page } = useConnectModalStore();

  return (
    <AnimatePresence mode="wait" initial={false}>
      {page === 'home' && <ConnectDialogHome />}
      {page === 'mail' && <LoginPage />}
      {page === 'otp' && <OTPPage />}
      {page === 'wallet-created' && <WalletCreatedPage />}
    </AnimatePresence>
  );
}
