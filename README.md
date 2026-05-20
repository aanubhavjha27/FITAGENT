<div align="center">

<img src="./assets/logo.png" alt="FitAgent Logo" width="80" />

# FITAGENT

### AI-Powered Fitness Coach

*Personalized workout & Indian diet plans that adapt to you — every single day.*

<br />

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![LangGraph](https://img.shields.io/badge/LangGraph-000000?style=for-the-badge&logo=python&logoColor=white)](https://langchain-ai.github.io/langgraph/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Groq](https://img.shields.io/badge/Groq-F55036?style=for-the-badge&logo=groq&logoColor=white)](https://groq.com/)

<br />



<br />


</div>

---
## DEMO VIDEO
 
 https://github.com/user-attachments/assets/5ef85940-cca7-4e68-a235-a0bb2e0c4187
 
---
## 📸 Screenshots

<div align="center">

| 🏠 Landing Page | 🔐 Onboarding |
|:-:|:-:|
| <!-- Replace --><img width="600" height="350" alt="Image" src="https://github.com/user-attachments/assets/64fceff7-6cc1-4eb5-a443-da4a7409f67d" /> | <!-- Replace --> <img width="600" height="350" alt="Image" src="https://github.com/user-attachments/assets/93395dd2-7957-49a1-ad1a-e5962fd90912" /> |

| 📊 Dashboard | 💬 AI Chat |
|:-:|:-:|
| <!-- Replace --> <img width="600" height="400" alt="Image" src="https://github.com/user-attachments/assets/2c8a1066-bae3-4637-a361-152d700f0c40" /> | <!-- Replace --> <img width="550" height="500" alt="Image" src="https://github.com/user-attachments/assets/94e00a3a-54cf-42a0-bbc2-4ad27e640fdc" /> |

</div>

---

## ✨ Features

- 🤖 &nbsp;**AI Plan Generation** — personalized weekly workout + meal plan powered by LLaMA 3.3 70B via Groq
- 🍛 &nbsp;**Indian Diet Focus** — real meals like dal, roti, paneer, sabzi — not generic western plans
- 🔄 &nbsp;**Auto-Replanning** — AI detects missed sessions and restructures your schedule automatically
- 💬 &nbsp;**Real-time Chat** — WebSocket-powered coach that answers questions about your plan instantly
- ✅ &nbsp;**Daily Checklist** — track tasks and get an end-of-day AI score with personalized motivation
- 🎯 &nbsp;**Smart Validation** — pushes back on unrealistic targets and validates inputs before planning
- 📱 &nbsp;**Responsive UI** — clean dark athletic design that works on any screen size

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS, Zustand |
| **Backend** | FastAPI, Python 3.12 |
| **AI Agent** | LangGraph, LangChain |
| **LLM** | LLaMA 3.3 70B via Groq |
| **Database** | PostgreSQL |
| **Auth** | JWT (python-jose) |
| **Realtime** | WebSockets |
| **Deployment** | Vercel + Render + Neon |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.12+
- Node.js 18+
- PostgreSQL
- Groq API key → [console.groq.com](https://console.groq.com)

### Backend Setup

```bash
cd fitagent/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

Create `fitagent/backend/.env`:

```env
DATABASE_URL=postgresql://user:password@localhost/fitagent
GROQ_API_KEY=your_groq_api_key_here
SECRET_KEY=your_secret_key_here
```

```bash
# Start the server
uvicorn app.main:app --reload
# API running at http://localhost:8000
# Docs at http://localhost:8000/docs
```

### Frontend Setup

```bash
cd fitagent/frontend

# Install dependencies
npm install
```

Create `fitagent/frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

```bash
# Start the dev server
npm run dev
# App running at http://localhost:5173
```

---

## 📁 Project Structure

```
fitagent/
├── backend/
│   ├── app/
│   │   ├── agent/
│   │   │   ├── nodes.py          # LangGraph agent nodes
│   │   │   ├── graph.py          # Agent graph definition
│   │   │   ├── state.py          # Agent state schema
│   │   │   └── prompts.py        # LLM prompts
│   │   ├── api/v1/
│   │   │   ├── auth.py           # Auth endpoints
│   │   │   ├── chat.py           # Chat + WebSocket
│   │   │   └── profile.py        # User profile
│   │   ├── core/
│   │   │   ├── config.py         # App settings
│   │   │   └── security.py       # JWT utils
│   │   └── models/               # SQLAlchemy models
│   └── requirements.txt
│
└── frontend/
    └── src/
        ├── components/
        │   ├── chat/             # ChatWindow, ChatMessage, ChatInput
        │   └── Header.jsx
        ├── pages/                # Home, Login, Signup, Dashboard, Onboarding
        ├── services/api.js       # Axios API calls
        ├── store/                # Zustand state (auth, chat)
        └── hooks/useWebSocket.js
```

---



## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

---

<div align="center">

Built with ❤️ by [Aanubhav Jha](https://github.com/aanubhavjha27)

⭐ Star this repo if you found it useful!

</div>
