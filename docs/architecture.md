# Architectuur Documentatie

## Overzicht
Het AI-Platform Johan de Witt Scholengroep is ontworpen als een moderne, schaalbare oplossing voor het beheren en genereren van leerdoelen.

## Componenten

### 1. Frontend (Next.js)
- **Locatie**: `frontend/`
- **Technologie**: Next.js 14, Tailwind CSS, TypeScript
- **Functionaliteit**: 
  - Dashboard voor leerdoelen beheer
  - AI-agent interface
  - Gebruikersbeheer

### 2. API Layer (Azure Functions)
- **Locatie**: `src/api/`
- **Technologie**: Node.js, Azure Functions
- **Endpoints**:
  - Learning Goals CRUD
  - AI Agent endpoints
  - Authentication

### 3. Database
- **Technologie**: PostgreSQL (Supabase)
- **Schema**: Zie database documentatie

### 4. AI Agents
- **Locatie**: `src/agents/`
- **Agents**:
  - **Lesgenerator**: Genereert leerdoelen op basis van input
  - **Validator**: Valideert kwaliteit van leerdoelen

## Security
- Azure Active Directory SSO
- Row Level Security (RLS) op database niveau
- API rate limiting