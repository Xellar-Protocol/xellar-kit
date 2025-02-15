import { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { useAccount, useDisconnect } from 'wagmi';

import { CopyIcon } from '@/assets/copy-icon';
import { StyledButton } from '@/components/ui/button';
import { useXellarContext } from '@/providers/xellar-kit';
import { truncateAddress } from '@/utils/string';

import { Separator, Title } from '../styled';

export function ProfileDialogContent() {
  const { closeModal } = useXellarContext();
  const { disconnectAsync } = useDisconnect();
  const { address } = useAccount();
  const handleDisconnect = async () => {
    await disconnectAsync();
    closeModal();
  };

  const theme = useTheme();

  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = async () => {
    if (isCopied) {
      setIsCopied(false);
    }
    if ('clipboard' in navigator) {
      await navigator.clipboard.writeText(address ?? '');
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }
  };

  return (
    <Wrapper>
      <Title>Connected</Title>
      <Separator />

      <AddressField>
        <Address>{truncateAddress(address ?? '')}</Address>

        <CopyIconWrapper onClick={handleCopy}>
          <CopyIcon color={theme.colors.TEXT_SECONDARY} />
        </CopyIconWrapper>
      </AddressField>

      <StyledButton onClick={handleDisconnect}>Disconnect</StyledButton>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 280px;
`;

const AddressField = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  height: 32px;
  background-color: ${({ theme }) => theme.colors.BG_SECONDARY};
  border-radius: 8px;
  align-items: center;
  padding: 0 12px;
`;

const Address = styled.p`
  font-size: 14px;
  font-weight: 500;
  flex: 1;
`;

const CopyIconWrapper = styled.div`
  cursor: pointer;
`;

CopyIconWrapper.defaultProps = {
  role: 'button'
};
