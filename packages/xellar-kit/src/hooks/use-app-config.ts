/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from 'wagmi/query';
import { useShallow } from 'zustand/react/shallow';

import { XELLAR_API_URL } from '@/constants/ew-api';
import { useBoundStore } from '@/xellar-connector/store';

export type AppConfigResponse = {
  status: number;
  message: string;
  data: AppConfig;
};

export type AppConfig = {
  isEmbeddedWalletEnabled: boolean;
  google: {
    enabled: boolean;
    clientId: string;
  };
  telegram: {
    botUsername: string;
    botId: string;
    enabled: boolean;
  };
  whatsapp: {
    enabled: boolean;
  };
  apple: {
    enabled: boolean;
    clientId: string;
    redirectUri: string;
  };
  useEmailLogin: boolean;
  isRampableEnabled: boolean;
  rampableClientSecret: string;
  useXellarBrand: boolean;
  logoUrl: string;
};

export function useAppConfig() {
  const { appId, env } = useBoundStore(
    useShallow(state => ({
      appId: state.appId,
      env: state.env
    }))
  );

  return useQuery<AppConfigResponse, Error, AppConfigResponse, any>({
    queryKey: ['xellar-app-config', appId, env],
    queryFn: async () => {
      if (!appId) {
        throw new Error('App ID is not set');
      }

      const result = await fetch(`${XELLAR_API_URL}/api/v1/apps/config`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-app-id': appId,
          'x-environment': env === 'production' ? 'production' : 'development'
        }
      });

      if (!result.ok) {
        throw new Error('Failed to fetch app config');
      }

      const data = await result.json();

      return data as AppConfigResponse;
    },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 // 1 hour
  });
}
