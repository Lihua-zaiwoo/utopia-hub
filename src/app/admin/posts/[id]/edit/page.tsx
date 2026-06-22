'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [form, setForm] = useState({
    title: '',
    content: '',
    coverImage: '',
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPost()
  }, [id])

  async function fetchPost() {
    try {
      const res = await fetch(`/api/posts/${id}`)
      if (!res.ok) throw new Error('帖子不存在')
      const data = await res.json()
      setForm({
        title: data.title || '',
        content: data.content || '',
        coverImage: data.coverImage || '',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          content: form.content,
          coverImage: form.coverImage || null,
        }),
      })

      if (res.ok) {
        router.push('/admin/posts')
      } else {
        const err = await res.json()
        throw new Error(err.error || '更新失败')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="text-gray-500">加载中...</div>

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">编辑帖子</h2>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">标题 *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">内容（Markdown）*</label>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-64"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">封面图片 URL（可选）</label>
          <input
            type="text"
            value={form.coverImage}
            onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? '保存中...' : '保存'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/posts')}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md text-sm hover:bg-gray-300"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  )
}
