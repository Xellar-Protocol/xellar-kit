import { Config, createConfig, CreateConfigParameters, Transport } from 'wagmi';
import { arbitrum, Chain, mainnet, optimism, polygon } from 'wagmi/chains';

import { defaultConnectors } from './connectors';
import { getDefaultTransports } from './default-transport';

export type _chains = readonly [Chain, ...Chain[]];
// Define the '_transports' type as a Record
// It maps each 'Chain' id to a 'Transport'
export type _transports = Record<_chains[number]['id'], Transport>;

interface GetDefaultConfigParameters<
  chains extends _chains,
  transports extends _transports
> extends Omit<
    CreateConfigParameters<chains, transports>,
    // If you use 'client' you can't use 'transports' (we force to use 'transports')
    // More info here https://wagmi.sh/core/api/createConfig#client
    // We will also use our own 'connectors' instead of letting user specifying it
    'client' | 'connectors' | 'chains'
  > {
  appName: string;
  appIcon?: string;
  appDescription?: string;
  appUrl?: string;
  chains?: _chains;
  // WC 2.0 requires a project ID (get one here: https://cloud.walletconnect.com/sign-in)
  walletConnectProjectId: string;
}

export const defaultConfig = ({
  appName = 'Xellar Kit',
  appIcon,
  appDescription,
  appUrl,
  walletConnectProjectId,
  ...wagmiParameters
}: GetDefaultConfigParameters<_chains, _transports>): Config => {
  const { transports, chains, ...restWagmiParameters } = wagmiParameters;
  const defaultChains = chains || [mainnet, polygon, optimism, arbitrum];

  const _connectors = defaultConnectors({
    app: {
      name: appName,
      icon: appIcon,
      description: appDescription,
      url: appUrl
    },
    walletConnectProjectId
  }); // Type assertion here

  const _transports = transports || getDefaultTransports({ chains });

  return createConfig({
    chains: defaultChains,
    connectors: _connectors,
    transports: _transports,
    ...restWagmiParameters
  });
};
