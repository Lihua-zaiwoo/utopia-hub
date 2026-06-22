import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return Response.json({ error: '密码错误' }, { status: 401 })
    }

    const token = generateToken()
    const cookieStore = await cookies()
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return Response.json({ success: true })
  } catch {
    return Response.json({ error: '请求处理失败' }, { status: 500 })
  }
}
