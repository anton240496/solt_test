import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.about.deleteMany()
  await prisma.about.createMany({
    data: [
  {
    "id": 1,
    "photo": "/uploads/avatar.png",
    "about": "<p>Я <span style=\"color: #2f9ea4;\"><strong>Ильинский Антон Михайлович</strong></span> и являюсь Full-Stack разработчиком.&nbsp;</p>\n<p>Занимаюсь разработкой сайтов веб-приложений с использованием современных технологий.</p>\n<ul>\n<li><span style=\"color: #2f9ea4;\"><strong><span class=\"\">Умею </span><span class=\"\">профессионально</span><span class=\"\"> верстать</span></strong></span> лендинги, страницы сайта на html/css.</li>\n<li><span style=\"color: #2f9ea4;\"><strong>Настраивать функционал сайта</strong></span> на JS, TS; знаком с фреймворками и платформами React, Vue, Node.js и др.</li>\n<li><span style=\"color: #2f9ea4;\"><strong><span class=\"\">Разрабатывать</span><span class=\"\"> админ-панели</span></strong></span> на PHP, Node.js, при помощи CMS WordPress, 1CBitrix, Modx и самописных CMS.</li>\n<li><span style=\"color: #2f9ea4;\"><strong>Работа с базами данных</strong></span> (MySQL, PostgreSQL, Oracle и др.) &mdash; выполнение запросов, вывод данных в виде таблиц и связка серверной части с интерфейсом через AJAX.</li>\n<li><strong><span style=\"color: #2f9ea4;\">Быстро учусь</span></strong>, усидчивый, готов учиться и приобретать новый опыт.</li>\n</ul>\n<p>Все мое портфоолио можно посмотреть по ссылке: <strong><span style=\"color: #2f9ea4;\"><a style=\"color: #2f9ea4;\" href=\"https://github.com/anton240496\" target=\"_blank\" rel=\"noopener\">https://github.com/anton240496</a></span></strong></p>\n<p>Есть свой собственный сайл, на котормо могу предложить свои услуги: <strong><span style=\"color: #2f9ea4;\"><a style=\"color: #2f9ea4;\" href=\"https://magtexnology.com/\" target=\"_blank\" rel=\"noopener\">https://magtexnology.com/</a></span></strong></p>",
    "telefon": "+7 (960) 268-09-10",
    "telegram": "@antoxalk192"
  }
],
  })

  await prisma.skillGroup.deleteMany()
  const groups = [
  {
    "id": 1,
    "title": "Верстка лендов, рассылок, посадочных страниц",
    "order": 1,
    "skills": [
      {
        "id": 1,
        "name": "html",
        "order": 1,
        "groupId": 1
      },
      {
        "id": 20,
        "name": "css",
        "order": 2,
        "groupId": 1
      }
    ]
  },
  {
    "id": 2,
    "title": "Настраивание функционала",
    "order": 2,
    "skills": [
      {
        "id": 3,
        "name": "Js",
        "order": 1,
        "groupId": 2
      },
      {
        "id": 18,
        "name": "TS",
        "order": 2,
        "groupId": 2
      },
      {
        "id": 19,
        "name": "Jquery",
        "order": 3,
        "groupId": 2
      }
    ]
  },
  {
    "id": 4,
    "title": "Редактирование и настраивание админ-панели",
    "order": 4,
    "skills": [
      {
        "id": 9,
        "name": "CMS WordPress",
        "order": 1,
        "groupId": 4
      },
      {
        "id": 10,
        "name": "1С-Битрикс",
        "order": 2,
        "groupId": 4
      },
      {
        "id": 11,
        "name": "Modx",
        "order": 3,
        "groupId": 4
      },
      {
        "id": 12,
        "name": "самописные CMS на языке PHP",
        "order": 4,
        "groupId": 4
      }
    ]
  },
  {
    "id": 5,
    "title": "Работа с базами данных",
    "order": 5,
    "skills": [
      {
        "id": 13,
        "name": "MySQL",
        "order": 1,
        "groupId": 5
      },
      {
        "id": 24,
        "name": "Oracle",
        "order": 3,
        "groupId": 5
      },
      {
        "id": 25,
        "name": "PostgreSQL",
        "order": 2,
        "groupId": 5
      }
    ]
  },
  {
    "id": 30,
    "title": "Работа с фреймворками и платформами",
    "order": 3,
    "skills": [
      {
        "id": 27,
        "name": "React",
        "order": 1,
        "groupId": 30
      },
      {
        "id": 28,
        "name": "Vue",
        "order": 2,
        "groupId": 30
      },
      {
        "id": 29,
        "name": "Node.js",
        "order": 3,
        "groupId": 30
      }
    ]
  }
]
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
    data: [
  {
    "id": 12,
    "position": "Разработчик документации",
    "company": "Компания Ибикон",
    "period": "09.2020-06.2021",
    "description": "<p>Различная разработка документация для судна, транспортная безопасность, кибербезопасность и другие документации необходимые на суднах.</p>\n<p> </p>\n<p>Для быстрого заполнения одного из документов была разработана программа. Ссылка <span style=\"color: #2f9ea4;\"><a style=\"color: #2f9ea4;\" href=\"https://github.com/anton240496/ihm2\" target=\"_blank\" rel=\"noopener\">https://github.com/anton240496/ihm2</a></span>.</p>\n<p style=\"padding-left: 40px;\"><span class=\"\">Суть программы — </span><span class=\"\">заполнение</span><span class=\"\"> вместо </span><span class=\"\">трёх</span><span class=\"\"> таблиц: </span><span class=\"\">только</span><span class=\"\"> одну </span><span class=\"\">вручную</span><span class=\"\">, а две другие таблицы заполняются автоматически.</span> <span class=\"\">Также для быстрого заполнения полей </span><span class=\"\">предусмотрена возможность подбора</span><span class=\"\"> терминов, </span><span class=\"\">заложенных</span><span class=\"\"> в коде программы.</span></p>",
    "order": 1
  },
  {
    "id": 25,
    "position": "Разработка сайта, полный цикл",
    "company": "Коннектика",
    "period": "09.2025-01.2026",
    "description": "<p>Полностью разработал сайт https://connectica.pro/ с нуля: от вёрстки до собственной админки на WordPress. Создал CRM-систему для управления заявками с удобными диалогами внутри каждой заявки.</p>\n<p> </p>\n<p>Реализовал отправку сообщений с файлами и конструктор коммерческих предложений с уникальным фирменным дизайном.</p>\n<p style=\"padding-left: 40px;\">В коммерческом предложение можно подробно описать проект и рассчитать его стоимости <span class=\"\">В коммерческом </span><span class=\"\">предложении</span><span class=\"\"> можно подробно описать проект и рассчитать его </span><span class=\"\">стоимость</span><span class=\"\"> при помощи «умной» таблицы</span><span class=\"\">-</span><span class=\"\">калькулятора.</span></p>",
    "order": 3
  },
  {
    "id": 26,
    "position": "Разработка сайтов, Написание и настраивание контента",
    "company": "magtexnology.com",
    "period": "01.2026-по сей день",
    "description": "<p class=\"ds-markdown-paragraph\"><span class=\"\">Разработка сайта с нуля, настройка функционала сайта, написание контента для сайта, настройка админ-панели, настройка SEO-оптимизации сайта, настройка рекламы в Яндекс.Директ и Google Ads.</span></p>\n<p class=\"ds-markdown-paragraph\"><span class=\"\">Поддержка сайта по сей день для привлечения клиентов. Параллельно вместе с разработкой сайта идёт разработка собственного продукта CRM Magia.</span></p>\n<p class=\"ds-markdown-paragraph\"><span class=\"\">В настоящее время приложение разработано в виде плагина на WordPress, но сейчас ведется разработка приложения для всех платформ.</span></p>\n<p class=\"ds-markdown-paragraph\"><span class=\"\">Плагин уже работает и приносит пользу.</span></p>\n<p class=\"ds-markdown-paragraph\"><span class=\"\">Функции плагина:</span></p>\n<ul>\n<li>\n<p class=\"ds-markdown-paragraph\"><span class=\"\"><span style=\"color: #2f9ea4;\"><strong>Автоматический </strong></span>сбор заявок с сайта</span></p>\n</li>\n<li>\n<p class=\"ds-markdown-paragraph\"><span class=\"\"><strong><span style=\"color: #2f9ea4;\">Отправка</span></strong> сообщений с файлами прямо из CRM</span></p>\n</li>\n<li>\n<p class=\"ds-markdown-paragraph\"><span class=\"\"><strong><span style=\"color: #2f9ea4;\">Хранение </span></strong>всей истории сообщений с клиентами</span></p>\n</li>\n<li>\n<p class=\"ds-markdown-paragraph\"><span class=\"\"><strong><span style=\"color: #2f9ea4;\">Построение </span></strong>коммерческих предложений с уникальным дизайном под каждого клиента</span></p>\n</li>\n<li>\n<p class=\"ds-markdown-paragraph\"><span class=\"\"><strong><span style=\"color: #2f9ea4;\">Возможность </span></strong>в каждом предложении рассчитать всю стоимость проекта с помощью &laquo;умной&raquo; таблицы-калькулятора</span></p>\n</li>\n</ul>\n<p class=\"ds-markdown-paragraph\"><span class=\"\">Подробнее можно посмотреть по ссылке:<span style=\"color: #2f9ea4;\"> </span></span><strong><span style=\"color: #2f9ea4;\"><a style=\"color: #2f9ea4;\" href=\"https://magtexnology.com/crmmagia-pay/\" target=\"_blank\" rel=\"noopener noreferrer\"><span class=\"\">https://magtexnology.com/crmmagia-pay/</span></a></span></strong></p>\n<p class=\"ds-markdown-paragraph\"><span class=\"\">А сам плагин &mdash; по ссылке: </span><span style=\"color: #2f9ea4;\"><strong><a style=\"color: #2f9ea4;\" href=\"https://github.com/anton240496/crmmagia\" target=\"_blank\" rel=\"noopener noreferrer\"><span class=\"\">https://github.com/anton240496/crmmagia</span></a></strong></span></p>",
    "order": 5
  },
  {
    "id": 27,
    "position": "Дизайнер-верстальщик, web-разработчик",
    "company": "Медиабаинговый холдинг",
    "period": "04.2026-07.2026",
    "description": "<ol>\n<li><span style=\"color: #2f9ea4;\"><strong>Верстка рекламных лендингов.</strong> </span>Разработка и адаптивная верстка высококонверсионных посадочных страниц под задачи рекламных кампаний (Mobile First, кроссбраузерность, Pixel Perfect). </li>\n<li><span style=\"color: #2f9ea4;\"><strong>Скачивание сайтов из интернета.</strong></span> Инжениринг готовых веб-страниц: выгрузка и парсинг существующих решений с последующей реструктуризацией под текущие бизнес-задачи (быстрый запуск гипотез).</li>\n<li><strong><span style=\"color: #2f9ea4;\">Очистка от ненужных стилей и скриптов.</span></strong> Рефакторинг и оптимизация чужого кода: ручная и автоматическая чистка CSS/JS-мусора( в том числе и с помощью ИИ сервисов), удаление неиспользуемых селекторов, тяжелых библиотек и \"мертвого\" кода для ускорения рендеринга.</li>\n<li><strong><span style=\"color: #2f9ea4;\">Сжатие изображений.</span></strong> Компрессия и конвертация графики в современные форматы (WebP/AVIF) с сохранением качества, ленивая загрузка (Lazy Load) и оптимизация медийного веса страницы.</li>\n<li><strong><span style=\"color: #2f9ea4;\">Размещение видео на лендах.</span></strong> Интеграция видеоконтента (включая фоновое видео и iframe-вставки) с грамотной настройкой автовоспроизведения, обложек и адаптивом под мобильные устройства. С дальнейшим выкладыванием готовых лендов на сервер</li>\n</ol>",
    "order": 4
  },
  {
    "id": 28,
    "position": "Инженер-программист",
    "company": "СПбГПМУ Педиатрический университет",
    "period": "07.2021-06.2025",
    "description": "<p><span class=\"\">Разбираться в базе педиатрического университета, на основе </span><span class=\"\">её</span><span class=\"\"> писать </span><span class=\"\">отчёты</span><span class=\"\"> в среде разработки </span><span class=\"\">PL/SQL Developer</span><span class=\"\"> (к примеру, </span><span class=\"\">вывод списка пациентов с их данными, с каким-нибудь диагнозом, на каком-нибудь отделении</span><span class=\"\">).</span> <span class=\"\">Далее красиво и понятно для всех формировать </span><span class=\"\">отчёты</span><span class=\"\"> в формате </span><span class=\"\">Excel</span><span class=\"\"> или </span><span class=\"\">Word</span><span class=\"\"> с помощью макросов (VBA).</span></p>",
    "order": 2
  }
],
  })

  console.log('✅ Seed сгенерирован из ваших данных')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
