import { AnimatePresence } from 'motion/react';
import { useCallback, useState } from 'react';
import { Connector, useConnect } from 'wagmi';

import { GenericWalletIcon } from '@/assets/generic-wallet';
import { SpinnerIcon } from '@/assets/spinner';
import { XellarDark } from '@/assets/xellar-dark';
import { XellarLight } from '@/assets/xellar-light';
import {
  WALLET_CONNECT_COMPATIBLE_WALLETS,
  WalletConnectCompatibleWallet
} from '@/constants/wallet';
import { useInjectedConnectors } from '@/hooks/connectors';
import { useWalletConnectUri } from '@/hooks/wallet-connect';
import { useXellarContext } from '@/providers/xellar-kit';

import { PassportContent } from './passport-content/passport-content';
import {
  ConnectContentWrapper,
  Container,
  Description,
  EmptyStateWrapper,
  Icon,
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
  const injectedConnectors = useInjectedConnectors();
  const { closeModal, theme } = useXellarContext();

  const { connectAsync } = useConnect();

  const [isConnectingInjected, setIsConnectingInjected] = useState(false);
  const [selectedInjectedWalletId, setSelectedInjectedWalletId] = useState<
    string | null
  >(null);

  const [selectedWallet, setSelectedWallet] =
    useState<WalletConnectCompatibleWallet | null>(null);

  const [timestamp, setTimestamp] = useState<string>(new Date().toISOString());

  const { uri, isConnecting } = useWalletConnectUri({
    enabled: !!selectedWallet,
    timestamp
  });

  const [showPassportContent, setShowPassportContent] = useState(false);

  const handleConnectInjected = useCallback(
    async (connector: Connector) => {
      setIsConnectingInjected(true);
      setSelectedInjectedWalletId(connector.uid);
      setSelectedWallet(null);
      setShowPassportContent(false);
      await connectAsync(
        { connector },
        {
          onSuccess: () => {
            setIsConnectingInjected(false);
            setSelectedInjectedWalletId(null);
            closeModal();
          },
          onSettled: () => {
            setIsConnectingInjected(false);
            setSelectedInjectedWalletId(null);
          },
          onError: () => {
            setIsConnectingInjected(false);
            setSelectedInjectedWalletId(null);
          }
        }
      );
    },
    [connectAsync, closeModal]
  );

  const handleConnectWalletConnect = useCallback(
    async (wallet: WalletConnectCompatibleWallet) => {
      if (isConnecting) return;
      if (selectedWallet?.id === wallet.id) return;
      if (showPassportContent) {
        setShowPassportContent(false);
      }
      setSelectedWallet(wallet);
      setSelectedInjectedWalletId(null);
      setIsConnectingInjected(false);
      setTimestamp(new Date().toISOString());
    },
    [isConnecting, selectedWallet, showPassportContent]
  );

  const renderIcon = useCallback((id: string, icon?: string) => {
    if (icon) return <Icon src={icon} alt={id} />;
    return <GenericWalletIcon />;
  }, []);

  const renderContent = useCallback(() => {
    if (showPassportContent) return <PassportContent />;
    if (uri && selectedWallet) {
      return (
        <WalletConnectModalContent
          isConnecting={isConnecting}
          wallet={selectedWallet}
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
  }, [showPassportContent, uri, selectedWallet, isConnecting]);

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

        {injectedConnectors.map(connector => (
          <WalletItem
            key={connector.uid}
            onClick={() => handleConnectInjected(connector)}
            selected={selectedInjectedWalletId === connector.uid}
          >
            <IconWrapper>
              {renderIcon(connector.id, connector.icon)}
            </IconWrapper>
            <WalletName>{connector.name}</WalletName>
            {selectedInjectedWalletId === connector.uid &&
              isConnectingInjected && <SpinnerIcon />}
          </WalletItem>
        ))}

        <WalletItem
          selected={showPassportContent}
          onClick={() => {
            setShowPassportContent(true);
            setSelectedWallet(null);
            setSelectedInjectedWalletId(null);
            setIsConnectingInjected(false);
          }}
        >
          <IconWrapper>
            {theme === 'light' ? <XellarDark /> : <XellarLight />}
          </IconWrapper>
          <WalletName>Xellar Passport</WalletName>
        </WalletItem>

        {WALLET_CONNECT_COMPATIBLE_WALLETS.map(wallet => (
          <WalletItem
            key={wallet.id}
            selected={selectedWallet?.id === wallet.id}
            onClick={() => {
              handleConnectWalletConnect(wallet);
            }}
          >
            <IconWrapper>
              {theme === 'light' ? <wallet.IconLight /> : <wallet.Icon />}
            </IconWrapper>
            <WalletName>{wallet.name}</WalletName>
            {selectedWallet?.id === wallet.id && isConnecting && (
              <SpinnerIcon />
            )}
          </WalletItem>
        ))}
      </Container>

      <ConnectContentWrapper>
        <AnimatePresence>{renderContent()}</AnimatePresence>
      </ConnectContentWrapper>
    </Wrapper>
  );
}
