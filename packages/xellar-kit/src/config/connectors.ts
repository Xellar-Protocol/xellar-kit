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
  xellarEnv?: 'sandbox' | 'production';
  googleClientId?: string;
};

export const defaultConnectors = ({
  app,
  walletConnectProjectId,
  xellarAppId,
  xellarEnv,
  googleClientId
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
        env: xellarEnv ?? 'sandbox',
        googleClientId
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
