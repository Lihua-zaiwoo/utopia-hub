import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface VideoCardProps {
  id: string
  title: string
  description: string
  coverPath: string | null
  duration: string | null
  createdAt: Date | string
}

export default function VideoCard({
  id,
  title,
  coverPath,
  duration,
  createdAt,
}: VideoCardProps) {
  return (
    <Link href={`/videos/${id}`} className="block">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full flex flex-col">
        {/* Cover */}
        <div className="relative aspect-video bg-gradient-to-br from-sky/20 to-mint/20 flex items-center justify-center">
          {coverPath ? (
            <img src={`/${coverPath}`} alt={title} className="w-full h-full object-cover" />
          ) : (
            <svg className="w-12 h-12 text-sky/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {duration && (
            <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white text-xs rounded">
              {duration}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{title}</h3>
          <p className="mt-auto pt-2 text-xs text-gray-400">{formatDate(createdAt)}</p>
        </div>
      </div>
    </Link>
  )
}
