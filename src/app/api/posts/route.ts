import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return Response.json(posts)
  } catch {
    return Response.json({ error: '获取帖子列表失败' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAuth()
    if (authError) return authError

    const body = await request.json()
    const { title, content, coverImage } = body

    if (!title || !content) {
      return Response.json({ error: '缺少必填字段' }, { status: 400 })
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        coverImage: coverImage || null,
      },
    })

    return Response.json(post, { status: 201 })
  } catch {
    return Response.json({ error: '创建帖子失败' }, { status: 500 })
  }
}
