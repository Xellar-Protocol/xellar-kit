import { create } from 'zustand';

import { WalletProps } from '@/wallets/use-wallet';

type ModalPage =
  | 'home'
  | 'whatsapp'
  | 'mail'
  | 'wallet'
  | 'qr-code'
  | 'otp'
  | 'wallet-created';
type Direction = 'back' | 'forward';

interface StoreState {
  page: ModalPage;
  isLoading: boolean;
  recoverySecret: string | null;
  direction: Direction;
  history: ModalPage[];
  wallet: WalletProps | null;
  setWallet: (wallet: WalletProps) => void;
  otpType: 'email' | 'whatsapp';
  setOtpType: (otpType: 'email' | 'whatsapp') => void;
  push: (page: ModalPage) => void;
  back: () => void;
  setPage: (page: ModalPage) => void;
  setDirection: (direction: Direction) => void;
  setHistory: (history: ModalPage[]) => void;
  codeVerifier: string | null;
  setCodeVerifier: (codeVerifier: string) => void;
  setRecoverySecret: (recoverySecret: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useConnectModalStore = create<StoreState>()(set => ({
  page: 'home',
  direction: 'forward',
  history: ['home'],
  isLoading: false,
  recoverySecret: null,
  codeVerifier: null,
  otpType: 'email',
  wallet: null,
  setWallet: wallet => set({ wallet }),
  setOtpType: otpType => set({ otpType }),
  push: page =>
    set(state => ({
      page,
      direction: 'forward',
      history: [...state.history, page]
    })),
  back: () =>
    set(state => {
      const newHistory = state.history.slice(0, -1);

      // If we're going back and history would be empty, reset to home
      if (newHistory.length === 0) {
        return {
          page: 'home',
          direction: 'back',
          history: ['home']
        };
      }

      return {
        page: newHistory[newHistory.length - 1],
        direction: 'back',
        history: newHistory
      };
    }),
  setPage: page => set({ page }),
  setDirection: direction => set({ direction }),
  setHistory: history => set({ history }),
  setCodeVerifier: codeVerifier => set({ codeVerifier }),
  setRecoverySecret: recoverySecret => set({ recoverySecret }),
  setIsLoading: isLoading => set({ isLoading })
}));
