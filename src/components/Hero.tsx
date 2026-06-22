'use client'

import SearchBar from './SearchBar'

interface HeroProps {
  searchValue: string
  onSearchChange: (value: string) => void
}

export default function Hero({ searchValue, onSearchChange }: HeroProps) {
  return (
    <section className="bg-gradient-to-b from-white to-cream py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
          外贸人的 AI Agent 开源社区
        </h1>
        <p className="mt-4 md:mt-6 text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
          发现、下载和分享最实用的 AI Skills、Agent 和 MCP，助力跨境电商智能化升级
        </p>
        <div className="mt-8 max-w-xl mx-auto">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            placeholder="搜索资源、视频、帖子..."
          />
        </div>
      </div>
    </section>
  )
}
