import { useEffect, useState } from 'react';
import { Connector } from 'wagmi';

export function useWalletConnector(connector: Connector) {
  const [uri, setUri] = useState<string | undefined>(undefined);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (connector) {
      const connectWallet = async () => {
        setIsConnecting(true);
        const provider = await connector.getProvider();

        // @ts-expect-error asda
        provider.once('display_uri', uri => {
          setUri(uri);
        });
      };

      connectWallet();
    }
  }, [connector]);

  return {
    uri,
    isConnecting
  };
}
