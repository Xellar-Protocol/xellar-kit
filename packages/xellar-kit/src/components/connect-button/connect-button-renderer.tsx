import { Chain } from 'viem';
import {
  useAccount,
  useBalance,
  useChainId,
  useChains,
  useDisconnect
} from 'wagmi';

import { MODAL_TYPE } from '@/constants/modal';
import { useXellarContext } from '@/providers/xellar-kit';

export interface ConnectButtonRendererProps {
  children: (props: {
    isConnected: boolean;
    account?: {
      address: `0x${string}`;
      balanceDecimals?: number;
      balanceFormatted?: string;
      balanceSymbol?: string;
    };
    chain?: Chain;
    disconnect: () => void;
    openConnectModal: () => void;
    openChainModal: () => void;
    openProfileModal: () => void;
  }) => React.ReactNode;
}

export const ConnectButtonRenderer = ({
  children
}: ConnectButtonRendererProps) => {
  const { openModal } = useXellarContext();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const chains = useChains();

  const chain = chains.find(chain => chain.id === chainId);

  const { data: balance } = useBalance({
    address
  });

  const openConnectModal = () => {
    openModal(MODAL_TYPE.CONNECT);
  };

  const openChainModal = () => {
    openModal(MODAL_TYPE.CHAIN);
  };

  const openProfileModal = () => {
    openModal(MODAL_TYPE.PROFILE);
  };

  return (
    <>
      {children({
        isConnected,
        account: address
          ? {
              address,
              balanceDecimals: balance?.decimals,
              balanceFormatted: balance?.formatted,
              balanceSymbol: balance?.symbol
            }
          : undefined,
        disconnect,
        chain: chain,
        openConnectModal,
        openChainModal,
        openProfileModal
      })}
    </>
  );
};
