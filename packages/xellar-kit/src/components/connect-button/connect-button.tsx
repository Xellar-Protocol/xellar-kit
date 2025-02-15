import styled from 'styled-components';

import { truncateAddress } from '@/utils/string';

import { StyledButton } from '../ui/button';
import { abbreviateETHBalance } from './abbreviate-balance';
import { ConnectButtonRenderer } from './connect-button-renderer';

export interface ConnectButtonProps {
  className?: string;
}

export function ConnectButton({ className }: ConnectButtonProps) {
  return (
    <ConnectButtonRenderer>
      {({
        isConnected,
        account,
        openConnectModal,
        openChainModal,
        chain,
        openProfileModal
      }) => {
        const displayBalance = account?.balanceFormatted
          ? `${abbreviateETHBalance(Number.parseFloat(account.balanceFormatted))} ${account.balanceSymbol}`
          : undefined;

        return !isConnected && !account ? (
          <StyledButton className={className} onClick={openConnectModal}>
            Connect
          </StyledButton>
        ) : (
          <Row className={className}>
            <StyledButton onClick={openChainModal}>{chain?.name}</StyledButton>
            <StyledButton onClick={openProfileModal}>
              {displayBalance} | {truncateAddress(account?.address ?? '')}
            </StyledButton>
          </Row>
        );
      }}
    </ConnectButtonRenderer>
  );
}

ConnectButton.Custom = ConnectButtonRenderer;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;
