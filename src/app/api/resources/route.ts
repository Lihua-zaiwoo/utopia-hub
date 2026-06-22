import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const where: Record<string, unknown> = {}

    if (category) {
      where.category = category
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }

    const resources = await prisma.resource.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return Response.json(resources)
  } catch {
    return Response.json({ error: '获取资源列表失败' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAuth()
    if (authError) return authError

    const body = await request.json()
    const { name, description, category, tags, fileName, filePath, fileSize, screenshots, instruction } = body

    if (!name || !description || !category || !fileName || !filePath || fileSize === undefined) {
      return Response.json({ error: '缺少必填字段' }, { status: 400 })
    }

    const resource = await prisma.resource.create({
      data: {
        name,
        description,
        category,
        tags: JSON.stringify(tags || []),
        fileName,
        filePath,
        fileSize,
        screenshots: screenshots ? JSON.stringify(screenshots) : null,
        instruction: instruction || null,
      },
    })

    return Response.json(resource, { status: 201 })
  } catch {
    return Response.json({ error: '创建资源失败' }, { status: 500 })
  }
}
