import React from "react";

import { WagmiProvider, createConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { XellarKitProvider } from "@xellar-protocol/xellar-kit";
import { mainnet } from "viem/chains";
import { http } from "viem";

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <XellarKitProvider>{children}</XellarKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
