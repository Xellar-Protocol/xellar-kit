import { useQuery } from '@tanstack/react-query';
import { useAccount, useDisconnect } from 'wagmi';
import { useShallow } from 'zustand/react/shallow';

import { useXellarSDK } from '@/components/dialog/content/passport-content/hooks';
import { useBoundStore } from '@/xellar-connector/store';

export function useCheckAccount() {
  const { disconnectAsync } = useDisconnect();
  const { xellarSDK } = useXellarSDK();
  const { address } = useAccount();
  const {
    refreshToken,
    setRefreshToken,
    setToken,
    clearToken,
    clearAddress,
    clearRefreshToken
  } = useBoundStore(
    useShallow(state => ({
      refreshToken: state.refreshToken,
      token: state.token,
      clearToken: state.clearToken,
      clearAddress: state.clearAddress,
      clearRefreshToken: state.clearRefreshToken,
      setToken: state.setToken,
      setRefreshToken: state.setRefreshToken
    }))
  );

  useQuery({
    queryKey: ['check-account', refreshToken],
    queryFn: async () => {
      if (!address) {
        try {
          if (refreshToken) {
            const refreshTokenResult =
              await xellarSDK?.wallet?.refreshToken(refreshToken);
            setToken(refreshTokenResult.walletToken);
            setRefreshToken(refreshTokenResult.refreshToken);
          } else {
            disconnectAsync();
          }
        } catch (error) {
          console.log({ error });
          disconnectAsync();
          clearToken();
          clearAddress();
          clearRefreshToken();
        }
      } else {
        disconnectAsync();
      }
    },
    refetchOnWindowFocus: true
  });
}
