# Database Documentatie

## Schema: LearningGoals

### Tabel: learning_goals

| Kolom | Type | Constraints | Beschrijving |
|-------|------|-------------|--------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unieke identifier |
| title | VARCHAR(255) | NOT NULL | Titel van het leerdoel |
| description | TEXT | | Uitgebreide beschrijving |
| created_at | TIMESTAMPTZ | DEFAULT now() | Aanmaakdatum |
| updated_at | TIMESTAMPTZ | DEFAULT now() | Laatste wijziging |

### Indexen
- Primary key op `id`
- Index op `created_at` voor chronologische queries
- Full-text search index op `title` en `description`

### Row Level Security (RLS)
- Gebruikers kunnen alleen hun eigen leerdoelen zien en bewerken
- Admins hebben volledige toegang

## API Mapping

### POST /api/goals
```json
{
  "title": "string (required)",
  "description": "string (optional)"
}
```

### GET /api/goals
```json
{
  "goals": [
    {
      "id": "uuid",
      "title": "string",
      "description": "string",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
}
```

### PUT /api/goals/:id
```json
{
  "title": "string (optional)",
  "description": "string (optional)"
}
```

### DELETE /api/goals/:id
Returns: `204 No Content`