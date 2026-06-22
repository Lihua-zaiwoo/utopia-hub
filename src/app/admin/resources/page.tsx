'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Resource {
  id: string
  name: string
  category: string
  downloads: number
  createdAt: string
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchResources()
  }, [])

  async function fetchResources() {
    try {
      const res = await fetch('/api/resources')
      const data = await res.json()
      setResources(Array.isArray(data) ? data : [])
    } catch {
      setMessage('获取资源列表失败')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/resources/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setResources(resources.filter((r) => r.id !== id))
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
        <h2 className="text-2xl font-bold text-gray-800">资源管理</h2>
        <Link
          href="/admin/resources/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
        >
          新增资源
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
              <th className="text-left px-4 py-3 font-medium text-gray-600">名称</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">分类</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">下载次数</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">创建时间</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {resources.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">暂无资源</td></tr>
            ) : (
              resources.map((r, i) => (
                <tr key={r.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-gray-800">{r.name}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">{r.category}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{r.downloads}</td>
                  <td className="px-4 py-3 text-gray-600">{new Date(r.createdAt).toLocaleDateString('zh-CN')}</td>
                  <td className="px-4 py-3 space-x-2">
                    <Link href={`/admin/resources/${r.id}/edit`} className="text-blue-600 hover:underline">编辑</Link>
                    <button onClick={() => setDeleteId(r.id)} className="text-red-600 hover:underline">删除</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-2">确认删除</h3>
            <p className="text-gray-600 mb-4">确定要删除这个资源吗？此操作不可撤销。</p>
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
