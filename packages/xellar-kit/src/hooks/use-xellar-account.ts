import { useShallow } from 'zustand/react/shallow';

import { useBoundStore } from '@/xellar-connector/store';

function decodeJWT(token: string) {
  const base64Url = token?.split('.')[1] ?? '';
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}

interface XellarAccount {
  email: string;
  provider: string;
  uid: string;
  address: {
    network: string;
    address: string;
  }[];
  mode: string;
}

export const useXellarAccount = () => {
  const token = useBoundStore(useShallow(state => state.token));

  if (!token) {
    return null;
  }

  const decodedToken = decodeJWT(token);

  return decodedToken as XellarAccount;
};
