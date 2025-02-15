import { createConnector, CreateConnectorFn } from 'wagmi';
import { walletConnect, WalletConnectParameters } from 'wagmi/connectors';

interface GetOrCreateWalletConnectInstanceParams {
  projectId: string;
  walletConnectParameters?: Omit<WalletConnectParameters, 'projectId'>;
  showQrModal: boolean;
}

type CreateWalletConnectConnectorParams = {
  projectId: string;
  walletConnectParameters?: Omit<WalletConnectParameters, 'projectId'>;
  showQrModal: boolean;
  id: string;
  name: string;
  mobileUrl?: string;
  desktopUrl?: string;
};

const walletConnectInstances = new Map<
  string,
  ReturnType<typeof walletConnect>
>();

const getOrCreateWalletConnectInstance = ({
  projectId,
  walletConnectParameters,
  showQrModal
}: GetOrCreateWalletConnectInstanceParams): ReturnType<
  typeof walletConnect
> => {
  let config: WalletConnectParameters = {
    ...(walletConnectParameters ? walletConnectParameters : {}),
    projectId,
    showQrModal: false // Required. Otherwise WalletConnect modal (Web3Modal) will popup during time of connection for a wallet
  };

  // `showQrModal` should always be `true`
  if (showQrModal) {
    config = { ...config, showQrModal: true };
  }

  const serializedConfig = JSON.stringify(config);

  const sharedWalletConnector = walletConnectInstances.get(serializedConfig);

  if (sharedWalletConnector) {
    return sharedWalletConnector;
  }

  // Create a new walletConnect instance and store it
  const newWalletConnectInstance = walletConnect(config);

  walletConnectInstances.set(serializedConfig, newWalletConnectInstance);

  return newWalletConnectInstance;
};

export function createWalletConnectConnector({
  projectId,
  walletConnectParameters,
  showQrModal,
  id,
  name,
  mobileUrl,
  desktopUrl
}: CreateWalletConnectConnectorParams): CreateConnectorFn {
  // Create and configure the WalletConnect connector with project ID and options.
  return createConnector(config => ({
    ...getOrCreateWalletConnectInstance({
      projectId,
      walletConnectParameters,
      // Used in `connectorsForWallets` to add another
      // walletConnect wallet into rainbowkit with modal popup option
      showQrModal
    })(config),
    id,
    name,
    mobileUrl,
    desktopUrl
  }));
}
