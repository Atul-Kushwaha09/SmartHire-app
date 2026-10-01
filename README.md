# 🚀 SmartScreener

An intelligent AI-powered resume screening and candidate ranking platform that matches candidates with job descriptions through multi-dimensional scoring and deep profile analysis.

![Tech Stack](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=flat&logo=fastapi)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat&logo=python)

---

## ✨ Features

- **🎯 Smart Job Alignment**: Parse job descriptions, set minimum qualification thresholds, and customize scoring weights.
- **📄 Multi-Resume Screening**: Bulk upload candidate resumes (PDF, DOCX, TXT) with fast extraction and parallel processing.
- **🏆 Ranked Leaderboard**: Automatically ranks candidates into tiers (Top Match, Strong Fit, Potential, Not Recommended).
- **📊 Multi-Dimensional Scoring**: Evaluates candidates across 4 core vectors:
  - Technical Skills Match
  - Relevant Experience
  - Education & Certifications
  - Soft Skills & Communication
- **🔍 Deep Profile Inspection**: Interactive radial gauge breakdown, candidate summary, strengths & gap analysis, and career timeline.
- **⚔️ Side-by-Side Comparison**: Compare multiple candidates simultaneously to make informed hiring decisions.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router, React 19, TypeScript), Tailwind CSS, Lucide Icons, Recharts.
- **Backend**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+), Uvicorn, SQLite database.

---

## ⚡ Quick Start

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)
- **Git**

### Automated Start (Windows)
Run the automated launcher from the project directory:
```powershell
.\run.ps1
```
or double-click `run.bat`.

---

### Manual Start

#### 1. Backend (FastAPI)
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be available at: [http://localhost:8000/docs](http://localhost:8000/docs)

#### 2. Frontend (Next.js)
```powershell
cd frontend
npm install
npm run dev
```
Open your browser at: [http://localhost:3000](http://localhost:3000)

---

## 📂 Project Structure

```
smartscreener/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models/
│   │   └── services/
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── components/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── package.json
├── test_resumes/
├── run.bat
├── run.ps1
└── README.md
```

---

## 📄 License
MIT License.
