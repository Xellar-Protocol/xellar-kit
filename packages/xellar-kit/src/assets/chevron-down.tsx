import { SVGProps } from 'react';

interface ChevronDownIconProps extends SVGProps<SVGSVGElement> {
  color?: string;
  width?: number;
  height?: number;
}

export function ChevronDownIcon({
  color = 'currentColor',
  width = 16,
  height = 16,
  ...props
}: ChevronDownIconProps) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
