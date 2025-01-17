import { Connector, useConnectors as useWagmiConnectors } from 'wagmi';

export function useConnectors() {
  const connectors = useWagmiConnectors();

  return connectors || [];
}

export function useConnector(id: string, uuid?: string) {
  const connectors = useConnectors();
  if (id === 'injected' && uuid) {
    return connectors.find(c => c.id === id && c.name === uuid) as Connector;
  }

  if (id === 'injected') {
    return connectors.find(
      c => c.id === id && c.name.includes('Injected')
    ) as Connector;
  }

  return connectors.find(c => c.id === id) as Connector;
}

export function useInjectedConnectors() {
  const connectors = useConnectors();

  const injectedConnectors = connectors
    .filter(w => w.type === 'injected')
    .filter(
      (wallet, index, self) =>
        !(
          (wallet.id === 'metaMaskSDK' || wallet.id === 'metaMask') &&
          self.find(
            w => w.id === 'io.metamask' || w.id === 'io.metamask.mobile'
          )
        )
    );

  return injectedConnectors;
}

export function useWalletConnectConnector() {
  return useConnector('walletConnect');
}
