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
import { ProfileDialogContent } from '@/components/dialog/content/profile-dialog/profile-dialog';
import { Dialog } from '@/components/dialog/dialog';
import { useConnectModalStore } from '@/components/dialog/store';
import { MODAL_TYPE, ModalType } from '@/constants/modal';
import { darkTheme, Theme } from '@/styles/theme';

import { Web3ContextProvider } from './web3-provider';

const GlobalStyle = createGlobalStyle`
  ${reset}
  * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

interface XellarKitProviderProps {
  theme?: Theme;
  googleClientId?: string;
  telegramConfig?: {
    /** Telegram bot ID */
    botId: string;
    /** Telegram bot username */
    botUsername: string;
  };
  enableWhatsappLogin?: boolean;
  appleLoginConfig?: {
    /** Client ID - eg: 'com.example.com' */
    clientId: string;
    /** Apple's redirectURI - must be one of the URIs you added to the serviceID - the undocumented trick in apple docs is that you should call auth from a page that is listed as a redirectURI, localhost fails */
    redirectUri: string;
  };
}

interface XellarKitContextType extends XellarKitProviderProps {
  modalOpen: boolean;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
}

const XellarKitContext = createContext<XellarKitContextType>(
  undefined as never
);

export function XellarKitProvider({
  children,
  theme = darkTheme as Theme,
  googleClientId,
  telegramConfig,
  enableWhatsappLogin = false,
  appleLoginConfig
}: PropsWithChildren<XellarKitProviderProps>) {
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

  const { setPage } = useConnectModalStore();

  useEffect(() => {
    const wcConnector = config.connectors.find(c => c.id === 'walletConnect');
    wcConnector?.getProvider().then((p: any) => {
      setWcProjectId(p?.rpc?.projectId);
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
    googleClientId,
    telegramConfig,
    enableWhatsappLogin,
    appleLoginConfig
  };

  const GoogleProviderWrapper = googleClientId ? GoogleOAuthProvider : Fragment;
  const googleProviderProps = googleClientId
    ? { clientId: googleClientId }
    : {};

  return createElement(
    XellarKitContext.Provider,
    { value },
    <Web3ContextProvider enabled={modalOpen}>
      <GoogleProviderWrapper {...(googleProviderProps as any)}>
        <GlobalStyle />
        <ThemeProvider theme={theme}>
          {children}
          <Dialog isOpen={modalOpen} onClose={handleCloseModal}>
            {modalContent}
          </Dialog>
        </ThemeProvider>
      </GoogleProviderWrapper>
    </Web3ContextProvider>
  );
}

export function useXellarContext() {
  const context = useContext(XellarKitContext);
  if (!context) {
    throw new Error('useXellarKit must be used within a XellarKitProvider');
  }
  return context;
}
