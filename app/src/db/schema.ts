import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const recipes = pgTable('recipes', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  url: text('url').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
