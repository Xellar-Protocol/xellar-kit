/**
 * TODO: Automate transports based on configured chains
 *
 * Developers using this causes loss of granular control over a dapps transports,
 * but for simple use cases, it's nice to have and saves a lot of boilerplate.
 *
 */

import { type HttpTransport, type WebSocketTransport } from 'viem';
import { CreateConfigParameters, fallback, http, Transport } from 'wagmi';
import { arbitrum, mainnet, optimism, polygon } from 'wagmi/chains';

type _chain = CreateConfigParameters['chains'];

type GetDefaultTransportsProps = {
  chains?: _chain;
  alchemyId?: string;
  infuraId?: string;
};

export const getDefaultTransports = ({
  chains = [mainnet, polygon, optimism, arbitrum]
}: GetDefaultTransportsProps): Record<number, Transport> => {
  const transports: Record<number, Transport> = {};

  chains.forEach(chain => {
    const urls: (HttpTransport | WebSocketTransport)[] = [];
    urls.push(http());
    transports[chain.id] = fallback(urls);
  });

  return transports;
};
