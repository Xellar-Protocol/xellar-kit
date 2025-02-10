import { CreateConnectorFn, injected } from 'wagmi';

import { walletConnectors } from '@/wallets/wallets';

type DefaultConnectorsProps = {
  app?: {
    name: string;
    icon?: string;
    description?: string;
    url?: string;
  };
  walletConnectProjectId: string;
};

export const defaultConnectors = ({
  app,
  walletConnectProjectId
}: DefaultConnectorsProps): CreateConnectorFn[] => {
  const connectors: CreateConnectorFn[] = [];

  connectors.push(injected({ target: 'metaMask' }));

  if (walletConnectProjectId) {
    connectors.push(
      ...walletConnectors({
        projectId: walletConnectProjectId,
        ...(app ?? {})
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
