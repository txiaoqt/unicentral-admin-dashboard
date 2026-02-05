from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
from bs4 import BeautifulSoup
import re
from datetime import datetime
from supabase import create_client, Client
import os
from dotenv import load_dotenv

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


# --- Helper Functions from pup_scraper.py ---
def format_date_for_supabase(date_str):
    if date_str == "Not Found" or date_str == "Not Found on iApply page" or date_str is None:
        return None
    try:
        return datetime.strptime(date_str, "%B %d, %Y").strftime("%Y-%m-%d")
    except ValueError:
        return None

def get_admission_status(current_date, academic_start_str, academic_end_str, application_deadline_str):
    try:
        current_date_obj = datetime.strptime(current_date, "%B %d, %Y")
        
        academic_start_obj = None
        if academic_start_str != "Not Found":
            academic_start_obj = datetime.strptime(academic_start_str, "%B %d, %Y")

        academic_end_obj = None
        if academic_end_str != "Not Found":
            academic_end_obj = datetime.strptime(academic_end_str, "%B %d, %Y")

        application_deadline_obj = None
        if application_deadline_str != "Not Found" and not application_deadline_str.startswith("From"):
            try:
                application_deadline_obj = datetime.strptime(application_deadline_str, "%B %d, %Y")
            except ValueError:
                application_deadline_obj = None

        if application_deadline_obj and current_date_obj <= application_deadline_obj:
            if academic_start_obj and current_date_obj < academic_start_obj:
                return "Not Yet Open"
            else:
                return "Open"
        elif application_deadline_obj and current_date_obj > application_deadline_obj:
            return "Closed"
        elif academic_end_obj and current_date_obj > academic_end_obj:
            return "Closed"
        elif academic_start_obj and current_date_obj < academic_start_obj:
            return "Not Yet Open"
        elif academic_start_obj:
            return "Open"
            
        return "Status Undetermined"

    except ValueError as e:
        return f"Error parsing date: {e}"
    except Exception as e:
        return f"An error occurred in get_admission_status: {e}"

def get_academic_status(current_date_obj, academic_start_obj, academic_end_obj):
    if not academic_start_obj or not academic_end_obj:
        return "Academic Dates Not Found"
    if current_date_obj < academic_start_obj:
        return "Not Yet Open"
    elif academic_start_obj <= current_date_obj <= academic_end_obj:
        return "Open"
    else:
        return "Closed"


# --- Main Scraper Logic ---
def scrape_pup_admissions():
    url = "https://www.pup.edu.ph/about/calendar"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        data = {
            "admission_status": "Not Found",
            "academic_semester_start": "Not Found",
            "academic_semester_end": "Not Found",
            "academic_application_deadline": "Not Found",
            "admission_deadline": "Not Found",
            "academic_status": "Academic Dates Not Found"
        }
        
        text_content = soup.get_text(separator=" ", strip=True)
        
        first_sem_start_str = "Not Found"
        first_sem_end_str = "Not Found"

        ay_2025_2026_first_sem_block_match = re.search(
            r"(First Semester, Academic Year 2025-2026.*?)(?=Second Semester, Academic Year 2025-2026|\Z)",
            text_content, re.DOTALL | re.IGNORECASE
        )

        if ay_2025_2026_first_sem_block_match:
            first_sem_block = ay_2025_2026_first_sem_block_match.group(1)
            
            start_match = re.search(r"September\s+1\s+First Semester classes start", first_sem_block, re.IGNORECASE)
            if start_match:
                first_sem_start_str = "September 1, 2025" 

            end_date_fragment_match = re.search(r"17\s+First Semester ends", first_sem_block, re.IGNORECASE)
            if end_date_fragment_match:
                if re.search(r"January", first_sem_block[:end_date_fragment_match.start()], re.IGNORECASE):
                    first_sem_end_str = "January 17, 2026"
        
        data["academic_semester_start"] = first_sem_start_str
        data["academic_semester_end"] = first_sem_end_str

        today_date_obj = datetime.now()
        academic_start_obj = None
        academic_end_obj = None

        try:
            if first_sem_start_str != "Not Found":
                academic_start_obj = datetime.strptime(first_sem_start_str, "%B %d, %Y")
            if first_sem_end_str != "Not Found":
                academic_end_obj = datetime.strptime(first_sem_end_str, "%B %d, %Y")
        except ValueError:
            pass
        
        data["academic_status"] = get_academic_status(
            today_date_obj,
            academic_start_obj,
            academic_end_obj
        )

        iapply_url = "https://www.pup.edu.ph/iapply/"
        try:
            iapply_response = requests.get(iapply_url, headers=headers)
            iapply_response.raise_for_status()
            iapply_soup = BeautifulSoup(iapply_response.text, 'html.parser')
            iapply_text_content = iapply_soup.get_text(separator=" ", strip=True)
            
            full_date_pattern = r"(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}"
            application_periods = []

            pupcet_ous_match = re.search(
                r"PUP College Entrance Test \(PUPCET\) for the Open University System:.*?(" + full_date_pattern + r")\s+to\s+(" + full_date_pattern + r")",
                iapply_text_content, re.IGNORECASE | re.DOTALL
            )
            if pupcet_ous_match:
                application_periods.append({
                    "program": "PUPCET (Open University System)",
                    "start_date": pupcet_ous_match.group(1).strip(),
                    "end_date": pupcet_ous_match.group(2).strip()
                })

            pupousaaet_match = re.search(
                r"PUP Open University System Academic and Admission Evaluation for Transferees \(PUPOUSAAET\):.*?(" + full_date_pattern + r")\s+to\s+(" + full_date_pattern + r")",
                iapply_text_content, re.IGNORECASE | re.DOTALL
            )
            if pupousaaet_match:
                application_periods.append({
                    "program": "PUPOUSAAET (Transferees)",
                    "start_date": pupousaaet_match.group(1).strip(),
                    "end_date": pupousaaet_match.group(2).strip()
                })
            
            puplhsee_match = re.search(
                r"Laboratory High School Entrance Examination \(PUP\s*LHSEE\).*?(" + full_date_pattern + r")\s+to\s+(" + full_date_pattern + r")",
                iapply_text_content, re.IGNORECASE | re.DOTALL
            )
            if puplhsee_match:
                application_periods.append({
                    "program": "PUP LHSEE (Grade 7)",
                    "start_date": puplhsee_match.group(1).strip(),
                    "end_date": puplhsee_match.group(2).strip()
                })
            
            pupgsee_match = re.search(
                r"Graduate School Entrance Exam \(PUPGSEE\).*?(" + full_date_pattern + r")\s+to\s+(" + full_date_pattern + r")",
                iapply_text_content, re.IGNORECASE | re.DOTALL
            )
            if pupgsee_match:
                application_periods.append({
                    "program": "PUPGSEE (Graduate Studies - General)",
                    "start_date": pupgsee_match.group(1).strip(),
                    "end_date": pupgsee_match.group(2).strip()
                })

            upcoming_deadlines = []
            for period in application_periods:
                try:
                    period_end_date_obj = datetime.strptime(period["end_date"], "%B %d, %Y")
                    if period_end_date_obj >= today_date_obj:
                        upcoming_deadlines.append(period)
                except ValueError:
                    continue

            if upcoming_deadlines:
                upcoming_deadlines.sort(key=lambda x: datetime.strptime(x["end_date"], "%B %d, %Y"))
                earliest_deadline = upcoming_deadlines[0]
                data["academic_application_deadline"] = f"{earliest_deadline['program']}: From {earliest_deadline['start_date']} to {earliest_deadline['end_date']}"
                data["admission_deadline"] = earliest_deadline["end_date"]
            else:
                data["academic_application_deadline"] = "No upcoming application deadlines found on iApply page"
                data["admission_deadline"] = "No upcoming application deadlines found on iApply page"

        except requests.exceptions.RequestException as req_err:
            data["academic_application_deadline"] = f"Error fetching iApply page: {req_err}"
            data["admission_deadline"] = f"Error fetching iApply page: {req_err}"
        
        today_date_formatted = today_date_obj.strftime("%B %d, %Y")
        data["admission_status"] = get_admission_status(
            today_date_formatted,
            data["academic_semester_start"], 
            data["academic_semester_end"],   
            data["academic_application_deadline"]
        ).lower()

        if supabase:
            try:
                supabase_data = {
                    "admission_status": data["admission_status"],
                    "admission_deadline": format_date_for_supabase(data["admission_deadline"]),
                    "academic_semester_start": format_date_for_supabase(data["academic_semester_start"]),
                    "academic_semester_end": format_date_for_supabase(data["academic_semester_end"]),
                    "academic_application_deadline": format_date_for_supabase(data["academic_application_deadline"]),
                }
                university_id = 1
                response_supabase = supabase.table('universities').update(supabase_data).eq('id', university_id).execute()
                data['supabase_status'] = 'success'
                data['supabase_response'] = str(response_supabase.data)
            except Exception as e:
                data['supabase_status'] = 'error'
                data['supabase_error'] = str(e)
        
        return data

    except requests.exceptions.HTTPError as http_err:
        return {"error": f"HTTP error occurred: {http_err} - URL: {url}"}
    except requests.exceptions.ConnectionError as conn_err:
        return {"error": f"Connection error occurred: {conn_err} - URL: {url}"}
    except requests.exceptions.Timeout as timeout_err:
        return {"error": f"Timeout error occurred: {timeout_err} - URL: {url}"}
    except requests.exceptions.RequestException as req_err:
        return {"error": f"An error occurred: {req_err} - URL: {url}"}
    except Exception as e:
        return {"error": f"An unexpected error occurred: {e}"}

# --- FastAPI Endpoints ---
@app.get("/")
def read_root():
    return {"Hello": "FastAPI on Vercel!"}

@app.post("/api/run-pup-scraper")
def run_scraper_endpoint():
    try:
        result = scrape_pup_admissions()
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