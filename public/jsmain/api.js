// ─── Общая функция запроса к GraphQL ───
async function gql (query) {
  const res = await fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })

  const { data, errors } = await res.json()
  if (errors) {
    console.error('GraphQL errors:', errors)
    return null
  }
  return data
}
