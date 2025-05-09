import { motion } from 'motion/react';

import { BackIcon } from '@/assets/back-icon';
import { styled } from '@/styles/styled';

import { BackButton, Header } from '../passport-content/styled';
import { Title } from '../styled';
import { useProfileDialogContext } from './profile-dialog';

export function SelectCurrencyDialogContent() {
  const { setScreen, currencies, setSelectedCurrency } =
    useProfileDialogContext();

  const handleBack = () => {
    setScreen('onramp');
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
        <Title>Select Currency</Title>
      </Header>
      <CurrencyList>
        {currencies?.map(currency => (
          <CurrencyItem
            key={currency.id}
            onClick={() => {
              setSelectedCurrency(currency);
              setScreen('onramp');
            }}
          >
            <CurrencyImage src={currency.logo} alt={currency.currency} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <CurrencyName>{currency.currency}</CurrencyName>
              <CurrencySymbol>{currency.symbol}</CurrencySymbol>
            </div>
          </CurrencyItem>
        ))}
      </CurrencyList>
    </Wrapper>
  );
}

const Wrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0;
`;

const CurrencyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 350px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none; /* Firefox */
`;

const CurrencyItem = styled.div`
  display: flex;
  align-items: center;
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

const CurrencyImage = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`;

const CurrencyName = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.texts.primary};
`;

const CurrencySymbol = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.texts.secondary};
`;
