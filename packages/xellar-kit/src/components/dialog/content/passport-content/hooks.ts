import { useMemo } from 'react';
import { XellarSDK } from 'xellar-ew-sdk';

import { useBoundStore } from '@/xellar-connector/store';

export function useXellarSDK() {
  const appId = useBoundStore(state => state.appId);
  const env = useBoundStore(state => state.env);

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

  return xellarSDK;
}
