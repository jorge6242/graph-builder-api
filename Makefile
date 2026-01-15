# Makefile for backend setup (Postgres + TypeORM)
# Adjust DB values according to your environment

# Variables
DB_NAME=pressmaster_graph
DB_USER=postgres
DB_HOST=localhost
DB_PORT=5432
DB_CONTAINER=graph-builder-db


# Command to run psql locally
# If using Docker, change PSQL variable to DOCKER_PSQL
LOCAL_PSQL=psql -U $(DB_USER) -h $(DB_HOST) -p $(DB_PORT)

# Usando psql local por defecto
PSQL=$(LOCAL_PSQL)

# Reset: drop and create database
.PHONY: db-reset
# Drops and creates the database from scratch
# WARNING! This will delete all data

db-reset:
	@echo "Dropping and creating database $(DB_NAME)..."
	-$(PSQL) -c "DROP DATABASE IF EXISTS $(DB_NAME);"
	$(PSQL) -c "CREATE DATABASE $(DB_NAME);"

# Docker workflow

# Start containers (backend and db)
.PHONY: up
up:
	docker compose up --build

# Stop and remove containers
.PHONY: down
down:
	docker compose down

# Remove volumes (clean DB)
.PHONY: clean
clean:
	docker compose down -v

# Reset DB from the DB container
.PHONY: db-reset-docker
db-reset-docker:
	docker compose exec db psql -U postgres -c "DROP DATABASE IF EXISTS pressmaster_graph;"
	docker compose exec db psql -U postgres -c "CREATE DATABASE pressmaster_graph;"

# Migrations from the backend container
.PHONY: db-migrate-docker
db-migrate-docker:
	docker compose exec backend npm run migration:run

# Setup: full reset and migration 
.PHONY: setup
setup: clean up

# Run migrations
.PHONY: db-migrate
# Runs all TypeORM migrations

db-migrate:
	npm run typeorm migration:run

# Reset + migrate
.PHONY: db-rebuild
# Drops, creates, and migrates the database

db-rebuild: db-reset db-migrate

# Ver logs del backend en tiempo real
.PHONY: logs
logs:
	docker compose logs -f backend

# Help
.PHONY: help
help:
	@echo "Makefile targets available:"
	@echo "  db-reset      - Drop and create database (will destroy all data!)"
	@echo "  db-migrate    - Run TypeORM migrations"
	@echo "  db-rebuild    - Reset + migrate"
	@echo "  setup         - Full reset and migration"
	@echo "  up           - Levanta contenedores de Docker"
	@echo "  logs          - Ver solo los logs del backend"