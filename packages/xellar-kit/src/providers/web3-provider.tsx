import React, { useState } from 'react';

import { useWalletConnectUri } from '@/hooks/use-walletconnect-uri';

type Web3ContextType = {
  connect: {
    getUri: (id?: string) => string;
  };
  error: string | undefined;
  setAutoEnabled: (enabled: boolean) => void;
};

const Web3Context = React.createContext<Web3ContextType>(undefined as never);

export const Web3ContextProvider = ({
  enabled,
  children
}: {
  enabled?: boolean;
  children: React.ReactNode;
}) => {
  const [autoEnabled, setAutoEnabled] = useState(false);

  const { uri: walletConnectUri, error } = useWalletConnectUri({
    enabled: enabled || autoEnabled
  });

  const value = {
    connect: {
      getUri: () => {
        return walletConnectUri;
      }
    },
    error,
    setAutoEnabled
  } as Web3ContextType;

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3 = () => React.useContext(Web3Context);
