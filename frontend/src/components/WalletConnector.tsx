import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Patch the window object type
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface Transaction {
  hash: string;
  to?: string;
  from: string;
  value: ethers.BigNumber;
  timeStamp?: string;
}

const WalletConnector = () => {
  const [ethBalance, setEthBalance] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Include basic error handling for failed connections or API calls.
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError("MetaMask is not installed.");
        return;
      }

      // Use web3.js or ethers.js for blockchain interactions.
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      setWalletAddress(userAddress);

      // Fetch and display the user's Ethereum balance (in ETH).
      const balance = await provider.getBalance(userAddress);
      setEthBalance(ethers.utils.formatEther(balance));

      const etherscan = new ethers.providers.EtherscanProvider(
        "homestead",
        process.env.REACT_APP_ETHERSCAN_API_KEY
      );

      setLoading(true);
      const history = await etherscan.getHistory(userAddress);
      // Fetch and display the user's last 10 transactions.
      const last10 = history.slice(-10).reverse();

      // Type assertion to fix type mismatch
      setTransactions(last10 as Transaction[]);
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet.");
    } finally {
      setLoading(false);
    }
  };

  // Build a UI that allows users to connect their Ethereum wallet.
  // Use TypeScript for the frontend code.
  return (
    <div className="p-4">
      <button
        onClick={connectWallet}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Connect Wallet
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {walletAddress && (
        <div className="mt-4">
          <p>
            <strong>Wallet:</strong> {walletAddress}
          </p>
          <p>
            <strong>Balance:</strong> {ethBalance} ETH
          </p>

          <h2 className="mt-4 font-bold">Last 10 Transactions:</h2>
          {loading ? (
            <p>Loading transactions...</p>
          ) : (
            <ul className="list-disc pl-6 mt-2">
              {transactions.map((tx) => (
                <li key={tx.hash}>
                  <a
                    href={`https://etherscan.io/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {tx.hash.slice(0, 10)}... →{" "}
                    {ethers.utils.formatEther(tx.value)} ETH
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletConnector;
