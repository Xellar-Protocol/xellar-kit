import { create } from 'zustand/react';

type ProfileDialogScreen =
  | 'home'
  | 'onramp'
  | 'select-currency'
  | 'select-crypto'
  | 'receive'
  | 'chain';

interface ProfileDialogState {
  screen: ProfileDialogScreen;
}

interface ProfileDialogActions {
  setState: (state: ProfileDialogState) => void;
}

interface ProfileDialogStore extends ProfileDialogState, ProfileDialogActions {}

export const useProfileDialogStore = create<ProfileDialogStore>(set => ({
  screen: 'home',
  setState: state => set(prev => ({ ...prev, ...state }))
}));
