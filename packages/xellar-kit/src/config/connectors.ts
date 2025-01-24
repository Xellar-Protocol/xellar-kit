import { CreateConnectorFn } from 'wagmi';
import { CoinbaseWalletParameters, injected } from 'wagmi/connectors';

import { walletConnectors } from '@/wallets/wallets';

type DefaultConnectorsProps = {
  app?: {
    name: string;
    icon?: string;
    description?: string;
    url?: string;
  };
  walletConnectProjectId: string;
  coinbaseWalletPreference?: CoinbaseWalletParameters;
};

export const defaultConnectors = (
  params: DefaultConnectorsProps
): CreateConnectorFn[] => {
  const connectors: CreateConnectorFn[] = [];

  // Add the rest of the connectors
  connectors.push(injected({ target: 'metaMask' }));

  if (params?.walletConnectProjectId) {
    connectors.push(
      ...walletConnectors({
        projectId: params.walletConnectProjectId,
        ...(params?.app ?? {})
      })
    );
  }

  //   }
  /*
  connectors.push(
    injected({
      shimDisconnect: true,
    })
  );
  */

  return connectors;
};
