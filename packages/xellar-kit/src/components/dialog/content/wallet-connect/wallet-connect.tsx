import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import styled, { useTheme } from 'styled-components';

import { CopyIcon } from '@/assets/copy-icon';
import { QRCode } from '@/components/qr-code/qr-code';
import { WalletConnectCompatibleWallet } from '@/constants/wallet';

import {
  AnimatedContainer,
  IconWrapper,
  InnerQRCodeWrapper,
  Title
} from '../styled';

interface WalletConnectModalContentProps {
  isConnecting: boolean;
  wallet: WalletConnectCompatibleWallet;
  uri: string;
}

export function WalletConnectModalContent({
  isConnecting,
  wallet,
  uri
}: WalletConnectModalContentProps) {
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

  return (
    <AnimatedContainer>
      <TitleContainer>
        <StyledTitle>Scan With Your Phone</StyledTitle>
        <CopyIconWrapper onClick={handleCopy}>
          <CopyIcon color={theme.colors.TEXT_SECONDARY} />
        </CopyIconWrapper>
      </TitleContainer>

      <InnerQRCodeWrapper>
        <QRCode
          blur={isConnecting}
          icon={
            <IconWrapper size={48}>
              <wallet.Icon width={32} height={32} />
            </IconWrapper>
          }
          size={320}
          uri={uri}
        />
        <AnimatePresence>
          {isCopied && (
            <CopiedText
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Copied to clipboard
            </CopiedText>
          )}
        </AnimatePresence>
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
