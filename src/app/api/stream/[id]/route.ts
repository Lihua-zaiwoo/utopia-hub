import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createReadStream, statSync } from 'fs'
import path from 'path'
import { Readable } from 'stream'

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

    const absolutePath = path.join(process.cwd(), video.videoPath)

    // 检查文件是否存在
    let stat
    try {
      stat = statSync(absolutePath)
    } catch {
      return Response.json(
        { error: '视频文件不存在，演示环境不支持视频流播放' },
        { status: 404 }
      )
    }

    const fileSize = stat.size
    const range = request.headers.get('range')

    // 根据文件扩展名确定 Content-Type
    const ext = path.extname(video.videoPath).toLowerCase()
    const videoMimeTypes: Record<string, string> = {
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.ogg': 'video/ogg',
      '.mov': 'video/quicktime',
      '.avi': 'video/x-msvideo',
      '.mkv': 'video/x-matroska',
    }
    const contentType = videoMimeTypes[ext] || 'video/mp4'

    if (range) {
      // 解析 Range header
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1

      if (start >= fileSize) {
        return new Response(null, {
          status: 416,
          headers: {
            'Content-Range': `bytes */${fileSize}`,
          },
        })
      }

      const chunkSize = end - start + 1
      const fileStream = createReadStream(absolutePath, { start, end })
      const webStream = Readable.toWeb(fileStream) as ReadableStream

      return new Response(webStream, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize.toString(),
          'Content-Type': contentType,
        },
      })
    } else {
      // 无 Range，返回完整文件
      const fileStream = createReadStream(absolutePath)
      const webStream = Readable.toWeb(fileStream) as ReadableStream

      return new Response(webStream, {
        status: 200,
        headers: {
          'Accept-Ranges': 'bytes',
          'Content-Length': fileSize.toString(),
          'Content-Type': contentType,
        },
      })
    }
  } catch {
    return Response.json({ error: '视频流处理失败' }, { status: 500 })
  }
}
