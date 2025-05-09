import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';

import { useBoundStore } from '@/xellar-connector/store';

import { PROD_BASE_URL, STAGING_BASE_URL } from './base';

interface RampableCurrencyRequest {
  limit: number;
}

export interface RampableCurrencyResponse {
  statusCode: number;
  message: string;
  data: Currency[];
}

export interface Currency {
  _id: string;
  value: string;
  country: string;
  currency: string;
  countryCode: string;
  logo: string;
  name: string;
  requireBankName: boolean;
  requireIfsc: boolean;
  requireIban: boolean;
  requireAchOrWire: boolean;
  requireAccountNumber: boolean;
  symbol: string;
  randomNumber: number;
  isRandomNumberDecimal: boolean;
  allowFraction: boolean;
  id: string;
  isConvertAvailable: boolean;
  requireTransitNumber?: boolean;
  requireSwiftCode?: boolean;
  requiredUnlimitKyc?: boolean;
}

export const useGetRampableCurrencies = ({
  limit = 100
}: RampableCurrencyRequest) => {
  const env = useBoundStore(useShallow(state => state.env));

  return useQuery({
    queryKey: ['rampable-currencies', env, limit],
    queryFn: async () => {
      const response = await fetch(
        `${env === 'production' ? PROD_BASE_URL : STAGING_BASE_URL}/v1/reference/currencies?limit=${limit}`
      );
      const data = await response.json();
      return data as RampableCurrencyResponse;
    }
  });
};
