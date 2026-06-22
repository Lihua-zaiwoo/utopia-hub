import Link from 'next/link'
import { formatDate } from '@/lib/utils'

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

interface ResourceCardProps {
  id: string
  name: string
  description: string
  category: string
  tags: string
  downloads: number
  createdAt: Date | string
}

export default function ResourceCard({
  id,
  name,
  description,
  category,
  downloads,
  createdAt,
}: ResourceCardProps) {
  return (
    <Link href={`/resources/${id}`} className="block">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-5 h-full flex flex-col">
        {/* Category Badge */}
        <div className="mb-3">
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[category] || 'bg-gray-100 text-gray-600'}`}>
            {categoryLabels[category] || category}
          </span>
        </div>

        {/* Content */}
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-1">{name}</h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-grow">{description}</p>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {downloads} 次下载
          </span>
          <span>{formatDate(createdAt)}</span>
        </div>
      </div>
    </Link>
  )
}
