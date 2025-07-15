import React, { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useTransactionConfirmStore } from '@/components/dialog/store';
import { StyledButton } from '@/components/ui/button';
import { styled } from '@/styles/styled';

// We need to make the payload properties optional to match the store's payload type
interface TransactionPayload {
  from?: string;
  to?: string;
  value?: string;
  data?: string;
  nonce?: string;
  gasPrice?: string;
  chainId?: number;
}

interface MessagePayload {
  message?: string;
  chainId?: number;
}

// Union type for both payload types
type ConfirmationPayload = TransactionPayload & MessagePayload;

interface TransactionConfirmationDialogProps {
  payload: ConfirmationPayload;
  type: 'transaction' | 'message' | 'need-permission';
  onConfirm: (setError: (error: string) => void) => Promise<void>;
  onReject: () => void;
  initialError?: string | null;
  initialLoading?: boolean;
}

export function TransactionConfirmationDialog({
  payload,
  type,
  onConfirm,
  onReject,
  initialError = null,
  initialLoading = false
}: TransactionConfirmationDialogProps) {
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(initialError);

  // Get error from the store
  const storeError = useTransactionConfirmStore(
    useShallow(state => state.error)
  );

  // Update error when initialError changes
  useEffect(() => {
    if (initialError) {
      setError(initialError);
      setIsLoading(false);
    }
  }, [initialError]);

  // Update local error state when store error changes
  useEffect(() => {
    if (storeError) {
      setError(storeError);
      setIsLoading(false);
      // Clear the error from the store after using it
      useTransactionConfirmStore.setState({ error: null });
    }
  }, [storeError]);

  // Update loading state from store
  const storeLoading = useTransactionConfirmStore(
    useShallow(state => state.isLoading)
  );
  useEffect(() => {
    setIsLoading(storeLoading);
  }, [storeLoading]);

  // Format Ethereum value from wei to ETH
  const formatValue = (value?: string): string => {
    if (!value) return '0';
    try {
      // Convert wei (as hex) to ETH
      const wei = BigInt(value);
      const eth = Number(wei) / 1e18;
      return `${eth}`;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return value;
    }
  };

  // Truncate address for display
  const truncateAddress = (address?: string): string => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Check if we have valid transaction payload
  const hasValidTransactionPayload = payload.from && payload.to;
  // Check if we have valid message payload
  const hasValidMessagePayload = payload.message;

  // Handle confirmation with loading state
  const handleConfirm = async () => {
    if (isLoading) return;
    setError(null);
    try {
      await onConfirm(setError);
      // The store will handle closing the modal on success
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
    }
  };

  const handleReject = () => {
    if (isLoading) return;
    onReject();
  };

  return (
    <Container>
      <Title>
        {type === 'transaction' ? 'Confirm Transaction' : 'Sign Message'}
      </Title>

      <Content>
        {type === 'transaction' && hasValidTransactionPayload ? (
          <>
            <Row>
              <Label>From:</Label>
              <Value>{truncateAddress(payload.from)}</Value>
            </Row>
            <Row>
              <Label>To:</Label>
              <Value>{truncateAddress(payload.to)}</Value>
            </Row>

            <Row>
              <Label>Value:</Label>
              <Value>{formatValue(payload.value)}</Value>
            </Row>
            {payload.chainId && (
              <Row>
                <Label>Chain ID:</Label>
                <Value>{payload.chainId}</Value>
              </Row>
            )}

            <Row>
              <Label>Gas Price:</Label>
              <Value>{payload.gasPrice ?? 'Unknown'}</Value>
            </Row>

            {payload.data && (
              <>
                <MessageContent>
                  <MessageLabel>Data:</MessageLabel>
                  <MessageBox>{payload.data}</MessageBox>
                </MessageContent>
              </>
            )}
          </>
        ) : (
          type === 'message' &&
          hasValidMessagePayload && (
            <MessageContent>
              <MessageLabel>Message:</MessageLabel>
              <MessageBox>
                <pre>{payload.message}</pre>
              </MessageBox>
            </MessageContent>
          )
        )}

        {error && (
          <ErrorContainer>
            <ErrorMessage>{error}</ErrorMessage>
          </ErrorContainer>
        )}
      </Content>

      <Footer>
        <StyledButton
          onClick={handleReject}
          disabled={isLoading}
          aria-disabled={isLoading}
          variant="outline"
          style={{ flex: 1 }}
        >
          {error ? 'Close' : 'Reject'}
        </StyledButton>
        {error ? (
          <StyledButton
            style={{ flex: 1 }}
            onClick={handleConfirm}
            aria-disabled={isLoading}
            disabled={isLoading}
          >
            Try Again
          </StyledButton>
        ) : (
          <StyledButton
            style={{ flex: 1 }}
            onClick={handleConfirm}
            aria-disabled={isLoading}
          >
            {isLoading ? <>Confirming...</> : 'Confirm'}
          </StyledButton>
        )}
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
  color: ${({ theme }) => theme.texts.primary};
`;

const Content = styled.div`
  margin: 16px 0;
`;

const Row = styled.div`
  margin: 8px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.span`
  font-weight: 500;
  font-size: 14px;
  color: ${({ theme }) => theme.texts.secondary};
`;

const Value = styled.span`
  word-break: break-all;
  color: ${({ theme }) => theme.texts.primary};
  font-family: monospace;
`;

const MessageContent = styled.div`
  margin: 8px 0;
`;

const MessageLabel = styled.div`
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.texts.secondary};
`;

const MessageBox = styled.div`
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.general.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.general.modalBackgroundSecondary};
  word-break: break-all;
  max-height: 150px;
  overflow: auto;
  font-family: monospace;
  color: ${({ theme }) => theme.texts.primary};
  font-size: 12px;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 16px;
  overflow: auto;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.danger};
  font-size: 14px;
  text-align: center;
  margin: 0;
`;

const Footer = styled.div`
  display: flex;
  margin-top: 24px;
  align-items: center;
  gap: 16px;
`;
