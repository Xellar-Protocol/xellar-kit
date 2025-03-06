/* eslint-disable @typescript-eslint/no-explicit-any */

import { OTPInput, SlotProps } from 'input-otp';
import { useEffect, useState } from 'react';
import { useConnect } from 'wagmi';

import { BackIcon } from '@/assets/back-icon';
import { SpinnerIcon } from '@/assets/spinner';
import { StyledButton } from '@/components/ui/button';
import { useConnector } from '@/hooks/connectors';
import { useXellarContext } from '@/providers/xellar-kit';
import { styled } from '@/styles/styled';
import { useBoundStore } from '@/xellar-connector/store';

import { useConnectModalStore } from '../../store';
import { AnimatedContainer, Description } from '../styled';
import { useXellarSDK } from './hooks';
import {
  BackButton,
  Header,
  PassportContainer,
  RootContainer,
  Title
} from './styled';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type AddressResponse = {
  network: string;
  address: string;
};

const FIVEMINUTES_IN_SECONDS = 60 * 5;

export function OTPPage() {
  const setToken = useBoundStore(state => state.setToken);
  const setRefreshToken = useBoundStore(state => state.setRefreshToken);
  const setAddress = useBoundStore(state => state.setAddress);

  const {
    back,
    direction,
    setDirection,
    codeVerifier,
    setRecoverySecret,
    otpType,
    push,
    email,
    setCodeVerifier,
    whatsapp
  } = useConnectModalStore();

  const handleBack = () => {
    back();
  };

  const getAnimationProps = () => ({
    initial: {
      opacity: 0,
      x: direction === 'back' ? -200 : 200
    },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: direction === 'back' ? 200 : -200 }
  });

  const { closeModal } = useXellarContext();

  const connector = useConnector('xellar-passport');
  const { connectAsync } = useConnect();

  const [otp, setOtp] = useState('');
  const { xellarSDK } = useXellarSDK();
  const [isLoading, setIsLoading] = useState(false);

  const [countdown, setCountdown] = useState(FIVEMINUTES_IN_SECONDS);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let frameId: number;
    let startTime: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const seconds = FIVEMINUTES_IN_SECONDS - Math.floor(elapsed / 1000);

      if (seconds <= 0) {
        setCountdown(0);
        setIsResendDisabled(false);
        return;
      }

      setCountdown(seconds);
      frameId = requestAnimationFrame(animate);
    };

    if (isResendDisabled) {
      frameId = requestAnimationFrame(animate);
    }

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [isResendDisabled]);

  const handleResend = async () => {
    if (isResendDisabled) return;

    if (otpType === 'email' && !!email) {
      setIsLoading(true);
      const result = await xellarSDK.auth.email.login(email);
      setCodeVerifier(result);
      setIsLoading(false);
      setCountdown(FIVEMINUTES_IN_SECONDS);
      setIsResendDisabled(true);
      return;
    }

    if (otpType === 'whatsapp' && !!whatsapp) {
      setIsLoading(true);
      const result = await xellarSDK.auth.whatsapp.login(whatsapp);
      setIsLoading(false);
      setCodeVerifier(result.verifyToken);
      setCountdown(FIVEMINUTES_IN_SECONDS);
      setIsResendDisabled(true);
      return;
    }
  };

  const onSubmit = async () => {
    if (!codeVerifier) {
      return;
    }

    if (otpType === 'email') {
      try {
        setIsLoading(true);
        const result = await xellarSDK.auth.email.verify(codeVerifier, otp);
        if (!result.isWalletCreated) {
          const createWalletResult = await xellarSDK.account.wallet.create({
            accessToken: result.accessToken
          });

          setToken(createWalletResult.walletToken);
          setRefreshToken(createWalletResult.refreshToken);
          setRecoverySecret(createWalletResult.secret0);
          setAddress(
            createWalletResult.address.find(n => n.network === 'evm')
              ?.address as `0x${string}`
          );

          await connectAsync({ connector });

          push('wallet-created');
          setDirection('forward');
        } else {
          setToken(result.walletToken);
          setRefreshToken(result.refreshToken);
          await wait(500);

          const address = (
            result as unknown as { addresses: AddressResponse[] }
          ).addresses.find(n => n.network === 'evm')?.address;

          if (address) {
            setAddress(address as `0x${string}`);
          }

          await connectAsync({ connector });
          closeModal();
          window.location.reload();
        }
      } catch (e: any) {
        setError(
          e?.response?.data?.message || e?.message || 'Something went wrong'
        );
        console.log({ e });

        setTimeout(() => {
          setError('');
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    }

    if (otpType === 'whatsapp') {
      try {
        setIsLoading(true);
        const result = await xellarSDK.auth.whatsapp.verify(codeVerifier, otp);
        if (!result.isWalletCreated) {
          const createWalletResult = await xellarSDK.account.wallet.create({
            accessToken: result.accessToken
          });

          setToken(createWalletResult.walletToken);
          setRefreshToken(createWalletResult.refreshToken);
          setRecoverySecret(createWalletResult.secret0);
          setAddress(
            createWalletResult.address.find(n => n.network === 'evm')
              ?.address as `0x${string}`
          );

          await connectAsync({ connector });

          push('wallet-created');
          setDirection('forward');
        } else {
          setToken(result.walletToken);
          setRefreshToken(result.refreshToken);
          await wait(500);

          const address = (
            result as unknown as { addresses: AddressResponse[] }
          ).addresses.find(n => n.network === 'evm')?.address;

          if (address) {
            setAddress(address as `0x${string}`);
          }

          await connectAsync({ connector });
          closeModal();
          window.location.reload();
        }
      } catch (e: any) {
        setError(
          e?.response?.data?.message || e?.message || 'Something went wrong'
        );
        console.log({ e });

        setTimeout(() => {
          setError('');
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    }
  };

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
          <Title>OTP Verification</Title>
        </Header>

        <PassportContainer>
          <Description style={{ marginBottom: 12, textAlign: 'center' }}>
            Please enter the 6-digit code sent to your email address.
          </Description>
          <OTPInput
            onComplete={setOtp}
            disabled={isLoading}
            maxLength={6}
            render={({ slots }) => {
              return (
                <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                  {slots.map((slot, idx) => (
                    <Slot key={idx} {...slot} />
                  ))}
                </div>
              );
            }}
          />

          {!!error && <ErrorText>{error}</ErrorText>}

          <div style={{ width: '100%', padding: '0 2px' }}>
            <StyledButton
              variant="outline"
              style={{
                marginTop: 12,
                border: 'none',
                opacity: isResendDisabled ? 0.5 : 1,
                cursor: isResendDisabled ? 'not-allowed' : 'pointer'
              }}
              onClick={handleResend}
              aria-disabled={isLoading}
            >
              {isResendDisabled
                ? `(${Math.floor(countdown / 60)}:${countdown % 60 < 10 ? '0' : ''}${countdown % 60}) Resend`
                : 'Resend'}
            </StyledButton>

            <StyledButton
              style={{ marginTop: 12 }}
              onClick={onSubmit}
              aria-disabled={isLoading}
            >
              {isLoading ? <SpinnerIcon /> : 'Confirm'}
            </StyledButton>
          </div>
        </PassportContainer>
      </RootContainer>
    </AnimatedContainer>
  );
}

const Slot = (props: SlotProps) => {
  return (
    <StyledSlot isActive={props.isActive}>
      {props.char ?? props.placeholderChar}
    </StyledSlot>
  );
};

const StyledSlot = styled.div<{ isActive: boolean }>`
  width: 32px;
  height: 42px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.BORDER};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.TEXT};
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  border-color: ${({ theme, isActive }) =>
    isActive ? theme.colors.PRIMARY : theme.colors.BORDER};
  display: flex;
  align-items: center;
  justify-content: center;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const ErrorText = styled.p`
  color: #ff4040;
  font-size: 12px;
  margin-left: 2px;
  margin-top: 0;
  margin-bottom: 0;
`;
