# UniCenter Dash

A specialized web application for monitoring the admission status of the Polytechnic University of the Philippines (PUP). It features a dashboard for displaying admission data, user management, and a backend for web scraping PUP's official website.

## Features

- **PUP Admission Monitoring**: Scrapes and displays the academic calendar and application deadlines from the PUP website.
- **Dashboard**: Centralized view of admission data.
- **User Management**: (Implied by modals like AddUserModal, EditUserModal)
- **Data Persistence**: Stores scraped and user data in a Supabase database.
- **Responsive UI**: Built with React and shadcn-ui for a modern and adaptable user experience.

## Technologies Used

### Frontend

-   **React**: A JavaScript library for building user interfaces.
-   **Vite**: A fast build tool for modern web projects.
-   **shadcn-ui**: A collection of reusable components.
-   **TanStack Query**: For data fetching, caching, and state management.
-   **Supabase Client**: For interacting with the Supabase backend.
-   **Tailwind CSS**: A utility-first CSS framework.

### Backend

-   **FastAPI**: A modern, fast (high-performance) web framework for building APIs with Python 3.7+ based on standard Python type hints.
-   **BeautifulSoup4**: A Python library for pulling data out of HTML and XML files.
-   **Supabase Python Client**: For interacting with the Supabase database.
-   **Uvicorn**: An ASGI web server for Python.

## Setup Instructions

### Prerequisites

-   Node.js (LTS recommended)
-   npm or Yarn or Bun
-   Python 3.7+
-   `pip` (Python package installer)
-   A Supabase project (URL and API keys required)

### 1. Clone the repository

```bash
git clone <repository_url>
cd unicenter-dash
```

### 2. Frontend Setup

Navigate to the project root directory.

```bash
cd unicenter-dash
```

#### Install Dependencies

```bash
bun install # or npm install or yarn install
```

#### Environment Variables

Create a `.env` file in the project root directory based on `.env.example`:

```
VITE_SUPABASE_URL="YOUR_SUPABASE_URL"
VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
```

Replace `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_ANON_KEY` with your actual Supabase project URL and public `anon` key.

### 3. Backend Setup

Navigate to the `api` directory.

```bash
cd api
```

#### Create and Activate Virtual Environment

```bash
python -m venv .venv
# On Windows
.\.venv\Scripts\activate
# On macOS/Linux
source .venv/bin/activate
```

#### Install Dependencies

```bash
pip install -r requirements.txt
```

#### Environment Variables

Create an `.env` file in the `api` directory based on `api/.env.example`:

```
SUPABASE_URL="YOUR_SUPABASE_URL"
SUPABASE_SERVICE_ROLE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY"
```

Replace `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_SERVICE_ROLE_KEY` with your actual Supabase project URL and `service_role` key. This key should be kept secure.

## How to Run the Application

### 1. Run the Backend

From the `api` directory (with the virtual environment activated):

```bash
uvicorn main:app --reload
```

The backend API will be accessible at `http://127.0.0.1:8000`.

### 2. Run the Frontend

From the project root directory:

```bash
bun dev # or npm run dev or yarn dev
```

The frontend application will typically open in your browser at `http://localhost:5173` (or another port if 5173 is in use).

## Project Structure

```
.
├── api/                  # Python FastAPI Backend
│   ├── main.py           # Main backend application with scraping logic
│   ├── requirements.txt  # Python dependencies
│   └── .env.example      # Example environment variables for backend
├── public/               # Static assets
├── src/                  # React Frontend
│   ├── components/       # Reusable UI components
│   │   ├── layout/       # Layout components (e.g., Sidebar)
│   │   ├── modals/       # Modal components (Add/Edit University/User)
│   │   └── ui/           # shadcn-ui components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and Supabase client setup
│   ├── pages/            # Main application pages
│   └── types/            # TypeScript type definitions
├── .env.example          # Example environment variables for frontend
├── package.json          # Frontend dependencies and scripts
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── ...                   # Other configuration files
```