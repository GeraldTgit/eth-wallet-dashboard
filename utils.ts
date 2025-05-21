import { ethers } from 'ethers';

export const formatEther = (wei: string) => ethers.utils.formatEther(wei);
export const shortenAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
