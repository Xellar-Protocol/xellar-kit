import { Network, XellarSDK } from '@xellar/sdk';
import {
  Chain,
  EIP1193Parameters,
  hexToString,
  PublicRpcSchema,
  WalletRpcSchema
} from 'viem';

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

let id = 0;

async function handleRefreshToken(xellarSDK: XellarSDK | undefined) {
  const { refreshToken } = getStoreState();
  const refreshTokenResult =
    await xellarSDK?.wallet?.refreshToken(refreshToken);

  if (refreshTokenResult) {
    useBoundStore.setState({
      refreshToken: refreshTokenResult.refreshToken,
      token: refreshTokenResult.walletToken
    });
  }
}

export async function handleRequest(
  xellarSDK: XellarSDK | undefined,
  { method, params }: EIP1193Parameters<RPCSchema>,
  chains: readonly [Chain, ...Chain[]]
) {
  switch (method) {
    case 'personal_sign': {
      try {
        const { token, refreshToken, chainId } = getStoreState();

        const result = await xellarSDK?.wallet?.signMessage({
          message: hexToString(params[0]),
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
      } catch (error) {
        await handleRefreshToken(xellarSDK);

        throw error;
      }
    }
    case 'eth_sign': {
      try {
        const { token, refreshToken, chainId } = getStoreState();

        const result = await xellarSDK?.wallet?.signMessage({
          message: hexToString(params[1]),
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
      } catch (error) {
        await handleRefreshToken(xellarSDK);

        throw error;
      }
    }

    case 'eth_signTypedData_v4': {
      try {
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
      } catch (error) {
        await handleRefreshToken(xellarSDK);

        throw error;
      }
    }

    case 'eth_signTransaction': {
      try {
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
      } catch (error) {
        await handleRefreshToken(xellarSDK);

        throw error;
      }
    }

    case 'eth_sendTransaction': {
      const { token, refreshToken, chainId } = getStoreState();
      try {
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

        useBoundStore.setState({
          refreshToken: result.refreshToken,
          token: result.walletToken
        });

        return result.txReceipt.hash;
      } catch (error) {
        await handleRefreshToken(xellarSDK);

        throw error;
      }
    }

    case 'eth_estimateGas': {
      try {
        const { token, refreshToken, chainId } = getStoreState();

        const request = params[0];

        const result = await xellarSDK?.wallet?.estimateGas({
          type: 'custom',
          transaction: {
            from: request.from as `0x${string}`,
            to: request.to as `0x${string}`,
            data: request.data ?? '0x',
            value: request.value,
            gasPrice: request.gasPrice
          },
          network: chainMap[chainId] as Network,
          walletToken: token,
          refreshToken
        });

        if (!result) {
          throw new Error('Failed to estimate gas');
        }

        useBoundStore.setState({
          refreshToken: result.refreshToken,
          token: result.walletToken
        });

        return result.gasLimit;
      } catch (error) {
        await handleRefreshToken(xellarSDK);

        throw error;
      }
    }

    default: {
      const { chainId } = getStoreState();

      const chain = chains.find(chain => chain.id === chainId);
      if (!chain) {
        throw new Error('Chain not found');
      }

      const rpcUrls = chain.rpcUrls.default.http;

      for (const rpcUrl of rpcUrls) {
        if (!rpcUrl) continue;

        try {
          const result = await fetch(rpcUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: method,
              params: params,
              id: id++
            })
          });

          if (!result.ok) continue;

          const json = await result.json();
          return json.result;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          // Continue to next RPC URL if current one fails
          continue;
        }
      }

      // If we've tried all URLs and none worked
      throw new Error('All RPC URLs failed');
    }
  }
}
