import { GenericWalletIcon } from '@/assets/generic-wallet';
import { IndodaxIcon } from '@/assets/indodax';
import { MetaMaskIcon } from '@/assets/metamask';
import { ReownLightIcon } from '@/assets/reown-light';
import { WalletConnectIcon } from '@/assets/wallet-connect';
import { isAndroid, isIOS } from '@/utils/is-mobile';

/**
 * EIP-6963: Multi Injected Provider Discovery
 * https://eips.ethereum.org/EIPS/eip-6963
 *
 */
export type WalletConfigProps = {
  // Wallets name
  name?: string;
  // Wallets short name. Defaults to `name`
  shortName?: string;
  // Icon to display in the modal
  icon?: string | React.ReactNode;
  // Icon to use on the wallet list button. If not provided, `icon` will be used
  iconConnector?: React.ReactNode;

  // Defaults to `false`, but some icons don't have a background and look better if they shrink to fit the container
  iconShouldShrink?: boolean;
  // Links to download the wallet
  downloadUrls?: {
    // Download redirect, hosted by Family.co
    // This URL redirects to the correct download URL based on the user's device
    // Note: this will eventually be automated by the below data
    download?: string;
    // wallet's website
    website?: string;
    // app downloads
    desktop?: string;
    android?: string;
    ios?: string;
    // browser extensions
    chrome?: string;
    firefox?: string;
    brave?: string;
    edge?: string;
    safari?: string;
  };
  // Create URI for QR code, where uri is encoded data from WalletConnect
  getWalletConnectDeeplink?: (uri: string) => string;
  getBrowserDeeplink?: (uri: string) => string;
  shouldDeeplinkDesktop?: boolean;
};

// Organised in alphabetical order by key
export const walletConfigs: {
  [rdns: string]: WalletConfigProps; // for multiple cases seperate rdns by comma
} = {
  injected: {
    name: 'Browser Wallet',
    shortName: 'Browser',
    icon: <GenericWalletIcon />
  },
  indodax: {
    name: 'Indodax',
    shortName: 'Indodax',
    icon: <IndodaxIcon />,
    iconConnector: <IndodaxIcon />,
    getWalletConnectDeeplink: (uri: string) =>
      isAndroid() ? uri : `indodaxweb3://wc/${encodeURIComponent(uri)}`,
    getBrowserDeeplink: (uri: string) =>
      `https://indodaxwebapp.xellar.co/connections/add?uri=${encodeURIComponent(uri)}`
  },
  'metaMask, metaMask-io, io.metamask, io.metamask.mobile, metaMaskSDK': {
    name: 'MetaMask',
    icon: <MetaMaskIcon />,
    iconConnector: <MetaMaskIcon />,
    iconShouldShrink: true,
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/metamask',
      website: 'https://metamask.io/download/',
      android: 'https://play.google.com/store/apps/details?id=io.metamask',
      ios: 'https://apps.apple.com/app/metamask/id1438144202',
      chrome:
        'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
      firefox: 'https://addons.mozilla.org/firefox/addon/ether-metamask/',
      brave:
        'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
      edge: 'https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm'
    },
    getWalletConnectDeeplink: (uri: string) => {
      return isAndroid()
        ? uri
        : isIOS()
          ? // currently broken in MetaMask v6.5.0 https://github.com/MetaMask/metamask-mobile/issues/6457
            `metamask://wc?uri=${encodeURIComponent(uri)}`
          : `https://metamask.app.link/wc?uri=${encodeURIComponent(uri)}`;
    }
  },
  'app.phantom': {
    name: 'Phantom'
  },
  reown: {
    name: 'Reown',
    shortName: 'Reown',
    icon: <ReownLightIcon />,
    iconConnector: <ReownLightIcon />
  },
  walletConnect: {
    name: 'WalletConnect',
    shortName: 'WalletConnect',
    icon: <WalletConnectIcon />,
    iconConnector: <WalletConnectIcon />
  }
} as const;
