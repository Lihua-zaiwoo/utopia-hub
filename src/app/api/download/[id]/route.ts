import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createReadStream, statSync, existsSync } from 'fs'
import path from 'path'
import { Readable } from 'stream'

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

    // 按优先级查找文件
    const possiblePaths = [
      path.join(process.cwd(), resource.filePath),
      path.join(process.cwd(), 'public', resource.filePath),
      path.join(process.cwd(), 'public', path.basename(resource.filePath)),
    ]

    let filePath = ''
    for (const p of possiblePaths) {
      if (existsSync(p)) {
        filePath = p
        break
      }
    }

    if (!filePath) {
      return Response.json({ error: '文件不存在' }, { status: 404 })
    }

    // 自增下载计数
    await prisma.resource.update({
      where: { id: params.id },
      data: { downloads: { increment: 1 } },
    })

    const stat = statSync(filePath)
    const fileStream = createReadStream(filePath)

    // 将 Node.js ReadStream 转为 Web ReadableStream
    const webStream = Readable.toWeb(fileStream) as ReadableStream

    // 根据文件扩展名设置 Content-Type
    const ext = path.extname(resource.fileName).toLowerCase()
    const mimeTypes: Record<string, string> = {
      '.zip': 'application/zip',
      '.rar': 'application/x-rar-compressed',
      '.7z': 'application/x-7z-compressed',
      '.tar': 'application/x-tar',
      '.gz': 'application/gzip',
      '.pdf': 'application/pdf',
      '.exe': 'application/x-msdownload',
      '.dmg': 'application/x-apple-diskimage',
      '.json': 'application/json',
    }
    const contentType = mimeTypes[ext] || 'application/octet-stream'

    return new Response(webStream, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(resource.fileName)}"`,
        'Content-Length': stat.size.toString(),
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes('不存在')) {
      return Response.json({ error: error.message }, { status: 404 })
    }
    return Response.json({ error: '文件下载失败' }, { status: 500 })
  }
}
