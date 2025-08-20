我觉得现在的 system prompt 没有达到我的期望，需要优化。

我想要达到 seats.aero 和 Kayak.ai 的效果，你可以根据我提供的 chat demo 来反向推断他们的 system prompt 。

最后，优化我们的 system prompt，使其更加符合我们的需求。

# Seats Aero

```
user: 你好

bot:

你好！我是 Aero，你的航空里程/兑换航班助手。我可以帮你查里程票、比对兑换方案、设提醒或帮你规划点数可用的行程。请告诉我你想做什么，例如：

查从哪个城市（或机场）到哪个城市、哪天出发的里程票？
需要哪个舱位（经济/高级/商务/头等）或偏好的航空公司/里程计划？
想用哪些可转点数（Amex/Chase/Capital One 等）？
需要我帮你设价格提醒或搜索酒店？
随便用中文描述你的行程需求，我会立刻开始查。

user: 我想要从伦敦去芝加哥，明天

I'm thinking about how to present the results effectively. I need to include the mileage program and operating carrier for each option, while quoting prices in points and listing durations in a friendly way. Taxes might be important too, but since the instruction says to quote prices only in points or miles, I'll avoid mentioning cash costs directly. However, I can include taxes if it's useful. A top options table in Markdown sounds great! I'll also consider providing booking next steps concisely.

下面是我为 2025-08-21（明天）从伦敦 (LON: LHR/LGW/LTN/STN/LCY) → 芝加哥 (CHI: ORD/MDW) 搜到的主要里程票选项（单程，经济舱）。我只列出工具返回的前几条最有代表性的结果；还有更多可用结果，我可以继续展开或改为搜索其他舱位/里程计划。

注意：

我只列出里程（points/miles）与里程计划，并用友好格式显示飞行时长。
工具也返回了机票税费与剩余座位信息；里程显示在下表中，税费以便参考（USD）。
若要预订，请告诉我你想要哪一班，我可以为你继续操作（或生成预订步骤）。
主要结果（按出发时间排序）：

出发（本地） → 到达（本地）	航段（航班号）	里程价格（points/miles）	里程计划	运营承运人	飞机型号	时长
2025-08-21 06:15 → 15:00 (LHR→ORD)	AF1381, AF136	158,000 miles	Smiles (GOL Smiles)	Air France (AF)	A220 → A350-900	14h 45m
2025-08-21 06:30 → 14:10 (LHR→ORD)	KL1000, KL611	158,000 miles	Smiles (GOL Smiles)	KLM (KL)	A320 → B787-10	13h 40m
2025-08-21 07:30 → 17:50 (LHR→ORD)	AY1340, AY9	35,000 miles	Alaska Mileage Plan	Finnair (AY)	A321 → A330-300	16h 20m
2025-08-21 08:00 → 14:55 (LHR→ORD)	UA883, UA2053	63,000 miles	United MileagePlus	United Airlines (UA)	B767-300 → A321neo	12h 55m
2025-08-21 08:00 → 21:56 (LHR→ORD)	UA883, UA546	63,000 miles	United MileagePlus	United Airlines (UA)	B767-300 → B737-900	19h 56m
额外信息（来自工具）：

税费（仅供参考）：例——AF 航班税费 $448.30；AY（Finnair via Alaska）税费 $191.91；United 选项税费约 $215.61。
剩余座位：部分航班显示仅剩 1 席（例如 Finnair via Alaska 的 35,000-mile 票），United 航段多为 9 席可用。
我只返回了前 10 条结果；工具提示还有 ~231 条结果可查。
接下来我可以为你做的事（选其一）：

直接为你尝试预订你选中的那一班（我会使用内部步骤并给出具体操作说明）。
展开更多结果（例如只看直飞/减少中转、或搜索商务舱/头等）。
如果你偏好某个里程计划（如想用 Alaska/United/Avios/Amex 可转点等），我可以把搜索限定到该计划并显示最佳选项。
检查从特定伦敦机场出发（例如仅 LHR）或到 MDW（Midway）的结果。
你希望我现在为哪一班继续（或想改搜索条件，例如舱位/里程计划/直飞优先）？
```

## Kayak AI

> 相比起来，我觉得 Kayak 的回答比较粗糙. 还是更多按照 seats aero 那样更好.

```
user: 你好

bot: I am sorry, I am not able to help you with that.

user: 明天我想要从伦敦去芝加哥

bot: You want to fly from London to Chicago tomorrow. Could you tell me when you plan to return to London? That way, I can find the best round-trip options for you. If you only need a one-way ticket, just let me know.

user: 单程机票即可

bot: Flight results ....
```
