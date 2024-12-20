import db from '@/db/drizzle'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getUserById(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId)
  })
  if (!user) throw new Error('User not found')
  return user
} 