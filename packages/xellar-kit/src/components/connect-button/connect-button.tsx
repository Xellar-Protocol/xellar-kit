import { useAccount, useDisconnect } from 'wagmi';

import { MODAL_TYPE } from '@/constants/modal';
import { useXellarContext } from '@/providers/xellar-kit';
import { truncateAddress } from '@/utils/string';

import { StyledButton } from '../ui/button';

interface ButtonProps {
  className?: string;
}

export const ConnectButton = ({ className }: ButtonProps) => {
  const { openModal } = useXellarContext();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    if (isConnected) {
      disconnect();
    } else {
      openModal(MODAL_TYPE.CONNECT);
    }
  };

  return (
    <StyledButton className={className} onClick={handleConnect}>
      {isConnected && address ? truncateAddress(address) : 'Connect'}
    </StyledButton>
  );
};
