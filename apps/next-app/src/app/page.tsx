import { ConnectButton } from '@xellar-protocol/xellar-kit';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <ConnectButton appName="Xellar">Connect</ConnectButton>
    </div>
  );
}
