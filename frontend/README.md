# Ethereum Wallet Connector (Frontend)

## Overview

This project is a React + TypeScript frontend application that allows users to:

- Connect their Ethereum wallet via MetaMask.
- Fetch and display their Ethereum balance (in ETH).
- Display their last 10 Ethereum transactions.
- Handle basic error cases for failed connections or API calls.

It uses **ethers.js v5** for blockchain interactions and connects to the Ethereum network through MetaMask and Etherscan APIs.

---

## Setup & Run Locally

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd <your-frontend-folder>
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create a `.env` file in the root directory with your Etherscan API key:**

   ```
   REACT_APP_ETHERSCAN_API_KEY=your_etherscan_api_key_here
   ```

4. **Start the development server:**

   ```bash
   npm start
   ```

5. **Open your browser and visit:**

   ```
   http://localhost:3000
   ```

---

## Prerequisites

- **Node.js** (version 16+ recommended)
- **npm** (comes with Node.js)
- A browser with **MetaMask extension installed** and configured
- Valid **Etherscan API key** (for fetching transactions)

---

## Docker Compose Instructions

_Not applicable for this frontend-only project._

---

## Assumptions and Decisions

- The app assumes users have MetaMask installed to connect their Ethereum wallet.
- Uses ethers.js v5 for compatibility and stability with available APIs.
- Etherscan API is used to fetch transaction history due to lack of native support in ethers.js.
- Environment variables are loaded via `.env` with the prefix `REACT_APP_` as per Create React App convention.
- Basic error handling included for wallet connection and API call failures.

---

## Known Issues or Limitations

- Only supports MetaMask wallet; other wallet providers are not supported.
- Transaction history is limited to the last 10 transactions via Etherscan API.
- The app does not support testnets currently.
- No caching mechanism implemented for transaction data.
- UI is minimal and can be enhanced for better UX.
