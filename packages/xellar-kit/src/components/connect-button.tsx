'use client';

import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  className?: string;
  appName: string;
}

export const ConnectButton = ({
  children,
  className,
  appName
}: ButtonProps) => {
  return (
    <button
      className={className}
      onClick={() => alert(`Hello from your ${appName} app, yey!`)}
    >
      {children}
    </button>
  );
};
