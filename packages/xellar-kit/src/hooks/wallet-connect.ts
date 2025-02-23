import { useState } from 'react';
import { Connector, CreateConnectorFn, useConnect } from 'wagmi';
import { walletConnect } from 'wagmi/connectors';

export function useWalletConnectModal() {
  const log = console.log;
  const { connectAsync, connectors } = useConnect();
  const [isOpen, setIsOpen] = useState(false);

  return {
    isOpen,
    open: async () => {
      // add modal styling because wagmi does not let you add styling to the modal
      const w3mcss = document.createElement('style');
      w3mcss.innerHTML = `w3m-modal, wcm-modal{ --wcm-z-index: 2147483647; --w3m-z-index:2147483647; }`;
      document.head.appendChild(w3mcss);

      const clientConnector: Connector | undefined = connectors.find(
        c => c.type === 'walletConnect'
      );

      if (clientConnector) {
        try {
          const provider: any = await clientConnector.getProvider();
          const projectId = provider.rpc.projectId;

          const connector: CreateConnectorFn = walletConnect({
            projectId,
            showQrModal: true
          });

          setIsOpen(true);
          try {
            await connectAsync({ connector: connector });
          } catch (err) {
            log('WalletConnect', err);
          }
          setIsOpen(false);

          // remove modal styling
          document.head.removeChild(w3mcss);
        } catch (err) {
          log('Could not get WalletConnect provider', err);
        }
      } else {
        log('No WalletConnect connector available');
      }
    }
  };
}
