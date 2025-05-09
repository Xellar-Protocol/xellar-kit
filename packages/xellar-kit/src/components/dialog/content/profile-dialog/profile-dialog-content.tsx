import { motion } from 'motion/react';
import { useState } from 'react';
import { useTheme } from 'styled-components';
import { formatUnits } from 'viem';
import { useAccount, useBalance, useDisconnect } from 'wagmi';

import { BuyIcon } from '@/assets/buy-icon';
import { CopyIcon } from '@/assets/copy-icon';
import { ReceiveIcon } from '@/assets/receive-icon';
import { SendIcon } from '@/assets/send-icon';
import { abbreviateETHBalance } from '@/components/connect-button/abbreviate-balance';
import { Avatar } from '@/components/ui/avatar';
import { StyledButton } from '@/components/ui/button';
import { useXellarContext } from '@/providers/xellar-kit';
import { styled } from '@/styles/styled';
import { truncateAddress } from '@/utils/string';

import { useProfileDialogContext } from './profile-dialog';

export function ProfileDialogContent() {
  const { setScreen, isLoading } = useProfileDialogContext();

  const { closeModal } = useXellarContext();
  const { disconnectAsync } = useDisconnect();
  const { address } = useAccount();

  const { data: balanceData } = useBalance({
    address
  });

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
    <Wrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
    >
      <Header>
        <WalletInfo>
          <Avatar name={address ?? ''} size={36} />
          <AddressWrapper>
            <AddressText>{truncateAddress(address ?? '')}</AddressText>
            <CopyIconButton onClick={handleCopy}>
              <CopyIcon color={theme.texts.secondary} width={14} height={14} />
            </CopyIconButton>
          </AddressWrapper>
        </WalletInfo>
      </Header>

      <ActionButtons>
        <ActionButton
          variant="outline"
          onClick={() => {
            // setScreen('offramp');
          }}
        >
          <SendIcon color={theme.texts.primary} />
          Send
        </ActionButton>
        <ActionButton
          variant="outline"
          onClick={() => {
            setScreen('receive');
          }}
        >
          <ReceiveIcon color={theme.texts.primary} />
          Receive
        </ActionButton>
        <ActionButton
          variant="outline"
          onClick={() => {
            if (isLoading) {
              return;
            }
            setScreen('onramp');
          }}
        >
          <BuyIcon color={theme.texts.primary} />
          Buy
        </ActionButton>
      </ActionButtons>

      <AssetList>
        <AssetItem>
          <AssetInfo>
            <p>Balance</p>
          </AssetInfo>
          <AssetBalance>
            {balanceData
              ? abbreviateETHBalance(
                  Number(formatUnits(balanceData.value, balanceData.decimals))
                )
              : '0.00'}{' '}
            {balanceData?.symbol}
          </AssetBalance>
        </AssetItem>
      </AssetList>

      {/* <MenuList>
        <MenuItem>
          <MenuItemText>Transactions</MenuItemText>
        </MenuItem>
        <MenuItem>
          <MenuItemText>View Funds</MenuItemText>
        </MenuItem>
        <MenuItem>
          <MenuItemText>Manage Wallet</MenuItemText>
        </MenuItem>
      </MenuList> */}

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
  padding: 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.general.border};
`;

const WalletInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AddressWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AddressText = styled.p`
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
  padding: 16px 0;
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

const AssetList = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${({ theme }) => theme.general.border};
`;

const AssetItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  align-items: center;
`;

const AssetInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AssetBalance = styled.p`
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  color: ${({ theme }) => theme.texts.primary};
`;

const DisconnectButton = styled.div`
  padding: 14px 16px;
  cursor: pointer;
  color: ${({ theme }) => theme.danger};
  font-size: 14px;
  font-weight: 500;
  text-align: center;

  &:hover {
    background-color: ${({ theme }) => theme.general.modalBackgroundSecondary};
  }
`;

CopyIconButton.defaultProps = {
  role: 'button'
};
