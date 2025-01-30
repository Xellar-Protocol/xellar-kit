import { AnimatePresence } from 'motion/react';
import { useState } from 'react';

import { SpinnerIcon } from '@/assets/spinner';
import { useConnectors } from '@/hooks/connectors';
import { useWalletConnection } from '@/hooks/use-wallet-connection';
import { useWalletIcon } from '@/hooks/use-wallet-icon';
import { useXellarContext } from '@/providers/xellar-kit';

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
  const connectors = useConnectors();
  const { theme } = useXellarContext();
  const { selectedConnector, setSelectedConnector, uri, isConnecting } =
    useWalletConnection();
  const renderIcon = useWalletIcon(theme);

  const [showPassportContent] = useState(false);

  const renderContent = () => {
    if (showPassportContent) return <PassportContent />;
    if (uri) {
      return (
        <WalletConnectModalContent
          isConnecting={isConnecting}
          walletId={selectedConnector?.id ?? ''}
          uri={uri}
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
      <Container>
        <Title>
          Connect <TitleSpan>Wallet</TitleSpan>
        </Title>
        <Separator />

        <Description>
          Wallets are used to send, receive, store, and display digital assets
          like Ethereum and NFTs.
        </Description>

        {/* <WalletItem
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
        </WalletItem> */}

        {connectors.map(connector => (
          <WalletItem
            key={connector.uid}
            onClick={() => {
              setSelectedConnector(connector);
            }}
            selected={selectedConnector?.id === connector.id}
          >
            <IconWrapper>
              {renderIcon(connector.id, connector.icon)}
            </IconWrapper>
            <WalletName>{connector.name}</WalletName>
            {selectedConnector?.id === connector.id && isConnecting && (
              <SpinnerIcon />
            )}
          </WalletItem>
        ))}
      </Container>

      <ConnectContentWrapper>
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </ConnectContentWrapper>
    </Wrapper>
  );
}
