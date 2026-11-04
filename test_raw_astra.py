import os
import certifi
import httpx
from dotenv import load_dotenv

load_dotenv()

ASTRA_DB_API_ENDPOINT = os.getenv("ASTRA_DB_API_ENDPOINT")
ASTRA_DB_APPLICATION_TOKEN = os.getenv("ASTRA_DB_APPLICATION_TOKEN")
COLLECTION_NAME = os.getenv("ASTRA_DB_COLLECTION", "notebook_rag_vectors")

def test_raw_keyspaces():
    print("Testing Astra DB REST API findKeyspaces...")
    headers = {
        "Token": ASTRA_DB_APPLICATION_TOKEN,
        "Content-Type": "application/json",
    }
    url = f"{ASTRA_DB_API_ENDPOINT}/api/json/v1"
    
    payload = {"findKeyspaces": {}}
    
    with httpx.Client(verify=False) as client:
        response = client.post(url, json=payload, headers=headers)
        print("Status Code:", response.status_code)
        print("Response JSON:", response.json())

if __name__ == "__main__":
    test_raw_keyspaces()
