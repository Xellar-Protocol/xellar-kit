import { motion } from 'motion/react';
import { useAccount } from 'wagmi';
import { useShallow } from 'zustand/react/shallow';

import { BackIcon } from '@/assets/back-icon';
import { ChevronDownIcon } from '@/assets/chevron-down';
import { StyledButton } from '@/components/ui/button';
import {
  WEBVIEW_BASE_URL,
  WEBVIEW_STAGING_BASE_URL
} from '@/hooks/rampable/base';
import { useAppConfig } from '@/hooks/use-app-config';
import { styled } from '@/styles/styled';
import { formatRateAmount } from '@/utils/string';
import { useBoundStore } from '@/xellar-connector/store';

import { BackButton, Header } from '../passport-content/styled';
import { Title } from '../styled';
import { useProfileDialogContext } from './profile-dialog';

export function OnrampDialogContent() {
  const {
    setScreen,
    selectedCurrency,
    selectedCrypto,
    setInputAmount,
    inputAmount,
    quote
  } = useProfileDialogContext();

  const quoteData = quote?.data;

  const handleBack = () => {
    setScreen('home');
  };

  const env = useBoundStore(useShallow(state => state.env));
  const { address } = useAccount();
  const { data: appConfig } = useAppConfig();

  const handleContinue = () => {
    const baseUrl =
      env === 'production' ? WEBVIEW_BASE_URL : WEBVIEW_STAGING_BASE_URL;

    const searchParams = new URLSearchParams();
    searchParams.set(
      'clientSecret',
      appConfig?.data?.rampableClientSecret ?? ''
    );
    searchParams.set('receiverWalletAddress', address ?? '');
    searchParams.set('inputAmount', inputAmount);
    searchParams.set('inputCurrency', selectedCurrency?.currency ?? '');
    searchParams.set('outputCurrency', selectedCrypto?.id ?? '');

    const url = `${baseUrl}/onramp?${searchParams.toString()}`;

    window.open(url, '_blank');
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
        <Title>Buy</Title>
      </Header>
      <SectionTitle>You Pay</SectionTitle>
      <InputOuterWrapper>
        <AmountInput
          placeholder="0"
          value={inputAmount}
          onChange={e => setInputAmount(e.target.value)}
          inputMode="decimal"
        />
        <CurrencySelectorWrapper
          role="button"
          onClick={() => setScreen('select-currency')}
        >
          <CurrencyImage
            src={selectedCurrency?.logo}
            alt={selectedCurrency?.currency}
          />
          <CurrencyText>{selectedCurrency?.currency}</CurrencyText>
          <ChevronDownIcon width={16} height={16} />
        </CurrencySelectorWrapper>
      </InputOuterWrapper>

      <StyledInfoSection style={{ marginTop: 20, marginBottom: 20 }}>
        <InfoRow>
          <IconWrapper>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </IconWrapper>
          <InfoTextDetails>
            {formatRateAmount(quoteData?.rate_amount ?? 0)}{' '}
            {quoteData?.currency ?? selectedCurrency?.currency} = 1
            {quoteData?.coin?.toUpperCase() ??
              selectedCrypto?.symbol?.toUpperCase()}
          </InfoTextDetails>
          <InfoLabelRight>Exchange Rate</InfoLabelRight>
        </InfoRow>
        <InfoRow>
          <IconWrapper>
            <svg
              width="12"
              height="12"
              viewBox="0 0 8 4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 1H1"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M7 3H1"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </IconWrapper>
          <InfoTextDetails>
            {formatRateAmount(quoteData?.amount_in_crypto ?? 0)}{' '}
            {quoteData?.coin?.toUpperCase() ??
              selectedCrypto?.symbol?.toUpperCase()}
          </InfoTextDetails>
          <InfoLabelRight>Amount Exchanged</InfoLabelRight>
        </InfoRow>
        <InfoRow>
          <IconWrapper>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </IconWrapper>
          <InfoTextDetails>
            {formatRateAmount(quoteData?.total_fee_amount ?? 0)}{' '}
            {selectedCrypto?.symbol?.toUpperCase()}
          </InfoTextDetails>
          <InfoLabelRight>Our Fees</InfoLabelRight>
        </InfoRow>
      </StyledInfoSection>

      <SectionTitle>You Receive</SectionTitle>
      <InputOuterWrapper>
        <AmountInput
          placeholder="0.00"
          readOnly
          value={formatRateAmount(
            quoteData?.total_received_amount_in_crypto ?? 0
          )}
        />
        <CurrencySelectorWrapper
          role="button"
          onClick={() => setScreen('select-crypto')}
        >
          <CurrencyImage
            src={selectedCrypto?.logo}
            alt={selectedCrypto?.symbol}
          />
          <CurrencyText>{selectedCrypto?.symbol.toUpperCase()}</CurrencyText>
          <ChevronDownIcon width={16} height={16} />
        </CurrencySelectorWrapper>
      </InputOuterWrapper>

      <StyledArrivalText>
        Should Arrive by <strong>Today</strong>
      </StyledArrivalText>

      {quote?.error && <ErrorText>{quote?.message}</ErrorText>}

      <StyledButton
        style={{ marginTop: 20 }}
        disabled={!!quote?.error || !quote?.data}
        onClick={handleContinue}
      >
        Continue
      </StyledButton>
    </Wrapper>
  );
}

const Wrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0;
`;

const SectionTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.texts.secondary};
  margin-bottom: 8px;
`;

const InputOuterWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.general.modalBackground};
  border: 1px solid ${({ theme }) => theme.general.border};
  border-radius: 8px;
  position: relative;
`;

const AmountInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 24px;
  font-weight: bold;
  background-color: transparent;
  color: ${({ theme }) => theme.texts.primary};
  padding: 12px 16px;

  &::placeholder {
    color: ${({ theme }) => theme.texts.secondary};
  }
`;

const CurrencySelectorWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-right: 12px;
  position: absolute;
  right: 0;
`;

CurrencySelectorWrapper.defaultProps = {
  role: 'button'
};

const CurrencyImage = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`;

const CurrencyText = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.texts.primary};
`;

const StyledInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-left: 28px; /* Increased padding */
  position: relative;
  margin-top: 8px;
  margin-bottom: 8px;

  &::before {
    content: '';
    position: absolute;
    left: 10px; /* Adjusted for icon centering */
    top: 8px;
    bottom: 8px;
    width: 1.5px;
    background-color: ${({ theme }) => theme.general.border};
  }
`;

const InfoRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 8px;
  position: relative;
`;

const IconWrapper = styled.div`
  position: absolute;
  left: -28px; /* Position to overlap the line */
  top: 50%;
  transform: translateY(-50%);
  background-color: ${({ theme }) =>
    theme.general
      .modalBackgroundSecondary}; /* Match ContentWrapper background */
  color: ${({ theme }) => theme.texts.secondary};
  border-radius: 50%;
  border: 1.5px solid ${({ theme }) => theme.general.border};
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    stroke: ${({ theme }) => theme.texts.secondary};
  }
`;

const InfoTextDetails = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.texts.primary};
  margin-left: 4px; /* Space from the icon area */
`;

const InfoLabelRight = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.texts.secondary};
  justify-self: end;
`;

const StyledArrivalText = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.texts.secondary};
  margin-top: 4px;
  strong {
    color: ${({ theme }) => theme.texts.primary};
    font-weight: 500;
  }
`;

const ErrorText = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.danger};
  margin-top: 4px;
  text-align: center;
`;
