import { useMemo } from 'react';
import { XellarSDK } from 'xellar-ew-sdk';

import { useBoundStore } from '@/xellar-connector/store';

const XELLAR_API_URL = {
  sandbox: 'https://mpc-dev.xellar.co',
  production: 'https://mpc-api.xellar.co'
} as const;

export function useXellarSDK() {
  const appId = useBoundStore(state => state.appId);
  const env = useBoundStore(state => state.env);

  const verifyGoogle = async (accessToken: string): Promise<Response> => {
    if (!appId) {
      throw new Error('appId is required');
    }

    const response = await fetch(`${XELLAR_API_URL[env]}/api/v2/auth/google`, {
      method: 'POST',
      body: JSON.stringify({ code: accessToken }),
      headers: {
        'Content-Type': 'application/json',
        'x-app-id': appId
      }
    });

    if (!response.ok) {
      throw new Error('Failed to verify google');
    }

    return response.json();
  };

  const xellarSDK = useMemo(() => {
    if (!appId) {
      throw new Error('appId is required');
    }

    return new XellarSDK({
      appId,
      clientSecret: '',
      env
    });
  }, [appId, env]);

  return { xellarSDK, verifyGoogle };
}

type WalletCreatedResponse = {
  isWalletCreated: true;
  walletToken: string;
  addresses: {
    network: string;
    address: string;
  }[];
};

type WalletNotCreatedResponse = {
  isWalletCreated: false;
  accessToken: string;
};

type AuthSuccessResponse = {
  refreshToken: string;
  /** (optional)
   * JWT token used to access the Rampable Operation endpoint.
   * This token will only be available if the account already create a rampable account
   * and the organization has enabled the rampable feature.
   */
  rampableAccessToken?: string;
} & (WalletCreatedResponse | WalletNotCreatedResponse);

interface Response {
  satus: number;
  message: string;
  data: AuthSuccessResponse;
}
