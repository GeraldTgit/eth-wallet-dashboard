import os
from web3 import Web3
from services.cache_service import get_cached, set_cached
from services.db_service import save_balance
from dotenv import load_dotenv

load_dotenv()

ALCHEMY_URL = os.getenv("ALCHEMY_URL")
web3 = Web3(Web3.HTTPProvider(ALCHEMY_URL))

async def get_eth_data(address: str):
    gas_price = get_cached("gas_price")
    block_number = get_cached("block_number")

    if not gas_price:
        gas_price = web3.eth.gas_price
        set_cached("gas_price", gas_price, 10)

    if not block_number:
        block_number = web3.eth.block_number
        set_cached("block_number", block_number, 10)

    balance = web3.eth.get_balance(address)
    eth_balance = web3.from_wei(balance, 'ether')
    save_balance(address, balance, gas_price, block_number)

    return {
        "gas_price": gas_price,
        "block_number": block_number,
        "balance": eth_balance
    }
