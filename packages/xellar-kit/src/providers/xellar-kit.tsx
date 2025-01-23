import React, {
  createContext,
  createElement,
  useContext,
  useMemo,
  useState
} from 'react';
import { ThemeProvider } from 'styled-components';
import { Reset } from 'styled-reset';
import { useAccountEffect, WagmiContext } from 'wagmi';

import { ConnectDialogContent } from '@/components/dialog/content/connect-dialog';
import { Dialog } from '@/components/dialog/dialog';
import { MODAL_TYPE, ModalType } from '@/constants/modal';
import { defaultTheme } from '@/styles/theme';

interface XellarKitContextType {
  modalOpen: boolean;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
}

const XellarKitContext = createContext<XellarKitContextType>(
  undefined as never
);

export function XellarKitProvider({
  children
}: {
  children?: React.ReactNode;
}) {
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
  useAccountEffect({
    onConnect: () => {
      if (modalOpen) {
        setModalOpen(false);
      }
    }
  });

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
        return <ConnectDialogContent />;
      case null:
        return null;
      default: {
        const _exhaustiveCheck: never = modalType;
        throw new Error(`Unhandled modal type: ${_exhaustiveCheck}`);
      }
    }
  }, [modalType]);

  const value = React.useMemo(
    () => ({
      modalOpen,
      openModal: handleOpenModal,
      closeModal: handleCloseModal
    }),
    [modalOpen]
  );

  return createElement(
    XellarKitContext.Provider,
    { value },
    <>
      <Reset />
      <ThemeProvider theme={defaultTheme}>
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
