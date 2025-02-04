import { AnimatePresence } from 'motion/react';
import { useState } from 'react';
import styled from 'styled-components';

import { SpinnerIcon } from '@/assets/spinner';
import { useConnectors } from '@/hooks/connectors';
import { useWalletConnection } from '@/hooks/use-wallet-connection';
import { useWalletIcon } from '@/hooks/use-wallet-icon';
import { useXellarContext } from '@/providers/xellar-kit';

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
  const connectors = useConnectors();
  const { theme } = useXellarContext();

  console.log(connectors);

  const {
    selectedConnectorMobile: selectedConnector,
    isConnecting,
    onWalletConnect
  } = useWalletConnection();

  const renderIcon = useWalletIcon(theme);

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
          {connectors
            .filter(c => c.type !== 'injected')
            .map(connector => (
              <WalletItem
                key={connector.uid}
                onClick={() => {
                  onWalletConnect(connector);
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
