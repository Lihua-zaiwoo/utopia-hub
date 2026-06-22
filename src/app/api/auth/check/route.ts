import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  try {
    const authenticated = await isAuthenticated()
    return Response.json({ authenticated })
  } catch {
    return Response.json({ authenticated: false })
  }
}
