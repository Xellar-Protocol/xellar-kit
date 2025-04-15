import { useConnect } from 'wagmi';

import { BackIcon } from '@/assets/back-icon';
import { useWalletConnectModal } from '@/hooks/wallet-connect';
import { useWeb3 } from '@/providers/web3-provider';
import { useXellarContext } from '@/providers/xellar-kit';
import { styled } from '@/styles/styled';
import { isMobileDevice } from '@/utils/is-mobile';
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
  const { back, direction, push, setDirection, setWallet } =
    useConnectModalStore();

  const { closeModal } = useXellarContext();

  const { open } = useWalletConnectModal();

  const { connect } = useConnect();

  const { connect: web3connect } = useWeb3();

  const uri = web3connect.getUri();

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
                if (_wallet.connector.type === 'injected') {
                  if (_wallet.isInstalled) {
                    connect(
                      { connector: _wallet.connector },
                      {
                        onSuccess: () => {
                          closeModal();
                        }
                      }
                    );
                    return;
                  }
                }

                if (isMobileDevice()) {
                  if (
                    _wallet.id === 'walletConnect' ||
                    _wallet.id === 'reown'
                  ) {
                    open();
                    return;
                  }

                  const deeplink = _wallet?.getWalletConnectDeeplink
                    ? _wallet.getWalletConnectDeeplink(uri)
                    : null;

                  if (deeplink) {
                    const anchor = document.createElement('a');
                    anchor.href = deeplink;
                    anchor.click();
                  }

                  return;
                }

                setWallet(_wallet);
                setTimeout(() => {
                  setDirection('forward');
                  push('qr-code');
                }, 100);
              }}
            >
              <IconWrapper $size={40}>{_wallet.icon}</IconWrapper>
              <WalletName>{_wallet.name}</WalletName>
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
