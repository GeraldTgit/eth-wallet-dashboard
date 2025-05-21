import React, { useState } from "react";
import { ethers } from "ethers";
import { formatEther } from "../utils";

interface WalletConnectorProps {
  onConnect: (provider: ethers.providers.Web3Provider, address: string) => void;
}

const WalletConnector: React.FC<WalletConnectorProps> = ({ onConnect }) => {
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError("MetaMask is not installed");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      const userBalance = await provider.getBalance(userAddress);

      setAddress(userAddress);
      setBalance(formatEther(userBalance.toString()));
      setError(null);
      onConnect(provider, userAddress);
    } catch (err) {
      setError("Failed to connect wallet");
    }
  };

  return (
    <div>
      <button onClick={connectWallet}>Connect Wallet</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {address && (
        <div>
          <p>Address: {address}</p>
          <p>Balance: {balance} ETH</p>
        </div>
      )}
    </div>
  );
};

export default WalletConnector;
