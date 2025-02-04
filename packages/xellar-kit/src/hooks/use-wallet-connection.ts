/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { Connector, CreateConnectorFn, useConnect } from 'wagmi';
import { walletConnect } from 'wagmi/connectors';

import { useXellarContext } from '@/providers/xellar-kit';
import { isMobile, isMobileDevice } from '@/utils/is-mobile';

export function useWalletConnection() {
  const { closeModal } = useXellarContext();
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(
    null
  );
  const [selectedConnectorMobile, setSelectedConnectorMobile] =
    useState<Connector | null>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { connectAsync, isPending } = useConnect();

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

    if (isMobileDevice() && connector?.mobileUrl) {
      const a = document.createElement('a');
      a.href = `${connector.mobileUrl}${uri}`;
      a.click();
      setIsConnecting(false);
      return;
    }

    if (connector?.mobileUrl) {
      setUri(`${connector.mobileUrl}${uri}`);
    } else {
      setUri(uri);
    }

    setIsConnecting(false);
  };

  const onWalletConnect = async (_connector: Connector) => {
    setSelectedConnectorMobile(_connector);
    const w3mcss = document.createElement('style');
    w3mcss.innerHTML = `w3m-modal, wcm-modal{ --wcm-z-index: 2147483647; --w3m-z-index:2147483647; }`;
    document.head.appendChild(w3mcss);
    const provider: any = await _connector.getProvider();
    const projectId = provider?.rpc?.projectId;
    const mobileUrl = _connector?.mobileUrl;

    let cn: CreateConnectorFn | Connector = _connector;
    if (projectId && isMobile() && _connector.id !== 'indodax') {
      cn = walletConnect({
        projectId,
        showQrModal: true
      });
    }

    if (isMobileDevice() && mobileUrl && projectId) {
      onQrCode(_connector);
    }

    try {
      await connectAsync({ connector: cn });
    } catch (err) {
      console.error('WalletConnect', err);
    }
    setSelectedConnectorMobile(null);
    // remove modal styling
    document.head.removeChild(w3mcss);
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
    isConnecting: isConnecting || isPending,
    setIsConnecting,
    onWalletConnect,
    selectedConnectorMobile,
    setSelectedConnectorMobile
  };
}
