# Travel Chatbot

一个基于 Next.js 开发的智能旅行助手聊天机器人，可以帮助用户进行酒店预订、航班查询等旅行相关服务。

## 项目概述

这是一个旅行主题的 AI Chatbot 项目，参考 [seats.aero/chat](https://seats.aero/chat) 设计理念，提供智能化的旅行咨询服务。

## 技术栈

- **前端框架**: Next.js 15 with App Router
- **语言**: TypeScript
- **样式**: TailwindCSS
- **AI 集成**: AI SDK with Google Gemini
- **开发模式**: Test-Driven Development (TDD)

## 功能特性

- 🤖 智能聊天界面
- 🎨 响应式设计，支持暗色模式
- ✈️ 旅行相关咨询（航班、酒店）
- 🔄 实时消息交互
- 📱 移动端适配

## 开发环境

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 环境变量

创建 `.env.local` 文件并配置必要的环境变量：

```bash
# Google AI API Key
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

## 项目结构

```
seats-chatbot/
├── src/
│   └── app/
│       ├── page.tsx          # 主聊天界面
│       ├── layout.tsx        # 应用布局
│       └── globals.css       # 全局样式
├── public/                   # 静态资源
├── PRPs/                     # 项目需求文档
└── README.md
```

## 开发计划

- [x] 项目初始化和基础 UI
- [ ] 集成 Gemini AI
- [ ] 实现旅行相关功能
- [ ] 添加酒店预订功能
- [ ] 添加航班查询功能
- [ ] 完善测试覆盖

## 部署

推荐使用 [Vercel](https://vercel.com) 进行部署：

```bash
npm run build
```

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License
