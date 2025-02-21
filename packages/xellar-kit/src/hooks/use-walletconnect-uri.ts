/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Connector, useAccount, useConnect } from 'wagmi';

import { useWalletConnectConnector } from './connectors';

type Props = {
  enabled?: boolean;
};

export function useWalletConnectUri(
  { enabled }: Props = {
    enabled: true
  }
) {
  const [uri, setUri] = useState<string | undefined>(undefined);

  const connector: Connector = useWalletConnectConnector();

  const { isConnected } = useAccount();
  const { connectAsync } = useConnect();

  useEffect(() => {
    if (!enabled) return;

    async function handleMessage(message: any) {
      const { type, data } = message;
      console.log('WC Message', type, data);
      if (type === 'display_uri') {
        setUri(data);
      }
      /*
        // This has the URI as well, but we're probably better off using the one in the display_uri event
        if (type === 'connecting') {
          const p = await connector.getProvider();
          const uri = p.signer.uri; 
          setConnectorUri(uri);
        }
        */
    }
    async function handleDisconnect() {
      console.log('WC Disconnect');

      if (connector) connectWallet(connector);
    }

    async function connectWallet(connector: Connector) {
      const result = await connectAsync({ connector });
      if (result) return result;
      return false;
    }

    async function connectWalletConnect(connector: Connector) {
      try {
        await connectWallet(connector);
      } catch (error: any) {
        console.log('catch error');
        console.log(error);
        if (error.code) {
          switch (error.code) {
            case 4001:
              console.log('error.code - User rejected');
              connectWalletConnect(connector); // Regenerate QR code
              break;
            default:
              console.log('error.code - Unknown Error');
              break;
          }
        } else {
          // Sometimes the error doesn't respond with a code
          console.log('WalletConnect cannot connect.', error);
        }
      }
    }
    if (isConnected) {
      setUri(undefined);
    } else {
      if (!connector || uri) return;
      if (connector && !isConnected) {
        connectWalletConnect(connector);
        console.log('add wc listeners');
        connector.emitter.on('message', handleMessage);
        connector.emitter.on('disconnect', handleDisconnect);
        return () => {
          console.log('remove wc listeners');
          connector.emitter.off('message', handleMessage);
          connector.emitter.off('disconnect', handleDisconnect);
        };
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, connector, isConnected]);

  return {
    uri
  };
}
