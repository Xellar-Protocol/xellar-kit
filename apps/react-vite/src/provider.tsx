import React from "react";
import { Config, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { XellarKitProvider, defaultConfig } from "@xellar/kit";
import { liskSepolia, polygonMumbai, lisk } from "viem/chains";

const walletConnectProjectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

const config = defaultConfig({
  appName: "Xellar",
  walletConnectProjectId,
  xellarAppId: import.meta.env.VITE_XELLAR_APP_ID,
  xellarEnv: "production",
  chains: [liskSepolia, polygonMumbai, lisk],
}) as Config;

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
