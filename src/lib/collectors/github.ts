import { Octokit } from '@octokit/rest'

export interface GithubCommit {
  title: string
  url: string
  repo: string
  date: string
}

export interface GithubPR {
  title: string
  url: string
  state: string
}

export interface GithubActivity {
  commits: GithubCommit[]
  prs: GithubPR[]
}

export async function fetchGithubActivity(
  username: string,
  since: Date,
  until: Date,
  accessToken: string
): Promise<GithubActivity> {
  // Octokit initialized inside the scope to access the token
  const octokit = new Octokit({ auth: accessToken })

  const sinceStr = since.toISOString().split('T')[0]
  const untilStr = until.toISOString().split('T')[0]

  try {
    const [commitsRes, prsRes] = await Promise.all([
      octokit.search.commits({
        q: `author:${username} committer-date:${sinceStr}..${untilStr}`,
        per_page: 50,
        sort: 'committer-date',
      }),
      octokit.search.issuesAndPullRequests({
        q: `author:${username} is:pr updated:${sinceStr}..${untilStr}`,
        per_page: 20,
      }),
    ])

    return {
      commits: commitsRes.data.items.map((c) => ({
        title: c.commit.message.split('\n')[0], // keep only the first line
        url: c.html_url,
        repo: c.repository.name,
        date: c.commit.author?.date ?? sinceStr,
      })),
      prs: prsRes.data.items.map((p) => ({
        title: p.title,
        url: p.html_url,
        state: p.state as string,
      })),
    }
  } catch (err) {
    console.error(`[github] Failed to fetch data for ${username}:`, err)
    return { commits: [], prs: [] }
  }
}