import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';
import styled from 'styled-components';

import { StyledButton } from '@/components/ui/button';

import { useConnectModalStore } from '../../store';
import { AnimatedContainer, Description } from '../styled';
import { RootContainer, Title } from './styled';

export function WalletCreatedPage() {
  const { recoverySecret } = useConnectModalStore();
  const [isCopied, setIsCopied] = useState(false);

  const handleDownload = () => {
    if (!recoverySecret) {
      return;
    }
    const element = document.createElement('a');
    const file = new Blob([recoverySecret], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'wallet-recovery-secret.xellar';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopy = async () => {
    if (!recoverySecret) {
      return;
    }
    if (isCopied) {
      return;
    }
    if ('clipboard' in navigator) {
      await navigator.clipboard.writeText(recoverySecret);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }
  };

  return (
    <AnimatedContainer
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      <RootContainer>
        <Container>
          <Title style={{ textAlign: 'center' }}>
            Wallet Created Successfully! 🎉
          </Title>

          <Description style={{ textAlign: 'center', margin: '24px 0' }}>
            Please save your recovery secret in a safe place. {"You'll"} need it
            to recover your wallet if you lose access.
          </Description>

          <ButtonWrapper>
            <DownloadORCopyButton onClick={handleCopy}>
              Copy
            </DownloadORCopyButton>
            <DownloadORCopyButton onClick={handleDownload}>
              Download
            </DownloadORCopyButton>
          </ButtonWrapper>

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

          <DoneButton>Done</DoneButton>
        </Container>
      </RootContainer>
    </AnimatedContainer>
  );
}

const Container = styled.div`
  margin: auto 0;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 12px;
  margin-top: 12px;
`;

const DownloadORCopyButton = styled(StyledButton)`
  height: 42px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.BG_SECONDARY};
  flex: 1;
  padding: 0 0;
  font-size: 12px;

  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.PRIMARY};
  }
`;

DownloadORCopyButton.defaultProps = {
  role: 'button'
};

const CopiedText = styled(motion.p)`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.TEXT_SECONDARY};
  text-align: center;
  margin-top: 12px;
`;

const DoneButton = styled.div`
  height: 42px;
  color: ${({ theme }) => theme.colors.PRIMARY};
  margin-top: 12px;
  cursor: pointer;
  font-size: 12px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

DoneButton.defaultProps = {
  role: 'button'
};
