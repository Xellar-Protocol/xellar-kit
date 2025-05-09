import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';

import { useBoundStore } from '@/xellar-connector/store';

import { useAppConfig } from '../use-app-config';
import { PROD_BASE_URL, STAGING_BASE_URL } from './base';

export interface RampableCryptoResponse {
  statusCode: number;
  message: string;
  data: Crypto[];
}

export interface Crypto {
  _id: string;
  symbol: string;
  id: string;
  name: string;
  label: string;
  address: string;
  chainId: number;
  is_native: boolean;
  logo: string;
  currencies: string[];
  decimal: number;
  priceId: string;
  useSmartContract: boolean;
  blockchainType: string;
  network: string;
  transactionType: string[];
  isConvertAvailable: boolean;
}

export const useGetRampableCryptos = () => {
  const env = useBoundStore(useShallow(state => state.env));
  const { data: appConfig } = useAppConfig();

  return useQuery({
    queryKey: ['rampable-cryptos', env, appConfig?.data?.rampableClientSecret],
    queryFn: async () => {
      const response = await fetch(
        `${env === 'production' ? PROD_BASE_URL : STAGING_BASE_URL}/v1/reference/cryptos?transactionType=onramp&blockchainType=EVM`,
        {
          headers: {
            'x-client-secret': appConfig?.data?.rampableClientSecret || ''
          }
        }
      );
      const data = await response.json();
      return data as RampableCryptoResponse;
    },
    enabled: !!appConfig?.data?.rampableClientSecret
  });
};
