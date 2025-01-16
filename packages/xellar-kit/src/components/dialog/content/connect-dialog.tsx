import { motion } from 'motion/react';
import styled from 'styled-components';

import { MetaMaskIcon } from '@/assets/metamask';

export function ConnectDialogContent() {
  return (
    <Container>
      <Title>Connect Wallet</Title>

      <WalletItem role="button">
        <IconWrapper>
          <MetaMaskIcon />
        </IconWrapper>
        <WalletName>MetaMask</WalletName>
      </WalletItem>
      <WalletItem role="button">
        <IconWrapper>
          <MetaMaskIcon />
        </IconWrapper>
        <WalletName>MetaMask</WalletName>
      </WalletItem>
      <WalletItem role="button">
        <IconWrapper>
          <MetaMaskIcon />
        </IconWrapper>
        <WalletName>MetaMask</WalletName>
      </WalletItem>
      <WalletItem role="button">
        <IconWrapper>
          <MetaMaskIcon />
        </IconWrapper>
        <WalletName>MetaMask</WalletName>
      </WalletItem>
      <WalletItem role="button">
        <IconWrapper>
          <MetaMaskIcon />
        </IconWrapper>
        <WalletName>MetaMask</WalletName>
      </WalletItem>
      <WalletItem role="button">
        <IconWrapper>
          <MetaMaskIcon />
        </IconWrapper>
        <WalletName>MetaMask</WalletName>
      </WalletItem>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: -0.02em;
`;

const WalletItem = styled(motion.div)`
  height: 40px;
  transition: background-color 0.15s ease-in-out;
  border-radius: 8px;
  display: flex;
  padding: 0 8px;
  gap: 8px;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.colors.BORDER};
  }
`;

const WalletName = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  font-weight: 500;
  letter-spacing: -0.02em;
  flex: 1;
`;

const IconWrapper = styled.div`
  width: 28px;
  height: 28px;
  border: 1px solid ${({ theme }) => theme.colors.BORDER};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
