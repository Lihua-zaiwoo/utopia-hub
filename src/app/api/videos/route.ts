import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return Response.json(videos)
  } catch {
    return Response.json({ error: '获取视频列表失败' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAuth()
    if (authError) return authError

    const body = await request.json()
    const { title, description, coverPath, videoPath, duration, resourceId } = body

    if (!title || !description || !videoPath) {
      return Response.json({ error: '缺少必填字段' }, { status: 400 })
    }

    const video = await prisma.video.create({
      data: {
        title,
        description,
        coverPath: coverPath || null,
        videoPath,
        duration: duration || null,
        resourceId: resourceId || null,
      },
    })

    return Response.json(video, { status: 201 })
  } catch {
    return Response.json({ error: '创建视频失败' }, { status: 500 })
  }
}
