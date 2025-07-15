import { useState } from 'react';
import { useTheme } from 'styled-components';
import { useShallow } from 'zustand/react/shallow';

import { useTransactionConfirmStore } from '@/components/dialog/store';
import { StyledButton } from '@/components/ui/button';
import { useXellarAccount } from '@/hooks/use-xellar-account';
import { styled } from '@/styles/styled';

import { Illustration } from './illustration';

export function NeedPermissionDialog() {
  const { general } = useTheme();

  const [, setError] = useState<string>('');
  const { onConfirmAction } = useTransactionConfirmStore(
    useShallow(state => ({
      onConfirmAction: state.onConfirmAction
    }))
  );

  const xellarAccount = useXellarAccount();

  // Handle confirmation with loading state
  const handleConfirm = async () => {
    if (xellarAccount?.acceptPermissionPage) {
      window.open(xellarAccount.acceptPermissionPage, '_blank');
      onConfirmAction(setError);
    }
  };

  return (
    <Container>
      <div
        style={{
          height: 160,
          width: 160,
          borderRadius: 80,
          background: general.modalBackgroundSecondary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        <Illustration width={100} height={100} />
      </div>
      <Title style={{ textAlign: 'center' }}>Permission needed</Title>

      <Content>
        <MessageContent>
          <MessageBox>
            You haven&apos;t granted access to your wallet yet. Connecting your
            wallet lets you access core features like managing assets, signing
            transactions, and viewing your account activity. We respect your
            privacy and will never access sensitive information without
            permission.
          </MessageBox>
        </MessageContent>
      </Content>

      <Footer>
        <StyledButton style={{ flex: 1 }} onClick={handleConfirm}>
          Setup Permission
        </StyledButton>
      </Footer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  margin-top: 16px;
  color: ${({ theme }) => theme.texts.primary};
`;

const Content = styled.div`
  margin: 16px 0;
`;

const MessageContent = styled.div`
  margin: 8px 0;
`;

const MessageBox = styled.div`
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.general.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.general.modalBackgroundSecondary};
  max-height: 150px;
  overflow: auto;
  font-family: monospace;
  color: ${({ theme }) => theme.texts.primary};
  font-size: 12px;
`;

const Footer = styled.div`
  display: flex;
  margin-top: 24px;
  align-items: center;
  gap: 16px;
`;
