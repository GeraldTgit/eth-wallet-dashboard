from fastapi import FastAPI, Query, HTTPException
from services.eth_service import get_eth_data
from fastapi.middleware.cors import CORSMiddleware
from services.contract_service import mint_token
from pydantic import BaseModel

class MintRequest(BaseModel):
    address: str

app = FastAPI(debug=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.post("/api/mint-token")
async def mint_token_api(request: MintRequest):
    try:
        print("⚙️ Starting mint_token for:", request.address)

        tx_result = mint_token(request.address)

        print("✅ Mint result:", tx_result)

        if tx_result["success"]:
            return {"tx_hash": tx_result["tx_hash"]}
        else:
            raise HTTPException(status_code=400, detail=tx_result["error"])

    except Exception as e:
        import traceback
        print("🔥 Error in /api/mint-token:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))