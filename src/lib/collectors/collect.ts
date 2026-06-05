import { supabase } from '@/lib/supabase'
import { fetchGithubActivity } from './github'
import { fetchLinearActivity } from './linear'
import { fetchJiraActivity }   from './jira'
import { fetchTrelloActivity } from './trello'

// Üyenin belirli bir provider'a ait token'ını çek
async function getToken(memberId: string, provider: string) {
  const { data } = await supabase
    .from('oauth_connections')
    .select('access_token, refresh_token, expires_at, provider_metadata, provider_user_id, provider_user_name')
    .eq('team_member_id', memberId)
    .eq('provider', provider)
    .eq('is_active', true)
    .single()
  return data
}

export async function collectTeamData(
  teamId: string,
  since: Date,
  until: Date
) {
  const { data: members } = await supabase
    .from('team_members')
    .select('*')
    .eq('team_id', teamId)
    .eq('is_active', true)

  const allActivity = await Promise.all(
    (members ?? []).map(async (member) => {

      // Her provider için token'ı ayrı çek
      const [githubConn, linearConn, jiraConn, trelloConn] = await Promise.all([
        getToken(member.id, 'github'),
        getToken(member.id, 'linear'),
        getToken(member.id, 'jira'),
        getToken(member.id, 'trello'),
      ])

      const github = githubConn && member.github_username
        ? await fetchGithubActivity(
            member.github_username,
            since, until,
            githubConn.access_token    // ← OAuth token
          )
        : { commits: [], prs: [] }

      const linear = linearConn
        ? await fetchLinearActivity(
            linearConn.provider_user_id,
            since, until,
            linearConn.access_token    // ← OAuth token
          )
        : []

      const jira = jiraConn
  ? await fetchJiraActivity(
      jiraConn.provider_user_id,   // accountId
      jiraConn.provider_metadata.cloud_id,  // cloudId
      jiraConn.provider_metadata.email,
      jiraConn.access_token,
      since,
      until
    )
  : []

      const trello = trelloConn
        ? await fetchTrelloActivity(
            trelloConn.provider_user_id,
            process.env.TRELLO_API_KEY!,   // Trello API key global
            trelloConn.access_token,        // ← OAuth token
            since, until
          )
        : []

      return {
        member: member.name,
        commits: github.commits,
        prs: github.prs,
        tickets: [
          ...linear.map(t => ({ ...t, source: 'linear' })),
          ...jira.map(t => ({ ...t, source: 'jira' })),
          ...trello.map(t => ({ ...t, source: 'trello' })),
        ],
      }
    })
  )

  return allActivity
}