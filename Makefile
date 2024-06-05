# Поднять прод окружение
prod:
		docker compose --env-file build_env/.env.prod up -d --build

# Поднять дев окружение
dev:
		docker compose --env-file build_env/.env.dev up -d --build

# Удалить все контейнеры
ddown:
		docker ps -a  | cut -c 1-12 | xargs -i sh -c 'docker stop {} && docker rm -v {}'