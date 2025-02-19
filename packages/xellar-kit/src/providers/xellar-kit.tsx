/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleOAuthProvider } from '@react-oauth/google';
import React, {
  createContext,
  createElement,
  Fragment,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { reset } from 'styled-reset';
import { useConfig, WagmiContext } from 'wagmi';

import { ChainDialogContent } from '@/components/dialog/content/chain-dialog/chain-dialog';
import { ConnectDialogContent } from '@/components/dialog/content/connect-dialog';
import { ConnectDialogMobileContent } from '@/components/dialog/content/connect-dialog-mobile';
import { ProfileDialogContent } from '@/components/dialog/content/profile-dialog/profile-dialog';
import { Dialog } from '@/components/dialog/dialog';
import { useConnectModalStore } from '@/components/dialog/store';
import { MODAL_TYPE, ModalType } from '@/constants/modal';
import { defaultTheme, lightTheme } from '@/styles/theme';
import { isMobile } from '@/utils/is-mobile';

const GlobalStyle = createGlobalStyle`
  ${reset}
  * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

interface XellarKitContextType {
  modalOpen: boolean;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
  theme: 'dark' | 'light';
  walletConnectProjectId: string;
  googleClientId?: string;
}

const XellarKitContext = createContext<XellarKitContextType>(
  undefined as never
);

export function XellarKitProvider({
  children,
  theme = 'dark'
}: PropsWithChildren<{
  theme?: 'dark' | 'light';
}>) {
  if (!useContext(WagmiContext)) {
    throw new Error('XellarKitProvider must be used within a WagmiProvider');
  }

  if (useContext(XellarKitContext)) {
    throw new Error(
      'Multiple, nested usages of XellarKitProvider detected. Please use only one.'
    );
  }

  // Get the config from Wagmi
  const config = useConfig();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [wcProjectId, setWcProjectId] = useState('');
  const [googleClientId, setGoogleClientId] = useState<string | undefined>(
    undefined
  );

  const { setPage } = useConnectModalStore();

  useEffect(() => {
    const wcConnector = config.connectors.find(c => c.id === 'walletConnect');
    wcConnector?.getProvider().then((p: any) => {
      setWcProjectId(p?.rpc?.projectId);
    });

    const xellarConnector = config.connectors.find(
      c => c.id === 'xellar-passport'
    );
    xellarConnector?.getProvider().then((p: any) => {
      setGoogleClientId(p?.googleClientId);
    });
  }, [config.connectors]);

  const handleOpenModal = (type: ModalType) => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalType(null);
    setTimeout(() => {
      setPage('home');
    }, 50);
  };

  const modalContent = useMemo(() => {
    switch (modalType) {
      case MODAL_TYPE.CONNECT:
        if (isMobile()) {
          return <ConnectDialogMobileContent />;
        }
        return <ConnectDialogContent />;
      case MODAL_TYPE.CHAIN:
        return <ChainDialogContent />;
      case MODAL_TYPE.PROFILE:
        return <ProfileDialogContent />;
      case null:
        return null;
      default: {
        const _exhaustiveCheck: never = modalType;
        throw new Error(`Unhandled modal type: ${_exhaustiveCheck}`);
      }
    }
  }, [modalType]);

  const value = {
    modalOpen,
    openModal: handleOpenModal,
    closeModal: handleCloseModal,
    theme,
    walletConnectProjectId: wcProjectId,
    googleClientId
  };

  const GoogleProviderWrapper = googleClientId ? GoogleOAuthProvider : Fragment;

  return createElement(
    XellarKitContext.Provider,
    { value },
    <GoogleProviderWrapper clientId={googleClientId ?? ''}>
      <GlobalStyle />
      <ThemeProvider theme={theme === 'dark' ? defaultTheme : lightTheme}>
        {children}
        <Dialog isOpen={modalOpen} onClose={handleCloseModal}>
          {modalContent}
        </Dialog>
      </ThemeProvider>
    </GoogleProviderWrapper>
  );
}

export function useXellarContext() {
  const context = useContext(XellarKitContext);
  if (!context) {
    throw new Error('useXellarKit must be used within a XellarKitProvider');
  }
  return context;
}
