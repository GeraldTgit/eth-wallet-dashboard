import { useState } from "react";
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
  const [lastMintedTokenId, setLastMintedTokenId] = useState<string | null>(
    null
  );
  const [lastMintedTokenMetadata, setLastMintedTokenMetadata] = useState<{
    image: string;
    name: string;
    description: string;
  } | null>(null);
  const [backendInfo, setBackendInfo] = useState<{
    balance: number;
    gas_price: number;
    block_number: number;
  } | null>(null);
  const [gasPrice, setGasPrice] = useState<string>("");
  const [blockNumber, setBlockNumber] = useState<number | null>(null);
  const [tokens, setTokens] = useState([]);

  const fetchBackendData = async (userAddress: string) => {
    try {
      const res = await fetch(`http://localhost:8000/wallet/${userAddress}`);
      if (!res.ok) throw new Error("Failed to fetch from backend");

      const data = await res.json();
      setBackendInfo(data);
    } catch (err: any) {
      console.error("Backend fetch error:", err.message);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError("MetaMask is not installed.");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const userAddress = await signer.getAddress();
      setWalletAddress(userAddress);
      await fetchBackendData(userAddress);

      // Fetch backend ETH info
      const res = await fetch(`http://localhost:8000/wallet/${userAddress}`);
      if (!res.ok) throw new Error("Failed to fetch ETH info from backend");
      const data = await res.json();

      // Wallet info
      setEthBalance(data.balance);
      setGasPrice(data.gas_price);
      setBlockNumber(data.block_number);

      const etherscan = new ethers.providers.EtherscanProvider(
        "homestead",
        process.env.REACT_APP_ETHERSCAN_API_KEY
      );

      setLoading(true);
      const history = await etherscan.getHistory(userAddress);
      const last10 = history.slice(-10).reverse();

      setTransactions(last10 as Transaction[]);
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet.");
    } finally {
      setLoading(false);
    }
  };

  const mintToken = async () => {
    if (!walletAddress) return;

    try {
      const response = await fetch("http://localhost:8000/api/mint-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: walletAddress }),
      });

      const data = await response.json();
      if (data.tx_hash) {
        alert(`Token minted! Tx Hash: ${data.tx_hash}`);
        // Optional: wait a few seconds for the chain to process, then fetch tokens again
        setTimeout(() => fetchTokens(walletAddress), 5000);
      } else {
        alert("Minting failed.");
      }
    } catch (error) {
      console.error("Mint error:", error);
      alert("An error occurred while minting.");
    }
  };

  const fetchTokens = async (address: string): Promise<void> => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/tokens/${address}`
      );
      const data = await response.json();
      setTokens(data.tokens); // Assume you use a `tokens` state
    } catch (error) {
      console.error("Token fetch error:", error);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={connectWallet}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Connect Wallet
      </button>

      <button
        onClick={mintToken}
        className="bg-green-600 text-white px-4 py-2 rounded ml-4"
      >
        Mint Token
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {lastMintedTokenId && (
        <p className="mt-4 text-green-700">
          🎉 Last Minted Token ID: {lastMintedTokenId}
        </p>
      )}

      {tokens.length > 0 && (
        <div>
          <h3>🎉 Your Minted Tokens:</h3>
          <ul>
            {tokens.map((id) => (
              <li key={id}>Token ID: {id}</li>
            ))}
          </ul>
        </div>
      )}

      {walletAddress && (
        <div className="mt-4">
          <p>
            <strong>Wallet:</strong> {walletAddress}
          </p>
          <p>
            <strong>Balance:</strong> {ethBalance} ETH
          </p>
          <p>
            <strong>Gas Price:</strong> {gasPrice}
          </p>
          <p>
            <strong>Block Number:</strong> {blockNumber}
          </p>

          <h2 className="mt-4 font-bold">Last 10 Transactions:</h2>
          {loading ? (
            <p>
              Loading transactions... <br></br>Can only retrieve ETH
              Transaction, for now.
            </p>
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
      {lastMintedTokenMetadata && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <img
            src={lastMintedTokenMetadata.image}
            alt={lastMintedTokenMetadata.name}
            className="w-32 h-32 object-cover mb-2 rounded"
          />
          <p>
            <strong>Name:</strong> {lastMintedTokenMetadata.name}
          </p>
          <p>
            <strong>Description:</strong> {lastMintedTokenMetadata.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default WalletConnector;
