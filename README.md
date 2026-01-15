# Graph Builder API

## Quick Setup & Run

Prerequisites:
- Docker and Docker Compose installed

### 1. Clone the repository

```bash
git clone <repo-url>
cd graph-builder-api
```

### 2. Start everything and view logs in real time

```bash
make destroy
```
This command cleans, rebuilds, and shows backend and database logs in your console.

### 3. Access the API
- API: http://localhost:8000/v1
- Swagger docs: http://localhost:8000/api

## Acceptance Criteria for Setup
- Backend and database must start without errors.
- Logs should be visible in the console after running make destroy.
- Swagger must be available at /api.
- No need to install Node or Postgres locally.

---


## Example Environment File

Copy `.env.example` to `.env` and adjust values as needed:

```env
NODE_ENV=development
PORT=8000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=pressmaster_graph

# Relationship Strategy Configuration
RELATIONSHIP_STRATEGY_DEFAULT=keyword_jaccard
RELATIONSHIP_THRESHOLD_DEFAULT=0.2
MAX_TOPICS_PER_GRAPH=200
```
