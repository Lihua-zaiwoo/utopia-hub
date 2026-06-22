import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface PostCardProps {
  id: string
  title: string
  content: string
  createdAt: Date | string
}

export default function PostCard({ id, title, content, createdAt }: PostCardProps) {
  return (
    <Link href={`/community/${id}`} className="block">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-5 h-full flex flex-col">
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-1">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-grow">{content}</p>
        <p className="mt-3 text-xs text-gray-400">{formatDate(createdAt)}</p>
      </div>
    </Link>
  )
}
