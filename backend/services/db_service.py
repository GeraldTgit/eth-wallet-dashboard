import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

def save_balance(address: str, balance: float, gas_price: float, block_number: int):
    try:
        # Open a new connection per request
        conn = psycopg2.connect(
            dbname=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASS"),
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT")
        )
        with conn:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO balances (address, balance, gas_price, block_number)
                    VALUES (%s, %s, %s, %s)
                    ON CONFLICT (address) DO UPDATE SET
                        balance = EXCLUDED.balance,
                        gas_price = EXCLUDED.gas_price,
                        block_number = EXCLUDED.block_number;
                """, (address, balance, gas_price, block_number))
    finally:
        conn.close()
