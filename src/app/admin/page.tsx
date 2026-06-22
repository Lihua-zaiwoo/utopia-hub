'use client'

import { useState, useEffect } from 'react'

interface Stats {
  totalResources: number
  totalVideos: number
  totalPosts: number
  totalDownloads: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalResources: 0, totalVideos: 0, totalPosts: 0, totalDownloads: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const [resRes, resVid, resPost] = await Promise.all([
        fetch('/api/resources'),
        fetch('/api/videos'),
        fetch('/api/posts'),
      ])

      const resources = await resRes.json()
      const videos = await resVid.json()
      const posts = await resPost.json()

      const totalDownloads = Array.isArray(resources)
        ? resources.reduce((sum: number, r: { downloads?: number }) => sum + (r.downloads || 0), 0)
        : 0

      setStats({
        totalResources: Array.isArray(resources) ? resources.length : 0,
        totalVideos: Array.isArray(videos) ? videos.length : 0,
        totalPosts: Array.isArray(posts) ? posts.length : 0,
        totalDownloads,
      })
    } catch {
      console.error('获取统计数据失败')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-gray-500">加载中...</div>
  }

  const cards = [
    { label: '总资源数', value: stats.totalResources, color: 'bg-blue-50 text-blue-700' },
    { label: '总视频数', value: stats.totalVideos, color: 'bg-green-50 text-green-700' },
    { label: '总帖子数', value: stats.totalPosts, color: 'bg-purple-50 text-purple-700' },
    { label: '总下载次数', value: stats.totalDownloads, color: 'bg-orange-50 text-orange-700' },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">仪表盘概览</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className={`p-6 rounded-lg ${card.color}`}>
            <div className="text-3xl font-bold">{card.value}</div>
            <div className="text-sm mt-1 opacity-80">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
