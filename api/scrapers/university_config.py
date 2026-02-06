"""
University Configuration for Web Scraping
This file contains configuration for all universities that need web scraping.
Each university has its own settings for calendar URLs, application URLs, and scraping patterns.
"""

from typing import Dict, List, Optional, TypedDict

class UniversityConfig(TypedDict):
    """Configuration for a university scraper"""
    name: str
    calendar_url: str
    application_url: str
    start_patterns: List[str]
    end_patterns: List[str]
    application_patterns: List[str]
    closed_application_patterns: List[str]
    fallback_start_date: Optional[str]
    fallback_end_date: Optional[str]
    is_pup_branch: bool
    parent_university_id: Optional[int]

# Configuration for all universities
UNIVERSITY_CONFIGS: Dict[int, UniversityConfig] = {
    # PUP Main Campus (ID: 1)
    1: {
        "name": "Polytechnic University of the Philippines",
        "calendar_url": "https://www.pup.edu.ph/about/calendar",
        "application_url": "https://www.pup.edu.ph/iapply/pupcet",
        "start_patterns": [
            r'([A-Za-z]+)\s+(\d{1,2})\s+First Semester classes start'
        ],
        "end_patterns": [
            r'June\s+(\d{1,2}),\s+2026',
            r'([A-Za-z]+)\s+(\d{1,2})\s+(?:End of 2nd Semester|Second Semester ends|End of Classes)'
        ],
        "application_patterns": [
            r'((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4})\s+to\s+((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4})'
        ],
        "closed_application_patterns": [
            r'Sta\.?\s*Mesa.*?Application is closed'
        ],
        "fallback_start_date": "September 1, 2025",
        "fallback_end_date": "June 21, 2026",
        "is_pup_branch": False,
        "parent_university_id": None
    },
    
    # TUP Main Campus (ID: 2)
    2: {
        "name": "Technological University of the Philippines",
        "calendar_url": "https://www.tup.edu.ph/academic-calendar",
        "application_url": "https://www.tup.edu.ph/admissions",
        "start_patterns": [
            r'Start of Classes.*?([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})',
            r'([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})\s+Start of Classes'
        ],
        "end_patterns": [
            r'End of 2nd Semester.*?([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})',
            r'([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})\s+End of 2nd Semester'
        ],
        "application_patterns": [
            r'Application Requirements.*?([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})',
            r'([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})\s+Application Requirements'
        ],
        "closed_application_patterns": [],
        "fallback_start_date": "August 11, 2025",
        "fallback_end_date": "May 21, 2026",
        "is_pup_branch": False,
        "parent_university_id": None
    },
    
    # PUP Parañaque (ID: 102)
    102: {
        "name": "Polytechnic University of the Philippines Parañaque",
        "calendar_url": "https://www.pup.edu.ph/about/calendar",
        "application_url": "https://www.pup.edu.ph/iapply/pupcet",
        "start_patterns": [
            r'([A-Za-z]+)\s+(\d{1,2})\s+First Semester classes start'
        ],
        "end_patterns": [
            r'June\s+(\d{1,2}),\s+2026',
            r'([A-Za-z]+)\s+(\d{1,2})\s+(?:End of 2nd Semester|Second Semester ends|End of Classes)'
        ],
        "application_patterns": [
            r'((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4})\s+to\s+((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4})'
        ],
        "closed_application_patterns": [
            r'Parañaque.*?Application is closed'
        ],
        "fallback_start_date": "September 1, 2025",
        "fallback_end_date": "June 21, 2026",
        "is_pup_branch": True,
        "parent_university_id": 1
    },
    
    # Add more universities as needed
    # Example structure for future universities:
    # 3: {
    #     "name": "University Name",
    #     "calendar_url": "https://example.edu/calendar",
    #     "application_url": "https://example.edu/admissions",
    #     "start_patterns": ["pattern1", "pattern2"],
    #     "end_patterns": ["pattern1", "pattern2"],
    #     "application_patterns": ["pattern1", "pattern2"],
    #     "closed_application_patterns": ["pattern1"],
    #     "fallback_start_date": "Month Day, Year",
    #     "fallback_end_date": "Month Day, Year",
    #     "is_pup_branch": False,
    #     "parent_university_id": None
    # }
}

def get_university_config(university_id: int) -> Optional[UniversityConfig]:
    """Get configuration for a specific university"""
    return UNIVERSITY_CONFIGS.get(university_id)

def get_all_university_ids() -> List[int]:
    """Get list of all configured university IDs"""
    return list(UNIVERSITY_CONFIGS.keys())

def is_pup_university(university_id: int) -> bool:
    """Check if university is a PUP branch or main campus"""
    config = get_university_config(university_id)
    return config is not None and (config["is_pup_branch"] or university_id == 1)

def get_pup_universities() -> List[int]:
    """Get list of all PUP universities (main + branches)"""
    return [uid for uid, config in UNIVERSITY_CONFIGS.items() 
            if config["is_pup_branch"] or uid == 1]

def get_non_pup_universities() -> List[int]:
    """Get list of non-PUP universities"""
    return [uid for uid, config in UNIVERSITY_CONFIGS.items() 
            if not config["is_pup_branch"] and uid != 1]