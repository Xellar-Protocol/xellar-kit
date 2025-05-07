import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { ConnectButton, ConnectDialogStandAlone, useXellarAccount } from "@xellar/kit";
import { useAccount, useChainId, useSignMessage, useSignTypedData, useWriteContract } from "wagmi";
import { erc20Abi } from "viem";

function App() {
  const [count, setCount] = useState(0);

  const { signMessageAsync, isPending: isSigningMessage } = useSignMessage();

  const { signTypedDataAsync } = useSignTypedData();

  const { writeContractAsync } = useWriteContract();
  const chainId = useChainId();
  const account = useAccount();
  const handleWriteContract = async () => {
    try {
      const hash = await writeContractAsync({
        abi: erc20Abi,
        address: "0x53844F9577C2334e541Aec7Df7174ECe5dF1fCf0" as `0x${string}`,
        functionName: "approve",
        args: ["0xCa2D0dFC23f4f4b1ee01ed727664f807c21f4505" as `0x${string}`, 1000000000000000000n],
      });

      console.log("Transaction successful:", hash);
    } catch (error) {
      console.error("Error in transaction:", error);
    }
  };

  const xellarAccount = useXellarAccount();

  console.log("Xellar Account:", xellarAccount);

  const handleSignTypedData = async () => {
    try {
      const typedData = await signTypedDataAsync({
        domain: {
          name: "Example DApp",
          version: "1",
          chainId: BigInt(chainId),
        },
        types: {
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
          ],
          Person: [
            { name: "name", type: "string" },
            { name: "wallet", type: "address" },
          ],
        },
        primaryType: "Person",
        message: {
          name: "John Doe",
          wallet: account.address as `0x${string}`,
        },
      });
      console.log("Typed data signed successfully:", typedData);
    } catch (error) {
      console.error("Error signing typed data:", error);
    }
  };

  const handleSignMessage = async () => {
    try {
      const message = "Hello, world!";
      const signature = await signMessageAsync({ message });
      console.log("Message signed successfully:", signature);
    } catch (error) {
      console.error("Error signing message:", error);
    }
  };

  return (
    <div className="w-full bg-red-500">
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
      {account?.address && (
        <>
          <button onClick={handleSignMessage} disabled={isSigningMessage}>
            {isSigningMessage ? "Signing..." : "Sign Message"}
          </button>
          <button onClick={handleSignTypedData}>Sign Typed Data</button>
          <button onClick={handleWriteContract}>Write Contract</button>
        </>
      )}
      <ConnectButton />
      <div className="w-full bg-red-500">
        <ConnectDialogStandAlone />
      </div>
    </div>
  );
}

export default App;
