import {
  CoinbaseWalletParameters,
  injected,
  walletConnect
} from '@wagmi/connectors';
import { CreateConnectorFn } from 'wagmi';

type DefaultConnectorsProps = {
  app?: {
    name: string;
    icon?: string;
    description?: string;
    url?: string;
  };
  walletConnectProjectId?: string;
  coinbaseWalletPreference?: CoinbaseWalletParameters<'4'>['preference'];
};

export const defaultConnectors = (
  params?: DefaultConnectorsProps
): CreateConnectorFn[] => {
  console.log(params);
  //   const hasAllAppData = app.name && app.icon && app.description && app.url;

  const connectors: CreateConnectorFn[] = [];

  // Add the rest of the connectors
  connectors.push(
    injected({ target: 'metaMask' })
    //  coinbaseWallet({
    //    appName: app.name,
    //    appLogoUrl: app.icon,
    //    overrideIsMetaMask: false,
    //    preference: coinbaseWalletPreference
    //  })
  );

  //   if (walletConnectProjectId) {
  connectors.push(
    walletConnect({
      showQrModal: false,
      projectId: '0164f6aefa91d65fe12adcfeebadf92b',
      metadata: {
        name: 'Xellar Kit Test',
        description: 'AppKit Example',
        url: 'https://reown.com/appkit', // origin must match your domain & subdomain
        icons: ['https://assets.reown.com/reown-profile-pic.png']
      },
      qrModalOptions: {
        explorerRecommendedWalletIds: [
          '7819f9cd07e8d7101a483087869f1e57b7d448f3ec5f4ef3eda63c19b926dc17'
        ],
        explorerExcludedWalletIds: 'ALL'
      }
    })
  );

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
