const Database = require('better-sqlite3');
const db = new Database('./prisma/dev.db');

// Проверяем, какие колонки уже есть
const before = db.prepare(`PRAGMA table_info("About")`).all();
console.log('До:', before.map(c => c.name).join(', '));

// Добавляем колонки, если их нет
const existing = before.map(c => c.name);

if (!existing.includes('telefon')) {
  db.exec(`ALTER TABLE "About" ADD COLUMN "telefon" TEXT NOT NULL DEFAULT '';`);
  console.log('Добавлена колонка telefon');
} else {
  console.log('Колонка telefon уже есть');
}

if (!existing.includes('telegram')) {
  db.exec(`ALTER TABLE "About" ADD COLUMN "telegram" TEXT NOT NULL DEFAULT '';`);
  console.log('Добавлена колонка telegram');
} else {
  console.log('Колонка telegram уже есть');
}

// Проверяем результат
const after = db.prepare(`PRAGMA table_info("About")`).all();
console.log('После:', after.map(c => c.name).join(', '));

// Показываем текущие данные
const rows = db.prepare(`SELECT * FROM "About"`).all();
console.log('Записи в About:', rows);

db.close();
console.log('Готово');