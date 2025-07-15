import { useShallow } from 'zustand/react/shallow';

import { useXellarAccountStore, XellarAccount } from '@/xellar-connector/store';

export const useXellarAccount = (): XellarAccount | null => {
  const account = useXellarAccountStore(useShallow(state => state.account));
  return account;
};
