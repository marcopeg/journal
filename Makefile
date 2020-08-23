start:
	docker-compose up -d migrations && \
	(cd frontend && npm i && npm start)

console:
	(cd services/migrations && hasura console)

migrate:
	(docker-compose up migrations)
	