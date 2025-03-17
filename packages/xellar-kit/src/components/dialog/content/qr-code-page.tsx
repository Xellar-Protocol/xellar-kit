import { BackIcon } from '@/assets/back-icon';
import { QRCode } from '@/components/qr-code/qr-code';
import { useWeb3 } from '@/providers/web3-provider';
import { styled } from '@/styles/styled';

import { useConnectModalStore } from '../store';
import {
  BackButton,
  Header,
  PassportContainer,
  RootContainer,
  Title
} from './passport-content/styled';
import { AnimatedContainer } from './styled';

export function QRCodePage() {
  const { back, direction, wallet } = useConnectModalStore();

  const { connect, error } = useWeb3();

  const handleBack = () => {
    back();
  };

  const uri = connect.getUri();

  const qrCodeUri = wallet?.getWalletConnectDeeplink
    ? wallet.getWalletConnectDeeplink(uri)
    : uri;

  const desktopUri = wallet?.getBrowserDeeplink
    ? wallet.getBrowserDeeplink(uri)
    : undefined;

  const getAnimationProps = () => ({
    initial: {
      opacity: 0,
      x: direction === 'back' ? -200 : 200
    },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: direction === 'back' ? 200 : -200 }
  });

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
          <Title>Scan QR Code</Title>
        </Header>

        <PassportContainer style={{ paddingTop: 24 }}>
          <QRCode
            uri={qrCodeUri}
            size={280}
            icon={<IconWrapper>{wallet!.icon}</IconWrapper>}
          />

          {error && <ErrorText>{error}</ErrorText>}

          {desktopUri && (
            <LinkButton onClick={() => window.open(desktopUri, '_blank')}>
              Open in Browser
            </LinkButton>
          )}
        </PassportContainer>
      </RootContainer>
    </AnimatedContainer>
  );
}

export const IconWrapper = styled.div`
  width: 42px;
  height: 42px;
  border: 1px solid ${({ theme }) => theme.colors.BORDER};
  background-color: ${({ theme }) => theme.colors.BACKGROUND};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.TEXT};
  cursor: pointer;

  svg {
    width: 50% !important;
    height: auto !important;
  }
`;

IconWrapper.defaultProps = {
  role: 'button'
};

const LinkButton = styled.div`
  cursor: pointer;
  color: ${({ theme }) => theme.colors.PRIMARY};
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  text-align: center;
  margin-top: 12px;
`;

const ErrorText = styled.p`
  color: #ff0000;
  font-size: 12px;
  margin-top: 8px;
  margin-left: 2px;
  margin-bottom: 0;
  margin-right: 0;
  max-width: 180px;
`;
