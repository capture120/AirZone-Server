# Run Backend Server
.PHONY: backend-dev
backend-dev: db-dev
	nodemon --exec ts-node --esm ./src/app.ts

# Start Database
.PHONY: db-dev
db-dev:
	sudo docker compose -f docker-compose.db.yml up -d

# Clean
.PHONY: clean
clean:
	sudo docker compose -f docker-compose.db.yml down