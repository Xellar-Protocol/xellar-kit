import { motion } from 'motion/react';
import { useState } from 'react';
import styled, { useTheme } from 'styled-components';

import { CopyIcon } from '@/assets/copy-icon';
import { QRCode } from '@/components/qr-code/qr-code';
import { WalletProps } from '@/wallets/use-wallet';

import {
  AnimatedContainer,
  IconWrapper,
  InnerQRCodeWrapper,
  Title
} from '../styled';
interface WalletConnectModalContentProps {
  isConnecting: boolean;
  uri: string;
  wallet: WalletProps | null;
  rawUri: string;
  browserUrl?: string | null;
}

export function WalletConnectModalContent({
  isConnecting,
  uri,
  wallet,
  rawUri,
  browserUrl
}: WalletConnectModalContentProps) {
  const theme = useTheme();
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = async () => {
    if (isCopied) {
      setIsCopied(false);
    }
    if ('clipboard' in navigator) {
      await navigator.clipboard.writeText(rawUri);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }
  };

  const renderIcon = () => {
    if (!wallet) return null;
    return wallet.icon;
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

        {browserUrl && !isCopied && (
          <WebUrl href={browserUrl} target="_blank" rel="noopener noreferrer">
            Open in browser
          </WebUrl>
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

const WebUrl = styled(motion.a)`
  font-size: 12px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.PRIMARY_ACCENT};
  &:hover {
    color: ${({ theme }) => theme.colors.PRIMARY};
  }
`;
