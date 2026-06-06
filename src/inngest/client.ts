import { Inngest } from 'inngest'

export const inngest = new Inngest({
  id: 'siorna',
  name: 'Siorna',
  isDev: process.env.NODE_ENV !== 'production',
  eventKey: process.env.INNGEST_EVENT_KEY,
})