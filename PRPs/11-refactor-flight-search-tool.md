# 现状

目前 @src/app/api/chat/route.ts 使用的 tool: flightSearch 主要是使用 SerpApi.

但是接下来，我希望可以将 SerpApi 替换为 PointsYeah 的 Search 和 Hotel 的 APIs.

# 期待

> 暂时将 SerpApi 相关的代码改名，文件中标注这个 API 的来源。

然后为 PointsYeah 的 flightSearch 和 hotelSearch 创建占位符的文件，相关的代码可以使用 placeholder 的方式实现.
