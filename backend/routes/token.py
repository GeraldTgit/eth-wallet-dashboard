from fastapi import APIRouter
from web3 import Web3
import os
import json
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

CONTRACT_ADDRESS = Web3.to_checksum_address(os.getenv("CONTRACT_ADDRESS"))
with open("contracts/MyToken.json") as f:
    CONTRACT_ABI = json.load(f)

w3 = Web3(Web3.HTTPProvider(os.getenv("WEB3_PROVIDER")))

contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)

@router.get("/tokens/{address}")
def get_tokens(address: str):
    try:
        balance = contract.functions.balanceOf(address).call()
        tokens = []
        for i in range(balance):
            token_id = contract.functions.tokenOfOwnerByIndex(address, i).call()
            tokens.append({"token_id": token_id, "owner": address})
        return {"tokens": tokens}
    except Exception as e:
        return {"error": str(e)}
