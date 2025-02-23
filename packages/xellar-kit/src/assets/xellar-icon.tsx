import React, { SVGProps } from 'react';
import { useTheme } from 'styled-components';

import { XellarDark } from './xellar-dark';
import { XellarLight } from './xellar-light';

export function XellarIcon(props: SVGProps<SVGSVGElement>) {
  const { scheme } = useTheme();
  return scheme === 'dark' ? (
    <XellarLight {...props} />
  ) : (
    <XellarDark {...props} />
  );
}
