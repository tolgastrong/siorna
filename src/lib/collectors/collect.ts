import { createClient } from '@supabase/supabase-js'
import { fetchGithubActivity } from './github'
import { fetchLinearActivity } from './linear'
import { fetchJiraActivity } from './jira'
import { fetchTrelloActivity } from './trello'

// @/lib/supabase yerine direkt createClient kullan
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )
}

async function getToken(memberId: string, provider: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('oauth_connections')
    .select('access_token, refresh_token, expires_at, provider_metadata, provider_user_id, provider_user_name')
    .eq('team_member_id', memberId)
    .eq('provider', provider)
    .eq('is_active', true)
    .single()

  if (error) {
    console.log(`[collect] No ${provider} token for member ${memberId}:`, error.message)
    return null
  }
  return data
}

export async function collectTeamData(
  teamId: string,
  since: Date,
  until: Date
) {
  const supabase = getSupabase()

  console.log(`[collect] Fetching members for team: ${teamId}`)

  const { data: members, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('team_id', teamId)
    .eq('is_active', true)

  if (error) {
    console.error('[collect] Error fetching members:', error)
    return []
  }

  console.log(`[collect] Found ${members?.length ?? 0} members`)

  if (!members || members.length === 0) return []

  const allActivity = await Promise.all(
    members.map(async (member) => {
      console.log(`[collect] Processing member: ${member.name}`)

      const [githubConn, linearConn, jiraConn, trelloConn] = await Promise.all([
        getToken(member.id, 'github'),
        getToken(member.id, 'linear'),
        getToken(member.id, 'jira'),
        getToken(member.id, 'trello'),
      ])

      console.log(`[collect] ${member.name} connections:`, {
        github: !!githubConn,
        linear: !!linearConn,
        jira:   !!jiraConn,
        trello: !!trelloConn,
      })

      const github = githubConn && member.github_username
        ? await fetchGithubActivity(
            member.github_username,
            since,
            until,
            githubConn.access_token
          ).catch(err => {
            console.error('[collect] GitHub error:', err)
            return { commits: [], prs: [] }
          })
        : { commits: [], prs: [] }

      const linear = linearConn
        ? await fetchLinearActivity(
            linearConn.provider_user_id,
            since,
            until,
            linearConn.access_token
          ).catch(err => {
            console.error('[collect] Linear error:', err)
            return []
          })
        : []

      const jira = jiraConn
        ? await fetchJiraActivity(
            jiraConn.provider_user_id,
            jiraConn.provider_metadata?.cloud_id ?? '',
            jiraConn.provider_metadata?.email ?? '',
            jiraConn.access_token,
            since,
            until
          ).catch(err => {
            console.error('[collect] Jira error:', err)
            return []
          })
        : []

      const trello = trelloConn
        ? await fetchTrelloActivity(
            trelloConn.provider_user_id,
            process.env.TRELLO_API_KEY!,
            trelloConn.access_token,
            since,
            until
          ).catch(err => {
            console.error('[collect] Trello error:', err)
            return []
          })
        : []

      const result = {
        member: member.name,
        commits: github.commits,
        prs:     github.prs,
        tickets: [
          ...linear.map((t: any) => ({ ...t, source: 'linear' })),
          ...jira.map((t: any) => ({ ...t, source: 'jira' })),
          ...trello.map((t: any) => ({ ...t, source: 'trello' })),
        ],
      }

      console.log(`[collect] ${member.name} activity:`, {
        commits: result.commits.length,
        prs:     result.prs.length,
        tickets: result.tickets.length,
      })

      return result
    })
  )

  return allActivity
}