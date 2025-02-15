import React from "react";
import { Config, WagmiProvider } from "wagmi";
import { polygonAmoy } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { XellarKitProvider, defaultConfig } from "@xellar-protocol/xellar-kit";

const walletConnectProjectId = "0164f6aefa91d65fe12adcfeebadf92b";

const config = defaultConfig({
  appName: "Xellar",
  walletConnectProjectId,
  xellarAppId: "ae3bf65c-d526-41e9-8579-9fa9f4652015",
  xellarEnv: "sandbox",
  chains: [polygonAmoy],
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
