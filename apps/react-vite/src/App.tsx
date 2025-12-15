import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  useXellarAccount,
  useSmartAccount,
  useConnectModal,
  ConnectButton,
  useSignAuthorization,
} from "@xellar/kit";
import {
  useAccount,
  useChainId,
  useSignMessage,
  useSignTypedData,
  useSwitchChain,
  useWriteContract,
} from "wagmi";
import { encodeFunctionData, erc20Abi } from "viem";
import { baseSepolia } from "viem/chains";
const tokenABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burnFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burnFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    name: "approve",
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const callABI = [
  {
    type: "constructor",
    inputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "execute",
    inputs: [
      {
        name: "calls",
        type: "tuple[]",
        internalType: "struct Call.CallData[]",
        components: [
          {
            name: "to",
            type: "address",
            internalType: "address",
          },
          {
            name: "value",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "data",
            type: "bytes",
            internalType: "bytes",
          },
        ],
      },
    ],
    outputs: [
      {
        name: "results",
        type: "bytes[]",
        internalType: "bytes[]",
      },
    ],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "executeSingle",
    inputs: [
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "data",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [
      {
        name: "result",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "version",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "string",
        internalType: "string",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "event",
    name: "BatchExecuted",
    inputs: [
      {
        name: "caller",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "totalCalls",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "totalValue",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "CallExecuted",
    inputs: [
      {
        name: "target",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "value",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "data",
        type: "bytes",
        indexed: false,
        internalType: "bytes",
      },
      {
        name: "result",
        type: "bytes",
        indexed: false,
        internalType: "bytes",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "CallFailed",
    inputs: [
      {
        name: "target",
        type: "address",
        internalType: "address",
      },
      {
        name: "index",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "EmptyBatch",
    inputs: [],
  },
  {
    type: "error",
    name: "ReentrancyGuardReentrantCall",
    inputs: [],
  },
  {
    type: "error",
    name: "ValueMismatch",
    inputs: [
      {
        name: "expected",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "provided",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "ZeroAddress",
    inputs: [],
  },
];

function App() {
  const [count, setCount] = useState(0);

  const { signMessageAsync, isPending: isSigningMessage } = useSignMessage();

  const { signTypedDataAsync } = useSignTypedData();
  const { signTransaction, smartAccount } = useSmartAccount();
  const { switchChainAsync } = useSwitchChain();
  const { open } = useConnectModal();
  const { writeContractAsync } = useWriteContract();
  const chainId = useChainId();
  const account = useAccount();
  const { signAuthorization, resetAuthorization } = useSignAuthorization();

  const handleWriteContract = async () => {
    try {
      const hash = await writeContractAsync({
        abi: erc20Abi,
        address: "0x53844F9577C2334e541Aec7Df7174ECe5dF1fCf0" as `0x${string}`,
        functionName: "approve",
        args: [
          "0xCa2D0dFC23f4f4b1ee01ed727664f807c21f4505" as `0x${string}`,
          1000000000000000000n,
        ],
      });

      console.log("Transaction successful:", hash);
    } catch (error) {
      console.error("Error in transaction:", error);
    }
  };

  const xellarAccount = useXellarAccount();

  console.log("Xellar Account:", xellarAccount);

  const handleSignAuthorization = async () => {
    try {
      if (chainId !== baseSepolia.id) {
        await switchChainAsync({ chainId: baseSepolia.id });
      }

      const signAuthorizationResult = await signAuthorization(
        baseSepolia.id.toString(),
        "0x64e2f8c98e6a85a35d279eeb853050b7ae59e1c9",
        "self"
      );
      if (!signAuthorizationResult) {
        return;
      }
      const transferCallData = encodeFunctionData({
        abi: tokenABI,
        functionName: "approve",
        args: [account.address as `0x${string}`, 1000n],
      });

      const txHash = await writeContractAsync({
        abi: callABI,
        functionName: "executeSingle",
        address: account.address as `0x${string}`,
        args: [
          "0x5deac602762362fe5f135fa5904351916053cf70" as `0x${string}`, // usdc hardcoded address
          transferCallData,
        ],
        chainId: baseSepolia.id,
        authorizationList: [
          {
            chainId: signAuthorizationResult.authorization.chainId,
            contractAddress: signAuthorizationResult.authorization
              .address as `0x${string}`,
            nonce: signAuthorizationResult.authorization.nonce,
            r: signAuthorizationResult.authorization.r as `0x${string}`,
            s: signAuthorizationResult.authorization.s as `0x${string}`,
            yParity: signAuthorizationResult.authorization.yParity,
          },
        ],
      });
      console.log("EIP-7702 Transaction Successfull: ", txHash);
    } catch (error) {
      console.error("Error signing typed data:", error);
    }
  };

  const handleResetAuthorization = async () => {
    try {
      await resetAuthorization(baseSepolia.id.toString(), "self");
      console.log("Authorization reset successfully");
    } catch (error) {
      console.error("Error resetting authorization:", error);
    }
  };

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

  const handleSmartAccountSignTransaction = async () => {
    const callData = encodeFunctionData({
      abi: erc20Abi,
      functionName: "approve",
      args: [
        "0xCa2D0dFC23f4f4b1ee01ed727664f807c21f4505" as `0x${string}`,
        1000000000000000000n,
      ],
    });

    const selectedAccount = smartAccount?.accounts[0];

    if (!selectedAccount) {
      return;
    }

    await switchChainAsync({ chainId: selectedAccount.chainId });

    await signTransaction({
      accountId: selectedAccount.id,
      to: "0x53844F9577C2334e541Aec7Df7174ECe5dF1fCf0" as `0x${string}`,
      value: "0",
      callData,
    });
  };

  return (
    <div className="w-full bg-red-500 text-center">
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
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      {account?.address ? (
        <>
          <ConnectButton />
          <button onClick={handleSignMessage} disabled={isSigningMessage}>
            {isSigningMessage ? "Signing..." : "Sign Message"}
          </button>
          <button onClick={handleSignTypedData}>Sign Typed Data</button>
          <button onClick={handleSignAuthorization}>Sign Authorization</button>
          <button onClick={handleResetAuthorization}>
            Reset Authorization
          </button>
          <button onClick={handleWriteContract}>Write Contract</button>
          <button onClick={handleSmartAccountSignTransaction}>
            Smart Account Sign Transaction
          </button>
        </>
      ) : (
        <button onClick={open}>Connect</button>
      )}
      {/* <ConnectDialogStandAlone /> */}
    </div>
  );
}

export default App;
