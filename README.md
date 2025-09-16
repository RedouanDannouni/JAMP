# AI-Platform Johan de Witt Scholengroep

Een AI-gedreven platform voor het genereren en valideren van lesdoelen voor de Johan de Witt Scholengroep.

## 🏗️ Architectuur

### Tech Stack
- **Backend**: Azure Functions (Node.js)
- **Database**: PostgreSQL (Supabase)
- **Frontend**: Next.js + Tailwind CSS
- **Auth**: Azure Active Directory (SSO)

### Folder Structure
```
ai-platform/
├── src/
│   ├── agents/          # AI agents: lesgenerator, validator
│   ├── api/            # Azure Functions API
│   ├── frontend/       # Next.js UI
│   └── monitoring/     # Logging, dashboards
├── infra/              # Azure deployment (IaC placeholders)
├── docs/               # Documentation
└── README.md
```

## 🚀 Quick Start

### Development
```bash
# Start frontend
cd frontend
npm run dev

# Start API (Azure Functions)
cd src/api
npm start
```

### Database Setup
1. Click "Connect to Supabase" in the top right
2. Database schema will be automatically created

## 📊 Features

### MVP Features
- ✅ Centrale Leerdoelendatabase
- ✅ CRUD API voor leerdoelen
- ✅ Modern UI met Next.js
- 🔄 AI Agents (in development)
- 🔄 Azure AD SSO (in development)

### Database Schema
- **LearningGoals**: Centrale opslag van alle leerdoelen
  - `id` (UUID, Primary Key)
  - `title` (String, Required)
  - `description` (Text)
  - `created_at` (Timestamp)

## 🔧 API Endpoints

### Learning Goals
- `POST /api/goals` - Create new learning goal
- `GET /api/goals` - Get all learning goals
- `PUT /api/goals/:id` - Update learning goal
- `DELETE /api/goals/:id` - Delete learning goal

## 📝 Documentation

Zie `/docs` folder voor uitgebreide documentatie.