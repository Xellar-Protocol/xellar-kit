"use client";

import { useEffect, useState } from "react";
import { SiweMessage } from "siwe";
import { useAccount, useChainId, useSignMessage } from "wagmi";

export const SiweButton = () => {
  const [state, setState] = useState<{
    loading?: boolean;
    nonce?: string;
  }>({});

  const [success, setSuccess] = useState<string | null>(null);

  const fetchNonce = async () => {
    try {
      const nonceRes = await fetch("/api/nonce");
      const json = await nonceRes.json();
      setState((x) => ({ ...x, nonce: json.nonce }));
    } catch (error) {
      setState((x) => ({ ...x, error: error as Error }));
    }
  };

  // Pre-fetch random nonce when button is rendered
  // to ensure deep linking works for WalletConnect
  // users on iOS when signing the SIWE message
  useEffect(() => {
    fetchNonce();
  }, []);

  const { address } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();

  const signIn = async () => {
    try {
      if (!address || !chainId) return;

      setState((x) => ({ ...x, loading: true }));
      // Create SIWE message with pre-fetched nonce and sign with wallet
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce: state.nonce,
      });

      const prepareMessage = message.prepareMessage();

      console.log({ prepareMessage });
      const signature = await signMessageAsync({
        message: prepareMessage,
      });

      // Verify signature
      const verifyRes = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, signature }),
      });
      if (!verifyRes.ok) throw new Error("Error verifying message");

      const json = await verifyRes.json();

      setState((x) => ({ ...x, loading: false }));
      setSuccess(JSON.stringify(json, null, 2));
    } catch (error) {
      console.error(error);
      setState((x) => ({ ...x, loading: false, nonce: undefined }));
      fetchNonce();
    }
  };

  return (
    <div>
      <button disabled={!state.nonce || state.loading} onClick={signIn}>
        {state.loading ? "Signing in..." : "Sign-In with Ethereum"}
      </button>
      {success && <pre>{success}</pre>}
    </div>
  );
};
