import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';

import { StyledButton } from '@/components/ui/button';
import { useXellarContext } from '@/providers/xellar-kit';
import { styled } from '@/styles/styled';

import { useConnectModalStore } from '../../store';
import { AnimatedContainer, Description } from '../styled';
import { RootContainer, Title } from './styled';

export function WalletCreatedPage() {
  const { closeModal } = useXellarContext();
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

          <Description style={{ textAlign: 'center', margin: '24px auto' }}>
            Please save your recovery secret in a safe place. {"You'll"} need it
            to recover your wallet if you lose access.
          </Description>

          <ButtonWrapper>
            <StyledButton style={{ flex: 1 }} onClick={handleCopy}>
              Copy
            </StyledButton>
            <StyledButton style={{ flex: 1 }} onClick={handleDownload}>
              Download
            </StyledButton>
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

          <StyledButton
            variant="outline"
            style={{ marginTop: 12, width: '100%' }}
            onClick={closeModal}
          >
            Done
          </StyledButton>
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

const CopiedText = styled(motion.p)`
  font-size: 10px;
  color: ${({ theme }) => theme.texts.secondary};
  text-align: center;
  margin-top: 12px;
`;
