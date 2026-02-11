import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { db } from './db/index.js'
import { recipes } from './db/schema.js'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/recipes', async (c) => {
  try {
    const { userId, url } = await c.req.json<{ userId: string; url: string }>()

    if (!userId || !url) {
      return c.json({ error: 'userId and url are required' }, 400)
    }

    const newRecipe = await db
      .insert(recipes)
      .values({ userId, url })
      .returning();

    return c.json(newRecipe[0], 201)
  } catch (error) {
    console.error('Error creating recipe:', error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})

export default app

