import { prisma } from '@/lib/prisma'
import PostCard from '@/components/PostCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '社区动态 - Utopia Hub',
  description: '外贸 AI 社区最新动态和讨论',
}

export default async function CommunityPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">社区动态</h1>

      {posts.length > 0 ? (
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
      ) : (
        <div className="text-center py-16">
          <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="mt-4 text-gray-500">暂无社区动态</p>
        </div>
      )}
    </div>
  )
}
