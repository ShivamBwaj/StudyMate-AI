# StudyMate AI 🧠🚀

An AI-powered personal study assistant that helps you plan your learning, summarize notes, ask doubts from your PDFs/images, and sync schedules with Google Calendar.

## 🖼️ Live Demo

🌐 Frontend: [https://study-mate-ai-gules.vercel.app](https://study-mate-ai-gules.vercel.app)
🛠️ Backend API: [https://studymate-ai-tkuz.onrender.com](https://studymate-ai-tkuz.onrender.com)

---

## ✨ Features

- 📚 **Smart Study Planner** – Input subjects & goals → get a full daily plan.
- 🧾 **PDF & Image Q&A** – Upload handwritten or printed content, ask questions directly.
- 📅 **Calendar Integration** – Sync study schedule with Google Calendar.
- 🧠 **AI Memory (Coming Soon)** – Remember past uploads, notes & sessions.

---

## 🚀 Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: FastAPI (Python)
- **AI**: GROQ/OpenAI APIs
- **OCR**: Tesseract
- **Calendar Sync**: Google Calendar API

---

## 📦 Setup Instructions

### 🔧 Frontend (Vite + React)
```bash
cd frontend
npm install
npm run dev
```

### 🔧 🧠 Backend (FastAPI)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

### Create a .env in /backend:
```bash
GROQ_API_KEY=your_api_key
```
### 🔐 Security Notes

- All secrets (API keys, tokens) are excluded using .gitignore
- If deploying, be sure to set your environment variables manually on Vercel & Render

### Made with ❤️ by Shivam Bhardwaj

-Instagram: @shivamisticz
-Linkedin: [https://www.linkedin.com/in/shivam-bhardwaj-118548377/](https://www.linkedin.com/in/shivam-bhardwaj-118548377/)
