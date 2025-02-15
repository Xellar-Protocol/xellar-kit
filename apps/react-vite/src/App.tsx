import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { ConnectButton } from "@xellar-protocol/xellar-kit";
import { useSignMessage } from "wagmi";

function App() {
  const [count, setCount] = useState(0);

  const { signMessageAsync } = useSignMessage();

  const handleSignMessage = async () => {
    const message = "Hello, world!";
    const signature = await signMessageAsync({ message });
    console.log(signature);
  };

  return (
    <>
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
      <button onClick={handleSignMessage}>Sign Message</button>
      <ConnectButton />
    </>
  );
}

export default App;
