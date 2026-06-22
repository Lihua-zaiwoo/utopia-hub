# Utopia Hub

外贸人的 AI Agent 开源社区 — AI Agent / Skills / MCP 分发与交流平台

## 项目简介

Utopia Hub 是面向外贸与跨境电商商家的 AI Agent 开源交流与分发平台。商家可以在这里发现、下载和使用 AI Skills、Agent 和 MCP 工具，观看教学视频，参与社区交流。

### 功能特性

- 📦 **资源市场** — 浏览、搜索、下载 AI Skills / Agent / MCP 资源
- 🎬 **教学视频** — 在线观看教程视频，快速上手
- 💬 **社区动态** — 获取最新资讯和使用心得
- 🔧 **管理后台** — 简洁的内容管理系统

## 快速开始

### 方式一：Docker 部署（推荐）

1. 克隆项目
```bash
git clone <repo-url>
cd utopia-hub
```

2. 配置环境变量
```bash
# 设置管理密码（可选，默认为 utopia2026）
export ADMIN_PASSWORD=your_secure_password
```

3. 启动服务
```bash
docker compose up -d
```

4. 访问网站
- 前台：http://localhost:3000
- 管理后台：http://localhost:3000/admin

### 方式二：本地开发

1. 安装依赖
```bash
npm install
```

2. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 设置 ADMIN_PASSWORD
```

3. 初始化数据库
```bash
npx prisma db push
npx prisma db seed
```

4. 启动开发服务器
```bash
npm run dev
```

5. 访问 http://localhost:3000

## 管理后台使用

1. 访问 `/admin` 路径
2. 输入管理密码（默认: `utopia2026`，可通过环境变量 `ADMIN_PASSWORD` 修改）
3. 登录后可以：
   - 查看统计数据（资源数、视频数、帖子数、总下载量）
   - 上传新资源（支持 .zip / .json / .yaml 等格式）
   - 上传教学视频（支持 mp4 格式）
   - 发布社区帖子（支持 Markdown 格式）
   - 编辑和删除已有内容

### 上传第一个资源

1. 进入管理后台 → 资源管理 → 新增资源
2. 填写名称、描述、选择分类
3. 上传资源文件（.zip / .json / .yaml）
4. 点击提交，前台即可看到新资源

### 上传第一个视频

1. 进入管理后台 → 视频管理 → 新增视频
2. 填写标题、描述
3. 上传视频文件（mp4 格式）
4. 可选：上传封面图片、填写时长、关联已有资源
5. 点击提交，前台视频页面即可播放

## 技术栈

| 技术 | 说明 |
|------|------|
| Next.js 14 | React 全栈框架 (App Router) |
| TypeScript | 类型安全 |
| Tailwind CSS | 原子化 CSS 框架 |
| Prisma | ORM + 数据库迁移 |
| SQLite | 轻量级数据库 |
| Docker | 容器化部署 |

## 项目结构

```
├── src/app/           # 页面和 API 路由
├── src/components/    # 可复用组件
├── src/lib/           # 工具函数和配置
├── prisma/            # 数据库 Schema 和种子数据
├── uploads/           # 上传文件存储
├── public/            # 静态资源
├── Dockerfile         # Docker 镜像构建
└── docker-compose.yml # Docker Compose 配置
```

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| DATABASE_URL | 数据库连接地址 | file:./dev.db |
| ADMIN_PASSWORD | 管理后台密码 | utopia2026 |
| NEXT_PUBLIC_SITE_NAME | 站点名称 | Utopia Hub |

## 许可证

MIT License © 2026 Utopia Hub
