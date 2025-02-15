# Xellar-kit

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
import { XellarKitProvider, useXellarKit } from "xellar-kit";

function App() {
  return (
    <XellarKitProvider>
      <MyComponent />
    </XellarKitProvider>
  );
}

function MyComponent() {
  const { connect, disconnect, account, isConnected } = useXellarKit();

  return (
    <div>
      {isConnected ? (
        <>
          <p>Connected: {account}</p>
          <button onClick={disconnect}>Disconnect</button>
        </>
      ) : (
        <button onClick={connect}>Connect Wallet</button>
      )}
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
- 🔹 Support for Coinbase Wallet
- 🔹 Integration with Solana wallets
- 🔹 Other multi-chain support for EVM & non-EVM networks

## Contributing
Contributions are welcome! Open an issue or submit a pull request to get started.

## License
Apache 2.0 License. See `LICENSE` for details.

---

💡 **Xellar-kit** aims to be the go-to solution for Web3 authentication. Cheers!

