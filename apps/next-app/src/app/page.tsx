import { ConnectButton } from "@xellar/kit";
import { SiweButton } from "./_components/_siwe-button";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen flex-col gap-4">
      <ConnectButton />

      <SiweButton />
    </div>
  );
}
