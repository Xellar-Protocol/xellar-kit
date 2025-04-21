import { useXellarAccountStore, XellarAccount } from '@/xellar-connector/store';

export const useXellarAccount = (): XellarAccount | null => {
  const account = useXellarAccountStore(state => state.account);
  return account;
};
