import { WalletConnectParameters } from 'wagmi/connectors';

import { createWalletConnectConnector } from './get-wc-connector';

interface AppParams {
  name?: string;
  icon?: string;
  description?: string;
  url?: string;
  projectId: string;
}

const qrModalOptions: WalletConnectParameters['qrModalOptions'] = {
  explorerRecommendedWalletIds: [
    '7819f9cd07e8d7101a483087869f1e57b7d448f3ec5f4ef3eda63c19b926dc17'
  ],
  explorerExcludedWalletIds: 'ALL'
};

export const walletConnectors = (appParams: AppParams) => [
  // createWalletConnectConnector({
  //   projectId: appParams.projectId,
  //   walletConnectParameters: {
  //     qrModalOptions
  //   },
  //   showQrModal: false,
  //   id: 'xellar-mobile',
  //   name: 'Xellar Mobile'
  // }),

  createWalletConnectConnector({
    projectId: appParams.projectId,
    walletConnectParameters: {
      qrModalOptions
    },
    showQrModal: false,
    id: 'indodax',
    name: 'Indodax'
  }),

  createWalletConnectConnector({
    projectId: appParams.projectId,
    walletConnectParameters: {
      qrModalOptions
    },
    showQrModal: false,
    id: 'reown',
    name: 'Reown'
  }),

  createWalletConnectConnector({
    projectId: appParams.projectId,
    walletConnectParameters: {
      qrModalOptions
    },
    showQrModal: false,
    id: 'walletConnect',
    name: 'WalletConnect'
  })
];
