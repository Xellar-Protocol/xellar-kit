import React from "react";
import { Config, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { XellarKitProvider, defaultConfig } from "@xellar/kit";

const walletConnectProjectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

const config = defaultConfig({
  appName: "Xellar",
  walletConnectProjectId,
  xellarAppId: import.meta.env.VITE_XELLAR_APP_ID,
  xellarEnv: "sandbox",
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
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
