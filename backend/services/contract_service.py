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

def mint_token(to_address: str, rpc_url: str, private_key: str):
    try:
        # Setup web3 connection and load contract
        web3 = Web3(Web3.HTTPProvider(rpc_url))
        if not web3.is_connected():
            return {"success": False, "error": "Unable to connect to the network"}

        token_uri = os.getenv("TOKEN_URI")  # Metadata URL
        public_key = web3.eth.account.from_key(private_key).address

        # Load contract ABI + address based on network
        with open("./contract/NFTCollection.json") as f: 
            contract_abi = json.load(f)["abi"]

        contract_address = os.getenv("CONTRACT_ADDRESS_SEPOLIA") if "sepolia" in rpc_url else os.getenv("CONTRACT_ADDRESS_MAINNET")

        contract = web3.eth.contract(address=contract_address, abi=contract_abi)

        nonce = web3.eth.get_transaction_count(public_key)

        txn = contract.functions.safeMint(to_address, token_uri).build_transaction({
            'from': public_key,
            'nonce': nonce,
            'gas': 300000,
            'gasPrice': web3.eth.gas_price
        })

        signed_txn = web3.eth.account.sign_transaction(txn, private_key=private_key)
        tx_hash = web3.eth.send_raw_transaction(signed_txn.raw_transaction)

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
