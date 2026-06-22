import { PrismaClient } from '@prisma/client'
import path from 'path'
import fs from 'fs'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getDatabaseUrl(): string {
  // 在 Vercel 环境中，将数据库复制到 /tmp
  if (process.env.VERCEL) {
    const tmpDbPath = '/tmp/utopia.db'
    
    // 如果 /tmp 中不存在数据库，从部署包中复制
    if (!fs.existsSync(tmpDbPath)) {
      const sourceDb = path.join(process.cwd(), 'prisma', 'dev.db')
      if (fs.existsSync(sourceDb)) {
        fs.copyFileSync(sourceDb, tmpDbPath)
      }
    }
    
    return `file:${tmpDbPath}`
  }
  
  // 本地开发使用环境变量
  return process.env.DATABASE_URL || 'file:./dev.db'
}

const databaseUrl = getDatabaseUrl()

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
