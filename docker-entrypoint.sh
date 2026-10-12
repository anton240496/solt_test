#!/bin/sh
set -e

# Self-heal: если именованный том (uploads_data) оказался пустым —
# например, при повторном использовании тома — возвращаем аватар по умолчанию,
# запечённый в образ по незатенённому пути /app/default-assets.
mkdir -p /app/public/uploads
if [ ! -f /app/public/uploads/avatar.png ] && [ -f /app/default-assets/avatar.png ]; then
  echo "[entrypoint] Восстанавливаю аватар по умолчанию в /app/public/uploads"
  cp /app/default-assets/avatar.png /app/public/uploads/avatar.png
fi

# Применяем миграции и заполняем БД
npx prisma migrate deploy
npx prisma db seed

# Запускаем сервер
exec node dist/main.js
