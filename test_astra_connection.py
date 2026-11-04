import os
import certifi
import urllib3
from dotenv import load_dotenv
from astrapy import DataAPIClient

# Disable SSL verification warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

load_dotenv()

ASTRA_DB_API_ENDPOINT = os.getenv("ASTRA_DB_API_ENDPOINT")
ASTRA_DB_APPLICATION_TOKEN = os.getenv("ASTRA_DB_APPLICATION_TOKEN")
COLLECTION_NAME = os.getenv("ASTRA_DB_COLLECTION", "notebook_rag_vectors")

def test_astradb_connection():
    print("Connecting to Astra DB...")
    
    client = DataAPIClient(token=ASTRA_DB_APPLICATION_TOKEN)
    db = client.get_database(api_endpoint=ASTRA_DB_API_ENDPOINT)
    
    print(f"Connected to Astra DB! DB Endpoint: {db.api_endpoint}")
    
    collections = db.list_collection_names()
    print(f"Existing Collections: {collections}")
    
    if COLLECTION_NAME not in collections:
        print(f"Creating vector collection '{COLLECTION_NAME}' (dimension=1536)...")
        collection = db.create_collection(
            COLLECTION_NAME,
            definition={"vector": {"dimension": 1536, "metric": "cosine"}}
        )
        print(f"Collection '{COLLECTION_NAME}' successfully created!")
    else:
        collection = db.get_collection(COLLECTION_NAME)
        print(f"Collection '{COLLECTION_NAME}' ready!")

    return db, collection

if __name__ == "__main__":
    test_astradb_connection()
