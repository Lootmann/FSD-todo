APP_BACKEND_NAME=backend
APP_FRONTEND_NAME=frontend
DB_CONTAINER_NAME=db

run:
	docker compose up -d

build:
	docker compose build

buildup:
	docker compose up --build

down:
	docker compose down -v

logs:
	docker compose logs -ft

logdb:
	docker compose logs $(DB_CONTAINER_NAME) -ft

logbackend:
	docker compose logs $(APP_BACKEND_NAME) -ft

logfrontend:
	docker compose logs $(APP_FRONTEND_NAME) -ft

restart:
	docker compose restart

migrate:
	docker compose exec $(APP_BACKEND_NAME) python3 -m api.db

login-backend:
	docker exec -it $(APP_BACKEND_NAME) /bin/bash

login-frontend:
	docker exec -it $(APP_FRONTEND_NAME) /bin/bash

login-db:
	docker exec -it postgres-db psql -U postgres

dumpdb:
	docker exec -it postgres-db pg_dumpall -U postgres > ./db/dump.sql

# tests
test:
	docker compose exec $(APP_BACKEND_NAME) python3.10 -m pytest -svv

re:
	docker compose exec $(APP_BACKEND_NAME) python3.10 -m pytest -svv --lf

# preformance
measure:
	docker compose exec $(APP_BACKEND_NAME) python3.10 -m pytest --durations=0

cov:
	docker compose exec $(APP_BACKEND_NAME) python3.10 -m pytest --cov --cov-report=html

report:
	google-chrome ./backend/htmlcov/index.html
