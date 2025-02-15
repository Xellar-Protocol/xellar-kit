# Xellar-kit


![](./xellar-kit-video.gif)


Xellar-kit is a plug-and-play wallet connection solution designed for seamless integration with **Xellar Passport** and various other wallets, including **MetaMask (injector)** and **WalletConnect**. It provides a smooth developer experience for integrating multi-wallet authentication into decentralized applications (dApps).

## Features

- 🔌 **Xellar Passport Integration** – Seamlessly authenticate users via Xellar Passport.
- 🦊 **MetaMask (Injected Wallets) Support** – Detect and connect to browser extension wallets.
- 📲 **WalletConnect Integration** – Connect to mobile wallets with QR code scanning.
- 🛠 **Customizable UI** – Easily theme and configure the modal to fit your dApp.
- ⚡ **Developer-Friendly API** – Simple hooks and components for quick integration.

## Installation

```sh
npm install xellar-kit
# or
yarn add xellar-kit
```

## Usage

### Basic Setup

```tsx
import { XellarKitProvider, defaultConfig,ConnectButton } from "@xellar-protocol/xellar-kit";
import { Config, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {

const config = defaultConfig({
  appName: "<your_app_name>",
  walletConnectProjectId: "<your_wallet_connect_project_id>",
  xellarAppId: "<your_xellar_app_id>",
}) as Config;

const queryClient = new QueryClient();


  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <XellarKitProvider theme="dark">
          <MyComponent />
        </XellarKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

function MyComponent() {


  return (
    <div>
    <ConnectButton.Custom>
        {({ openConnectModal, disconnect, isConnected, openChainModal, openProfileModal, account, chain }) => (
          <button onClick={openConnectModal}>Connect</button>
        )}
      </ConnectButton.Custom>
    </div>
  );
}
```

## API

### `<XellarKitProvider>`
Wrap your application with `XellarKitProvider` to enable wallet connection features.


## Supported Wallets
- **Xellar Passport** (native integration)
- **MetaMask (Injected Web3 Wallets)**
- **WalletConnect** (QR code-based connection)

## Customization

Xellar-kit allows styling and theming via props and CSS variables. More details on theming options coming soon!

## Roadmap
- 🔹 Integration with Solana wallets
- 🔹 Other multi-chain support for EVM & non-EVM networks

## Contributing
Contributions are welcome! Open an issue or submit a pull request to get started.

## License
Apache 2.0 License. See `LICENSE` for details.





