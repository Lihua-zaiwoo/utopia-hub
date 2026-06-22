import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ResourceCard from '@/components/ResourceCard'
import VideoCard from '@/components/VideoCard'
import PostCard from '@/components/PostCard'
import HomeHero from './HomeHero'

export default async function Home() {
  const [resources, videos, posts] = await Promise.all([
    prisma.resource.findMany({ orderBy: { createdAt: 'desc' }, take: 6 }),
    prisma.video.findMany({ orderBy: { createdAt: 'desc' }, take: 3 }),
    prisma.post.findMany({ orderBy: { createdAt: 'desc' }, take: 3 }),
  ])

  return (
    <div>
      {/* Hero */}
      <HomeHero />

      {/* Latest Resources */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">最新资源</h2>
          <Link href="/resources" className="text-sm text-sky hover:text-blue-600 transition-colors">
            查看全部 →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              id={resource.id}
              name={resource.name}
              description={resource.description}
              category={resource.category}
              tags={resource.tags}
              downloads={resource.downloads}
              createdAt={resource.createdAt}
            />
          ))}
        </div>
        {resources.length === 0 && (
          <p className="text-center text-gray-400 py-8">暂无资源</p>
        )}
      </section>

      {/* Recommended Videos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">推荐视频</h2>
          <Link href="/videos" className="text-sm text-sky hover:text-blue-600 transition-colors">
            查看全部 →
          </Link>
        </div>
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
        {videos.length === 0 && (
          <p className="text-center text-gray-400 py-8">暂无视频</p>
        )}
      </section>

      {/* Community Posts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">社区动态</h2>
          <Link href="/community" className="text-sm text-sky hover:text-blue-600 transition-colors">
            查看全部 →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              content={post.content}
              createdAt={post.createdAt}
            />
          ))}
        </div>
        {posts.length === 0 && (
          <p className="text-center text-gray-400 py-8">暂无动态</p>
        )}
      </section>
    </div>
  )
}
