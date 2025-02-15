import { CreateConnectorFn, injected } from 'wagmi';

import { walletConnectors } from '@/wallets/wallets';
import { xellarConnector } from '@/xellar-connector';

type DefaultConnectorsProps = {
  app?: {
    name: string;
    icon?: string;
    description?: string;
    url?: string;
  };
  walletConnectProjectId: string;
  xellarAppId?: string;
};

export const defaultConnectors = ({
  app,
  walletConnectProjectId,
  xellarAppId
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

  if (xellarAppId) {
    connectors.push(
      xellarConnector({
        appId: xellarAppId,
        env: 'sandbox'
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
