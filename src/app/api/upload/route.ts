import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const UPLOAD_DIRS: Record<string, string> = {
  resource: 'uploads/resources',
  video: 'uploads/videos',
  cover: 'uploads/covers',
  screenshot: 'uploads/screenshots',
}

export async function POST(request: NextRequest) {
  try {
    // Vercel 演示环境不支持文件上传
    if (process.env.VERCEL) {
      return Response.json(
        { error: '演示环境不支持文件上传，请使用本地部署版本' },
        { status: 403 }
      )
    }

    const authError = await requireAuth()
    if (authError) return authError

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const type = formData.get('type') as string | null

    if (!file) {
      return Response.json({ error: '未提供文件' }, { status: 400 })
    }

    if (!type || !UPLOAD_DIRS[type]) {
      return Response.json({ error: '无效的文件类型，支持: resource, video, cover, screenshot' }, { status: 400 })
    }

    const uploadDir = UPLOAD_DIRS[type]
    const absoluteDir = path.join(process.cwd(), uploadDir)

    // 确保目录存在
    await mkdir(absoluteDir, { recursive: true })

    // 生成安全文件名: 时间戳_原始文件名
    const timestamp = Date.now()
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const fileName = `${timestamp}_${safeName}`
    const filePath = `${uploadDir}/${fileName}`
    const absolutePath = path.join(absoluteDir, fileName)

    // 读取文件并写入磁盘
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    await writeFile(absolutePath, buffer)

    return Response.json({
      filePath,
      fileName: file.name,
      fileSize: buffer.length,
    }, { status: 201 })
  } catch {
    return Response.json({ error: '文件上传失败' }, { status: 500 })
  }
}
