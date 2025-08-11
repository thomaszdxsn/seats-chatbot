# Explore

目前来说 @src/lib/flight-tool.ts 要求输入的 `departure` 和 `arrival` 均要求为 IATA 代码。

但是用户很难这么输入，因此我们希望提供一个 iata 的 tool（不确定？），可以自动将用户的输入转换为 IATA 代码。

# Plan

> 以下是我的规划，但是您可以自行决定正确的方案

- 通过网络下载 IATA 的映射表
- 将映射表以 JSON 的格式存储在本地
- 让 LLM 可以了解这个映射表，然后将用户的输入转换为 IATA 代码
- 有必要做一个 iata 的 tool，或者直接将 IATA 映射存入 system prompt 中？
