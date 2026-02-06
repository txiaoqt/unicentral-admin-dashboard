from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
from bs4 import BeautifulSoup
import os
from dotenv import load_dotenv
from supabase import create_client, Client
from typing import Dict, Callable 

from scrapers.pup_scraper import scrape_pup_admissions # Import the refactored PUP scraper
from scrapers.tup_scraper import scrape_tup_admissions # Import the TUP scraper

app = FastAPI()

# Load environment variables. This is for local development.
# In Vercel, these should be set in the project's environment variables settings.
load_dotenv()

# Configure CORS
# In production, replace "*" with your frontend's specific Vercel URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Supabase Client Initialization ---
# NEVER expose your Service Role Key on the client-side.
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    # In a production environment, you might want to handle this differently,
    # but for Vercel, the app will fail to start if the env vars are missing,
    # which is the desired behavior.
    print("Warning: Supabase credentials are not fully set. The app will not be able to connect to Supabase.")
    supabase = None
else:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Define a dictionary to map university IDs to their scraper functions
SCRAPERS: Dict[int, Callable[[Client, int], Dict]] = {
    1: scrape_pup_admissions, # Map university_id 1 to pup_scraper
    2: scrape_tup_admissions, # Map university_id 2 to tup_scraper
    # Add other university scrapers here as they are implemented
}


# --- FastAPI Endpoints ---
@app.get("/")
def read_root():
    return {"Hello": "FastAPI on Vercel!"}

@app.post("/api/run-scraper/{university_id}")
async def run_specific_scraper_endpoint(university_id: int, university_url: str = None): # university_url is optional for now
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Supabase client not initialized.")
        
        scraper_func = SCRAPERS.get(university_id)
        if scraper_func:
            result = scraper_func(supabase, university_id)
        else:
            raise HTTPException(status_code=404, detail=f"No scraper implemented for university ID {university_id}")

        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")

@app.post("/api/run-pup-scraper")
def run_scraper_endpoint():
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Supabase client not initialized.")
        result = scrape_pup_admissions(supabase, university_id=1) # Pass supabase client and university_id
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")

# Generic scraper, kept for potential future use or testing
@app.get("/api/scrape")
def scrape_data(url: str):
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        title = soup.title.string if soup.title else "No title"
        return {"title": title}
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Error scraping URL: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred during scraping: {e}")