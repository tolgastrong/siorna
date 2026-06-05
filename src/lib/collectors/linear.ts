export interface LinearTicket {
  id: string
  title: string
  status: string
  url: string
  priority: string | null
  completedAt: string | null
  updatedAt: string
  source: 'linear'
}

export async function fetchLinearActivity(
  userId: string,
  since: Date,
  until: Date,
  accessToken: string          // ← ekle
): Promise<LinearTicket[]> {
  const query = `
    query {
      issues(
        filter: {
          assignee: { id: { eq: "${userId}" } }
          updatedAt: { gte: "${since.toISOString()}", lte: "${until.toISOString()}" }
        }
        first: 50
      ) {
        nodes {
          id
          title
          state { name }
          url
          priority
          completedAt
          updatedAt
        }
      }
    }
  `

  try {
    const res = await fetch('https://api.linear.app/graphql', {
      method: 'POST',
      headers: {
        Authorization: process.env.LINEAR_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })

    if (!res.ok) throw new Error(`Linear API ${res.status}`)

    const data = await res.json()

    if (data.errors) {
      console.error('[linear] GraphQL hatası:', data.errors)
      return []
    }

    return (data.data?.issues?.nodes ?? []).map((node: any) => ({
      id: node.id,
      title: node.title,
      status: node.state?.name ?? 'Unknown',
      url: node.url,
      priority: node.priority,
      completedAt: node.completedAt,
      updatedAt: node.updatedAt,
      source: 'linear' as const,
    }))
  } catch (err) {
    console.error(`[linear] ${userId} için veri çekilemedi:`, err)
    return []
  }
}