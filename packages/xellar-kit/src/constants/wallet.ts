import { IndodaxIcon } from '@/assets/indodax';
import { ReownLightIcon } from '@/assets/reown-light';
import { WalletConnectIcon } from '@/assets/wallet-connect';
import { XellarLight } from '@/assets/xellar-light';

export const WALLET_CONNECT_COMPATIBLE_WALLETS = [
  { id: 'xellar-mobile', name: 'Xellar Mobile', Icon: XellarLight },
  { id: 'indodax', name: 'Indodax', Icon: IndodaxIcon },
  { id: 'reown', name: 'Reown', Icon: ReownLightIcon },
  { id: 'walletconnect', name: 'WalletConnect', Icon: WalletConnectIcon }
];

export type WalletConnectCompatibleWallet =
  (typeof WALLET_CONNECT_COMPATIBLE_WALLETS)[number];
