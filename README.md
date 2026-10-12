# Визитка о себе

Сайт-портфолио с админ-панелью. Позволяет редактировать весь контент через веб-интерфейс без правки кода.

## О проекте

Одностраничный сайт-визитка с собственным бэкендом и админкой. Все данные хранятся в SQLite, редактируются через админку на GraphQL. Фронт и админка — статические страницы, на NestJS.

**Что редактируется:**

- О себе — фото, описание, телефон, Telegram
- Навыки — разделы с тегами
- Опыт работы — должность, компания, период, описание

**Стек:** NestJS, Prisma, SQLite, GraphQL, TinyMCE, IMask, SortableJS.

## Запуск локально

### Сайт и API

## 1. Установить все зависимости (создаст node_modules)  
npm install

## 2. Сгенерировать Prisma Client (чтобы заработали бд)
npx prisma generate

## 3. Запустить проект
npm run start

Сервер: http://localhost:3000

**Вход в админ-панель:** ссылка «Админ-панель» в шапке сайта.

### База данных SQLite

```bash
npx prisma@6 studio
```

Prisma Studio: http://localhost:5555

## Сборка

Сборка проекта осуществляется через докер командой
docker compose up --build

## Убить сервер http://localhost:3000

docker compose down -v

## Структура проекта

```
soltz/
├── prisma/
│   ├── schema.prisma           # схема БД (About, SkillGroup, Skill, Work, Project)
│   ├── seed.ts                 # автозаполнение БД при запуске
│   ├── migrations/             # история миграций
│   └── dev.db                  # файл базы SQLite (в .gitignore)
│
├── public/                     # статика (сайт + админка)
│   ├── index.html              # главная страница сайта
│   ├── admin/
│   │   ├── index.html          # страница админки
│   │   ├── css/
│   │   │   └── admin.css       # стили админки
│   │   └── js/
│   │       └── admin.js        # логика админки
│   ├── css/
│   │   ├── reset.css           # сброс стилей
│   │   └── style.css           # стили сайта
│   ├── jsmain/
│   │   ├── main.js             # меню, общая логика
│   │   ├── about.js            # вывод «О себе» и контактов
│   │   ├── skills.js           # вывод разделов с тегами
│   │   ├── works.js            # вывод опыта работы + аккордеон
│   │   └── projects.js         # вывод проектов
│   ├── images/                 # картинки сайта
│   ├── uploads/                # загруженные фото (из админки)
│   ├── tinymce/                # визуальный редактор (self-hosted)
│   └── sortablejs/             # drag-and-drop (self-hosted)
│
├── src/                        # бэкенд на NestJS
│   ├── main.ts                 # точка входа
│   ├── app.module.ts           # корневой модуль
│   │
│   ├── prisma.service.ts       # клиент Prisma
│   ├── prisma.module.ts        # глобальный модуль Prisma
│   │
│   ├── models/                 # GraphQL-типы
│   │   ├── about.model.ts
│   │   ├── profile.model.ts    # агрегирующий тип: skills, experience, projects
│   │   ├── skill-group.model.ts
│   │   ├── skill.model.ts
│   │   ├── work.model.ts
│   │   └── project.model.ts
│   │
│   ├── about.resolver.ts       # query/mutation для «О себе»
│   ├── profile.resolver.ts     # агрегирующий query { profile { ... } }
│   ├── skill-group.resolver.ts # query/mutation для разделов
│   ├── skill.resolver.ts       # query/mutation для тегов
│   ├── work.resolver.ts        # query/mutation для опыта
│   ├── project.resolver.ts     # query/mutation для проектов
│   │
│   ├── upload.controller.ts    # загрузка фото (Multer)
│   └── schema.gql              # авто-сгенерированная GraphQL-схема
│
├── Dockerfile                  # сборка образа
├── .dockerignore               # исключения для Docker
├── docker-compose.yml          # (опционально) запуск через compose
│
├── .env                        # DATABASE_URL
├── .gitignore
├── package.json
├── tsconfig.json
├── nest-cli.json
└── README.md
```

## Кратко о визитке

**Что это:** личное портфолио с админкой. Сайт показывает три блока — «О себе», «Навыки», «Опыт работы». Все данные редактируются через админку без изменения кода.

**Как устроено:**

- **Бэкенд** — NestJS + Prisma + SQLite.
- **API** — GraphQL на `/graphql`. Запросы `query` для чтения, `mutation` для записи.
- **Фронт** — статические HTML/CSS/JS в `public/`. Данные тянутся через `fetch` к `/graphql`.
- **Админка** — отдельная страница `/admin/`. Табы: «О себе», «Теги», «Опыт работы».
- **База** — SQLite, файл `prisma/dev.db`. Схема — 4 модели: `About`, `SkillGroup`, `Skill`, `Work`.

**Функции:**

- Визуальный редактор TinyMCE для описаний (О себе и опыт работы).
- Drag-and-drop сортировка разделов, тегов и опыта (SortableJS).
- Загрузка фото через проводник — файлы попадают в `public/uploads/`.
- Маска телефона (IMask), календарь для выбора месяца и года (период работы).
- Сворачивание блоков: разделы тегов открываются по одному, опыт работы — можно несколько.
- Авто-сохранение порядка при перетаскивании, авто-скрытие статуса через 5 секунд.

**Как редактировать сайт:**

1. Открыть `/admin/` (ссылка в шапке сайта).
2. Выбрать вкладку — «О себе», «Теги» или «Опыт работы».
3. Изменить поля, добавить или удалить записи.
4. Нажать «Сохранить» (или «Сохранить всё»).
5. Обновить сайт — изменения сразу отображаются.

## Быстрый старт

```bash
# 1. Установить зависимости
npm install

# 2. Применить миграции (создаст dev.db)
npx prisma migrate dev

# 3. Сгенерировать Prisma Client
npx prisma generate

# 4. Запустить сервер
npm run start

# 5. Открыть сайт
# http://localhost:3000
```

Отдельно — открыть Prisma Studio, чтобы посмотреть данные:

```bash
npx prisma studio
# http://localhost:5555
```

## Технологии

| Слой            | Что используется         |
| --------------- | ------------------------ |
| Сервер          | NestJS (TypeScript, ESM) |
| БД              | SQLite                   |
| ORM             | Prisma                   |
| API             | GraphQL (Apollo)         |
| Фронт           | Vanilla JS + HTML + CSS  |
| Редактор        | TinyMCE (self-hosted)    |
| Сортировка      | SortableJS               |
| Маска телефона  | IMask                    |
| Загрузка файлов | Multer (NestJS)          |
