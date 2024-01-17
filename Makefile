# Run Backend Server and Database
.PHONY: backend-dev
backend-dev: db-dev backend-server

# Run Backend Server
.PHONY: backend-server
backend-server: 
	nodemon --exec ts-node --esm ./src/app.ts

# Start Database
.PHONY: db-dev
db-dev:
	sudo docker compose -f docker-compose.db.yml up -d

# Clean
.PHONY: clean
clean:
	sudo docker compose -f docker-compose.db.yml down