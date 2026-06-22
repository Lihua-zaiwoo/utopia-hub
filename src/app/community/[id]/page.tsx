import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.post.findUnique({ where: { id: params.id } })
  if (!post) return { title: '帖子未找到' }
  return {
    title: `${post.title} - Utopia Hub`,
    description: post.content.slice(0, 160),
  }
}

export default async function PostDetailPage({ params }: Props) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
  })

  if (!post) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link
        href="/community"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回社区动态
      </Link>

      {/* Title + Time */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
      <p className="text-xs text-gray-400 mb-6">{formatDate(post.createdAt)}</p>

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
      </div>

      {/* Comment Placeholder */}
      <div className="bg-gray-blue rounded-xl p-6 text-center">
        <p className="text-gray-500 text-sm">💬 评论功能即将上线，敬请期待！</p>
      </div>
    </div>
  )
}
