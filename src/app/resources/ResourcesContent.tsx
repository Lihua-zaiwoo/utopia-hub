'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ResourceCard from '@/components/ResourceCard'
import SearchBar from '@/components/SearchBar'

interface Resource {
  id: string
  name: string
  description: string
  category: string
  tags: string
  downloads: number
  createdAt: string
}

const categories = [
  { value: '', label: '全部' },
  { value: 'skill', label: 'Skill' },
  { value: 'agent', label: 'Agent' },
  { value: 'mcp', label: 'MCP' },
]

export default function ResourcesContent() {
  const searchParams = useSearchParams()
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState(searchParams.get('search') || '')

  useEffect(() => {
    fetchResources()
  }, [category, search])

  async function fetchResources() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category) params.set('category', category)
      if (search) params.set('search', search)
      const res = await fetch(`/api/resources?${params.toString()}`)
      const data = await res.json()
      setResources(data)
    } catch (error) {
      console.error('Failed to fetch resources:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">资源市场</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                category === cat.value
                  ? 'bg-sky text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="sm:ml-auto w-full sm:w-64">
          <SearchBar value={search} onChange={setSearch} placeholder="搜索资源..." />
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-2 border-sky border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-sm text-gray-500">加载中...</p>
        </div>
      ) : resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              id={resource.id}
              name={resource.name}
              description={resource.description}
              category={resource.category}
              tags={resource.tags}
              downloads={resource.downloads}
              createdAt={resource.createdAt}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="mt-4 text-gray-500">没有找到相关资源</p>
        </div>
      )}
    </div>
  )
}
