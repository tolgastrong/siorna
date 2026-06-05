export interface JiraTicket {
  id: string
  title: string
  status: string
  priority: string | null
  url: string
  completedAt: string | null
  updatedAt: string
  source: 'jira'
}

export async function fetchJiraActivity(
  accountId: string,
  cloudId: string,
  email: string,
  accessToken: string,
  since: Date,
  until: Date
): Promise<JiraTicket[]> {
  // Removed the unused Basic Auth (Buffer) line. OAuth uses Bearer token directly.
  
  const sinceStr = since.toISOString().split('T')[0]
  const untilStr = until.toISOString().split('T')[0]

  const jql = `assignee = "${accountId}" AND updated >= "${sinceStr}" AND updated <= "${untilStr}" ORDER BY updated DESC`

  try {
    const res = await fetch(
      `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/search?jql=${encodeURIComponent(jql)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      }
    )

    if (!res.ok) throw new Error(`Jira API Error: ${res.status}`)

    const data = await res.json()

    return (data.issues ?? []).map((issue: any) => ({
      id: issue.key,
      title: issue.fields.summary,
      status: issue.fields.status.name,
      priority: issue.fields.priority?.name ?? null,
      url: `https://${email.split('@')[1]}/browse/${issue.key}`,
      completedAt: issue.fields.resolutiondate,
      updatedAt: issue.fields.updated,
      source: 'jira' as const,
    }))
  } catch (err) {
    console.error(`[jira] Failed to fetch data for ${accountId}:`, err)
    return []
  }
}