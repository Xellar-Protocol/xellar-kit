/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Connector, useAccount, useConnect } from 'wagmi';

import { WalletProps } from '@/wallets/use-wallet';

export function useConnection() {
  const [wallet, setWallet] = useState<WalletProps | null>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const { isConnected } = useAccount();
  const { connectAsync } = useConnect();

  useEffect(() => {
    if (!wallet) return;
    //  if(wallet.connector.)

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

      if (wallet?.connector) connectWallet(wallet.connector);
    }

    async function connectWallet(connector: Connector) {
      const result = await connectAsync({ connector });
      if (result) return result;
      return false;
    }

    async function connectWalletConnect(connector: Connector) {
      try {
        //skip if injected connector
        setIsConnecting(true);
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
      } finally {
        setIsConnecting(false);
      }
    }
    if (isConnected) {
      setUri(null);
      setIsConnecting(false);
    } else {
      setIsConnecting(false);
      if (!wallet?.connector || uri) return;
      if (wallet?.connector && !isConnected) {
        setIsConnecting(false);
        connectWalletConnect(wallet.connector);
        console.log('add wc listeners');
        wallet.connector.emitter.on('message', handleMessage);
        wallet.connector.emitter.on('disconnect', handleDisconnect);
        return () => {
          console.log('remove wc listeners');
          wallet.connector.emitter.off('message', handleMessage);
          wallet.connector.emitter.off('disconnect', handleDisconnect);
        };
      }
    }
  }, [wallet, isConnected, connectAsync, uri]);

  return {
    wallet,
    setWallet,
    uri,
    isConnecting
  };
}
