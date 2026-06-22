'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Video {
  id: string
  title: string
  duration: string | null
  resourceId: string | null
  createdAt: string
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchVideos()
  }, [])

  async function fetchVideos() {
    try {
      const res = await fetch('/api/videos')
      const data = await res.json()
      setVideos(Array.isArray(data) ? data : [])
    } catch {
      setMessage('获取视频列表失败')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/videos/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setVideos(videos.filter((v) => v.id !== id))
        setMessage('删除成功')
      } else {
        setMessage('删除失败')
      }
    } catch {
      setMessage('删除失败')
    } finally {
      setDeleteId(null)
    }
  }

  if (loading) return <div className="text-gray-500">加载中...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">视频管理</h2>
        <Link
          href="/admin/videos/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
        >
          新增视频
        </Link>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
          {message}
          <button onClick={() => setMessage('')} className="ml-2 text-green-900 font-bold">×</button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">标题</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">时长</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">关联资源</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">创建时间</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {videos.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">暂无视频</td></tr>
            ) : (
              videos.map((v, i) => (
                <tr key={v.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-gray-800">{v.title}</td>
                  <td className="px-4 py-3 text-gray-600">{v.duration || '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{v.resourceId ? '已关联' : '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{new Date(v.createdAt).toLocaleDateString('zh-CN')}</td>
                  <td className="px-4 py-3 space-x-2">
                    <Link href={`/admin/videos/${v.id}/edit`} className="text-blue-600 hover:underline">编辑</Link>
                    <button onClick={() => setDeleteId(v.id)} className="text-red-600 hover:underline">删除</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-2">确认删除</h3>
            <p className="text-gray-600 mb-4">确定要删除这个视频吗？此操作不可撤销。</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 bg-gray-200 rounded-md text-sm hover:bg-gray-300">取消</button>
              <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700">删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
