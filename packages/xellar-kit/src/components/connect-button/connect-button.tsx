import styled from 'styled-components';
import { useAccount, useDisconnect } from 'wagmi';

import { useXellarContext } from '@/providers/xellar-kit';
import { truncateAddress } from '@/utils/string';

interface ButtonProps {
  className?: string;
}

export const ConnectButton = ({ className }: ButtonProps) => {
  const { setModalOpen } = useXellarContext();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    if (isConnected) {
      disconnect();
    } else {
      setModalOpen(true);
    }
  };

  return (
    <StyledButton role="button" className={className} onClick={handleConnect}>
      {isConnected && address ? truncateAddress(address) : 'Connect'}
    </StyledButton>
  );
};

const StyledButton = styled.div`
  background-color: ${({ theme }) => theme.colors.PRIMARY};
  color: ${({ theme }) => theme.colors.TEXT};
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
`;
