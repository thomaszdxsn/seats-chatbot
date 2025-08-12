# explore

> 以下是 pointsyeah 的 hotel search 的查询方式

curl 'https://api.pointsyeah.com/v2/beta/hotel/explorer/search' \
 -H 'accept: _/_' \
 -H 'accept-language: en-US,en;q=0.9' \
 -H 'authorization: eyJraWQiOiI2cDVBaGlIVU5hM21XcWxYeDNRNENtbDZXbFBlZ0IwM0ZuYklpekRWWGJZPSIsImFsZyI6IlJTMjU2In0.eyJleHRyYV91c2VybmFtZSI6IiIsInN1YiI6ImRkOGZlZDY2LWQxZTItNDA0Mi05ZWUwLTczNDUzZDY2YzFmOSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9YOGJXamJDWkYiLCJjb2duaXRvOnVzZXJuYW1lIjoiZGQ4ZmVkNjYtZDFlMi00MDQyLTllZTAtNzM0NTNkNjZjMWY5Iiwiam9pbmVkX2F0IjoiMjAyNC0wMi0wMSIsIm9yaWdpbl9qdGkiOiJiZGVlOTU2YS0xNjk1LTQyZDgtODZkZC03NjhjNmRlNTBlNWMiLCJhdWQiOiIzaW04anJlbnR0czFwZ3V1b3V2NXM1N2dmdSIsImV2ZW50X2lkIjoiOWRlMDg0MzAtNDBhOC00M2UzLTg0ZGMtMDhmNDkyZjEyNjM3Iiwiam9pbmVkX2F0X3RpbWVzdGFtcCI6IjE3MDY3OTYyOTUiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTc1MzE0NDgzMiwiZXhwIjoxNzU0OTg1OTA0LCJvdGhlcl91c2VybmFtZXMiOiIiLCJpYXQiOjE3NTQ5ODIzMDQsImp0aSI6IjUyMDRmNTMyLTUyYTYtNDU4Ny04OGZkLWJkNTliY2RjNDUwYyIsImVtYWlsIjoid2FuZ3lvbmdibzkwK3BvaW50c3llYWgyQGdtYWlsLmNvbSJ9.fvn8ezQUBuqtWjS_WH_jJ0Zc30J7ElL2eHzKMgru7Kp_qhRmW6TQNhhzq95CEBPt5XS6yFutj1vOVp-jssylDNYL_9Q-ibDYpytej0hoXldjQsAyXa5w1g9ZkX7VRwRgi-0fzpDmj-DiJwszeXTxqfGs1mMqgzGv9fAqTri9zoEuyYq_RRsrH9jH07x0LX-hUtL80FSBNO1JWQKO9lZ2EVuKClGgiY1hzgbJloEZuAeUOlkX6fRP7dSe3FKbxMb49Rw2DAzY6gFuCPyxE9Rlfk-PY1J6XgSReP4HLPx8qFu7RFOcRNLLSsMCprifn2qw4CvTezGLENyRwzgNFl8XCg' \
 -H 'content-type: text/plain;charset=UTF-8' \
 -H 'origin: https://beta.pointsyeah.com' \
 -H 'priority: u=1, i' \
 -H 'referer: https://beta.pointsyeah.com/' \
 -H 'sec-ch-ua: "Not)A;Brand";v="8", "Chromium";v="138"' \
 -H 'sec-ch-ua-mobile: ?0' \
 -H 'sec-ch-ua-platform: "macOS"' \
 -H 'sec-fetch-dest: empty' \
 -H 'sec-fetch-mode: cors' \
 -H 'sec-fetch-site: same-site' \
 -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36' \
 --data-raw '{"location":{},"start_date":"2025-08-12","end_date":"2025-10-11","weekend_only":false,"holiday_only":false,"max_points":0,"max_prices":0,"suit_only":false,"amenities":["pet_friendly","free_parking","free_airports_shuttle","resort","amazing_bathtub","all_inclusive","infinite_pool","plunge_pool","kids_club","water_slide","golf","city_center","club_lounge"],"programs":["hilton","hyatt","ihg","marriott"],"free_night_certificate":[],"sort":"cpp","tag":[],"banks":["Amex","Bilt","Capital One","Chase","Citi","WF"],"pagination":{"page_size":17,"page":1}}'

以下是 response 的数据（截取了前两条)

```javascript

{
  code: 0,
  data: {
    total: 1686,
    results: [
      {
        "points": 45000,
        "cash_price": 2559,
        "room_type": "Standard Room",
        "property": {
          "ota": [],
          "code": "sjcal",
          "name": "Alila Ventana Big Sur",
          "tags": [
            "Mountain",
            "Unique Hotels",
            "Romance"
          ],
          "brand": {
            "code": "ALILA",
            "name": "Alila"
          },
          "image": "https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2019/02/20/1257/Ventana-Big-Sur-an-Alila-Resort-P015-The-Sur-House-Terrace.jpg/Ventana-Big-Sur-an-Alila-Resort-P015-The-Sur-House-Terrace.4x3.jpg",
          "program": "hyatt",
          "calendar": true,
          "category": "8",
          "location": {
            "city": "Big Sur",
            "address": "48123 Hwy 1, Big Sur, United States",
            "country": "United States",
            "latitude": 36.229167,
            "longitude": -121.760353,
            "country_code": "US"
          },
          "amenities": [
            "pet_friendly",
            "free_parking",
            "resort"
          ],
          "property_id": 30001
        },
        "featured": true,
        "transfer": [
          {
            "bank": "Bilt",
            "bonus_percentage": 0,
            "url": "https://www.biltrewards.com/",
            "code": "Bilt"
          },
          {
            "bank": "Chase Ultimate Rewards",
            "bonus_percentage": 0,
            "url": "https://secure04ea.chase.com/web/auth/?logoff&TYPE=33554433&REALMOID=06-000e6ca5-b42c-1bd0-b819-cce1a9625a5a&GUID=&SMAUTHREASON=0&METHOD=GET&SMAGENTNAME=-SM-oGaiSECBzNLCwnS387KA80b5qOTasvG9QJ2jaJFaB2Pe%2bKUGU%2b3DP7%2f%2b4Ugtd1hZ8E%2bgjFwxDdAYoKVA6XSHpJmKebQTOJmL&TARGET=-SM-https%3a%2f%2fultimaterewardspoints%2echase%2ecom%2ftransfer--points%2flist--programs#/logon/logon/chaseOnline",
            "code": "Chase"
          }
        ],
        "updated_at": 1754052379
      },
      {
        "points": 25000,
        "cash_price": 788,
        "room_type": "Standard Room",
        "property": {
          "ota": [],
          "code": "mldal",
          "name": "Alila Kothaifaru Maldives",
          "tags": [
            "Beach",
            "Romance"
          ],
          "brand": {
            "code": "ALILA",
            "name": "Alila"
          },
          "image": "https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2022/03/07/0316/MLDAL-P0002-Beach-View.jpg/MLDAL-P0002-Beach-View.4x3.jpg",
          "program": "hyatt",
          "calendar": true,
          "category": "7",
          "location": {
            "city": "Raa Atoll",
            "address": "Kothaifaru, Raa Atoll, Maldives",
            "country": "Maldives",
            "latitude": 5.523287,
            "longitude": 72.842758,
            "country_code": "MV"
          },
          "amenities": [
            "resort"
          ],
          "property_id": 29577
        },
        "featured": true,
        "transfer": [
          {
            "bank": "Bilt",
            "bonus_percentage": 0,
            "url": "https://www.biltrewards.com/",
            "code": "Bilt"
          },
          {
            "bank": "Chase Ultimate Rewards",
            "bonus_percentage": 0,
            "url": "https://secure04ea.chase.com/web/auth/?logoff&TYPE=33554433&REALMOID=06-000e6ca5-b42c-1bd0-b819-cce1a9625a5a&GUID=&SMAUTHREASON=0&METHOD=GET&SMAGENTNAME=-SM-oGaiSECBzNLCwnS387KA80b5qOTasvG9QJ2jaJFaB2Pe%2bKUGU%2b3DP7%2f%2b4Ugtd1hZ8E%2bgjFwxDdAYoKVA6XSHpJmKebQTOJmL&TARGET=-SM-https%3a%2f%2fultimaterewardspoints%2echase%2ecom%2ftransfer--points%2flist--programs#/logon/logon/chaseOnline",
            "code": "Chase"
          }
        ],
        "updated_at": 1754562046
      }
    ]
  }
}
```

# Plan

> 你的任务是为 AI 实现一个新的 tool: hotelSearch.

相关的代码你可以参考

- @src/lib/pointsyeah/hotel-tool.ts
- @src/lib/pointsyeah/hotel-api.ts

你应该参考 pointsyeah flight search 的实现，完全使用 pointsyeah hotel search 的原始数据，然后前端基于原始数据进行渲染.
