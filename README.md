# ETH Wallet Dashboard

An Ethereum DApp project that lets users:

- Connect their MetaMask wallet
- Mint ERC-721 tokens
- View wallet balance and last 10 transactions (on Ethereum Mainnet only)
- Fetch real-time on-chain data (balance, block number, gas price)
- Leverages both frontend (React + ethers.js) and backend (FastAPI + Web3.py + PostgreSQL + Redis)

---

## 🚀 Features

- ERC-721 token minting (via smart contract)
- Display minted NFT metadata
- Wallet balance via frontend & backend
- Dockerized services (frontend, backend, Redis, Postgres)
- Redis caching and PostgreSQL storage
- IPFS metadata hosting

---

## 📦 Prerequisites

Make sure you have:

- Docker & Docker Compose
- Node.js (for local React testing)
- Python 3.11+

.env files are required in:

### `/frontend/.env`

```
REACT_APP_CONTRACT_ADDRESS=0x...
REACT_APP_TOKEN_URI=https://ipfs.io/ipfs/...
REACT_APP_ETHERSCAN_API_KEY=your_api_key
```

### `/backend/.env`

```
ALCHEMY_URL=https://eth-sepolia.g.alchemy.com/v2/your_key
PRIVATE_KEY=your_wallet_private_key
DB_NAME=postgres
DB_USER=postgres
DB_PASS=postgres
DB_HOST=db
DB_PORT=5432
CONTRACT_ADDRESS=0x...
```

---

## 🛠️ Local Development

### 1. Clone the repo

```
git clone https://github.com/GeraldTgit/eth-wallet-dashboard.git
cd eth-wallet-dashboard
```

### 2. Build and start with Docker Compose

```
docker-compose up --build
```

Access the frontend at: `http://localhost:3000`
Backend: `http://localhost:8000/docs`

---

## 🐳 Docker Compose Services

- `frontend`: React app served via Nginx
- `backend`: FastAPI + Web3 + PostgreSQL
- `redis`: Caching
- `db`: PostgreSQL for wallet balance history

---

## 🤔 Assumptions & Decisions

- Metadata is hosted on IPFS via lighthouse.storage (since nft.storage now requires CSV)
- Redis used to cache gas/block/balance for performance
- Minting logic moved to backend for centralized control
- Token ID is extracted from Transfer event
- Contract uses `safeMint` with dynamic `tokenURI`

---

## 🐞 Known Issues / Limitations

- Last 10 transactions only supported on Ethereum mainnet (via EtherscanProvider)
- IPFS gateway may timeout if unreliable
- Backend currently only supports minting to 1 contract (no multi-contract support)
- Uses raw `PRIVATE_KEY` in backend for signing (ensure secure environment)

---

## 🧰 Troubleshooting Summary

### ✅ Docker Errors

- Fixed conflicting `backend` definitions in `docker-compose.yml`
- Changed Redis connection from `localhost` to `redis`

### 🐛 ABI / Contract

- `safeMint` wasn't showing in ABI -> recompiled `NFTCollection.sol`
- Wrong ABI in backend -> synced with frontend copy

### ❌ Transaction Errors

- "missing argument" -> forgot to pass `tokenURI` to `safeMint`
- "invalid token ID" -> tried calling `ownerOf` before mint was confirmed
- `rawTransaction` typo -> fixed to `raw_transaction`

### 🔥 Redis / DB Errors

- Redis connection refused in Docker -> updated `host="redis"`
- Decimal not serializable -> converted to float before caching
- psycopg2 InterfaceError: connection closed -> re-opened DB connection each call

---

## 📬 API Endpoints

### GET `/wallet/{address}`

Returns block, gas price, balance from backend (cache/db/web3)

### POST `/api/mint-token`

Triggers backend minting of NFT using smart contract
Body: `{ "address": "0x..." }`

---

---

## 🙌 Author

**Gerald T.** - [github.com/GeraldTgit](https://github.com/GeraldTgit/eth-wallet-dashboard.git)

---

Feel free to fork, test, and expand! ✨
