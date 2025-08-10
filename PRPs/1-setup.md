# 这是一个什么样的项目

这是一个关于旅行的 AI Chatbot，这个 Chatbot 可以帮助用户回答关于旅行的话题，包括酒店的预定，航班的预定。

你可以参考: https://seats.aero/chat 这个项目

我设想的技术架构是这样的：

- 使用 Next.js 搭建整个项目，前后端放在一起开发
- 使用 ai-sdk library 搭建 chatbot 的 UI 界面和 AI 的相关逻辑（请判断是否需要 LangChain，LangGraph 之类的框架）
- 使用 TailwindCSS
- 使用 TypeScript
- 基于 TDD 的模式进行开发
- 使用 pnpm 进行包管理

# 在这个 task 中你需要做什么

> 在这个任务你主要负责搭建项目

- 使用 Next.js 进行项目初始化
- 首页即显示 Chatbot 的画面，给我一个基本的 Chatbot 的 UI，通过 AI SDK 来实现（？）
  - 暂时不需要实现 AI 交互的细节
- 使用 GitHub CLI 创建一个仓库，private，然后将本地仓库推送到远端（请记得更新 `.gitignore`)
- 所有初始化任务完成以后，更新 README.md 。将项目的基本内容进行更新
