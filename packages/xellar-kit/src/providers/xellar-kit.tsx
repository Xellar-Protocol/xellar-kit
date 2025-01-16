import React, {
  createContext,
  createElement,
  useContext,
  useState
} from 'react';
import { ThemeProvider } from 'styled-components';
import { Reset } from 'styled-reset';
import { WagmiContext } from 'wagmi';

import { ConnectDialogContent } from '@/components/dialog/content/connect-dialog';
import { Dialog } from '@/components/dialog/dialog';
import { defaultTheme } from '@/styles/theme';

interface XellarKitContextType {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
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

  const value = React.useMemo(
    () => ({
      modalOpen,
      setModalOpen
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
        <Dialog isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <ConnectDialogContent />
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
