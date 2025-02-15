import { EIP1193Parameters, PublicRpcSchema, WalletRpcSchema } from 'viem';
import { Network, XellarSDK } from 'xellar-ew-sdk';

import { chainMap } from '@/utils/chain-map';

import { useBoundStore } from './store';
type RPCSchema = PublicRpcSchema | WalletRpcSchema;

export async function handleRequest(
  xellarSDK: XellarSDK | undefined,
  { method, params }: EIP1193Parameters<RPCSchema>
) {
  switch (method) {
    case 'personal_sign':
    case 'eth_sign': {
      const token = useBoundStore.getState().token;
      const refreshToken = useBoundStore.getState().refreshToken;
      const chainId = useBoundStore.getState().chainId;

      if (!token || !refreshToken) {
        throw new Error('No token found');
      }

      if (!chainId) {
        throw new Error('No chainId found');
      }

      const result = await xellarSDK?.wallet?.signMessage({
        message: params[0],
        network: chainMap[chainId] as Network,
        walletToken: token,
        refreshToken
      });

      if (!result) {
        throw new Error('Failed to sign message');
      }

      useBoundStore.setState({
        refreshToken: result.refreshToken,
        token: result.walletToken
      });

      return result.signature;
    }
    default:
      throw new Error(`Unsupported method: ${method}`);
  }
}
