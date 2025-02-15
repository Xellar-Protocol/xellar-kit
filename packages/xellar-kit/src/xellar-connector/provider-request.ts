import { EIP1193Parameters, PublicRpcSchema, WalletRpcSchema } from 'viem';
import { Network, XellarSDK } from 'xellar-ew-sdk';

import { chainMap } from '@/utils/chain-map';

import { useBoundStore } from './store';
type RPCSchema = PublicRpcSchema | WalletRpcSchema;

function getStoreState() {
  const token = useBoundStore.getState().token;
  const refreshToken = useBoundStore.getState().refreshToken;
  const chainId = useBoundStore.getState().chainId;

  if (!token || !refreshToken) {
    throw new Error('No token found');
  }

  if (!chainId) {
    throw new Error('No chainId found');
  }

  return { token, refreshToken, chainId };
}

export async function handleRequest(
  xellarSDK: XellarSDK | undefined,
  { method, params }: EIP1193Parameters<RPCSchema>
) {
  console.log('XELLAR METHOD', method);
  switch (method) {
    case 'personal_sign':
    case 'eth_sign': {
      const { token, refreshToken, chainId } = getStoreState();

      const result = await xellarSDK?.wallet?.signMessage({
        message: params[1],
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

    case 'eth_signTypedData_v4': {
      const { token, refreshToken, chainId } = getStoreState();

      const result = await xellarSDK?.wallet?.signTypedData({
        data: params[1],
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

    case 'eth_signTransaction': {
      const { token, refreshToken, chainId } = getStoreState();

      const request = params[0];

      const result = await xellarSDK?.wallet?.signTransaction({
        transaction: {
          from: request.from as `0x${string}`,
          to: request.to as `0x${string}`,
          value: request.value,
          data: request.data,
          nonce: request.nonce,
          gasPrice: request.gasPrice
        },
        network: chainMap[chainId] as Network,
        walletToken: token,
        refreshToken
      });

      if (!result) {
        throw new Error('Failed to sign transaction');
      }

      useBoundStore.setState({
        refreshToken: result.refreshToken,
        token: result.walletToken
      });

      return result.signature;
    }
    case 'eth_sendTransaction': {
      const { token, refreshToken, chainId } = getStoreState();

      const request = params[0];

      const result = await xellarSDK?.wallet?.sendTransaction({
        transaction: {
          from: request.from as `0x${string}`,
          to: request.to as `0x${string}`,
          value: request.value,
          data: request.data ?? '0x',
          nonce: request.nonce,
          gasPrice: request.gasPrice
        },
        network: chainMap[chainId] as Network,
        walletToken: token,
        refreshToken
      });

      if (!result) {
        throw new Error('Failed to send transaction');
      }

      return result.txReceipt.hash;
    }

    default:
      throw new Error(`Unsupported method: ${method}`);
  }
}
