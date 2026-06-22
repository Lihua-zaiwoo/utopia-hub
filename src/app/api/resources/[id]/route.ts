import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resource = await prisma.resource.findUnique({
      where: { id: params.id },
    })

    if (!resource) {
      return Response.json({ error: '资源不存在' }, { status: 404 })
    }

    return Response.json(resource)
  } catch {
    return Response.json({ error: '获取资源详情失败' }, { status: 500 })
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
    const { name, description, category, tags, fileName, filePath, fileSize, screenshots, instruction } = body

    const resource = await prisma.resource.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(category && { category }),
        ...(tags && { tags: JSON.stringify(tags) }),
        ...(fileName && { fileName }),
        ...(filePath && { filePath }),
        ...(fileSize !== undefined && { fileSize }),
        ...(screenshots !== undefined && { screenshots: screenshots ? JSON.stringify(screenshots) : null }),
        ...(instruction !== undefined && { instruction: instruction || null }),
      },
    })

    return Response.json(resource)
  } catch {
    return Response.json({ error: '更新资源失败' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await requireAuth()
    if (authError) return authError

    await prisma.resource.delete({
      where: { id: params.id },
    })

    return Response.json({ success: true })
  } catch {
    return Response.json({ error: '删除资源失败' }, { status: 500 })
  }
}
