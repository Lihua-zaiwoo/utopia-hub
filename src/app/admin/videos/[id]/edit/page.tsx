'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

interface Resource {
  id: string
  name: string
}

export default function EditVideoPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [form, setForm] = useState({
    title: '',
    description: '',
    duration: '',
    resourceId: '',
  })
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([fetchVideo(), fetchResources()])
  }, [id])

  async function fetchVideo() {
    try {
      const res = await fetch(`/api/videos/${id}`)
      if (!res.ok) throw new Error('视频不存在')
      const data = await res.json()
      setForm({
        title: data.title || '',
        description: data.description || '',
        duration: data.duration || '',
        resourceId: data.resourceId || '',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }

  async function fetchResources() {
    try {
      const res = await fetch('/api/resources')
      const data = await res.json()
      setResources(Array.isArray(data) ? data : [])
    } catch {
      // ignore
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      let videoPath: string | undefined
      let coverPath: string | undefined

      // Upload new video if provided
      if (videoFile) {
        const videoFormData = new FormData()
        videoFormData.append('file', videoFile)
        videoFormData.append('type', 'video')
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: videoFormData })
        if (!uploadRes.ok) throw new Error('视频上传失败')
        const data = await uploadRes.json()
        videoPath = data.filePath
      }

      // Upload new cover if provided
      if (coverFile) {
        const coverFormData = new FormData()
        coverFormData.append('file', coverFile)
        coverFormData.append('type', 'cover')
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: coverFormData })
        if (uploadRes.ok) {
          const data = await uploadRes.json()
          coverPath = data.filePath
        }
      }

      const body: Record<string, unknown> = {
        title: form.title,
        description: form.description,
        duration: form.duration || null,
        resourceId: form.resourceId || null,
      }
      if (videoPath) body.videoPath = videoPath
      if (coverPath) body.coverPath = coverPath

      const res = await fetch(`/api/videos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        router.push('/admin/videos')
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">编辑视频</h2>

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
          <label className="block text-sm font-medium text-gray-700 mb-1">描述 *</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">时长</label>
          <input
            type="text"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="例如: 05:30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">关联资源</label>
          <select
            value={form.resourceId}
            onChange={(e) => setForm({ ...form, resourceId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">不关联</option>
            {resources.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">替换封面（可选）</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">替换视频文件（可选）</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
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
            onClick={() => router.push('/admin/videos')}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md text-sm hover:bg-gray-300"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  )
}
