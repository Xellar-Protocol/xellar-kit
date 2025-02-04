import { motion } from 'motion/react';
import { useState } from 'react';
import styled, { useTheme } from 'styled-components';

import { CopyIcon } from '@/assets/copy-icon';
import { MetaMaskIcon } from '@/assets/metamask';
import { QRCode } from '@/components/qr-code/qr-code';
import { WALLET_CONNECT_COMPATIBLE_WALLETS } from '@/constants/wallet';
import { useXellarContext } from '@/providers/xellar-kit';

import {
  AnimatedContainer,
  IconWrapper,
  InnerQRCodeWrapper,
  Title
} from '../styled';

interface WalletConnectModalContentProps {
  isConnecting: boolean;
  walletId: string;
  uri: string;
}

export function WalletConnectModalContent({
  isConnecting,
  uri,
  walletId
}: WalletConnectModalContentProps) {
  const { theme: xTheme } = useXellarContext();
  const theme = useTheme();
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = async () => {
    if (isCopied) {
      setIsCopied(false);
    }
    if ('clipboard' in navigator) {
      await navigator.clipboard.writeText(uri);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }
  };

  const renderIcon = () => {
    const currentWallet = WALLET_CONNECT_COMPATIBLE_WALLETS.find(
      wallet => wallet.id === walletId
    )!;

    const DarkIcon = currentWallet.Icon;
    const LightIcon = currentWallet.IconLight;

    return xTheme === 'light' ? (
      <LightIcon width={24} height={24} />
    ) : (
      <DarkIcon width={24} height={24} />
    );
  };

  return (
    <AnimatedContainer
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      <TitleContainer>
        <StyledTitle>Scan With Your Phone</StyledTitle>
        <CopyIconWrapper onClick={handleCopy}>
          <CopyIcon color={theme.colors.TEXT_SECONDARY} />
        </CopyIconWrapper>
      </TitleContainer>

      <InnerQRCodeWrapper>
        <QRCode
          blur={isConnecting}
          icon={<IconWrapper $size={48}>{renderIcon()}</IconWrapper>}
          size={320}
          uri={uri}
        />
        {isCopied && (
          <CopiedText
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Copied to clipboard
          </CopiedText>
        )}
      </InnerQRCodeWrapper>
    </AnimatedContainer>
  );
}

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StyledTitle = styled(Title)`
  flex-shrink: 0;
`;

const CopyIconWrapper = styled.div`
  cursor: pointer;
`;
CopyIconWrapper.defaultProps = {
  role: 'button'
};

const CopiedText = styled(motion.p)`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.TEXT_SECONDARY};
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
`;
