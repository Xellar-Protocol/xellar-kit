import { AnimatePresence } from 'motion/react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useDebounce } from '@/hooks/debounce';
import { Crypto, useGetRampableCryptos } from '@/hooks/rampable/cryptos';
import {
  Currency,
  useGetRampableCurrencies
} from '@/hooks/rampable/currencies';
import {
  RampableQuoteResponse,
  useGetRampableQuote
} from '@/hooks/rampable/quote';

import { OnrampDialogContent } from './onramp-dialog-content';
import { ProfileDialogContent } from './profile-dialog-content';
import { ReceiveDialogContent } from './receive-dialog-content';
import { SelectCryptoDialogContent } from './select-crypto';
import { SelectCurrencyDialogContent } from './select-currency';
import { useProfileDialogStore } from './store';

type ProfileDialogScreen =
  | 'home'
  | 'onramp'
  | 'select-currency'
  | 'select-crypto'
  | 'receive';

export type ProfileDialogContextType = {
  screen: ProfileDialogScreen;
  setScreen: (screen: ProfileDialogScreen) => void;
  currencies: Currency[];
  selectedCurrency: Currency | null;
  setSelectedCurrency: (currency: Currency) => void;
  cryptos: Crypto[];
  selectedCrypto: Crypto | null;
  setSelectedCrypto: (crypto: Crypto) => void;
  quote: RampableQuoteResponse | null;
  quoteError: Error | null;
  inputAmount: string;
  setInputAmount: (amount: string) => void;
  isLoading: boolean;
};

export const ProfileDialogContext = createContext<ProfileDialogContextType>(
  undefined as never
);

export const ProfileDialog = () => {
  const [screen, setScreen] = useState<ProfileDialogScreen>('home');
  const [availableCurrencies, setAvailableCurrencies] = useState<Currency[]>(
    []
  );
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
    null
  );
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
  const setStoreState = useProfileDialogStore(
    useShallow(state => state.setState)
  );

  const [inputAmount, setInputAmount] = useState<string>('');

  const debouncedInputAmount = useDebounce(inputAmount, 500);

  const { data: quote, error: quoteError } = useGetRampableQuote({
    amount: debouncedInputAmount,
    inputCurrency: selectedCurrency?.currency || '',
    outputCurrency: selectedCrypto?.id || ''
  });

  const { data: currencies, isLoading: isCurrenciesLoading } =
    useGetRampableCurrencies({
      limit: 100
    });

  const { data: cryptos, isLoading: isCryptosLoading } =
    useGetRampableCryptos();

  const cryptoList = cryptos?.data?.filter(c =>
    c.currencies?.includes(selectedCurrency?.currency || '')
  );

  useEffect(() => {
    if (cryptos?.data.length && currencies?.data.length) {
      setAvailableCurrencies(
        getAvailableCurrencies(cryptos?.data, currencies?.data)
      );
    }
  }, [cryptos, currencies]);

  useEffect(() => {
    if (availableCurrencies.length) {
      const currency = availableCurrencies.find(
        c => c.currency === 'IDR'
      ) as Currency;
      setSelectedCurrency(currency || null);
    }
  }, [availableCurrencies]);

  useEffect(() => {
    if (cryptoList?.length) {
      const crypto = cryptoList[0];
      setSelectedCrypto(crypto || null);
    }
  }, [cryptoList, selectedCurrency]);

  useEffect(() => {
    setStoreState({ screen });
  }, [screen, setStoreState]);

  return (
    <ProfileDialogContext.Provider
      value={{
        screen,
        setScreen,
        currencies: availableCurrencies,
        selectedCurrency,
        setSelectedCurrency,
        cryptos: cryptoList || [],
        selectedCrypto,
        setSelectedCrypto,
        quote: quote || null,
        quoteError,
        inputAmount,
        setInputAmount,
        isLoading: isCurrenciesLoading || isCryptosLoading
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {screen === 'home' && <ProfileDialogContent />}
        {screen === 'onramp' && <OnrampDialogContent />}
        {screen === 'select-currency' && <SelectCurrencyDialogContent />}
        {screen === 'select-crypto' && <SelectCryptoDialogContent />}
        {screen === 'receive' && <ReceiveDialogContent />}
      </AnimatePresence>
    </ProfileDialogContext.Provider>
  );
};

export const useProfileDialogContext = () => {
  const context = useContext(ProfileDialogContext);
  if (!context) {
    throw new Error(
      'useProfileDialogContext must be used within a ProfileDialogContext'
    );
  }
  return context;
};

const getAvailableCurrencies = (cryptos: Crypto[], currencies: Currency[]) => {
  const arr: Currency[] = [];

  for (let i = 0; i < cryptos.length; i++) {
    const cryptoList = cryptos[i];
    if (cryptoList?.currencies && cryptoList?.currencies?.length) {
      for (let i = 0; i < cryptoList?.currencies?.length; i++) {
        const element = cryptoList?.currencies[i];

        const currency = currencies.find((c: Currency) => {
          const cValue = c;
          return cValue.currency === element;
        });

        if (currency && !arr.includes(currency)) {
          arr.push(currency);
        }
      }
    }
  }

  return arr;
};
