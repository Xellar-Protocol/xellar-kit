import React from 'react';

import { useWalletConnectUri } from '@/hooks/use-walletconnect-uri';

type Web3ContextType = {
  connect: {
    getUri: (id?: string) => string;
  };
};

const Web3Context = React.createContext<Web3ContextType>(undefined as never);

export const Web3ContextProvider = ({
  enabled,
  children
}: {
  enabled?: boolean;
  children: React.ReactNode;
}) => {
  const { uri: walletConnectUri } = useWalletConnectUri({
    enabled
  });

  const value = {
    connect: {
      getUri: () => {
        return walletConnectUri;
      }
    }
  } as Web3ContextType;

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3 = () => React.useContext(Web3Context);
