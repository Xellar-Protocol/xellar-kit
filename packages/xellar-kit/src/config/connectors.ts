import { CreateConnectorFn, injected } from 'wagmi';
import { CoinbaseWalletParameters, metaMask } from 'wagmi/connectors';

import { isMobileDevice } from '@/utils/is-mobile';
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

  connectors.push(
    metaMask({
      headless: !isMobileDevice(),
      dappMetadata: {
        ...(params?.app ?? {})
      },
      preferDesktop: !isMobileDevice()
    })
  );

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
