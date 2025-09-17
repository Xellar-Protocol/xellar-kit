"use client";

import React from "react";

import { Config, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { XellarKitProvider, defaultConfig, lightTheme } from "@xellar/kit";
import { sepolia, polygonAmoy } from "viem/chains";

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string;
const xellarAppId = process.env.NEXT_PUBLIC_XELLAR_APP_ID as string;

const config = defaultConfig({
  appName: "Xellar",
  walletConnectProjectId,
  xellarAppId,
  xellarEnv: "production",
  chains: [sepolia, polygonAmoy],
  ssr: true,
}) as Config;

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <XellarKitProvider
          theme={{
            ...lightTheme,
            buttons: {
              ...lightTheme.buttons,
              primaryBackground: "#582af0",
              primaryHoverBackground: "#7459f9",
              accentBackground: "#582af0",
            },
          }}
        >
          {children}
        </XellarKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
