import { Network, XellarSDK } from '@xellar/sdk';
import {
  Chain,
  EIP1193Parameters,
  hexToString,
  PublicRpcSchema,
  WalletRpcSchema
} from 'viem';

import { useConnectModalStore } from '@/components/dialog/store';
import { chainMap } from '@/utils/chain-map';

import { useBoundStore } from './store';
import {
  completeTransaction,
  showMessageConfirmation,
  showTransactionConfirmation
} from './transaction-confirmation';
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
  const showConfirmationModal =
    useConnectModalStore.getState().showConfirmationModal;

  switch (method) {
    case 'personal_sign': {
      const { token, refreshToken, chainId } = getStoreState();

      const message = hexToString(params[0]);

      if (showConfirmationModal) {
        // Request confirmation before proceeding with message signing
        const confirmed = await showMessageConfirmation(message, chainId);

        // If user rejected the message signing, throw an error
        if (!confirmed) {
          throw new Error('Message signing rejected by user');
        }
      }

      try {
        // At this point, the dialog will show a loading indicator
        // since the confirmation Promise has resolved but the
        // dialog's onConfirm Promise is still pending
        const result = await xellarSDK?.wallet?.signMessage({
          message: message,
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

        // Signal the transaction is complete
        completeTransaction(true);

        return result.signature;
      } catch (error) {
        // Signal transaction error with the error message
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        completeTransaction(false, errorMessage);

        // Handle refresh token first if needed
        await handleRefreshToken(xellarSDK);

        // Now throw so it propagates to the caller
        throw error;
      }
    }
    case 'eth_sign': {
      const { token, refreshToken, chainId } = getStoreState();

      const message = hexToString(params[1]);
      if (showConfirmationModal) {
        // Request confirmation before proceeding with message signing
        const confirmed = await showMessageConfirmation(message);

        // If user rejected the message signing, throw an error
        if (!confirmed) {
          throw new Error('Message signing rejected by user');
        }
      }

      try {
        // At this point, the dialog will show a loading indicator
        // since the confirmation Promise has resolved but the
        // dialog's onConfirm Promise is still pending
        const result = await xellarSDK?.wallet?.signMessage({
          message: message,
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

        // Signal the transaction is complete
        completeTransaction(true);

        return result.signature;
      } catch (error) {
        // Signal transaction error with the error message
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        completeTransaction(false, errorMessage);

        // Handle refresh token first if needed
        await handleRefreshToken(xellarSDK);

        // Now throw so it propagates to the caller
        throw error;
      }
    }

    case 'eth_signTypedData_v4': {
      const { token, refreshToken, chainId } = getStoreState();

      // For typed data, let's show the raw JSON as the message
      let typedDataString = '';
      try {
        // Try to parse and prettify
        const parsedData = JSON.parse(params[1]);
        typedDataString = JSON.stringify(parsedData, null, 2);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        // If parsing fails, just use the raw string
        typedDataString = params[1];
      }

      if (showConfirmationModal) {
        // Request confirmation before proceeding with typed data signing
        const confirmed = await showMessageConfirmation(
          typedDataString,
          chainId
        );

        // If user rejected the typed data signing, throw an error
        if (!confirmed) {
          throw new Error('Typed data signing rejected by user');
        }
      }

      try {
        // At this point, the dialog will show a loading indicator
        // since the confirmation Promise has resolved but the
        // dialog's onConfirm Promise is still pending
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

        // Signal the transaction is complete
        completeTransaction(true);

        return result.signature;
      } catch (error) {
        // Signal transaction error with the error message
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        completeTransaction(false, errorMessage);

        // Handle refresh token first if needed
        await handleRefreshToken(xellarSDK);

        // Now throw so it propagates to the caller
        throw error;
      }
    }

    case 'eth_signTransaction': {
      const { token, refreshToken, chainId } = getStoreState();

      const request = params[0];

      if (showConfirmationModal) {
        // Request confirmation before proceeding with transaction signing
        const confirmed = await showTransactionConfirmation({
          from: request.from as string,
          to: request.to as string,
          value: request.value,
          data: request.data,
          nonce: request.nonce,
          gasPrice: request.gasPrice,
          chainId
        });

        // If user rejected the transaction, throw an error
        if (!confirmed) {
          throw new Error('Transaction rejected by user');
        }
      }

      try {
        // At this point, the dialog will show a loading indicator
        // since the confirmation Promise has resolved but the
        // dialog's onConfirm Promise is still pending
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

        // Signal the transaction is complete
        completeTransaction(true);

        return result.signature;
      } catch (error) {
        // Signal transaction error with the error message
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        completeTransaction(false, errorMessage);

        // Handle refresh token first if needed
        await handleRefreshToken(xellarSDK);

        // Now throw so it propagates to the caller
        throw error;
      }
    }

    case 'eth_sendTransaction': {
      const { token, refreshToken, chainId } = getStoreState();
      const request = params[0];

      if (showConfirmationModal) {
        // Request confirmation before proceeding with transaction
        const confirmed = await showTransactionConfirmation({
          from: request.from as string,
          to: request.to as string,
          value: request.value,
          data: request.data ?? '0x',
          nonce: request.nonce,
          gasPrice: request.gasPrice,
          chainId
        });

        // If user rejected the transaction, throw an error
        if (!confirmed) {
          throw new Error('Transaction rejected by user');
        }
      }

      try {
        // At this point, the dialog will show a loading indicator
        // since the confirmation Promise has resolved but the
        // dialog's onConfirm Promise is still pending
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

        // Signal the transaction is complete
        completeTransaction(true);

        return result.txReceipt.hash;
      } catch (error) {
        // Signal transaction error with the error message
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        completeTransaction(false, errorMessage);

        // Handle refresh token first if needed
        await handleRefreshToken(xellarSDK);

        // Now throw so it propagates to the caller
        throw error;
      }
    }

    case 'eth_estimateGas': {
      const { token, refreshToken, chainId } = getStoreState();

      const request = params[0];

      try {
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
