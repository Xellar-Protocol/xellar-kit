import { IndodaxIcon } from '@/assets/indodax';
import { MetaMaskIcon } from '@/assets/metamask';
import { ReownDarkIcon } from '@/assets/reown-dark';
import { ReownLightIcon } from '@/assets/reown-light';
import { WalletConnectIcon } from '@/assets/wallet-connect';
import { XellarDark } from '@/assets/xellar-dark';
import { XellarLight } from '@/assets/xellar-light';

export const WALLET_CONNECT_COMPATIBLE_WALLETS = [
  {
    id: 'xellar-mobile',
    name: 'Xellar Mobile',
    Icon: XellarLight,
    IconLight: XellarDark
  },
  {
    id: 'metaMaskSDK',
    name: 'MetaMask',
    Icon: MetaMaskIcon,
    IconLight: MetaMaskIcon
  },
  {
    id: 'indodax',
    name: 'Indodax',
    Icon: IndodaxIcon,
    IconLight: IndodaxIcon
  },
  {
    id: 'reown',
    name: 'Reown',
    Icon: ReownLightIcon,
    IconLight: ReownDarkIcon
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    Icon: WalletConnectIcon,
    IconLight: WalletConnectIcon
  }
];

export type WalletConnectCompatibleWallet =
  (typeof WALLET_CONNECT_COMPATIBLE_WALLETS)[number];
