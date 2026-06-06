import { serve } from 'inngest/next'
import { inngest } from '@/inngest/client'
import {
  dailyStandup,
  weeklyReport,
  biweeklyReport,
  monthlyReport,
} from '@/inngest/functions'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    dailyStandup,
    weeklyReport,
    biweeklyReport,
    monthlyReport,
  ],
})