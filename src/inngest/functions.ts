import { inngest } from './client'

export const dailyStandup = inngest.createFunction(
  {
    id: 'daily-standup',
    name: 'Daily Standup Report',
    triggers: [{ cron: '0 14 * * 1-5' }],
  },
  async ({ step }) => {
    await step.run('log', async () => {
      console.log('[inngest] daily-standup çalıştı')
    })
  }
)

export const weeklyReport = inngest.createFunction(
  {
    id: 'weekly-report',
    name: 'Weekly Report',
    triggers: [{ cron: '0 22 * * 5' }],
  },
  async ({ step }) => {
    await step.run('log', async () => {
      console.log('[inngest] weekly-report çalıştı')
    })
  }
)

export const biweeklyReport = inngest.createFunction(
  {
    id: 'biweekly-report',
    name: 'Biweekly Sprint Review',
    triggers: [{ cron: '0 13 1,15 * *' }],
  },
  async ({ step }) => {
    await step.run('log', async () => {
      console.log('[inngest] biweekly-report çalıştı')
    })
  }
)

export const monthlyReport = inngest.createFunction(
  {
    id: 'monthly-report',
    name: 'Monthly Executive Report',
    triggers: [{ cron: '0 22 28-31 * *' }],
  },
  async ({ step }) => {
    await step.run('check-last-day', async () => {
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1)
      if (tomorrow.getMonth() === today.getMonth()) {
        console.log('[inngest] Ayın son günü değil, atlanıyor')
        return
      }
      console.log('[inngest] monthly-report çalıştı')
    })
  }
)