import { AnimatePresence } from 'motion/react';
import { useState } from 'react';
import styled from 'styled-components';

import { SpinnerIcon } from '@/assets/spinner';
import { useWalletConnection } from '@/hooks/use-wallet-connection';
import { useWallets } from '@/wallets/use-wallet';

import { PassportContent } from './passport-content/passport-content';
import {
  ConnectContentWrapper,
  Container,
  Description,
  EmptyStateWrapper,
  IconWrapper,
  Separator,
  Title,
  TitleSpan,
  WalletItem,
  WalletName,
  Wrapper
} from './styled';
import { WalletConnectModalContent } from './wallet-connect/wallet-connect';

export function ConnectDialogContent() {
  const wallets = useWallets();

  const { wallet, setWallet, uri, isConnecting } = useWalletConnection();

  // const deeplink =
  //   (!wallet?.isInstalled && isMobile) ||
  //   (wallet?.shouldDeeplinkDesktop && !isMobile)
  //     ? wallet?.getWalletConnectDeeplink?.(uri ?? '')
  //     : undefined;

  const deeplink = wallet?.getBrowserDeeplink
    ? wallet?.getWalletConnectDeeplink?.(uri ?? '')
    : uri;

  // const redirectToMoreWallets = isMobile && isWalletConnectConnector(wallet.id);

  const browserUrl = uri ? wallet?.getBrowserDeeplink?.(uri) : null;

  const [showPassportContent] = useState(false);

  const renderContent = () => {
    if (showPassportContent) return <PassportContent />;

    // If MetaMask is selected but not installed, and we have a QR code URI
    if (wallet?.id.includes('metaMask') && !wallet.isInstalled && uri) {
      return (
        <WalletConnectModalContent
          isConnecting={isConnecting}
          uri={uri}
          wallet={wallet}
          rawUri={uri}
          browserUrl={browserUrl}
        />
      );
    }

    // If we have a deeplink (for other wallets) and wallet is selected
    if (deeplink && wallet && uri) {
      return (
        <WalletConnectModalContent
          isConnecting={isConnecting}
          uri={deeplink}
          wallet={wallet}
          rawUri={uri}
          browserUrl={browserUrl}
        />
      );
    }

    return (
      <EmptyStateWrapper>
        <Description style={{ textAlign: 'center' }}>
          Choose a wallet on the left to get started. Wallets let you send,
          receive, and store digital assets securely.
        </Description>
      </EmptyStateWrapper>
    );
  };

  return (
    <Wrapper>
      <Container $isMobile={false}>
        <Title>
          Connect <TitleSpan>Wallet</TitleSpan>
        </Title>
        <Separator />

        <Description>
          Wallets are used to send, receive, store, and display digital assets
          like Ethereum and NFTs.
        </Description>

        <ConnectorList>
          {wallets.map(_wallet => {
            return (
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
            );
          })}
        </ConnectorList>
      </Container>

      <ConnectContentWrapper>
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </ConnectContentWrapper>
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
