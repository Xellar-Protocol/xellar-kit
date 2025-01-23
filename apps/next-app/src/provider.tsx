"use client";

import React from "react";

import { CreateConnectorFn, WagmiProvider, createConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { XellarKitProvider, defaultConnectors } from "@xellar-protocol/xellar-kit";
import { mainnet } from "viem/chains";
import { http } from "viem";

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
  connectors: defaultConnectors({}) as CreateConnectorFn[],
  ssr: true,
});

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <XellarKitProvider theme="dark">{children}</XellarKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
