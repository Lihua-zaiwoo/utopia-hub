import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
    })

    if (!post) {
      return Response.json({ error: '帖子不存在' }, { status: 404 })
    }

    return Response.json(post)
  } catch {
    return Response.json({ error: '获取帖子详情失败' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await requireAuth()
    if (authError) return authError

    const body = await request.json()
    const { title, content, coverImage } = body

    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(coverImage !== undefined && { coverImage: coverImage || null }),
      },
    })

    return Response.json(post)
  } catch {
    return Response.json({ error: '更新帖子失败' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await requireAuth()
    if (authError) return authError

    await prisma.post.delete({
      where: { id: params.id },
    })

    return Response.json({ success: true })
  } catch {
    return Response.json({ error: '删除帖子失败' }, { status: 500 })
  }
}
