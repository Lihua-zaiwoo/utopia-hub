import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const video = await prisma.video.findUnique({ where: { id: params.id } })
  if (!video) return { title: '视频未找到' }
  return {
    title: `${video.title} - Utopia Hub`,
    description: video.description,
  }
}

export default async function VideoDetailPage({ params }: Props) {
  const video = await prisma.video.findUnique({
    where: { id: params.id },
  })

  if (!video) {
    notFound()
  }

  // If video has a related resource, fetch it
  let relatedResource = null
  if (video.resourceId) {
    relatedResource = await prisma.resource.findUnique({
      where: { id: video.resourceId },
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link
        href="/videos"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回视频列表
      </Link>

      {/* Video Player */}
      <div className="rounded-xl overflow-hidden bg-black mb-6">
        <video
          src={`/api/stream/${video.id}`}
          controls
          className="w-full aspect-video"
          poster={video.coverPath ? `/${video.coverPath}` : undefined}
        />
      </div>

      {/* Title + Info */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{video.title}</h1>
      <p className="text-xs text-gray-400 mb-4">{formatDate(video.createdAt)}</p>

      {/* Description */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{video.description}</p>
      </div>

      {/* Related Resource */}
      {relatedResource && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">关联资源</h2>
          <div className="flex items-center justify-between">
            <div>
              <Link
                href={`/resources/${relatedResource.id}`}
                className="text-sm font-medium text-sky hover:text-blue-600 transition-colors"
              >
                {relatedResource.name}
              </Link>
              <p className="text-xs text-gray-500 mt-1">{relatedResource.description}</p>
            </div>
            <a
              href={`/api/download/${relatedResource.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 ml-4 px-4 py-2 bg-sky text-white text-xs font-medium rounded-lg hover:bg-blue-400 transition-colors"
            >
              下载
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
