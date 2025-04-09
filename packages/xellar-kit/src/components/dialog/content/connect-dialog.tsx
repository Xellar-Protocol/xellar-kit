import { AnimatePresence, motion } from 'motion/react';

import { SpinnerIcon } from '@/assets/spinner';
import { Footer } from '@/components/ui/footer';
import { useAppConfig } from '@/hooks/use-app-config';
import { styled } from '@/styles/styled';

import { useConnectModalStore } from '../store';
import { ConnectDialogHome } from './connect-dialog-home';
import { ConnectDialogWalletList } from './connect-dialog-wallet-list';
import { LoginPage } from './passport-content/login-page';
import { OTPPage } from './passport-content/otp-page';
import { WalletCreatedPage } from './passport-content/wallet-created-page';
import { WhatsappLoginPage } from './passport-content/whatsapp-login';
import { QRCodePage } from './qr-code-page';

export function ConnectDialogContent() {
  const { page, isLoading } = useConnectModalStore();

  const { isLoading: isAppConfigLoading } = useAppConfig();

  return (
    <Cointainer>
      <AnimatePresence mode="wait" initial={false}>
        {isAppConfigLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              width: 280,
              height: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <SpinnerIcon />
          </motion.div>
        ) : (
          <>
            {page === 'home' && <ConnectDialogHome />}
            {page === 'mail' && <LoginPage />}
            {page === 'otp' && <OTPPage />}
            {page === 'wallet-created' && <WalletCreatedPage />}
            {page === 'wallet' && <ConnectDialogWalletList />}
            {page === 'whatsapp' && <WhatsappLoginPage />}
            {page === 'qr-code' && <QRCodePage />}
          </>
        )}
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
  overflow: hidden;
`;

const LoadingContainer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: transparent;
  backdrop-filter: blur(1px);
  display: flex;
  align-items: center;
  justify-content: center;
`;
