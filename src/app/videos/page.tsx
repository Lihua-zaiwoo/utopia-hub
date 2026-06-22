import { prisma } from '@/lib/prisma'
import VideoCard from '@/components/VideoCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '教学视频 - Utopia Hub',
  description: '外贸 AI 工具教学视频，从入门到精通',
}

export default async function VideosPage() {
  const videos = await prisma.video.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">教学视频</h1>

      {videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              id={video.id}
              title={video.title}
              description={video.description}
              coverPath={video.coverPath}
              duration={video.duration}
              createdAt={video.createdAt}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p className="mt-4 text-gray-500">暂无教学视频</p>
        </div>
      )}
    </div>
  )
}
