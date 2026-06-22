import { cookies } from 'next/headers'

const ADMIN_TOKEN_NAME = 'admin_token'

export function generateToken(): string {
  const payload = `${process.env.ADMIN_PASSWORD}_${Date.now()}`
  return Buffer.from(payload).toString('base64')
}

export function validateToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    return decoded.startsWith(process.env.ADMIN_PASSWORD || '')
  } catch {
    return false
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_TOKEN_NAME)?.value
  if (!token) return false
  return validateToken(token)
}

export async function requireAuth(): Promise<Response | null> {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return Response.json({ error: '未授权访问' }, { status: 401 })
  }
  return null
}
