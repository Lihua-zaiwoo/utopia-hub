'use client'

import { Suspense } from 'react'
import ResourcesContent from './ResourcesContent'

export default function ResourcesPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">资源市场</h1>
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-2 border-sky border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-sm text-gray-500">加载中...</p>
        </div>
      </div>
    }>
      <ResourcesContent />
    </Suspense>
  )
}
