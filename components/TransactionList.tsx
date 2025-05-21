import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Transaction } from "../types";
import { shortenAddress, formatEther } from "../utils";

interface Props {
  provider: ethers.providers.Web3Provider;
  address: string;
}

const TransactionList: React.FC<Props> = ({ provider, address }) => {
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const etherscanProvider = new ethers.providers.EtherscanProvider(
          "homestead"
        );
        const history = await etherscanProvider.getHistory(address);
        const latestTxs = history.slice(-10).reverse();

        const txData: Transaction[] = await Promise.all(
          latestTxs.map(async (tx) => {
            const block = await provider.getBlock(tx.blockNumber);
            return {
              hash: tx.hash,
              from: tx.from,
              to: tx.to ?? "",
              value: formatEther(tx.value.toString()),
              timestamp: new Date(block.timestamp * 1000).toLocaleString(),
            };
          })
        );

        setTxs(txData);
      } catch (err) {
        setError("Failed to fetch transactions");
      }
    };

    fetchTransactions();
  }, [address, provider]);

  return (
    <div>
      <h3>Last 10 Transactions</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {txs.map((tx) => (
          <li key={tx.hash}>
            <p>Hash: {shortenAddress(tx.hash)}</p>
            <p>
              From: {shortenAddress(tx.from)} → {shortenAddress(tx.to)}
            </p>
            <p>Value: {tx.value} ETH</p>
            <p>Time: {tx.timestamp}</p>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
