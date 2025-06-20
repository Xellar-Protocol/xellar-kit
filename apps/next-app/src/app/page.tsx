"use client";

import { ConnectButton } from "@xellar/kit";
import { SiweButton } from "./_components/_siwe-button";
import { useWriteContract } from "wagmi";
import { erc20Abi } from "viem";

export default function Home() {
  const { writeContractAsync } = useWriteContract();

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

  return (
    <div className="flex items-center justify-center h-screen flex-col gap-4">
      <ConnectButton />

      <button onClick={handleWriteContract}>Write Contract</button>

      <SiweButton />
    </div>
  );
}
