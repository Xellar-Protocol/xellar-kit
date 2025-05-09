import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';

import { useBoundStore } from '@/xellar-connector/store';

import { useAppConfig } from '../use-app-config';
import { PROD_BASE_URL, STAGING_BASE_URL } from './base';

interface RampableQuoteRequest {
  amount: string;
  /*The fiat id of the onramp transaction (e.g. "IDR").*/
  inputCurrency: string;
  /*The crypto id of the onramp transaction (e.g. "usdt-polygon").*/
  outputCurrency: string;
}

export interface RampableQuoteResponse {
  statusCode: number;
  message: string;
  data: Quote;
  error?: string;
}

export interface Quote {
  status: boolean;
  acceptance_method: string;
  onramp_service: string;
  coin: string;
  currency: string;
  amount_in_crypto: number;
  amount_in_currency: number;
  rate_amount: number;
  total_fee_percentage: number;
  total_fee_amount: number;
  total_fee_amount_in_currency: number;
  total_received_amount_in_crypto: number;
  total_received_amount_in_currency: number;
  expiry_time: number;
}

export const useGetRampableQuote = ({
  amount,
  inputCurrency,
  outputCurrency
}: RampableQuoteRequest) => {
  const env = useBoundStore(useShallow(state => state.env));
  const { data: appConfig } = useAppConfig();

  const hasAmount = Number(amount) > 0;

  return useQuery({
    queryKey: [
      'rampable-quote',
      env,
      amount,
      inputCurrency,
      outputCurrency,
      appConfig?.data?.rampableClientSecret
    ],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (amount) {
        searchParams.set('amount', amount);
      }
      if (inputCurrency) {
        searchParams.set('inputCurrency', inputCurrency);
      }
      if (outputCurrency) {
        searchParams.set('outputCurrency', outputCurrency);
      }
      searchParams.set('withLimit', 'false');
      const response = await fetch(
        `${env === 'production' ? PROD_BASE_URL : STAGING_BASE_URL}/v1/onramp/quote?${searchParams.toString()}`,
        {
          headers: {
            origin: 'https://webview.rampable.co',
            referer: 'https://webview.rampable.co',
            'x-client-secret': appConfig?.data?.rampableClientSecret || ''
          }
        }
      );
      const data = await response.json();
      return data as RampableQuoteResponse;
    },
    refetchInterval: 5000, // 5 seconds
    enabled: ({ state }) => {
      if ((state.data?.statusCode ?? 0) >= 400) {
        return false;
      }
      return (
        hasAmount &&
        !!inputCurrency &&
        !!outputCurrency &&
        !!appConfig?.data?.rampableClientSecret
      );
    }
  });
};
