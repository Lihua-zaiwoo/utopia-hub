'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Hero from '@/components/Hero'

export default function HomeHero() {
  const [searchValue, setSearchValue] = useState('')
  const router = useRouter()

  const handleSearch = (value: string) => {
    setSearchValue(value)
    if (value.trim()) {
      router.push(`/resources?search=${encodeURIComponent(value.trim())}`)
    }
  }

  return <Hero searchValue={searchValue} onSearchChange={handleSearch} />
}
