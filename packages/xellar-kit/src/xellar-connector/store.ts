import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface StoreState {
  token: string | null;
  refreshToken: string | null;
  chainId: number | null;
  appId: string | null;
  env: 'sandbox' | 'production';
  address: `0x${string}` | null;
  setToken: (token: string | null) => void;
  clearToken: () => void;
  setRefreshToken: (refreshToken: string | null) => void;
  clearRefreshToken: () => void;
  setChainId: (chainId: number | null) => void;
  clearChainId: () => void;
  setAppId: (appId: string | null) => void;
  clearAppId: () => void;
  setEnv: (env: 'sandbox' | 'production') => void;
  clearEnv: () => void;
  setAddress: (address: `0x${string}` | null) => void;
  clearAddress: () => void;
}

export const useBoundStore = create<StoreState>()(
  persist(
    set => ({
      token: null,
      chainId: null,
      refreshToken: null,
      appId: null,
      env: 'sandbox',
      address: null,
      setToken: token => set({ token }),
      setChainId: chainId => set({ chainId }),
      clearToken: () => set({ token: null }),
      clearChainId: () => set({ chainId: null }),
      setRefreshToken: refreshToken => set({ refreshToken }),
      clearRefreshToken: () => set({ refreshToken: null }),
      setAppId: appId => set({ appId }),
      clearAppId: () => set({ appId: null }),
      setEnv: env => set({ env }),
      clearEnv: () => set({ env: 'sandbox' }),
      setAddress: address => set({ address }),
      clearAddress: () => set({ address: null })
    }),
    {
      name: 'Xellar-Passport-Storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
