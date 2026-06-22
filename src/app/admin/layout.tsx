'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const res = await fetch('/api/auth/check')
      const data = await res.json()
      setAuthenticated(data.authenticated)
    } catch {
      setAuthenticated(false)
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoggingIn(true)
    setLoginError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        setAuthenticated(true)
        setPassword('')
      } else {
        setLoginError('密码错误')
      }
    } catch {
      setLoginError('登录失败，请重试')
    } finally {
      setLoggingIn(false)
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setAuthenticated(false)
  }

  // Loading state
  if (authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F4F8]">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  // Login form
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F4F8]">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <h1 className="text-xl font-bold text-center mb-6 text-gray-800">Utopia Hub 管理后台</h1>
          <form onSubmit={handleLogin}>
            <label className="block text-sm font-medium text-gray-700 mb-2">管理密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              placeholder="请输入管理密码"
              required
            />
            {loginError && <p className="text-red-500 text-sm mb-4">{loginError}</p>}
            <button
              type="submit"
              disabled={loggingIn}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loggingIn ? '登录中...' : '登录'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Admin panel
  const navItems = [
    { href: '/admin', label: '概览', icon: '📊' },
    { href: '/admin/resources', label: '资源管理', icon: '📦' },
    { href: '/admin/videos', label: '视频管理', icon: '🎬' },
    { href: '/admin/posts', label: '帖子管理', icon: '📝' },
  ]

  return (
    <div className="min-h-screen flex bg-[#F0F4F8]">
      {/* Sidebar */}
      <aside className="w-56 bg-[#F0F4F8] border-r border-gray-200 flex flex-col min-h-screen">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-lg font-bold text-gray-800">Utopia Hub</h1>
          <p className="text-xs text-gray-500">管理后台</p>
        </div>
        <nav className="flex-1 p-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-1 ${
                  isActive ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="p-2 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
          >
            <span>🚪</span>
            <span>退出登录</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  )
}
