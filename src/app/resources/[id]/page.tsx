import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate, formatFileSize } from '@/lib/utils'
import type { Metadata } from 'next'

const categoryColors: Record<string, string> = {
  skill: 'bg-mint/30 text-green-700',
  agent: 'bg-sky/30 text-blue-700',
  mcp: 'bg-peach/30 text-orange-700',
}

const categoryLabels: Record<string, string> = {
  skill: 'Skill',
  agent: 'Agent',
  mcp: 'MCP',
}

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resource = await prisma.resource.findUnique({ where: { id: params.id } })
  if (!resource) return { title: '资源未找到' }
  return {
    title: `${resource.name} - Utopia Hub`,
    description: resource.description,
  }
}

export default async function ResourceDetailPage({ params }: Props) {
  const resource = await prisma.resource.findUnique({
    where: { id: params.id },
  })

  if (!resource) {
    notFound()
  }

  const tags: string[] = JSON.parse(resource.tags || '[]')
  const screenshots: string[] = resource.screenshots
    ? JSON.parse(resource.screenshots)
    : []

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back + Category */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/resources"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回资源市场
        </Link>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[resource.category] || 'bg-gray-100 text-gray-600'}`}>
          {categoryLabels[resource.category] || resource.category}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{resource.name}</h1>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed mb-6">{resource.description}</p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-6">
          {tags.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Instruction */}
      {resource.instruction && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">安装/使用说明</h2>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
              {resource.instruction}
            </div>
          </div>
        </div>
      )}

      {/* File Info + Download */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">文件信息</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">文件名:</span>
            <span>{resource.fileName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">大小:</span>
            <span>{formatFileSize(resource.fileSize)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">下载次数:</span>
            <span>{resource.downloads}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">上传时间:</span>
            <span>{formatDate(resource.createdAt)}</span>
          </div>
        </div>
        <a
          href={`/api/download/${resource.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 bg-sky text-white text-sm font-medium rounded-lg hover:bg-blue-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          下载资源
        </a>
      </div>

      {/* Screenshots */}
      {screenshots.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">截图预览</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {screenshots.map((src, i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-gray-100">
                <img src={`/${src}`} alt={`截图 ${i + 1}`} className="w-full" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
