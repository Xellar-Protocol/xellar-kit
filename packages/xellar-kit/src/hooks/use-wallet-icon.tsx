import React from 'react';
import { useCallback } from 'react';

import { GenericWalletIcon } from '@/assets/generic-wallet';
import { IndodaxIcon } from '@/assets/indodax';
import { MetaMaskIcon } from '@/assets/metamask';
import { ReownDarkIcon } from '@/assets/reown-dark';
import { ReownLightIcon } from '@/assets/reown-light';
import { WalletConnectIcon } from '@/assets/wallet-connect';
import { XellarDark } from '@/assets/xellar-dark';
import { XellarLight } from '@/assets/xellar-light';

interface IconProps {
  src: string;
  alt: string;
}

const Icon: React.FC<IconProps> = ({ src, alt }) => (
  <img src={src} alt={alt} style={{ width: 18, height: 18 }} />
);

export function useWalletIcon(theme: 'light' | 'dark') {
  const renderIcon = useCallback(
    (id: string, icon?: string): React.ReactNode => {
      if (icon) return <Icon src={icon} alt={id} />;
      if (id === 'xellar-passport' || id === 'xellar-mobile') {
        if (theme === 'light') return <XellarDark />;
        return <XellarLight />;
      }
      if (id === 'indodax') return <IndodaxIcon />;
      if (id === 'reown') {
        if (theme === 'light') return <ReownDarkIcon />;
        return <ReownLightIcon />;
      }
      if (id === 'walletconnect') return <WalletConnectIcon />;
      if (id === 'metaMaskSDK') return <MetaMaskIcon />;
      return <GenericWalletIcon />;
    },
    [theme]
  );

  return renderIcon;
}
