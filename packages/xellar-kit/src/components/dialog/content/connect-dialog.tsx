import { useCallback, useState } from 'react';
import { Connector, useConnect } from 'wagmi';

import { GenericWalletIcon } from '@/assets/generic-wallet';
import { IndodaxIcon } from '@/assets/indodax';
import { ReownLightIcon } from '@/assets/reown-light';
import { SpinnerIcon } from '@/assets/spinner';
import { WalletConnectIcon } from '@/assets/wallet-connect';
import { XellarLight } from '@/assets/xellar-light';
import { QRCode } from '@/components/qr-code/qr-code';
import { useInjectedConnectors } from '@/hooks/connectors';
import { useWalletConnectUri } from '@/hooks/wallet-connect';
import { useXellarContext } from '@/providers/xellar-kit';

import {
  Container,
  Description,
  Icon,
  IconWrapper,
  InnerQRCodeWrapper,
  QRCodeWrapper,
  Separator,
  Title,
  TitleSpan,
  WalletItem,
  WalletName,
  Wrapper
} from './styled';

export function ConnectDialogContent() {
  const injectedConnectors = useInjectedConnectors();
  const { setModalOpen } = useXellarContext();

  const { connectAsync } = useConnect();

  const [isConnectingInjected, setIsConnectingInjected] = useState(false);
  const [selectedInjectedWalletId, setSelectedInjectedWalletId] = useState<
    string | null
  >(null);

  const [selectedWallet, setSelectedWallet] = useState<
    (typeof walletconnectCompatibleWallets)[number] | null
  >(null);

  const [timestamp, setTimestamp] = useState<string>(new Date().toISOString());

  const { uri, isConnecting } = useWalletConnectUri({
    enabled: !!selectedWallet,
    timestamp
  });

  const handleConnectInjected = useCallback(
    async (connector: Connector) => {
      setIsConnectingInjected(true);
      setSelectedInjectedWalletId(connector.uid);
      setSelectedWallet(null);
      await connectAsync(
        { connector },
        {
          onSuccess: () => {
            setIsConnectingInjected(false);
            setSelectedInjectedWalletId(null);
            setModalOpen(false);
          },
          onSettled: () => {
            setIsConnectingInjected(false);
            setSelectedInjectedWalletId(null);
          }
        }
      );
    },
    [connectAsync, setModalOpen]
  );

  const handleConnectWalletConnect = useCallback(
    async (wallet: (typeof walletconnectCompatibleWallets)[number]) => {
      if (isConnecting) return;
      if (selectedWallet?.id === wallet.id) return;
      setSelectedWallet(wallet);
      setSelectedInjectedWalletId(null);
      setIsConnectingInjected(false);
      setTimestamp(new Date().toISOString());
    },
    [isConnecting, selectedWallet]
  );

  const renderIcon = useCallback((id: string, icon?: string) => {
    if (icon) return <Icon src={icon} alt={id} />;
    return <GenericWalletIcon />;
  }, []);

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

        <WalletItem>
          <IconWrapper>
            <XellarLight />
          </IconWrapper>
          <WalletName>Xellar Passport</WalletName>
        </WalletItem>

        {walletconnectCompatibleWallets.map(wallet => (
          <WalletItem
            key={wallet.id}
            selected={selectedWallet?.id === wallet.id}
            onClick={() => {
              handleConnectWalletConnect(wallet);
            }}
          >
            <IconWrapper>
              <wallet.Icon />
            </IconWrapper>
            <WalletName>{wallet.name}</WalletName>
            {selectedWallet?.id === wallet.id && isConnecting && (
              <SpinnerIcon />
            )}
          </WalletItem>
        ))}
      </Container>

      {uri && selectedWallet && (
        <QRCodeWrapper>
          <Title>Scan With Your Phone</Title>
          <InnerQRCodeWrapper>
            <QRCode
              blur={isConnecting}
              icon={
                <IconWrapper size={48}>
                  <selectedWallet.Icon width={32} height={32} />
                </IconWrapper>
              }
              size={320}
              uri={uri}
            />
          </InnerQRCodeWrapper>
        </QRCodeWrapper>
      )}
    </Wrapper>
  );
}

const walletconnectCompatibleWallets = [
  { id: 'xellar-mobile', name: 'Xellar Mobile', Icon: XellarLight },
  { id: 'indodax', name: 'Indodax', Icon: IndodaxIcon },
  { id: 'reown', name: 'Reown', Icon: ReownLightIcon },
  { id: 'walletconnect', name: 'WalletConnect', Icon: WalletConnectIcon }
];
