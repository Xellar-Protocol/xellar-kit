import React, { SVGProps } from 'react';
import { useTheme } from 'styled-components';

import { ReownDarkIcon } from './reown-dark';
import { ReownLightIcon } from './reown-light';

export function ReownIcon(props: SVGProps<SVGSVGElement>) {
  const { scheme } = useTheme();
  return scheme === 'dark' ? (
    <ReownLightIcon {...props} />
  ) : (
    <ReownDarkIcon {...props} />
  );
}
