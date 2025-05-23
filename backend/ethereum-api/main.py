from fastapi import FastAPI, Query, HTTPException
from services.eth_service import get_eth_data

app = FastAPI()

@app.get("/eth-info")
async def eth_info(address: str = Query(..., min_length=42, max_length=42)):
    return await get_eth_data(address)

@app.get("/wallet/{address}")
async def get_wallet_info(address: str):
    try:    
        data = await get_eth_data(address)
        return {
            "address": address,
            "balance": data["balance"],
            "block_number": data["block_number"],
            "gas_price": data["gas_price"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))