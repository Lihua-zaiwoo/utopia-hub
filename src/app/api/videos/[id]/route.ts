import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const video = await prisma.video.findUnique({
      where: { id: params.id },
    })

    if (!video) {
      return Response.json({ error: '视频不存在' }, { status: 404 })
    }

    return Response.json(video)
  } catch {
    return Response.json({ error: '获取视频详情失败' }, { status: 500 })
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
    const { title, description, coverPath, videoPath, duration, resourceId } = body

    const video = await prisma.video.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(coverPath !== undefined && { coverPath: coverPath || null }),
        ...(videoPath && { videoPath }),
        ...(duration !== undefined && { duration: duration || null }),
        ...(resourceId !== undefined && { resourceId: resourceId || null }),
      },
    })

    return Response.json(video)
  } catch {
    return Response.json({ error: '更新视频失败' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await requireAuth()
    if (authError) return authError

    await prisma.video.delete({
      where: { id: params.id },
    })

    return Response.json({ success: true })
  } catch {
    return Response.json({ error: '删除视频失败' }, { status: 500 })
  }
}
