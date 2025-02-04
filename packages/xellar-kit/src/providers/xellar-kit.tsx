import React, {
  createContext,
  createElement,
  PropsWithChildren,
  useContext,
  useMemo,
  useState
} from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { reset } from 'styled-reset';
import { WagmiContext } from 'wagmi';

import { ChainDialogContent } from '@/components/dialog/content/chain-dialog/chain-dialog';
import { ConnectDialogContent } from '@/components/dialog/content/connect-dialog';
import { ConnectDialogMobileContent } from '@/components/dialog/content/connect-dialog-mobile';
import { ProfileDialogContent } from '@/components/dialog/content/profile-dialog/profile-dialog';
import { Dialog } from '@/components/dialog/dialog';
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
}

const XellarKitContext = createContext<XellarKitContextType>(
  undefined as never
);

export function XellarKitProvider({
  children,
  theme = 'dark'
}: PropsWithChildren<{ theme?: 'dark' | 'light' }>) {
  if (!useContext(WagmiContext)) {
    throw new Error('XellarKitProvider must be used within a WagmiProvider');
  }

  if (useContext(XellarKitContext)) {
    throw new Error(
      'Multiple, nested usages of XellarKitProvider detected. Please use only one.'
    );
  }

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType | null>(null);

  const handleOpenModal = (type: ModalType) => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalType(null);
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
    theme
  };

  return createElement(
    XellarKitContext.Provider,
    { value },
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme === 'dark' ? defaultTheme : lightTheme}>
        {children}
        <Dialog isOpen={modalOpen} onClose={handleCloseModal}>
          {modalContent}
        </Dialog>
      </ThemeProvider>
    </>
  );
}

export function useXellarContext() {
  const context = useContext(XellarKitContext);
  if (!context) {
    throw new Error('useXellarKit must be used within a XellarKitProvider');
  }
  return context;
}
