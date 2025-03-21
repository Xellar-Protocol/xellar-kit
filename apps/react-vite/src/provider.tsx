import React from "react";
import { Config, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { XellarKitProvider, defaultConfig, lightTheme, darkTheme } from "@xellar/kit";
import { polygonAmoy } from "viem/chains";

const walletConnectProjectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

const config = defaultConfig({
  appName: "Xellar",
  walletConnectProjectId,
  xellarAppId: import.meta.env.VITE_XELLAR_APP_ID,
  xellarEnv: "sandbox",
  chains: [polygonAmoy],
}) as Config;

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <XellarKitProvider
          theme={darkTheme}
          googleClientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
          telegramConfig={{
            botId: import.meta.env.VITE_TELEGRAM_BOT_ID,
            botUsername: import.meta.env.VITE_TELEGRAM_BOT_USERNAME,
          }}
          enableWhatsappLogin
        >
          {children}
        </XellarKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
