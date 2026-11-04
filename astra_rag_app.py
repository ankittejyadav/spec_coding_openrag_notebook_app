import os
from dotenv import load_dotenv

load_dotenv()

ASTRA_DB_API_ENDPOINT = os.getenv("ASTRA_DB_API_ENDPOINT")
ASTRA_DB_APPLICATION_TOKEN = os.getenv("ASTRA_DB_APPLICATION_TOKEN")
ASTRA_DB_COLLECTION = os.getenv("ASTRA_DB_COLLECTION", "notebook_rag_vectors")

def get_astradb_client():
    """
    Returns an initialized AstraDB client / VectorStore.
    """
    if not ASTRA_DB_API_ENDPOINT or not ASTRA_DB_APPLICATION_TOKEN:
        raise ValueError(
            "Missing Astra DB credentials. Please set ASTRA_DB_API_ENDPOINT and ASTRA_DB_APPLICATION_TOKEN in your environment or .env file."
        )
    
    from astrapy import DataAPIClient
    
    client = DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
    db = client.get_database_by_api_endpoint(ASTRA_DB_API_ENDPOINT)
    return db

if __name__ == "__main__":
    print("Astra DB configuration helper initialized.")
