import { AnimatePresence } from 'motion/react';
import { useState } from 'react';
import styled from 'styled-components';

import { SpinnerIcon } from '@/assets/spinner';
import { useWalletConnection } from '@/hooks/use-wallet-connection';
import { useWallets } from '@/wallets/use-wallet';

import { PassportContent } from './passport-content/passport-content';
import {
  Container,
  Description,
  IconWrapper,
  Separator,
  Title,
  TitleSpan,
  WalletItem,
  WalletName,
  Wrapper
} from './styled';

export function ConnectDialogMobileContent() {
  const wallets = useWallets();

  const { wallet, setWallet, isConnecting } = useWalletConnection();

  const [showPassportContent] = useState(false);

  const renderContent = () => {
    if (showPassportContent) return <PassportContent />;

    return (
      <Container $isMobile>
        <Title>
          Connect <TitleSpan>Wallet</TitleSpan>
        </Title>
        <Separator />

        <Description>
          Wallets are used to send, receive, store, and display digital assets
          like Ethereum and NFTs.
        </Description>

        <ConnectorList>
          {wallets.map(_wallet => (
            <WalletItem
              key={_wallet.id}
              onClick={() => {
                setWallet(_wallet);
              }}
              selected={_wallet.id === wallet?.id}
            >
              <IconWrapper>{_wallet.icon}</IconWrapper>
              <WalletName>{_wallet.name}</WalletName>
              {_wallet.id === wallet?.id && isConnecting && <SpinnerIcon />}
            </WalletItem>
          ))}
        </ConnectorList>
      </Container>
    );
  };

  return (
    <Wrapper>
      <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
    </Wrapper>
  );
}

const ConnectorList = styled.div`
  overflow-y: auto;
`;

/* <WalletItem
          selected={showPassportContent}
          onClick={() => {
            setShowPassportContent(true);
            setUri(null);
          }}
        >
          <IconWrapper>
            {theme === 'light' ? <XellarDark /> : <XellarLight />}
          </IconWrapper>
          <WalletName>Xellar Passport</WalletName>
        </WalletItem> */
