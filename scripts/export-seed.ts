import { PrismaClient } from '@prisma/client'
import { writeFileSync } from 'fs'

const prisma = new PrismaClient()

async function main() {
  // 1. Читаем все данные из текущей базы
  const about = await prisma.about.findMany()
  const skillGroups = await prisma.skillGroup.findMany({ include: { skills: true } })
  const works = await prisma.work.findMany()

  // 2. Генерируем строку с кодом для seed.ts
  const code = `import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.about.deleteMany()
  await prisma.about.createMany({
    data: ${JSON.stringify(about, null, 2)},
  })

  await prisma.skillGroup.deleteMany()
  const groups = ${JSON.stringify(skillGroups, null, 2)}
  for (const group of groups) {
    const { skills, ...groupData } = group
    await prisma.skillGroup.create({
      data: {
        ...groupData,
        skills: {
          create: skills.map(s => ({ name: s.name, order: s.order })),
        },
      },
    })
  }

  await prisma.work.deleteMany()
  await prisma.work.createMany({
    data: ${JSON.stringify(works, null, 2)},
  })

  console.log('✅ Seed сгенерирован из ваших данных')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
`

  // 3. Сохраняем в файл
  writeFileSync('prisma/seed.ts', code)
  console.log('✅ prisma/seed.ts сохранён с вашими данными')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())