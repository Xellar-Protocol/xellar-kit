import { createConnector } from '@wagmi/core';
import {
  EIP1193Parameters,
  EIP1193Provider,
  PublicRpcSchema,
  WalletRpcSchema
} from 'viem';
import { XellarSDK } from 'xellar-ew-sdk';

import { handleRequest } from './provider-request';
import { useBoundStore } from './store';

export interface XellarConnectorOptions {
  appId: string;
  env: 'sandbox' | 'production';
}

type RPCSchema = PublicRpcSchema | WalletRpcSchema;
type WalletProvider = EIP1193Provider & {
  appId: string;
  env: 'sandbox' | 'production';
};

export function xellarConnector(options: XellarConnectorOptions) {
  const { appId, env = 'sandbox' } = options;

  if (!appId) {
    throw new Error('appId is required');
  }

  let xellarProvider: EIP1193Provider | undefined;
  let xellarSDK: XellarSDK | undefined;

  return createConnector<EIP1193Provider>(config => ({
    id: 'xellar-passport',
    type: 'xellar-passport',
    name: 'Xellar Passport',
    async setup() {
      useBoundStore.setState({ appId, env });
      if (!xellarSDK) {
        xellarSDK = new XellarSDK({
          appId,
          clientSecret: '',
          env
        });
      }
    },
    async connect({ chainId }: { chainId?: number } = {}) {
      const walletToken = useBoundStore.getState().token;
      const address = useBoundStore.getState().address;
      useBoundStore.setState({ chainId: chainId || 1 });
      if (!walletToken) {
        throw new Error('No token found');
      }

      if (!address) {
        throw new Error('No addresses found');
      }

      // if (!accountsChanged) {
      //   accountsChanged = this.onAccountsChanged.bind(this);
      //   provider.on('accountsChanged', accountsChanged);
      // }
      config.emitter.emit('connect', {
        accounts: [address],
        chainId: chainId ?? 1
      });

      return {
        accounts: [address],
        chainId: chainId ?? 1
      };
    },

    async disconnect() {
      useBoundStore.getState().clearToken();
    },

    onMessage(message) {
      console.log({ message });
    },

    async getAccounts() {
      const address = useBoundStore.getState().address;

      if (!address) {
        throw new Error('No address found');
      }

      return [address];
    },

    async getChainId() {
      const chainId = useBoundStore.getState().chainId;

      if (!chainId) {
        throw new Error('No chainId found');
      }

      return chainId;
    },

    async isAuthorized() {
      const token = useBoundStore.getState().token;

      return !!token;
    },

    onAccountsChanged(accounts) {
      if (accounts.length === 0) this.onDisconnect();
      else
        config.emitter.emit('change', {
          accounts: accounts.map(x => x as `0x${string}`)
        });
    },

    async switchChain({ chainId }: { chainId: number }) {
      const chain = config.chains.find(x => x.id === chainId);

      if (!chain) {
        throw new Error('Chain not found');
      }

      config.emitter.emit('change', { chainId });

      return chain;
    },
    onChainChanged(chain) {
      const chainId = Number(chain);
      config.emitter.emit('change', { chainId });
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async onDisconnect(_error) {
      config.emitter.emit('disconnect');

      useBoundStore.getState().clearToken();
      useBoundStore.getState().clearAddress();
      useBoundStore.getState().clearRefreshToken();
    },
    async getProvider(): Promise<EIP1193Provider> {
      // return xellarProvider;

      const _provider = {
        appId,
        env,
        request: (params: EIP1193Parameters<RPCSchema>) =>
          handleRequest(xellarSDK, params)
      } as WalletProvider;

      if (!xellarProvider) {
        xellarProvider = _provider;
      }

      return xellarProvider;
    }
  }));
}
