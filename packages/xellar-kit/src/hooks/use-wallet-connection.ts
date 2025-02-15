import { useEffect, useRef, useState } from 'react';
import { Connector, CreateConnectorFn, useConnect } from 'wagmi';
import { walletConnect } from 'wagmi/connectors';

import { useXellarContext } from '@/providers/xellar-kit';
import { isMobileDevice } from '@/utils/is-mobile';
import { WalletProps } from '@/wallets/use-wallet';

import { useConnector } from './connectors';

export function useWalletConnection() {
  const { closeModal, walletConnectProjectId } = useXellarContext();
  const [wallet, setWallet] = useState<WalletProps | null>(null);
  const wcConnector = useConnector('walletConnect');

  const [uri, setUri] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { connectAsync } = useConnect();

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
    const _uri = await getWalletConnectUri(connector);
    setUri(_uri);
    setIsConnecting(false);
  };

  const onWalletConnect = async (wallet: WalletProps) => {
    const _connector = wallet.connector;
    console.log(typeof wallet.getWalletConnectDeeplink);

    if (wallet.getWalletConnectDeeplink) {
      return;
    }

    const w3mcss = document.createElement('style');
    w3mcss.innerHTML = `w3m-modal, wcm-modal{ --wcm-z-index: 2147483647; --w3m-z-index:2147483647; }`;
    document.head.appendChild(w3mcss);

    let cn: CreateConnectorFn | Connector = _connector;
    if (walletConnectProjectId && wallet.id !== 'indodax') {
      cn = walletConnect({
        projectId: walletConnectProjectId,
        showQrModal: true
      });
    }

    if (isMobileDevice()) {
      onQrCode(_connector);
    }

    try {
      await connectAsync({ connector: cn });
    } catch (err) {
      console.error('WalletConnect', err);
    }
    // remove modal styling
    document.head.removeChild(w3mcss);
  };

  const selectWallet = async (wallet: WalletProps) => {
    if (isMobileDevice()) {
      onWalletConnect(wallet);
    }

    if (wallet.connector.type !== 'injected' && !uri) {
      onQrCode(wallet.connector);
    }

    if (wallet.connector.type === 'injected') {
      // If it's MetaMask and not installed, we should use WalletConnect instead
      if (wallet.id.includes('metaMask') && !wallet.isInstalled) {
        try {
          if (!uri) {
            setIsConnecting(true);
            onQrCode(wcConnector);
          }
          await connectAsync({
            connector: wcConnector
          });
          setIsConnecting(false);
          setWallet(null);
          closeModal();
        } catch (error) {
          console.error('WalletConnect error:', error);
          setIsConnecting(false);
          setWallet(null);
        }
        setIsConnecting(false);
        return;
      }

      setUri(null);
    }

    if (!uri) {
      setIsConnecting(true);
    }
    wallet.connector
      .connect()
      .then(acccount => {
        if (acccount.accounts.length > 0) {
          setIsConnecting(false);
          setWallet(null);
          closeModal();
        }
      })
      .catch(error => {
        console.error(error);
        setIsConnecting(false);
        setWallet(null);
      });
  };

  const selectWalletRef = useRef(selectWallet);
  selectWalletRef.current = selectWallet;

  useEffect(() => {
    if (wallet) {
      selectWalletRef.current(wallet);
    }
  }, [wallet]);

  return {
    wallet,
    setWallet,
    uri,
    setUri,
    isConnecting: isConnecting,
    setIsConnecting,
    onWalletConnect
  };
}
