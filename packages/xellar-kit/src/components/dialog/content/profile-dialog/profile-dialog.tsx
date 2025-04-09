import { useState } from 'react';
import { useTheme } from 'styled-components';
import { useAccount, useDisconnect } from 'wagmi';

import { CopyIcon } from '@/assets/copy-icon';
import { Avatar } from '@/components/ui/avatar';
import { StyledButton } from '@/components/ui/button';
import { MODAL_WIDTH } from '@/constants/modal';
import { useXellarContext } from '@/providers/xellar-kit';
import { styled } from '@/styles/styled';
import { isMobile } from '@/utils/is-mobile';
import { truncateAddress } from '@/utils/string';

import { Title } from '../styled';

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
      <div>
        <Title>Connected</Title>
      </div>

      <AvatarWrapper>
        <Avatar name={address ?? ''} size={80} />
      </AvatarWrapper>

      <AddressField>
        <Address>{truncateAddress(address ?? '')}</Address>

        <CopyIconWrapper onClick={handleCopy}>
          <CopyIcon
            color={theme.colors.TEXT_SECONDARY}
            width={12}
            height={12}
          />
        </CopyIconWrapper>
      </AddressField>

      <StyledButton onClick={handleDisconnect}>Disconnect</StyledButton>
    </Wrapper>
  );
}

const AvatarWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: ${() => (isMobile() ? '100%' : `${MODAL_WIDTH}px`)};
`;

const AddressField = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  height: 32px;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
`;

const Address = styled.p`
  font-size: 16px;
  font-weight: 500;
  margin: 0;
`;

const CopyIconWrapper = styled.div`
  cursor: pointer;
`;

CopyIconWrapper.defaultProps = {
  role: 'button'
};
