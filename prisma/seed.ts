import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 清空现有数据
  await prisma.resource.deleteMany()
  await prisma.video.deleteMany()
  await prisma.post.deleteMany()

  // 创建示例资源
  await prisma.resource.create({
    data: {
      name: '智能选品 Agent',
      description: '帮助商家快速筛选热销品类，基于市场数据和趋势分析，自动推荐最具潜力的产品方向。',
      category: 'agent',
      tags: JSON.stringify(['选品', 'AI', '数据分析']),
      fileName: 'smart-product-agent.json',
      filePath: 'public/samples/smart-product-agent.json',
      fileSize: 2048000,
    },
  })

  await prisma.resource.create({
    data: {
      name: '多语言商品描述 Skill',
      description: '自动生成多语言商品标题和描述，支持英语、西班牙语、法语等主流外贸语言，让你的产品触达全球买家。',
      category: 'skill',
      tags: JSON.stringify(['多语言', '商品描述', '翻译']),
      fileName: 'multilang-description-skill.json',
      filePath: 'public/samples/multilang-description-skill.json',
      fileSize: 1024000,
    },
  })

  await prisma.resource.create({
    data: {
      name: '1688 采购数据 MCP',
      description: '连接 1688 平台获取实时采购数据，包括价格走势、供应商评级、最小起订量等关键信息。',
      category: 'mcp',
      tags: JSON.stringify(['1688', '采购', '数据接口']),
      fileName: '1688-procurement-mcp.json',
      filePath: 'public/samples/1688-procurement-mcp.json',
      fileSize: 3072000,
    },
  })

  // 创建示例视频
  await prisma.video.create({
    data: {
      title: 'Accio Work 快速上手教程',
      description: '本视频将带你快速了解如何使用 Accio Work 平台进行外贸业务自动化，从注册到第一个 Agent 运行仅需 10 分钟。',
      videoPath: 'uploads/videos/placeholder.mp4',
      duration: '10:30',
    },
  })

  // 创建示例帖子
  await prisma.post.create({
    data: {
      title: '欢迎来到 Utopia Hub',
      content: `# 欢迎来到 Utopia Hub

Utopia Hub 是一个面向外贸从业者的 AI Agent 开源资源社区。

## 我们提供什么？

- **Agent 资源**: 各种开箱即用的 AI Agent，帮助你自动化外贸工作流
- **Skill 技能包**: 可组合的技能模块，为你的 Agent 添加新能力
- **MCP 数据连接**: 连接各大平台的数据接口，让 Agent 获取实时信息
- **视频教程**: 从入门到精通的视频学习资源
- **社区交流**: 与其他外贸人分享经验和最佳实践

## 开始探索

浏览我们的资源库，找到适合你业务场景的 AI 工具，让工作更高效！
`,
    },
  })

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
