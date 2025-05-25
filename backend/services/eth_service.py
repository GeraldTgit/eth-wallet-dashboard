import os
from web3 import Web3
from services.cache_service import get_cached, set_cached
from services.db_service import save_balance
from dotenv import load_dotenv
import traceback
import redis.asyncio as redis
import json
from decimal import Decimal

load_dotenv()

ALCHEMY_URL = os.getenv("ALCHEMY_URL")
web3 = Web3(Web3.HTTPProvider(ALCHEMY_URL))

r = redis.Redis(host="redis", port=6379, decode_responses=True)

def convert_decimal(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError(f"Type {type(obj)} not serializable")

async def get_eth_data(address: str):
    cache_key = f"eth_data:{address}"

    # 1. Check if full result is cached for this address
    cached_data = await r.get(cache_key)
    if cached_data:
        return json.loads(cached_data)

    try:
        # 2. Try getting gas price and block number from shorter cache (or fetch)
        gas_price = get_cached("gas_price")
        if not gas_price:
            gas_price = web3.eth.gas_price
            set_cached("gas_price", gas_price, 10)

        block_number = get_cached("block_number")
        if not block_number:
            block_number = web3.eth.block_number
            set_cached("block_number", block_number, 10)

        # 3. Always fetch balance
        balance = web3.eth.get_balance(address)
        eth_balance = web3.from_wei(balance, 'ether')

        # 4. Save to DB
        save_balance(address, balance, gas_price, block_number)

        # 5. Cache full response by address for 30 seconds
        result = {
            "gas_price": gas_price,
            "block_number": block_number,
            "balance": eth_balance
        }
        await r.setex(cache_key, 30, json.dumps(result, default=convert_decimal))

        return result

    except Exception as e:
        print("ERROR in get_eth_data:", e)
        traceback.print_exc()
        raise
