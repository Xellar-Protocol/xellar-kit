import { motion } from 'motion/react';
import { useState } from 'react';
import { useTheme } from 'styled-components';
import { formatUnits } from 'viem';
import {
  useAccount,
  useBalance,
  useChainId,
  useChains,
  useDisconnect
} from 'wagmi';

import { BuyIcon } from '@/assets/buy-icon';
import { ChevronDownIcon } from '@/assets/chevron-down';
import { CopyIcon } from '@/assets/copy-icon';
import { ReceiveIcon } from '@/assets/receive-icon';
// import { SendIcon } from '@/assets/send-icon';
import { abbreviateETHBalance } from '@/components/connect-button/abbreviate-balance';
import { Avatar } from '@/components/ui/avatar';
import { StyledButton } from '@/components/ui/button';
import { ChainImage } from '@/components/ui/chain-image';
import { useSmartAccount } from '@/hooks/account-abstraction';
import { useXellarContext } from '@/providers/xellar-kit';
import { styled } from '@/styles/styled';
import { truncateAddress } from '@/utils/string';

import { useProfileDialogContext } from './profile-dialog';

export function ProfileDialogContent() {
  const {
    setScreen,
    setActiveAddress,
    isLoading,
    selectedCrypto,
    selectedCurrency
  } = useProfileDialogContext();

  const { smartAccount } = useSmartAccount();

  const aaAddress = smartAccount?.accounts[0]?.aaAddress;

  const { closeModal } = useXellarContext();
  const { disconnectAsync } = useDisconnect();
  const { address } = useAccount();
  const chainId = useChainId();
  const chains = useChains();
  const { data: balanceData } = useBalance({
    address,
    chainId
  });

  const chain = chains.find(chain => chain.id === chainId);

  const handleDisconnect = async () => {
    console.log('disconnecting');
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
        <HeaderInfo>
          <Avatar name={address ?? ''} size={36} />
          <TitleWrapper>
            <TitleText style={{ fontWeight: 'bold' }}>
              Personal Wallet
            </TitleText>
            <TitleText style={{ fontSize: 12, color: theme.texts.secondary }}>
              Default EOA Wallet
            </TitleText>
          </TitleWrapper>
        </HeaderInfo>

        <AddressWrapper>
          <AddressText>{truncateAddress(address ?? '')}</AddressText>
          <CopyIconButton onClick={handleCopy}>
            <CopyIcon color={theme.texts.secondary} width={14} height={14} />
          </CopyIconButton>
        </AddressWrapper>
      </Header>

      <ActionButtons>
        {/* <ActionButton
          variant="outline"
          onClick={() => {
            // setScreen('offramp');
          }}
        >
          <SendIcon color={theme.texts.primary} />
          Send
        </ActionButton> */}
        <ActionButton
          variant="outline"
          onClick={() => {
            setScreen('receive');
            setActiveAddress(address ?? '');
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
            setActiveAddress(address ?? '');
          }}
        >
          <BuyIcon color={theme.texts.primary} />
          Buy
        </ActionButton>
      </ActionButtons>

      <AssetItem onClick={() => setScreen('chain')}>
        <ChainImage id={chainId ?? 0} />
        <div style={{ flex: 1 }}>
          <AssetBalance>
            {abbreviateETHBalance(
              Number(
                formatUnits(
                  balanceData?.value ?? 0n,
                  balanceData?.decimals ?? 18
                )
              )
            )}{' '}
            {balanceData?.symbol}
          </AssetBalance>
          <ChainName>{chain?.name}</ChainName>
        </div>
        <div style={{ transform: 'rotate(-90deg)' }}>
          <ChevronDownIcon color={theme.texts.secondary} />
        </div>
      </AssetItem>
      {aaAddress && (
        <AssetItem onClick={() => setScreen('smart-account')}>
          <Avatar name={aaAddress ?? ''} size={24} />
          <div style={{ flex: 1 }}>
            <AssetBalance>Smart Wallet</AssetBalance>
            <ChainName style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
              {truncateAddress(aaAddress)}
            </ChainName>
          </div>
          <div style={{ transform: 'rotate(-90deg)' }}>
            <ChevronDownIcon color={theme.texts.secondary} />
          </div>
        </AssetItem>
      )}

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
