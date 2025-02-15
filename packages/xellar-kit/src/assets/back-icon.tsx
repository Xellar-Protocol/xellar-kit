import React, { SVGProps } from 'react';
import { useTheme } from 'styled-components';

export function BackIcon(props: SVGProps<SVGSVGElement>) {
  const theme = useTheme();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        fill={theme.colors.TEXT}
        d="m15.626 22.598-9.144-9.009C6.152 13.27 6 12.914 6 12.5c0-.414.165-.793.482-1.1l9.144-8.998c.27-.26.588-.402.975-.402C17.39 2 18 2.616 18 3.397c0 .379-.153.746-.423 1.018l-8.24 8.073 8.24 8.097c.27.272.423.627.423 1.018 0 .781-.611 1.397-1.399 1.397-.376 0-.705-.142-.975-.402Z"
      />
    </svg>
  );
}
