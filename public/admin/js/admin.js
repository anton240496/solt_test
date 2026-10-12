const API = '/graphql'

async function gql (query, variables = {}) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
  const { data, errors } = await res.json()
  if (errors) throw new Error(errors[0].message)
  return data
}

// 
// УТИЛИТЫ СВОРАЧИВАНИЯ (общие)
// 

// Свернуть один блок
function collapseItem (li) {
  li.classList.remove('admin-item--open')
  const body = li.querySelector('.admin-item__body')
  if (body) body.style.maxHeight = '0px'
}

// Раскрыть один блок
function expandItem (li) {
  li.classList.add('admin-item--open')
  const body = li.querySelector('.admin-item__body')
  if (body) body.style.maxHeight = body.scrollHeight + 'px'
}

// Свернуть все блоки в контейнере
function collapseAll (container) {
  container.querySelectorAll('.admin-item--open').forEach(collapseItem)
}

// Навесить toggle на блок
// options.scope — если задан, при раскрытии сворачиваются остальные блоки в scope
// options.onOpen — колбэк после раскрытия (например, инициализация TinyMCE)
function bindToggle (li, options = {}) {
  const toggle = li.querySelector('[data-toggle]')
  if (!toggle) return

  toggle.addEventListener('click', () => {
    const isOpen = li.classList.contains('admin-item--open')

    if (isOpen) {
      collapseItem(li)
    } else {
      if (options.scope) collapseAll(options.scope)
      expandItem(li)
      if (typeof options.onOpen === 'function') options.onOpen()
    }
  })
}

// 
// О СЕБЕ
// 

async function loadAbout () {
  const data = await gql(`query { about { id photo about telefon telegram } }`)
  return data.about
}

async function saveAbout (photo, about, telefon, telegram) {
  const data = await gql(
    `
    mutation UpdateAbout(
      $photo: String!
      $about: String!
      $telefon: String!
      $telegram: String!
    ) {
      updateAbout(
        photo: $photo
        about: $about
        telefon: $telefon
        telegram: $telegram
      ) {
        id photo about telefon telegram
      }
    }
  `,
    { photo, about, telefon, telegram },
  )
  return data.updateAbout
}

// 
// РАЗДЕЛЫ ТЕГОВ
// 

async function loadSkillGroups () {
  const data = await gql(`
    query {
      skillGroups {
        id title order
        skills { id name order groupId }
      }
    }
  `)
  return data.skillGroups
}

async function createSkillGroup (title, order) {
  const data = await gql(
    `
    mutation Create($title: String!, $order: Int) {
      createSkillGroup(title: $title, order: $order) { id title order }
    }
  `,
    { title, order },
  )
  return data.createSkillGroup
}

async function updateSkillGroup (id, title, order) {
  const data = await gql(
    `
    mutation Update($id: Int!, $title: String!, $order: Int) {
      updateSkillGroup(id: $id, title: $title, order: $order) { id title order }
    }
  `,
    { id, title, order },
  )
  return data.updateSkillGroup
}

async function deleteSkillGroup (id) {
  const data = await gql(
    `
    mutation Delete($id: Int!) {
      deleteSkillGroup(id: $id)
    }
  `,
    { id },
  )
  return data.deleteSkillGroup
}

async function createSkill (name, groupId, order) {
  const data = await gql(
    `
    mutation CreateSkill($name: String!, $groupId: Int!, $order: Int) {
      createSkill(name: $name, groupId: $groupId, order: $order) {
        id name order groupId
      }
    }
  `,
    { name, groupId, order },
  )
  return data.createSkill
}

async function updateSkill (id, name, order) {
  const data = await gql(
    `
    mutation UpdateSkill($id: Int!, $name: String!, $order: Int) {
      updateSkill(id: $id, name: $name, order: $order) {
        id name order
      }
    }
  `,
    { id, name, order },
  )
  return data.updateSkill
}

async function deleteSkill (id) {
  const data = await gql(
    `
    mutation DeleteSkill($id: Int!) {
      deleteSkill(id: $id)
    }
  `,
    { id },
  )
  return data.deleteSkill
}

async function reindexSkillGroups () {
  const groups = await loadSkillGroups()
  await Promise.all(
    groups.map((g, i) => updateSkillGroup(g.id, g.title, i + 1)),
  )
}

async function saveCurrentOrder (list) {
  const items = [...list.querySelectorAll(':scope > .admin-item')]
  await Promise.all(
    items.map((li, index) => {
      const id = parseInt(li.dataset.id, 10)
      const title = li.querySelector('[data-field="title"]').value.trim()
      return updateSkillGroup(id, title, index + 1)
    }),
  )
}

async function renderSkillGroups (container) {
  const groups = await loadSkillGroups()

  const section = document.createElement('section')
  section.className = 'admin-section'
  section.id = 'skill-groups-section'
  section.innerHTML = `
    <h2>Разделы тегов</h2>
    <form id="group-add-form" class="admin-inline-form">
      <input class="admin-input" name="title" placeholder="Название раздела" required />
      <button type="submit" class="admin-btn">Добавить</button>
    </form>
    <ul class="admin-list" id="groups-list"></ul>
    <div class="admin-actions admin-actions--bottom">
      <button type="button" class="admin-btn" id="save-all-groups">Сохранить всё</button>
      <span class="admin-status" id="groups-status"></span>
    </div>
  `

  const list = section.querySelector('#groups-list')
  const status = section.querySelector('#groups-status')

  groups.forEach(g => {
    const li = document.createElement('li')
    li.className =
      'admin-list__item admin-list__item--column admin-item group-admin-item'
    li.dataset.id = g.id
    li.innerHTML = `
      <div class="admin-item__header">
        <span class="admin-drag-handle admin-drag-handle--group" title="Перетащите">⋮⋮</span>
        <input class="admin-input" type="text" value="${g.title}" data-field="title" />
        <span class="admin-toggle" data-toggle><span>+</span></span>
        <button class="admin-btn admin-btn--danger" data-action="delete-group">Удалить</button>
      </div>

      <div class="admin-item__body">
        <ul class="admin-sublist" data-skill></ul>

        <form class="admin-inline-form" data-skill-add>
          <input class="admin-input admin-skill" name="name" placeholder="Новый тег" required />
          <button type="submit" class="admin-btn">Добавить тег</button>
        </form>
      </div>
    `

    // Toggle — со scope: при раскрытии сворачиваются остальные разделы
    bindToggle(li, { scope: list })

    // Удаление раздела
    li.querySelector('[data-action="delete-group"]').addEventListener(
      'click',
      async () => {
        if (!confirm(`Удалить раздел «${g.title}»? Теги внутри тоже удалятся.`))
          return
        await deleteSkillGroup(g.id)
        await reindexSkillGroups()
        await renderSkillGroups(container)
      },
    )

    // Список тегов
    const skillList = li.querySelector('[data-skill]')

    g.skills.forEach(s => {
      const sLi = document.createElement('li')
      sLi.className = 'admin-sublist__item'
      sLi.dataset.id = s.id
      sLi.innerHTML = `
        <span class="admin-drag-handle admin-drag-handle--skill" title="Перетащите">⋮⋮</span>
        <input class="admin-input" type="text" value="${s.name}" data-skill-name />
        <button class="admin-btn admin-btn--danger" data-action="delete-skill">Удалить</button>
      `
      sLi
        .querySelector('[data-action="delete-skill"]')
        .addEventListener('click', async () => {
          if (!confirm(`Удалить тег «${s.name}»?`)) return

          const currentTitle = li
            .querySelector('[data-field="title"]')
            .value.trim()
          if (currentTitle && currentTitle !== g.title) {
            await updateSkillGroup(g.id, currentTitle, g.order)
          }

          try {
            await deleteSkill(s.id)
            await renderSkillGroups(container)
          } catch (err) {
            console.error('Ошибка удаления тега:', err)
            status.textContent = 'Ошибка: ' + err.message
            status.className = 'admin-status admin-status--err'
          }
        })

      skillList.appendChild(sLi)
    })

    // Перетаскивание тегов внутри раздела
    Sortable.create(skillList, {
      handle: '.admin-drag-handle--skill',
      animation: 150,
      ghostClass: 'admin-list__item--ghost',
      onEnd: async () => {
        const currentTitle = li
          .querySelector('[data-field="title"]')
          .value.trim()
        if (currentTitle && currentTitle !== g.title) {
          await updateSkillGroup(g.id, currentTitle, g.order)
        }

        const items = [...skillList.querySelectorAll('.admin-sublist__item')]
        await Promise.all(
          items.map((sLi, index) => {
            const id = parseInt(sLi.dataset.id, 10)
            const name = sLi.querySelector('[data-skill-name]').value.trim()
            return updateSkill(id, name, index + 1)
          }),
        )
      },
    })

    // Форма добавления тега — в конец списка
    li.querySelector('[data-skill-add]').addEventListener('submit', async e => {
      e.preventDefault()
      const name = e.target.name.value.trim()
      if (!name) return

      const currentTitle = li.querySelector('[data-field="title"]').value.trim()
      if (currentTitle && currentTitle !== g.title) {
        await updateSkillGroup(g.id, currentTitle, g.order)
      }

      const maxOrder = g.skills.length
        ? Math.max(...g.skills.map(s => s.order))
        : 0

      await createSkill(name, g.id, maxOrder + 1)
      await renderSkillGroups(container)

      // Раскрыть этот же раздел после перерисовки
      const newItem = document.querySelector(`#groups-list [data-id="${g.id}"]`)
      if (newItem) {
        expandItem(newItem)
      }
    })

    list.appendChild(li)
  })

  // Секция в DOM
  const existing = document.getElementById('skill-groups-section')
  if (existing) existing.remove()
  container.appendChild(section)

  // Перетаскивание разделов
  Sortable.create(list, {
    handle: '.admin-drag-handle--group',
    animation: 150,
    ghostClass: 'admin-list__item--ghost',
    onEnd: async () => {
      status.textContent = 'Сохраняю порядок...'
      status.className = 'admin-status'

      try {
        await saveCurrentOrder(list)
        status.textContent = 'Порядок сохранён'
        status.classList.add('admin-status--ok')
      } catch (err) {
        status.textContent = 'Ошибка: ' + err.message
        status.classList.add('admin-status--err')
      }
    },
  })

  // Кнопка «Сохранить всё»
  section
    .querySelector('#save-all-groups')
    .addEventListener('click', async () => {
      status.textContent = 'Сохраняю...'
      status.className = 'admin-status'

      try {
        const groupRows = [...list.querySelectorAll('.group-admin-item')]
        const groupUpdates = groupRows.map((li, index) => {
          const id = parseInt(li.dataset.id, 10)
          const title = li.querySelector('[data-field="title"]').value.trim()
          return updateSkillGroup(id, title, index + 1)
        })

        const skillUpdates = []
        groupRows.forEach(li => {
          const skillRows = [...li.querySelectorAll('.admin-sublist__item')]
          skillRows.forEach((sLi, index) => {
            const id = parseInt(sLi.dataset.id, 10)
            const name = sLi.querySelector('[data-skill-name]').value.trim()
            skillUpdates.push(updateSkill(id, name, index + 1))
          })
        })

        await Promise.all([...groupUpdates, ...skillUpdates])
        await renderSkillGroups(container)

        const newStatus = document.querySelector('#groups-status')
        if (newStatus) {
          newStatus.textContent = 'Сохранено'
          newStatus.classList.add('admin-status--ok')

          // Скрыть через 5 секунд
          setTimeout(() => {
            if (newStatus) {
              newStatus.textContent = ''
              newStatus.className = 'admin-status'
            }
          }, 5000)
        }
      } catch (err) {
        const newStatus = document.querySelector('#groups-status')
        if (newStatus) {
          newStatus.textContent = 'Ошибка: ' + err.message
          newStatus.classList.add('admin-status--err')

          setTimeout(() => {
            if (newStatus) {
              newStatus.textContent = ''
              newStatus.className = 'admin-status'
            }
          }, 5000)
        }
      }
    })

  // Добавление нового раздела — в начало
  section
    .querySelector('#group-add-form')
    .addEventListener('submit', async e => {
      e.preventDefault()
      const title = e.target.title.value.trim()
      if (!title) return

      try {
        const groups = await loadSkillGroups()

        await Promise.all(
          groups.map(g => updateSkillGroup(g.id, g.title, g.order + 1)),
        )

        const newGroup = await createSkillGroup(title, 1)

        await renderSkillGroups(container)

        // Раскрыть новый раздел + анимация
        const newItem = document.querySelector(
          `#groups-list [data-id="${newGroup.id}"]`,
        )
        if (newItem) {
          newItem.classList.add('admin-list__item--new')
          setTimeout(
            () => newItem.classList.remove('admin-list__item--new'),
            350,
          )
          expandItem(newItem)
        }
      } catch (err) {
        console.error('Ошибка при добавлении раздела:', err)
        status.textContent = 'Ошибка: ' + err.message
        status.className = 'admin-status admin-status--err'
      }
    })
}

// 
// ОПЫТ РАБОТЫ
// 

async function loadWorks () {
  const data = await gql(`
    query {
      works { id position company period description order }
    }
  `)
  return data.works
}

async function createWork (position, company, period, description, order) {
  const data = await gql(
    `
    mutation CreateWork(
      $position: String!
      $company: String!
      $period: String!
      $description: String!
      $order: Int
    ) {
      createWork(
        position: $position
        company: $company
        period: $period
        description: $description
        order: $order
      ) {
        id position company period description order
      }
    }
  `,
    { position, company, period, description, order },
  )
  return data.createWork
}

async function updateWork (id, position, company, period, description, order) {
  const data = await gql(
    `
    mutation UpdateWork(
      $id: Int!
      $position: String!
      $company: String!
      $period: String!
      $description: String!
      $order: Int
    ) {
      updateWork(
        id: $id
        position: $position
        company: $company
        period: $period
        description: $description
        order: $order
      ) {
        id position company period description order
      }
    }
  `,
    { id, position, company, period, description, order },
  )
  return data.updateWork
}

async function deleteWork (id) {
  const data = await gql(
    `
    mutation DeleteWork($id: Int!) {
      deleteWork(id: $id)
    }
  `,
    { id },
  )
  return data.deleteWork
}

async function reindexWorks () {
  const works = await loadWorks()
  await Promise.all(
    works.map((w, i) =>
      updateWork(w.id, w.position, w.company, w.period, w.description, i + 1),
    ),
  )
}

async function saveCurrentWorkOrder (list) {
  const items = [...list.querySelectorAll('.work-admin-item')]

  const operations = items
    .map((li, index) => {
      const id = li.dataset.id ? parseInt(li.dataset.id, 10) : null
      if (!id) return null

      const position = li.querySelector('[data-field="position"]').value.trim()
      const company = li.querySelector('[data-field="company"]').value.trim()
      const period = buildPeriodFromItem(li)

      const textarea = li.querySelector('[data-field="description"]')
      const key = textarea.dataset.workKey
      const editor = tinymce.get(`work-desc-${key}`)
      const description = editor ? editor.getContent() : textarea.value

      return updateWork(id, position, company, period, description, index + 1)
    })
    .filter(Boolean)

  await Promise.all(operations)
}

async function renderWorks (container) {
  const works = await loadWorks()

  const section = document.createElement('section')
  section.className = 'admin-section'
  section.id = 'works-section'
  section.innerHTML = `
    <h2>Опыт работы</h2>
    <ul class="admin-list" id="works-list"></ul>
    <div class="admin-actions admin-actions--bottom">
      <button type="button" class="admin-btn" id="add-work">Добавить опыт</button>
      <button type="button" class="admin-btn" id="save-all-works">Сохранить всё</button>
      <span class="admin-status" id="works-status"></span>
    </div>
  `

  const list = section.querySelector('#works-list')
  const status = section.querySelector('#works-status')

  function buildItem (w, isNew = false) {
    const li = document.createElement('li')
    li.className =
      'admin-list__item admin-list__item--column admin-item work-admin-item'
    li.dataset.id = w.id || ''
    li.dataset.new = isNew ? '1' : '0'

    const key = w.id ? w.id : 'new-' + Math.random().toString(36).slice(2)

    li.innerHTML = `
    <div class="admin-item__header">
      <span class="admin-drag-handle" title="Перетащите">⋮⋮</span>
      <input class="admin-input" type="text" value="${
        w.position || ''
      }" data-field="position" placeholder="Новая должность" />
      <span class="admin-toggle" data-toggle><span>+</span></span>
      <button class="admin-btn admin-btn--danger" data-action="delete-work">Удалить</button>
    </div>

    <div class="admin-item__body">
      <label class="admin-field">
        <span>Компания</span>
        <input class="admin-input" type="text" value="${
          w.company || ''
        }" data-field="company" placeholder="Компания" />
      </label>

      <div class="admin-field admin-field--period">
        <span>Период работы</span>
        <div class="admin-period">
          <label class="admin-period__item">
            <span>Начало</span>
            <input class="admin-input" type="month" value="${toMonthInput(
              w.period,
              'start',
            )}" data-period="start" />
          </label>
          <span class="admin-period__sep">—</span>
          <label class="admin-period__item">
            <span>Окончание</span>
            <input class="admin-input" type="month" value="${toMonthInput(
              w.period,
              'end',
            )}" data-period="end" />
          </label>
        </div>
        <label class="admin-period__current">
          <input type="checkbox" data-period="current" ${
            isCurrent(w.period) ? 'checked' : ''
          } />
          <span>По настоящее время</span>
        </label>
      </div>

      <label class="admin-field">
        <span>Что делал</span>
        <textarea class="admin-input" data-field="description" data-work-key="${key}" placeholder="Что делал на этой работе...">${
      w.description || ''
    }</textarea>
      </label>
    </div>
  `

    // ─── Логика чекбокса «По настоящее время» ───
    const currentCheckbox = li.querySelector('[data-period="current"]')
    const endInput = li.querySelector('[data-period="end"]')

    function updateEndState () {
      if (currentCheckbox.checked) {
        endInput.value = ''
        endInput.disabled = true
      } else {
        endInput.disabled = false
      }
    }

    currentCheckbox.addEventListener('change', updateEndState)
    updateEndState()

    // ─── TinyMCE — один раз при первом раскрытии ───
    let editorInitialized = false
    async function initEditorOnce () {
      if (editorInitialized) return
      const textarea = li.querySelector('[data-field="description"]')
      if (!textarea) return
      textarea.id = `work-desc-${key}`

      const oldEditor = tinymce.get(`work-desc-${key}`)
      if (oldEditor) oldEditor.remove()

      await tinymce.init({
        selector: `#work-desc-${key}`,
        placeholder: 'Что делал на этой работе...',
        license_key: 'gpl',
        height: 400,
        menubar: true,
        plugins: [
          'advlist',
          'anchor',
          'autolink',
          'autoresize',
          'charmap',
          'code',
          'codesample',
          'emoticons',
          'fullscreen',
          'help',
          'image',
          'importcss',
          'insertdatetime',
          'link',
          'lists',
          'media',
          'nonbreaking',
          'pagebreak',
          'preview',
          'quickbars',
          'searchreplace',
          'table',
          'visualblocks',
          'visualchars',
          'wordcount',
        ].join(' '),
        toolbar: [
          'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | link image media table | emoticons charmap | codesample code | fullscreen preview | removeformat',
        ].join(' '),
        toolbar_mode: 'sliding',
        contextmenu: 'link image table',
        quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
        quickbars_insert_toolbar: 'quickimage quicktable',
        image_advtab: true,
        image_title: true,
        automatic_uploads: true,
        file_picker_types: 'image',
        content_style:
          'body { font-family: system-ui, sans-serif; font-size: 15px; }',
        branding: false,
        // при редактироование увеличиваем блок
        setup: editor => {
          const recalc = () => {
            const body = li.querySelector('.admin-item__body')
            if (!body) return
            if (body.style.maxHeight === 'none') return
            body.style.maxHeight = body.scrollHeight + 'px'
          }

          editor.on('init', recalc)
          editor.on('change input undo redo keyup', recalc)
        },
      })

      editorInitialized = true

      // После инициализации снимаем ограничение по высоте
      const body = li.querySelector('.admin-item__body')
      if (body && li.classList.contains('admin-item--open')) {
        body.style.maxHeight = 'none'
      }
    }

    // Toggle — БЕЗ scope (можно раскрыть несколько опытов одновременно)
    bindToggle(li, { onOpen: () => initEditorOnce() })

    // ─── Удаление ───
    li.querySelector('[data-action="delete-work"]').addEventListener(
      'click',
      async () => {
        const title =
          li.querySelector('[data-field="position"]').value.trim() ||
          'без названия'

        if (li.dataset.new === '1') {
          if (!confirm(`Удалить новый опыт «${title}»?`)) return
          li.classList.add('admin-list__item--removing')
          await new Promise(resolve => setTimeout(resolve, 300))
          li.remove()
          return
        }

        if (!confirm(`Удалить опыт «${title}»?`)) return

        li.classList.add('admin-list__item--removing')
        await new Promise(resolve => setTimeout(resolve, 300))

        await deleteWork(w.id)
        await reindexWorks()
        await renderWorks(container)
      },
    )

    return { li }
  }

  // Отрисовка существующих
  works.forEach(w => {
    const { li } = buildItem(w, false)
    list.appendChild(li)
  })

  // Секция в DOM
  const existing = document.getElementById('works-section')
  if (existing) existing.remove()
  container.appendChild(section)

  // Перетаскивание
  Sortable.create(list, {
    handle: '.admin-drag-handle',
    animation: 150,
    ghostClass: 'admin-list__item--ghost',
    onEnd: async () => {
      status.textContent = 'Сохраняю порядок...'
      status.className = 'admin-status'
      try {
        await saveCurrentWorkOrder(list)
        status.textContent = 'Порядок сохранён'
        status.classList.add('admin-status--ok')
      } catch (err) {
        status.textContent = 'Ошибка: ' + err.message
        status.classList.add('admin-status--err')
      }
    },
  })

  // Добавить опыт (только в DOM, без сохранения)
  section.querySelector('#add-work').addEventListener('click', () => {
    // Свернуть все существующие
    collapseAll(list)

    const { li } = buildItem(
      {
        id: null,
        position: '',
        company: '',
        period: '',
        description: '',
        order: 0,
      },
      true,
    )
    list.appendChild(li)

    li.classList.add('admin-list__item--new')
    setTimeout(() => li.classList.remove('admin-list__item--new'), 350)

    // Раскрыть новый
    expandItem(li)
    // Инициализировать редактор для нового блока
    li.querySelector('[data-toggle]')?.click() // не нужно — проще вызвать expandItem + инициализация
  })

  // Сохранить всё
  section
    .querySelector('#save-all-works')
    .addEventListener('click', async () => {
      status.textContent = 'Сохраняю...'
      status.className = 'admin-status'

      try {
        const items = [...list.querySelectorAll('.work-admin-item')]
        const operations = items.map((li, index) => {
          const id = li.dataset.id ? parseInt(li.dataset.id, 10) : null
          const position = li
            .querySelector('[data-field="position"]')
            .value.trim()
          const company = li
            .querySelector('[data-field="company"]')
            .value.trim()
          const period = buildPeriodFromItem(li)

          const textarea = li.querySelector('[data-field="description"]')
          const key = textarea.dataset.workKey
          const editor = tinymce.get(`work-desc-${key}`)
          const description = editor ? editor.getContent() : textarea.value

          if (id) {
            return updateWork(
              id,
              position,
              company,
              period,
              description,
              index + 1,
            )
          } else {
            return createWork(position, company, period, description, index + 1)
          }
        })

        await Promise.all(operations)
        await renderWorks(container)

        const newStatus = document.querySelector('#works-status')
        if (newStatus) {
          newStatus.textContent = 'Сохранено'
          newStatus.classList.add('admin-status--ok')

          setTimeout(() => {
            if (newStatus) {
              newStatus.textContent = ''
              newStatus.className = 'admin-status'
            }
          }, 5000)
        }
      } catch (err) {
        const newStatus = document.querySelector('#works-status')
        if (newStatus) {
          newStatus.textContent = 'Ошибка: ' + err.message
          newStatus.classList.add('admin-status--err')

          setTimeout(() => {
            if (newStatus) {
              newStatus.textContent = ''
              newStatus.className = 'admin-status'
            }
          }, 5000)
        }
      }
    })
}

// ═══════════════════════════════════════════
// ХЕЛПЕРЫ ДЛЯ PERIOD
// ═══════════════════════════════════════════

function toMonthInput (period, which) {
  if (!period) return ''

  const startMatch = period.match(/^(\d{2})\.(\d{4})/)
  const endMatch = period.match(/-(\d{2})\.(\d{4})$/)

  if (which === 'start') {
    if (!startMatch) return ''
    const [, m, y] = startMatch
    return `${y}-${m}`
  }

  if (which === 'end') {
    if (!endMatch) return ''
    const [, m, y] = endMatch
    return `${y}-${m}`
  }

  return ''
}

function isCurrent (period) {
  return /по сей день|настоящее время|по н\.?в\.?/i.test(period || '')
}

function buildPeriodFromItem (li) {
  const start = li.querySelector('[data-period="start"]').value
  const end = li.querySelector('[data-period="end"]').value
  const current = li.querySelector('[data-period="current"]').checked

  if (!start && !end && !current) return ''

  const fmt = val => {
    if (!val) return ''
    const [y, m] = val.split('-')
    return `${m}.${y}`
  }

  const s = fmt(start)
  const e = current ? 'по сей день' : fmt(end)

  if (s && e) return `${s}-${e}`
  if (s) return `${s}-по сей день`
  if (e) return e
  return ''
}

// 
// ГЛАВНАЯ ФУНКЦИЯ
// 

async function render () {
  const container = document.querySelector('.admin-main')

  container.innerHTML = `
    <nav class="admin-tabs">
      <button class="admin-tab admin-tab--active" data-tab="about">О себе</button>
      <button class="admin-tab" data-tab="skills">Теги</button>
      <button class="admin-tab" data-tab="works">Опыт работы</button>
    </nav>

    <div class="admin-content">
      <section class="admin-tab-panel admin-tab-panel--active" data-panel="about">
        <div id="about-tab-content"></div>
      </section>
      <section class="admin-tab-panel" data-panel="skills">
        <div id="skills-tab-content"></div>
      </section>
      <section class="admin-tab-panel" data-panel="works">
        <div id="works-tab-content"></div>
      </section>
    </div>
  `

  const tabs = container.querySelectorAll('.admin-tab')
  const panels = container.querySelectorAll('.admin-tab-panel')

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab
      tabs.forEach(t => t.classList.toggle('admin-tab--active', t === tab))
      panels.forEach(p =>
        p.classList.toggle(
          'admin-tab-panel--active',
          p.dataset.panel === target,
        ),
      )
    })
  })

  await renderAboutTab(document.getElementById('about-tab-content'))
  await renderSkillGroups(document.getElementById('skills-tab-content'))
  await renderWorks(document.getElementById('works-tab-content'))
}

async function renderAboutTab (container) {
  const about = await loadAbout()
  const currentPhoto = about?.photo ?? ''

  container.innerHTML = `
    <section class="admin-section">
      <h2>О себе</h2>
      <form id="about-form">

        <div class="admin-field">
          <span>Фото</span>
          <label class="admin-file">
            <input class="admin-file__input" name="file" type="file" accept="image/*" />
            <span class="admin-btn admin-file__btn">Выбрать файл</span>
            <span class="admin-file__name" data-file-name>Файл не выбран</span>
          </label>
          <img id="photo-preview" class="admin-preview" src="${currentPhoto}" alt="" />
        </div>

        <label class="admin-field">
          <span>Описание</span>
          <textarea class="admin-input" id="about-textarea" name="about" rows="6">${
            about?.about ?? ''
          }</textarea>
        </label>

        <label class="admin-field">
          <span>Телефон</span>
          <input class="admin-input" name="telefon" type="tel"
                 value="${
                   about?.telefon ?? ''
                 }" placeholder="+7 900 000-00-00" />
        </label>

        <label class="admin-field">
          <span>Telegram</span>
          <input class="admin-input" name="telegram" type="text"
                 value="${about?.telegram ?? ''}" placeholder="@username" />
        </label>

        <div class="admin-actions">
          <button type="submit" class="admin-btn">Сохранить</button>
          <span class="admin-status" id="status"></span>
        </div>
      </form>
    </section>
  `

  const oldEditor = tinymce.get('about-textarea')
  if (oldEditor) oldEditor.remove()

  await tinymce.init({
    selector: '#about-textarea',
    license_key: 'gpl',
    height: 500,
    menubar: true,
    plugins: [
      'advlist',
      'anchor',
      'autolink',
      'autoresize',
      'charmap',
      'code',
      'codesample',
      'emoticons',
      'fullscreen',
      'help',
      'image',
      'importcss',
      'insertdatetime',
      'link',
      'lists',
      'media',
      'nonbreaking',
      'pagebreak',
      'preview',
      'quickbars',
      'searchreplace',
      'table',
      'visualblocks',
      'visualchars',
      'wordcount',
    ].join(' '),
    toolbar: [
      'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | link image media table | emoticons charmap | codesample code | fullscreen preview | removeformat',
    ].join(' '),
    toolbar_mode: 'sliding',
    contextmenu: 'link image table',
    quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
    quickbars_insert_toolbar: 'quickimage quicktable',
    image_advtab: true,
    image_title: true,
    automatic_uploads: true,
    file_picker_types: 'image',
    content_style:
      'body { font-family: system-ui, sans-serif; font-size: 15px; }',
    branding: false,
  })

  const form = document.getElementById('about-form')
  const status = document.getElementById('status')
  const fileInput = form.querySelector('input[name="file"]')
  const preview = document.getElementById('photo-preview')

  const phoneInput = form.querySelector('input[name="telefon"]')
  if (phoneInput && typeof IMask !== 'undefined') {
    IMask(phoneInput, {
      mask: '+{7} (000) 000-00-00',
      lazy: false,
    })
  }

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0]
    const fileNameEl = form.querySelector('[data-file-name]')

    if (file) {
      preview.src = URL.createObjectURL(file)
      if (fileNameEl) fileNameEl.textContent = file.name
    } else {
      if (fileNameEl) fileNameEl.textContent = 'Файл не выбран'
    }
  })

  form.addEventListener('submit', async e => {
    e.preventDefault()
    status.textContent = 'Сохраняю...'
    status.className = 'admin-status'

    const aboutText = tinymce.get('about-textarea').getContent()
    const telefon = form.telefon.value.trim()
    const telegram = form.telegram.value.trim()
    let photo = currentPhoto

    try {
      if (fileInput.files.length > 0) {
        const fd = new FormData()
        fd.append('file', fileInput.files[0])

        const uploadRes = await fetch('/upload', { method: 'POST', body: fd })
        if (!uploadRes.ok) throw new Error('Не удалось загрузить файл')

        const { url } = await uploadRes.json()
        photo = url
      }

      await saveAbout(photo, aboutText, telefon, telegram)
      status.textContent = 'Сохранено'
      status.classList.add('admin-status--ok')

      // Скрыть через 5 секунд
      setTimeout(() => {
        status.textContent = ''
        status.className = 'admin-status'
      }, 5000)
    } catch (err) {
      status.textContent = 'Ошибка: ' + err.message
      status.classList.add('admin-status--err')

      setTimeout(() => {
        status.textContent = ''
        status.className = 'admin-status'
      }, 5000)
    }
  })
}

render().catch(err => {
  document.querySelector(
    '.admin-main',
  ).innerHTML = `<p class="admin-empty">Ошибка: ${err.message}</p>`
})
