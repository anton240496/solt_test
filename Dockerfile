# ─── Этап сборки ───
FROM node:22-alpine AS builder

WORKDIR /app

# Инструменты для сборки better-sqlite3 через node-gyp
RUN apk add --no-cache python3 make g++

# Копируем только package-файлы для кэширования зависимостей
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Копируем всё остальное
COPY . .

# Генерируем Prisma Client
RUN npx prisma generate

# Собираем NestJS
RUN npm run build

# ─── Этап запуска ───
FROM node:22-alpine

WORKDIR /app

# Копируем node_modules и собранный код из builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public
COPY package*.json ./

# Переменная для Prisma
ENV DATABASE_URL="file:./dev.db"

EXPOSE 3000

# При старте: применяем миграции → заполняем БД → запускаем сервер
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && node dist/main.js"]