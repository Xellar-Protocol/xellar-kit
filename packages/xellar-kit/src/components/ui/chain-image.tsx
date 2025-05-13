import React, { useState } from 'react';
import { useChains } from 'wagmi';

interface ChainImageProps {
  id: number;
  size?: number;
}

export function ChainImage({ id, size = 24 }: ChainImageProps) {
  const chains = useChains();
  const chain = chains.find(chain => chain.id === id);

  const [isError, setIsError] = useState(false);

  // @ts-expect-error imageUrl is not defined in the type
  const imageUrl = `https://icons.llamao.fi/icons/chains/rsz_${chain?.network}.jpg`;

  return (
    <img
      src={isError ? `https://chainlist.org/unknown-logo.png` : imageUrl}
      alt={`${id}`}
      onError={() => setIsError(true)}
      width={size}
      height={size}
      style={{
        borderRadius: '50%',
        objectFit: 'cover'
      }}
    />
  );
}
