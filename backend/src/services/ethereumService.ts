import { ethers } from 'ethers';

export async function getEthereumData(address: string) {
  if (!ethers.utils.isAddress(address)) {
    throw new Error('Invalid Ethereum address');
  }

  const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_URL);

  const [gasPrice, blockNumber, balance] = await Promise.all([
    provider.getGasPrice(),
    provider.getBlockNumber(),
    provider.getBalance(address),
  ]);

  return {
    gasPrice: ethers.utils.formatUnits(gasPrice, 'gwei'),
    blockNumber,
    balance: ethers.utils.formatEther(balance),
  };
}
