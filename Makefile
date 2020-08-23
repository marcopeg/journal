start:
	docker-compose up -d migrations && \
	(cd frontend && npm i && npm start)

prod:
	docker-compose -f docker-compose-prod.yml up --build

console:
	(cd services/migrations && hasura console)

migrate:
	(docker-compose up migrations)
