// ─── Загрузка навыков в виде тегов ───
async function loadSkillGroups() {
  const data = await gql(`
    query {
      skillGroups {
        id
        title
        order
        skills {
          id
          name
          order
        }
      }
    }
  `)
  return data?.skillGroups ?? []
}
// группа тегов
async function renderSkillGroups() {
  const container = document.getElementById('skills-content');
  console.log('container:', container);
  if (!container) return;

  const groups = await loadSkillGroups();
  console.log('groups:', groups);
  if (!groups.length) {
    container.innerHTML = '';
    return;
  }
// сначала группа потом теги, которые относится к ней
  container.innerHTML = groups
    .map(
      (group) => `
        <li class="skills_item">
          <p>${group.title}</p>
          <p>${(group.skills || [])
            .map((skill) => `<span>#${skill.name}</span>`)
            .join(' ')}</p>
        </li>
      `,
    )
    .join('');

  console.log('вставили в DOM:', container.innerHTML);
}

renderSkillGroups();