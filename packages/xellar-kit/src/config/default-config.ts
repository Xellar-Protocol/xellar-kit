import {
  Config,
  createConfig,
  CreateConfigParameters,
  CreateConnectorFn,
  http,
  Transport
} from 'wagmi';
import { arbitrum, Chain, mainnet, optimism, polygon } from 'wagmi/chains';

import { defaultConnectors } from './connectors';

export type _chains = readonly [Chain, ...Chain[]];

// Define the '_transports' type as a Record
// It maps each 'Chain' id to a 'Transport'
export type _transports = Record<_chains[number]['id'], Transport>;

const createDefaultTransports = <
  chains extends _chains,
  transports extends _transports
>(
  chains: chains
): transports => {
  const transportsObject = chains.reduce((acc: transports, chain) => {
    const key = chain.id as keyof transports;
    acc[key] = http() as transports[keyof transports]; // Type assertion here
    return acc;
  }, {} as transports);

  return transportsObject;
};

type DefaultConfigProps = {
  appName: string;
  appIcon?: string;
  appDescription?: string;
  appUrl?: string;
  // WC 2.0 requires a project ID (get one here: https://cloud.walletconnect.com/sign-in)
  walletConnectProjectId: string;
} & Partial<CreateConfigParameters>;

export const defaultConfig = ({
  appName = 'Xellar Kit',
  appIcon,
  appDescription,
  appUrl,
  walletConnectProjectId,
  chains = [mainnet, polygon, optimism, arbitrum],
  ...props
}: DefaultConfigProps): Config => {
  const connectors = defaultConnectors({
    app: {
      name: appName,
      icon: appIcon,
      description: appDescription,
      url: appUrl
    },
    walletConnectProjectId
  });

  return createConfig<_chains, _transports, CreateConnectorFn[]>({
    chains,
    // @ts-expect-error type is not correct
    connectors,
    transports: createDefaultTransports(chains),
    ...props
  });
};
