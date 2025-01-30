import { useEffect, useRef, useState } from 'react';
import { Connector } from 'wagmi';

import { useXellarContext } from '@/providers/xellar-kit';

export function useWalletConnection() {
  const { closeModal } = useXellarContext();
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(
    null
  );
  const [uri, setUri] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const getWalletConnectUri = async (connector: Connector): Promise<string> => {
    const provider = await connector.getProvider();

    return new Promise<string>(resolve =>
      // Wagmi v2 doesn't have a return type for provider yet
      // @ts-expect-error Provider type not yet defined
      provider.once('display_uri', _uri => {
        resolve(_uri);
      })
    );
  };

  const onQrCode = async (connector: Connector) => {
    const uri = await getWalletConnectUri(connector);
    setUri(uri);
    setIsConnecting(false);
  };

  const selectConnector = async (connector: Connector) => {
    if (connector.type === 'injected') {
      setUri(null);
    }

    if (connector.type !== 'injected') {
      onQrCode(connector);
    }

    setIsConnecting(true);
    connector
      .connect()
      .then(acccount => {
        if (acccount.accounts.length > 0) {
          setIsConnecting(false);
          setSelectedConnector(null);
          closeModal();
        }
      })
      .catch(error => {
        console.error(error);
        setIsConnecting(false);
        setSelectedConnector(null);
      });
  };

  const selectConnectorRef = useRef(selectConnector);
  selectConnectorRef.current = selectConnector;

  useEffect(() => {
    if (selectedConnector) {
      selectConnectorRef.current(selectedConnector);
    }
  }, [selectedConnector]);

  return {
    selectedConnector,
    setSelectedConnector,
    uri,
    setUri,
    isConnecting,
    setIsConnecting
  };
}
