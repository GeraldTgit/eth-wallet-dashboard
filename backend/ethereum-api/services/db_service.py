import os
import socket
import psycopg2
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

# Resolve DB host to IPv4
resolved_ip = socket.gethostbyname(os.getenv("DB_HOST"))

conn = psycopg2.connect(
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASS"),
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT")
)


def save_balance(address: str, balance: float, gas_price: float, block_number: int):
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO balances (address, balance, gas_price, block_number)
        VALUES (%s, %s, %s, %s);
    """, (address, balance, gas_price, block_number))

    conn.commit()
    cur.close()
    conn.close()
