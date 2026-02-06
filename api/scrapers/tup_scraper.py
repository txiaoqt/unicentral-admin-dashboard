import requests
from bs4 import BeautifulSoup
import re
from datetime import datetime
from supabase import Client
from .utils import format_date_for_supabase, get_admission_status, get_academic_status

def scrape_tup_admissions(supabase: Client, university_id: int):
    calendar_url = "https://tup.edu.ph/viewcalendar"
    announcement_url = "https://tup.edu.ph/announcement"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        response = requests.get(calendar_url, headers=headers)
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
        
        # Look for actual Start and End of Classes based on TUP calendar structure
        # Pattern: "August 11, 2025 Start of Classes"
        start_classes_match = re.search(r'([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})\s+Start of Classes', text_content, re.IGNORECASE)
        if start_classes_match:
            month = start_classes_match.group(1)
            day = start_classes_match.group(2)
            year = start_classes_match.group(3)
            data["academic_semester_start"] = f"{month} {day}, {year}"

        # Look for End of Classes pattern
        # Pattern: "May 21, 2026 End of 2nd Semester/Start of PVP"
        end_classes_match = re.search(r'([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})\s+End of 2nd Semester', text_content, re.IGNORECASE)
        if end_classes_match:
            month = end_classes_match.group(1)
            day = end_classes_match.group(2)
            year = end_classes_match.group(3)
            data["academic_semester_end"] = f"{month} {day}, {year}"

        # Calculate academic status
        today_date_obj = datetime.now()
        academic_start_obj = None
        academic_end_obj = None

        try:
            if data["academic_semester_start"] != "Not Found":
                academic_start_obj = datetime.strptime(data["academic_semester_start"], "%B %d, %Y")
            if data["academic_semester_end"] != "Not Found":
                academic_end_obj = datetime.strptime(data["academic_semester_end"], "%B %d, %Y")
        except ValueError:
            pass
        
        data["academic_status"] = get_academic_status(
            today_date_obj,
            academic_start_obj,
            academic_end_obj
        )

        # --- Scrape Announcement Page for Admission Deadlines ---
        try:
            announcement_response = requests.get(announcement_url, headers=headers)
            announcement_response.raise_for_status()
            announcement_soup = BeautifulSoup(announcement_response.text, 'html.parser')
            announcement_text_content = announcement_soup.get_text(separator=" ", strip=True)
            
            # Look for application deadlines in announcements
            # Pattern: "Submission of Application Requirements September 8, 2025"
            application_deadline_match = re.search(r"Submission of Application Requirements\s+([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})", announcement_text_content, re.IGNORECASE)
            if application_deadline_match:
                month = application_deadline_match.group(1)
                day = application_deadline_match.group(2)
                year = application_deadline_match.group(3)
                
                deadline_date = f"{month} {day}, {year}"
                data["academic_application_deadline"] = f"Application Requirements: {deadline_date}"
                data["admission_deadline"] = deadline_date
            else:
                # Look for other deadline patterns
                deadline_match = re.search(r"(?:Application deadline|Deadline for applications|Last day to apply|Application period ends)\s*(?:is|on|by)?\s*((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4})", announcement_text_content, re.IGNORECASE)
                if deadline_match:
                    data["academic_application_deadline"] = f"Application Deadline: {deadline_match.group(1).strip()}"
                    data["admission_deadline"] = deadline_match.group(1).strip()
                else:
                    data["academic_application_deadline"] = "No explicit deadline found on announcement page"
                    data["admission_deadline"] = "No explicit deadline found on announcement page"

        except requests.exceptions.RequestException as req_err:
            data["academic_application_deadline"] = f"Error fetching announcement page: {req_err}"
            data["admission_deadline"] = f"Error fetching announcement page: {req_err}"
        
        # Calculate admission status
        today_date_formatted = today_date_obj.strftime("%B %d, %Y")
        
        # If no application deadline is found, set admission status to "open"
        if data["academic_application_deadline"] == "No explicit deadline found on announcement page":
            data["admission_status"] = "open"
        else:
            data["admission_status"] = get_admission_status(
                today_date_formatted,
                data["academic_semester_start"], 
                data["academic_semester_end"],   
                data["academic_application_deadline"]
            ).lower()

        # Update Supabase - only if we have meaningful data (not "Not Found")
        if supabase:
            try:
                # Only update if we have actual data, not "Not Found" values
                should_update = (
                    data["academic_semester_start"] != "Not Found" or
                    data["academic_semester_end"] != "Not Found" or
                    data["academic_application_deadline"] != "Not Found" or
                    data["admission_deadline"] != "Not Found"
                )
                
                if should_update:
                    supabase_data = {}
                    
                    # Only include fields that have actual data
                    if data["admission_status"] != "Not Found":
                        supabase_data["admission_status"] = data["admission_status"]
                    
                    if data["admission_deadline"] != "Not Found":
                        supabase_data["admission_deadline"] = format_date_for_supabase(data["admission_deadline"])
                    
                    if data["academic_semester_start"] != "Not Found":
                        supabase_data["academic_semester_start"] = format_date_for_supabase(data["academic_semester_start"])
                    
                    if data["academic_semester_end"] != "Not Found":
                        supabase_data["academic_semester_end"] = format_date_for_supabase(data["academic_semester_end"])
                    
                    if data["academic_application_deadline"] != "Not Found":
                        supabase_data["academic_application_deadline"] = format_date_for_supabase(data["academic_application_deadline"])
                    
                    if supabase_data:  # Only update if we have data to update
                        response_supabase = supabase.table('universities').update(supabase_data).eq('id', university_id).execute()
                        data['supabase_status'] = 'success'
                        data['supabase_response'] = str(response_supabase.data)
                    else:
                        data['supabase_status'] = 'skipped'
                        data['supabase_response'] = 'No meaningful data to update'
                else:
                    data['supabase_status'] = 'skipped'
                    data['supabase_response'] = 'No meaningful data to update'
            except Exception as e:
                data['supabase_status'] = 'error'
                data['supabase_error'] = str(e)
        
        return data

    except requests.exceptions.HTTPError as http_err:
        return {"error": f"HTTP error occurred: {http_err} - URL: {calendar_url}"}
    except requests.exceptions.ConnectionError as conn_err:
        return {"error": f"Connection error occurred: {conn_err} - URL: {calendar_url}"}
    except requests.exceptions.Timeout as timeout_err:
        return {"error": f"Timeout error occurred: {timeout_err} - URL: {calendar_url}"}
    except requests.exceptions.RequestException as req_err:
        return {"error": f"An error occurred: {req_err} - URL: {calendar_url}"}
    except Exception as e:
        return {"error": f"An unexpected error occurred: {e}"}
