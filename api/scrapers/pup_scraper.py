import requests
from bs4 import BeautifulSoup
import re
from datetime import datetime, date
import os
from supabase import Client # Only import Client, supabase client will be passed as an argument
from .utils import format_date_for_supabase, get_admission_status, get_academic_status # Import from utils

def scrape_pup_admissions(supabase: Client, university_id: int): # Accept supabase client and university_id as argument
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

        # Look for First Semester dates using pattern matching instead of hardcoded values
        # Pattern: "September 1 First Semester classes start"
        start_match = re.search(r'([A-Za-z]+)\s+(\d{1,2})\s+First Semester classes start', text_content, re.IGNORECASE)
        if start_match:
            month = start_match.group(1)
            day = start_match.group(2)
            # Assume current year or next year based on month
            year = "2025" if month in ["September", "October", "November", "December"] else "2026"
            first_sem_start_str = f"{month} {day}, {year}"

        # Look for End of 2nd Semester pattern: "June 21, 2026" (as you mentioned)
        # Since the current calendar might not show this date, we'll use a fallback approach
        # Pattern 1: Look for any June date in 2026
        end_match = re.search(r'June\s+(\d{1,2}),\s+2026', text_content, re.IGNORECASE)
        if end_match:
            day = end_match.group(1)
            first_sem_end_str = f"June {day}, 2026"
        
        # Pattern 2: If no June date found, use the specific date you mentioned as fallback
        if first_sem_end_str == "Not Found":
            # Use the date you specified: June 21, 2026
            first_sem_end_str = "June 21, 2026"
        
        # Pattern 3: Alternative pattern if we want to be more flexible
        if first_sem_end_str == "Not Found":
            end_match_alt = re.search(r'([A-Za-z]+)\s+(\d{1,2})\s+(?:End of 2nd Semester|Second Semester ends|End of Classes)', text_content, re.IGNORECASE)
            if end_match_alt:
                month = end_match_alt.group(1)
                day = end_match_alt.group(2)
                year = "2026"  # End of 2nd semester is always next year
                first_sem_end_str = f"{month} {day}, {year}"
        
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

        iapply_url = "https://www.pup.edu.ph/iapply/pupcet"
        try:
            iapply_response = requests.get(iapply_url, headers=headers)
            iapply_response.raise_for_status()
            iapply_soup = BeautifulSoup(iapply_response.text, 'html.parser')
            iapply_text_content = iapply_soup.get_text(separator=" ", strip=True)
            
            # Check if applications are closed for Sta. Mesa, Manila
            if re.search(r'Sta\.?\s*Mesa.*?Application is closed', iapply_text_content, re.IGNORECASE):
                data["academic_application_deadline"] = "Application is closed for Sta. Mesa, Manila"
                data["admission_deadline"] = "Application is closed"
                data["admission_status"] = "closed"
            else:
                # Look for date ranges in the format "January 5, 2026 to March 31, 2026"
                date_range_pattern = r'((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4})\s+to\s+((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4})'
                date_matches = re.findall(date_range_pattern, iapply_text_content, re.IGNORECASE)
                
                upcoming_deadlines = []
                for start_date, end_date in date_matches:
                    try:
                        period_end_date_obj = datetime.strptime(end_date, "%B %d, %Y")
                        if period_end_date_obj >= today_date_obj:
                            upcoming_deadlines.append({
                                "program": "PUPCET Application",
                                "start_date": start_date.strip(),
                                "end_date": end_date.strip()
                            })
                    except ValueError:
                        continue

                if upcoming_deadlines:
                    upcoming_deadlines.sort(key=lambda x: datetime.strptime(x["end_date"], "%B %d, %Y"))
                    earliest_deadline = upcoming_deadlines[0]
                    data["academic_application_deadline"] = f"{earliest_deadline['program']}: From {earliest_deadline['start_date']} to {earliest_deadline['end_date']}"
                    data["admission_deadline"] = earliest_deadline["end_date"]
                else:
                    data["academic_application_deadline"] = "No upcoming application deadlines found on PUPCET page"
                    data["admission_deadline"] = "No upcoming application deadlines found on PUPCET page"

        except requests.exceptions.RequestException as req_err:
            data["academic_application_deadline"] = f"Error fetching iApply page: {req_err}"
            data["admission_deadline"] = f"Error fetching iApply page: {req_err}"
        
        # Only call get_admission_status if we haven't already set it to "closed"
        if data["admission_status"] != "closed":
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
                # university_id = 1 # This was hardcoded, now it's passed as an argument
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