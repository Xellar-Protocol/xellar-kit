import { motion } from 'motion/react';
import { useState } from 'react';
import { useTheme } from 'styled-components';
import { useAccount } from 'wagmi';

import { BackIcon } from '@/assets/back-icon';
import { CopyIcon } from '@/assets/copy-icon';
import { QRCode } from '@/components/qr-code/qr-code';
import { styled } from '@/styles/styled';
import { truncateAddress } from '@/utils/string';

import { BackButton, Header } from '../passport-content/styled';
import { Title } from '../styled';
import { useProfileDialogContext } from './profile-dialog';

export function ReceiveDialogContent() {
  const { setScreen } = useProfileDialogContext();
  const theme = useTheme();

  const handleBack = () => {
    setScreen('home');
  };

  const { address } = useAccount();

  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = async () => {
    if (isCopied) {
      setIsCopied(false);
    }
    if ('clipboard' in navigator) {
      await navigator.clipboard.writeText(address ?? '');
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }
  };

  return (
    <Wrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
    >
      <Header style={{ marginBottom: 20 }}>
        <BackButton role="button" onClick={handleBack}>
          <BackIcon width={16} height={16} />
        </BackButton>
        <Title>Receive</Title>
      </Header>
      <QRCodeContainer>
        <QRCode uri={address ?? ''} size={300} />
      </QRCodeContainer>
      <AddressInfo onClick={handleCopy} role="button">
        <AddressText>{truncateAddress(address ?? '')}</AddressText>
        <CopyIcon color={theme.texts.secondary} width={14} height={14} />
      </AddressInfo>
      {isCopied && <CopiedText>Copied to clipboard</CopiedText>}
    </Wrapper>
  );
}

const Wrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0;
`;

const QRCodeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AddressInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.general.modalBackground};
  border: 1px solid ${({ theme }) => theme.general.border};
  cursor: pointer;
  &:hover {
    border: 1px solid ${({ theme }) => theme.general.accent};
  }
  transition: background-color 0.2s ease-in-out;
`;

const AddressText = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.texts.primary};
  font-family: monospace;
`;

const CopiedText = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.texts.primary};
  margin-top: 10px;
  text-align: center;
`;
