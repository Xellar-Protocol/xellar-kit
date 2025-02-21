import { useState } from 'react';
import styled from 'styled-components';

import { BackIcon } from '@/assets/back-icon';
import { SpinnerIcon } from '@/assets/spinner';
import { useWalletConnection } from '@/hooks/use-wallet-connection';
import { useWallets } from '@/wallets/use-wallet';

import { useConnectModalStore } from '../store';
import { BackButton, Header, RootContainer } from './passport-content/styled';
import {
  AnimatedContainer,
  Description,
  IconWrapper,
  Title,
  WalletItem,
  WalletName
} from './styled';

export function ConnectDialogWalletList() {
  const { back, direction } = useConnectModalStore();

  const handleBack = () => {
    back();
  };

  const getAnimationProps = () => ({
    initial: {
      opacity: 0,
      x: direction === 'back' ? -200 : 200
    },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: direction === 'back' ? 200 : -200 }
  });

  const wallets = useWallets();

  const { setWallet, isConnecting } = useWalletConnection();

  const [walletId, setWalletId] = useState<string | null>(null);

  return (
    <AnimatedContainer
      {...getAnimationProps()}
      transition={{
        duration: 0.2,
        type: 'spring',
        bounce: 0
      }}
    >
      <RootContainer>
        <Header>
          <BackButton role="button" onClick={handleBack}>
            <BackIcon width={16} height={16} />
          </BackButton>
          <Title>Connect Wallet</Title>
        </Header>

        <Description>
          Wallets are used to send, receive, store, and display digital assets
          like Ethereum and NFTs.
        </Description>

        <ConnectorList>
          {wallets.map(_wallet => (
            <WalletItem
              key={_wallet.id}
              onClick={() => {
                setWalletId(_wallet.id);
                if (_wallet.id !== 'xellar-passport') {
                  setWallet(_wallet);
                } else {
                  setWallet(null);
                }
              }}
              selected={_wallet.id === walletId}
            >
              <IconWrapper $size={40}>{_wallet.icon}</IconWrapper>
              <WalletName>{_wallet.name}</WalletName>
              {_wallet.id === walletId && isConnecting && <SpinnerIcon />}
            </WalletItem>
          ))}
        </ConnectorList>
      </RootContainer>
    </AnimatedContainer>
  );
}

const ConnectorList = styled.div`
  margin-top: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
