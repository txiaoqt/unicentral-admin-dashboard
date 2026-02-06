from datetime import datetime

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
