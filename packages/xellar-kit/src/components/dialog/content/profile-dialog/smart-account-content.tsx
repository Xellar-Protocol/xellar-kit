import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AACreateAccountResponse } from '@xellar/sdk';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useTheme } from 'styled-components';
import { useAccount, useDisconnect } from 'wagmi';

import { BuyIcon } from '@/assets/buy-icon';
import { ChevronDownIcon } from '@/assets/chevron-down';
import { CopyIcon } from '@/assets/copy-icon';
import { ReceiveIcon } from '@/assets/receive-icon';
// import { SendIcon } from '@/assets/send-icon';
import { Avatar } from '@/components/ui/avatar';
import { StyledButton } from '@/components/ui/button';
import { ChainImage } from '@/components/ui/chain-image';
import { useSmartAccount } from '@/hooks/account-abstraction';
import { useXellarContext } from '@/providers/xellar-kit';
import { styled } from '@/styles/styled';
import { truncateAddress } from '@/utils/string';

import { useProfileDialogContext } from './profile-dialog';

const chainNameMap = {
  1: 'Ethereum',
  137: 'Polygon',
  56: 'BSC',
  8453: 'Base',
  17000: 'Holesky',
  11155111: 'Sepolia'
};

const statusMap = {
  not_deployed: 'Not Activated',
  deployed: 'Activated',
  deploying: 'Activating'
};

export function ProfileSmartAccountContent() {
  const {
    setScreen,
    setActiveAddress,
    isLoading,
    selectedCrypto,
    selectedCurrency
  } = useProfileDialogContext();
  const queryClient = useQueryClient();

  const { activateAccount, smartAccount } = useSmartAccount();

  const aaAddress = smartAccount?.accounts[0]?.aaAddress;

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
      await navigator.clipboard.writeText(aaAddress ?? '');
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (accountId: string) => activateAccount(accountId),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['get-smart-account'] });
    }
  });

  return (
    <Wrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
    >
      <Header>
        <HeaderInfo>
          <Avatar name={aaAddress ?? ''} size={36} />
          <TitleWrapper>
            <TitleText style={{ fontWeight: 'bold' }}>Smart Wallet</TitleText>
            <TitleText style={{ fontSize: 12, color: theme.texts.secondary }}>
              Enhanced Security, Gasless Transactions
            </TitleText>
          </TitleWrapper>
        </HeaderInfo>

        <AddressWrapper>
          <AddressText>{truncateAddress(aaAddress ?? '')}</AddressText>
          <CopyIconButton onClick={handleCopy}>
            <CopyIcon color={theme.texts.secondary} width={14} height={14} />
          </CopyIconButton>
        </AddressWrapper>
      </Header>

      <ActionButtons>
        <ActionButton
          variant="outline"
          onClick={() => {
            setScreen('receive');
            setActiveAddress(aaAddress ?? '');
          }}
        >
          <ReceiveIcon color={theme.texts.primary} />
          Receive
        </ActionButton>
        <ActionButton
          variant="outline"
          onClick={() => {
            if (isLoading || !selectedCrypto || !selectedCurrency) {
              return;
            }
            setScreen('onramp');
            setActiveAddress(aaAddress ?? '');
          }}
        >
          <BuyIcon color={theme.texts.primary} />
          Buy
        </ActionButton>
      </ActionButtons>

      <p
        style={{
          fontSize: 14,
          fontWeight: 500,
          margin: 0,
          marginBottom: 12,
          color: theme.texts.primary
        }}
      >
        Chains
      </p>

      {smartAccount?.accounts?.map(aa => {
        return (
          <AssetItem
            style={{
              cursor: 'default',
              backgroundColor: theme.general.modalBackgroundSecondary
            }}
            key={aa.id}
          >
            <ChainImage id={aa?.chainId ?? 0} />
            <div style={{ flex: 1 }}>
              <AssetBalance>
                {chainNameMap[aa.chainId as keyof typeof chainNameMap] ||
                  aa.network}
              </AssetBalance>
              <ChainName>
                {statusMap[aa.status as keyof typeof statusMap] || 'Unknown'}
              </ChainName>
            </div>
            {aa.status === 'not_deployed' && (
              <StyledButton
                style={{ height: 32, fontSize: 12 }}
                disabled={isPending}
                onClick={() => mutate(aa.id)}
              >
                {isPending ? 'Activating...' : 'Activate'}
              </StyledButton>
            )}
          </AssetItem>
        );
      })}

      <AssetItem onClick={() => setScreen('home')}>
        <Avatar name={address ?? ''} size={24} />
        <div style={{ flex: 1 }}>
          <AssetBalance>Personal Wallet</AssetBalance>
          <ChainName style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
            {truncateAddress(address ?? '')}
          </ChainName>
        </div>
        <div style={{ transform: 'rotate(-90deg)' }}>
          <ChevronDownIcon color={theme.texts.secondary} />
        </div>
      </AssetItem>

      <DisconnectButton onClick={handleDisconnect}>
        Disconnect Wallet
      </DisconnectButton>
    </Wrapper>
  );
}

const Wrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0;
`;

const Header = styled.div`
  padding: 0 0 16px 0;
`;

const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleText = styled.p`
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  color: ${({ theme }) => theme.texts.primary};
`;

const CopyIconButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  padding-bottom: 16px;
`;

const ActionButton = styled(StyledButton)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  height: 38px;
`;

const AssetItem = styled.div`
  padding-left: 12px;
  padding-right: 12px;
  height: 62px;
  align-items: center;
  display: flex;
  margin-bottom: 12px;
  gap: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  border-radius: 12px;
  &:hover {
    background-color: ${({ theme }) => theme.general.modalBackgroundSecondary};
  }
`;

const AddressWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.general.modalBackgroundSecondary};
  margin-top: 16px;
`;

const AddressText = styled.p`
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.texts.secondary};
  font-family: monospace;
`;

const AssetBalance = styled.p`
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  color: ${({ theme }) => theme.texts.primary};
`;

const ChainName = styled.p`
  font-size: 12px;
  font-weight: 400;
  margin: 0;
  color: ${({ theme }) => theme.texts.secondary};
`;

const DisconnectButton = styled.div`
  padding: 14px 16px;
  cursor: pointer;
  color: ${({ theme }) => theme.danger};
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  border-radius: 12px;

  &:hover {
    background-color: ${({ theme }) => theme.general.modalBackgroundSecondary};
  }
`;

CopyIconButton.defaultProps = {
  role: 'button'
};
