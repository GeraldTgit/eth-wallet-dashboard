import os
import json
from web3 import Web3
from dotenv import load_dotenv

load_dotenv()

ALCHEMY_URL = os.getenv("ALCHEMY_URL")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
account = Web3().eth.account.from_key(PRIVATE_KEY)
PUBLIC_KEY = account.address  # ✅ Extract the address from the account
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")

# Load ABI
with open("./contract/NFTCollection.json") as f:
    contract_abi = json.load(f)["abi"]

# Connect to Web3
web3 = Web3(Web3.HTTPProvider(ALCHEMY_URL))
contract = web3.eth.contract(address=CONTRACT_ADDRESS, abi=contract_abi)

def mint_token(to_address: str):
    try:
        token_uri = os.getenv("TOKEN_URI") # or pull from env
        nonce = web3.eth.get_transaction_count(PUBLIC_KEY)

        txn = contract.functions.safeMint(to_address, token_uri).build_transaction({
            'from': PUBLIC_KEY,
            'nonce': nonce,
            'gas': 300000,
            'gasPrice': web3.eth.gas_price
        })

        signed_txn = web3.eth.account.sign_transaction(txn, private_key=PRIVATE_KEY)
        tx_hash = web3.eth.send_raw_transaction(signed_txn.raw_transaction)
        print(dir(signed_txn))

        return {
            "success": True,
            "tx_hash": tx_hash.hex()
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


def get_token_details(token_id: int):
    try:
        owner = contract.functions.ownerOf(token_id).call()
        token_uri = contract.functions.tokenURI(token_id).call()
        return {
            "token_id": token_id,
            "owner": owner,
            "token_uri": token_uri
        }
    except Exception as e:
        return {
            "error": str(e)
        }
