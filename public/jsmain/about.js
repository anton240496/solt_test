// ─── Загрузка данных о себе из GraphQL ───
async function loadAbout () {
  const data = await gql(`
    query {
      about {
        id
        photo
        about
        telefon
        telegram
      }
    }
  `)
  return data?.about ?? null
}

// ─── Утилиты для контактов ───

// Телефон: '+7 (960) 268-09-10' → '+79602680910'
function phoneToTel (phone) {
  if (!phone) return ''
  return '+' + phone.replace(/\D/g, '')
}

// Telegram: '@username' → 'https://t.me/username'
function telegramToUrl (telegram) {
  if (!telegram) return ''
  const username = telegram.replace(/^@/, '').trim()
  return `https://t.me/${username}`
}

// ─── Рендер контактов ───
function renderContacts (about) {
  if (!about) return

  const tgContainer = document.getElementById('contact-telegram')
  const phoneContainer = document.getElementById('contact-phone')

  // Telegram
  if (tgContainer) {
    if (about.telegram) {
      tgContainer.innerHTML = `
        <a href="${telegramToUrl(about.telegram)}" target="_blank" rel="noopener">
          <img src="../images/tg.svg" alt="Telegram">
        </a>
      `
    } else {
      tgContainer.innerHTML = ''
    }
  }

  // Телефон
  if (phoneContainer) {
    if (about.telefon) {
      phoneContainer.innerHTML = `
        <a href="tel:${phoneToTel(about.telefon)}">
          ${about.telefon}
        </a>
      `
    } else {
      phoneContainer.innerHTML = ''
    }
  }
}

// ─── Отрисовка блока «О себе» ───
async function renderAbout () {
  const container = document.getElementById('about-content')
  if (!container) return

  const about = await loadAbout()
  if (!about) return

  // Фото
  const img = document.createElement('img')
  img.className = 'about_photo'
  img.src = about.photo
  img.alt = 'Фото'

  // Описание (HTML из TinyMCE)
  const div = document.createElement('div')
  div.className = 'about_text'
  div.innerHTML = about.about

  container.innerHTML = ''
  container.appendChild(img)
  container.appendChild(div)

  // ─── Контакты ───
  renderContacts(about)
}

renderAbout()