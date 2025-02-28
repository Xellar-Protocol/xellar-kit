import { createConnector } from '@wagmi/core';
import { XellarSDK } from '@xellar/sdk';
import {
  EIP1193Parameters,
  EIP1193Provider,
  getAddress,
  PublicRpcSchema,
  WalletRpcSchema
} from 'viem';

import { handleRequest } from './provider-request';
import { useBoundStore } from './store';

export interface XellarConnectorOptions {
  appId: string;
  env: 'sandbox' | 'production';
}

type RPCSchema = PublicRpcSchema | WalletRpcSchema;
type WalletProvider = EIP1193Provider & XellarConnectorOptions;

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
      const chainId = config.chains[0]?.id;
      if (chainId) {
        useBoundStore.setState({ chainId });
      }
      if (!xellarSDK) {
        xellarSDK = new XellarSDK({
          appId,
          clientSecret: '',
          env
        });
      }
    },
    async onConnect(info) {
      const accounts = await this.getAccounts();
      const chainId = Number(info.chainId);

      useBoundStore.setState({ chainId });
      config.emitter.emit('connect', {
        accounts,
        chainId
      });
    },
    async connect({ chainId }: { chainId?: number } = {}) {
      const walletToken = useBoundStore.getState().token;
      const address = useBoundStore.getState().address;

      let targetChainId = chainId;
      targetChainId = config.chains[0]?.id;

      if (!walletToken) {
        throw new Error('No token found');
      }

      if (!address) {
        return undefined as never;
      }

      if (!targetChainId) throw new Error('No chains found on connector.');

      return {
        accounts: [getAddress(address)],
        chainId: targetChainId
      };
    },

    async disconnect() {
      useBoundStore.getState().clearToken();
      useBoundStore.getState().clearAddress();
      useBoundStore.getState().clearRefreshToken();
    },

    onMessage() {
      // Not implemented
    },

    async getAccounts() {
      const address = useBoundStore.getState().address;

      if (!address) {
        return undefined as never;
      }

      return [getAddress(address)];
    },

    async getChainId() {
      const chainId = useBoundStore.getState().chainId;

      if (!chainId) {
        throw new Error('No chainId found');
      }

      return chainId;
    },

    async isAuthorized() {
      const accounts = await this.getAccounts();

      if (!accounts) {
        return false;
      }

      return !!accounts.length;
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
      useBoundStore.setState({ chainId });

      return chain;
    },
    onChainChanged(chain) {
      const chainId = Number(chain);
      config.emitter.emit('change', { chainId });
      useBoundStore.setState({ chainId });
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
