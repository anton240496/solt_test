// плавное сдвиг до нужного раздела 
document.querySelectorAll('a[href^="#"]').forEach(
  a =>
    (a.onclick = e => {
      e.preventDefault()
      const el = document.querySelector(a.hash)
      if (!el) return
// в зависимости от размера экрана останавливаемся чуть раньше
      const offset = window.matchMedia('(max-width: 480px)').matches ? 230 : 160
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset
      window.scrollTo({ top, behavior: 'smooth' })
    })
)
// блок меню
const btn = document.querySelector('.menu_button')
const list = document.querySelector('.menu_list')

btn.addEventListener('click', () => {
  list.classList.toggle('active')
  btn.classList.toggle('active')
})
// клик по пункту меню — закрываем всё
list.querySelectorAll('.menu_item').forEach(item => {
  item.addEventListener('click', () => {
    list.classList.remove('active')
    btn.classList.remove('active')
  })
})
