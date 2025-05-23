```markdown
# Ethereum Wallet Dashboard Backend

## Overview

This backend service provides Ethereum wallet information including balance, current gas price, and block number by interacting with the Ethereum blockchain via Alchemy and storing data in a Supabase PostgreSQL database. It uses Redis caching to optimize performance by reducing redundant blockchain calls.

The API is built with FastAPI and supports async calls to provide efficient responses.

---

## Features

- Fetch Ethereum wallet balance, gas price, and current block number.
- Cache blockchain data in Redis for improved performance.
- Save wallet balance and blockchain metadata into Supabase PostgreSQL.
- REST API endpoints for wallet data retrieval.

---

## Prerequisites

- Python 3.11+
- Docker (optional, for running Redis)
- Supabase PostgreSQL database and credentials
- Ethereum node provider account (e.g., Alchemy API key)
- `pip` for installing Python dependencies

---

## Setup and Running Locally
```

### 1. Clone the Repository

```bash
git clone https://github.com/GeraldTgit/eth-wallet-dashboard.git
cd <your-project-directory>/backend
```

### 2. Create and Activate a Python Virtual Environment

```bash
python -m venv venv
# Windows
.\venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

### 3. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the project root and add:

```env
# Ethereum Node (e.g., Alchemy or Infura HTTP URL)
ALCHEMY_URL="https://eth-mainnet.alchemyapi.io/v2/your-api-key"

# Supabase PostgreSQL Database Connection
DB_HOST="db.tpmkmtzevdsexvqozuhv.supabase.co"
DB_PORT=5432
DB_NAME="postgres"
DB_USER="postgres"
DB_PASSWORD="your_db_password"

# Redis Cache Configuration
REDIS_HOST="127.0.0.1"
REDIS_PORT=6379
REDIS_PASSWORD=""  # leave empty if no password set
```

- **ALCHEMY_URL**: Ethereum node provider URL to query blockchain data.
- **DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD**: Supabase PostgreSQL connection details.
- **REDIS_HOST, REDIS_PORT, REDIS_PASSWORD**: Redis server connection info. Defaults match local Docker setup.

### 5. Start Redis Server (Optional but Recommended)

To run Redis locally for caching, use Docker:

```bash
docker run -p 6379:6379 redis
```

This command starts a Redis container exposing port 6379 on localhost.

### 6. Run the FastAPI Backend

Start the server with:

```bash
uvicorn main:app --reload
```

API will be available at `http://127.0.0.1:8000`.

### 7. Testing the API

Use your browser, Postman, or `curl` to test:

```
GET http://127.0.0.1:8000/eth-info?address=0xYourEthereumAddressHere
```

---

## Database Schema Changes

If the table doesn’t exist yet, create it with:

Sure! Here’s the updated **Database Schema Changes** section with the additional columns and detailed SQL commands:

````markdown
## Database Schema Changes

Make sure your PostgreSQL database table `wallet_balances` includes these columns to store blockchain metadata:

If the table doesn’t exist yet, create it with:

```sql
CREATE TABLE wallet_balances (
  id SERIAL PRIMARY KEY,
  address TEXT NOT NULL,
  balance NUMERIC NOT NULL,
  block_number BIGINT,
  gas_price NUMERIC,
  timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

- **block_number**: The current Ethereum block number at the time of balance fetch.
- **gas_price**: The gas price in wei when the data was fetched (using `NUMERIC` for precision).
- **timestamp**: Automatically records the time of the balance record insertion with timezone support.

---

## Tools and Services Used

- **FastAPI**: Python web framework for building APIs.
- **Web3.py**: Python library for interacting with Ethereum blockchain.
- **Supabase**: Hosted PostgreSQL database backend with REST API support.
- **Redis**: In-memory key-value store used here for caching blockchain data.
- **Docker**: Container runtime used to easily spin up Redis.
- **Uvicorn**: ASGI server for running FastAPI apps.
- **Python-dotenv**: Loads environment variables from `.env`.

---

## Assumptions and Decisions

- Used Redis for caching gas price and block number to reduce API calls and improve response time.
- Supabase PostgreSQL stores wallet balances and blockchain metadata for historical data.
- Ethereum blockchain data accessed via Alchemy node provider.
- Local Redis is optional but recommended.
- `.env` file stores all sensitive configs and keys.

---

## Known Issues and Limitations

- Redis caching only applied to gas price and block number, not wallet balances.
- IPv6 connectivity issues with direct Supabase connection might occur; use session pooler if needed.
- Database schema must be manually updated to add new columns.
- No authentication implemented on API endpoints.
- Ethereum address validation is minimal (length only).

---
````
