import { useState } from "react";
import { ethers } from "ethers";
import contractABI from "../abis/NFTCollection.json";

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
    try {
      if (!window.ethereum) {
        setError("MetaMask is not installed.");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();

      const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
      if (!contractAddress) {
        throw new Error("REACT_APP_CONTRACT_ADDRESS is not defined in .env");
      }

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const tokenURI = process.env.REACT_APP_TOKEN_URI;

      const tx = await contract.safeMint(userAddress, tokenURI);
      await tx.wait();
      const receipt = await tx.wait();

      // Extract the minted token ID from Transfer event
      const transferEvent = receipt.events?.find(
        (e: any) => e.event === "Transfer"
      );

      if (!transferEvent) throw new Error("Transfer event not found");

      const mintedTokenId = transferEvent.args?.tokenId.toString();

      const owner = await contract.ownerOf(mintedTokenId);

      setLastMintedTokenId(`${mintedTokenId} (owner: ${owner})`);

      // Get the token URI
      const tokenUri = await contract.tokenURI(mintedTokenId);

      // more reliable public gateway
      const response = await fetch(tokenUri);

      const metadata = await response.json();

      // Store metadata to display in UI
      setLastMintedTokenMetadata({
        image: metadata.image,
        name: metadata.name,
        description: metadata.description,
      });

      alert("🎉 Token minted successfully!");
    } catch (err: any) {
      console.error("Minting failed:", err);
      setError(err.message || "Minting failed.");
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
