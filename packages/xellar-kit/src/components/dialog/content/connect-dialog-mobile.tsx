import { AnimatePresence } from 'motion/react';
import { useState } from 'react';

import { SpinnerIcon } from '@/assets/spinner';
import { useWalletConnection } from '@/hooks/use-wallet-connection';
import { styled } from '@/styles/styled';
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

  const { setWallet, isConnecting } = useWalletConnection();

  const [walletId, setWalletId] = useState<string | null>(null);

  const renderContent = () => {
    if (walletId === 'xellar-passport')
      return (
        <PassportContent onBack={() => setWalletId(null)} showBackButton />
      );

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
                setWalletId(_wallet.id);
                if (_wallet.id !== 'xellar-passport') {
                  setWallet(_wallet);
                } else {
                  setWallet(null);
                }
              }}
              selected={_wallet.id === walletId}
            >
              <IconWrapper>{_wallet.icon}</IconWrapper>
              <WalletName>{_wallet.name}</WalletName>
              {_wallet.id === walletId && isConnecting && <SpinnerIcon />}
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
