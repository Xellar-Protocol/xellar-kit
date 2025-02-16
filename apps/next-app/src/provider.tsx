"use client";

import React from "react";

import { Config, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { XellarKitProvider, defaultConfig } from "@xellar/kit";
import { polygonAmoy } from "viem/chains";

const walletConnectProjectId = "";

const config = defaultConfig({
  appName: "Xellar",
  walletConnectProjectId,
  xellarAppId: "",
  xellarEnv: "sandbox",
  chains: [polygonAmoy],
  googleClientId: "",
}) as Config;

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
