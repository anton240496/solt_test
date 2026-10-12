// загрузка опыты работы
async function loadWorks () {
  const data = await gql(`
    query {
      works {
        id
        position
        company
        period
        description
        order
      }
    }
  `)
  return data?.works ?? []
}

async function renderWorks () {
  const container = document.getElementById('works-content')
  if (!container) return

  const works = await loadWorks()
  if (!works.length) {
    container.innerHTML = ''
    return
  }

  container.innerHTML = works
    .map(
      work => `
        <div class="work_item">
          <div class="work_accor">
            <div class="work_accor_inner">
              <h3 class="work_title">${work.position}</h3>
              <p class="work_text">${work.company}, ${work.period}</p>
            </div>
            <span class="work_icon">+</span>
          </div>
          <div class="work_description">
            ${work.description}
          </div>
        </div>
      `,
    )
    .join('')

  // Обработчик клика по каждому аккордеону
  container.querySelectorAll('.work_accor').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement
      const body = item.querySelector('.work_description')
      const isOpen = item.classList.contains('active')

      // Закрыть все остальные
      container.querySelectorAll('.work_item.active').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('active')
          const openBody = openItem.querySelector('.work_description')
          if (openBody) openBody.style.maxHeight = null
        }
      })

      // Переключить текущий
      if (isOpen) {
        item.classList.remove('active')
        body.style.maxHeight = null
      } else {
        item.classList.add('active')
        body.style.maxHeight = body.scrollHeight + 'px'
      }
    })
  })
}

renderWorks()
