import { SVGProps } from 'react';

import { SendIcon } from './send-icon';

interface ReceiveIconProps extends SVGProps<SVGSVGElement> {
  color?: string;
  width?: number;
  height?: number;
}

export function ReceiveIcon({
  color = 'currentColor',
  width = 16,
  height = 16,
  ...props
}: ReceiveIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  );
}
