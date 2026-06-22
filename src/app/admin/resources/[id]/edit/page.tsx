'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function EditResourcePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'skill',
    tags: '',
    instruction: '',
  })
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchResource()
  }, [id])

  async function fetchResource() {
    try {
      const res = await fetch(`/api/resources/${id}`)
      if (!res.ok) throw new Error('资源不存在')
      const data = await res.json()
      let tags = ''
      try {
        const parsed = JSON.parse(data.tags || '[]')
        tags = Array.isArray(parsed) ? parsed.join(', ') : ''
      } catch {
        tags = ''
      }
      setForm({
        name: data.name || '',
        description: data.description || '',
        category: data.category || 'skill',
        tags,
        instruction: data.instruction || '',
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
      let fileData = {}

      // If new file selected, upload it first
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', 'resource')

        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
        if (!uploadRes.ok) {
          const err = await uploadRes.json()
          throw new Error(err.error || '文件上传失败')
        }
        const { filePath, fileName, fileSize } = await uploadRes.json()
        fileData = { filePath, fileName, fileSize }
      }

      const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean)
      const res = await fetch(`/api/resources/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          category: form.category,
          tags,
          instruction: form.instruction || null,
          ...fileData,
        }),
      })

      if (res.ok) {
        router.push('/admin/resources')
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">编辑资源</h2>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">名称 *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">描述 *</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">分类 *</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="skill">Skill</option>
            <option value="agent">Agent</option>
            <option value="mcp">MCP</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">标签（逗号分隔）</label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">安装说明（Markdown）</label>
          <textarea
            value={form.instruction}
            onChange={(e) => setForm({ ...form, instruction: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">替换文件（可选）</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-xs text-gray-500 mt-1">不选择文件则保留原文件</p>
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
            onClick={() => router.push('/admin/resources')}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md text-sm hover:bg-gray-300"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  )
}
