import { useState } from 'react';
import { useConnect } from 'wagmi';

import { BackIcon } from '@/assets/back-icon';
import { SpinnerIcon } from '@/assets/spinner';
import { useConnector } from '@/hooks/connectors';
import { useXellarContext } from '@/providers/xellar-kit';
import { useBoundStore } from '@/xellar-connector/store';

import { useConnectModalStore } from '../../store';
import { AnimatedContainer, Description } from '../styled';
import { useXellarSDK } from './hooks';
import { OTPInput } from './otp-input';
import {
  BackButton,
  Header,
  PassportButton,
  PassportContainer,
  RootContainer,
  Title
} from './styled';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type AddressResponse = {
  network: string;
  address: string;
};

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
    push
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
      } catch (error) {
        console.log({ error });
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
      } catch (error) {
        console.log({ error });
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
          <OTPInput onComplete={setOtp} disabled={isLoading} />
          <PassportButton
            style={{ width: '100%', marginTop: 12 }}
            onClick={onSubmit}
            aria-disabled={isLoading}
          >
            {isLoading ? <SpinnerIcon /> : 'Confirm'}
          </PassportButton>
        </PassportContainer>
      </RootContainer>
    </AnimatedContainer>
  );
}
