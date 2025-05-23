---
# NFT Smart Contract - Sepolia Testnet Deployment

This project is a simple Ethereum smart contract built using Hardhat and OpenZeppelin. It allows users to **mint** and **transfer** ERC-721 (NFT) tokens. The contract is deployed on the **Sepolia testnet** and is integrated with **Alchemy** for Web3 infrastructure.
---

## 🚀 Project Overview

- **Smart Contract**: ERC-721 NFT collection using OpenZeppelin
- **Minting**: Users can mint NFTs to their wallet with a metadata URI
- **Transfer**: NFTs can be transferred to other Ethereum addresses
- **Testnet Deployment**: Deployed on Sepolia via Alchemy
- **Development Tool**: Hardhat

---

## ⚙️ Setup Instructions

### 1. Clone or Navigate to Project

> _(No cloning instructions included, as this is part of a larger project)_

### 2. Install Node.js Dependencies

```bash
npm install
```

### 3. Create a Sepolia Project in Alchemy

1. Go to [Alchemy Dashboard](https://www.alchemy.com/)
2. Create a **New App**

   - Name: `NFT Contract`
   - Chain: `Ethereum`
   - Network: `Sepolia`

3. Copy your **HTTP API Key URL**

---

## 🔐 Setup `.env` File

Create a `.env` file in your root directory:

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-alchemy-key
PRIVATE_KEY=your-wallet-private-key
```

> 💡 Use a **test wallet** (e.g., MetaMask) and never share your private key publicly.

---

## 💻 Run Locally (Hardhat)

### Compile Contracts

```bash
npx hardhat compile
```

### Deploy Locally

```bash
npx hardhat node  # start local node
npx hardhat run scripts/deploy.js --network localhost
```

### Mint NFT Locally

```bash
npx hardhat run scripts/mint.js --network localhost
```

---

## 🌐 Deploy to Sepolia Testnet

### 1. Fund Your Wallet

Get Sepolia ETH using:

- [Alchemy Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)
- [Google Cloud Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)

### 2. Deploy to Sepolia

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### 3. Mint on Sepolia

```bash
npx hardhat run scripts/mint.js --network sepolia
```

---

## 🧠 Assumptions & Decisions

- Used **Sepolia** instead of Rinkeby/Goerli since it's the most active Ethereum testnet as of 2025.
- Chose **ERC-721** for non-fungible, metadata-supported tokens.
- Used **Alchemy** for more reliable infrastructure than default Infura.

---

## ⚠️ Known Issues / Limitations

- No front-end UI yet — minting and deployment are run via scripts.
- Minting is manual; no access control or payment mechanism added.
- No image hosting or metadata pinning (e.g., IPFS) integrated yet.

---
