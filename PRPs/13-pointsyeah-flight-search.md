# explore

> 以下是 pointsyeah 的 flight search 的查询方式

curl 'https://api.pointsyeah.com/v2/beta/explorer/search' \
  -H 'accept: */*' \
  -H 'accept-language: en-US,en;q=0.9' \
  -H 'authorization: eyJraWQiOiI2cDVBaGlIVU5hM21XcWxYeDNRNENtbDZXbFBlZ0IwM0ZuYklpekRWWGJZPSIsImFsZyI6IlJTMjU2In0.eyJleHRyYV91c2VybmFtZSI6IiIsInN1YiI6ImRkOGZlZDY2LWQxZTItNDA0Mi05ZWUwLTczNDUzZDY2YzFmOSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9YOGJXamJDWkYiLCJjb2duaXRvOnVzZXJuYW1lIjoiZGQ4ZmVkNjYtZDFlMi00MDQyLTllZTAtNzM0NTNkNjZjMWY5Iiwiam9pbmVkX2F0IjoiMjAyNC0wMi0wMSIsIm9yaWdpbl9qdGkiOiJiZGVlOTU2YS0xNjk1LTQyZDgtODZkZC03NjhjNmRlNTBlNWMiLCJhdWQiOiIzaW04anJlbnR0czFwZ3V1b3V2NXM1N2dmdSIsImV2ZW50X2lkIjoiOWRlMDg0MzAtNDBhOC00M2UzLTg0ZGMtMDhmNDkyZjEyNjM3Iiwiam9pbmVkX2F0X3RpbWVzdGFtcCI6IjE3MDY3OTYyOTUiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTc1MzE0NDgzMiwiZXhwIjoxNzU0OTY3Mjc4LCJvdGhlcl91c2VybmFtZXMiOiIiLCJpYXQiOjE3NTQ5NjM2NzksImp0aSI6IjFmYjI1YmQ4LWY3NzktNDdhMi1iNjhlLWI3MzkwOGIyMmQ1YiIsImVtYWlsIjoid2FuZ3lvbmdibzkwK3BvaW50c3llYWgyQGdtYWlsLmNvbSJ9.o--7dVxeq0nTlL4fEUoZ3v3yO0ovX9KNcseFTIRO7oh8Om0mtgemPtha9JEym50H8L1fOmB6h0C5k2OkNGMcOnB5RAWFNja0rplmGPrmK9HsTETPaHrtOxzwI17EtNaOHCfl6k9GFAXKRYXeUueKvxQZxwANbJSWnm719cksuqCR5WfXMIbjalY0ekCpLVL2gXUQljbTvyU6trXXeoh229d-PHo9XT8uiPPOq8Bf8PU12tkCkMEzb4-LIe10gJP-UfpQtKCBXE7aH9gWniarTaY4sNfJO37Jct60mY8GPgfzaxZX-80vc_ZE7YWqXNw24i1oDQu2SqjlP7ZwZqXVaQ' \
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
  --data-raw '{"departure":{"airports":["SAN"],"continents":[],"countries":[],"regions":[],"states":[]},"arrival":{"anywhere":true},"start_date":"2025-08-13","end_date":"2025-10-12","banks":["Amex","Chase","Citi"],"programs":["AC","AM","AV","B6","DL","EK","EY","IB","KL","QF","TK","UA","VS"],"cabins":["Economy","Premium Economy","Business","First"],"premium_cabin_percentage":60,"trip":"","sort":"miles","pagination":{"page":1,"page_size":17},"seats":1,"weekend_only":false,"collection":true}'


以下是 response 的数据（截取了前两条)

```javascript
{
  total: 3584
  results: [
  {
    "program": "DL",
    "departure_date": "2025-08-24",
    "departure": {
      "code": "SAN",
      "city": "San Diego, CA",
      "country_name": "United States",
      "longitude": -117.183333,
      "latitude": 32.733333
    },
    "arrival": {
      "code": "LAS",
      "city": "Las Vegas, NV",
      "country_name": "United States",
      "longitude": -115.166667,
      "latitude": 36.083333
    },
    "miles": 4200,
    "tax": 5.6,
    "cabin": "Economy",
    "detail_url": "https://dr8zs5wv9gtw3.cloudfront.net/2025-08-06/2025-08-24/SAN/LAS/DL_160e036f2a51a643d5f60a32ce7cd8eb_1754441972.json",
    "stops": 0,
    "seats": 3,
    "duration": 94,
    "premium_cabin_percentage": 0,
    "created_at": 1754441972969,
    "updated_at": 1754441972969,
    "transfer": [
      {
        "bank": "American Exp Membership Rewards",
        "bonus_percentage": 0,
        "url": "https://global.americanexpress.com/rewards/transfer",
        "code": "Amex"
      }
    ],
    "img": "https://d54op9z1b1dar.cloudfront.net/city/iStock-614973464.jpg"
  },
  {
    "program": "VS",
    "departure_date": "2025-08-28",
    "departure": {
      "code": "SAN",
      "city": "San Diego, CA",
      "country_name": "United States",
      "longitude": -117.183333,
      "latitude": 32.733333
    },
    "arrival": {
      "code": "LAX",
      "city": "Los Angeles, CA",
      "country_name": "United States",
      "longitude": -118.407222,
      "latitude": 33.9425
    },
    "miles": 7500,
    "tax": 5.6,
    "cabin": "Economy",
    "detail_url": "https://dr8zs5wv9gtw3.cloudfront.net/2025-08-05/2025-08-28/SAN/LAX/VS_ced294a710bc9ea171fbbdb5cb3b1d6a_1754424343.json",
    "stops": 0,
    "seats": 9,
    "duration": 68,
    "premium_cabin_percentage": 0,
    "created_at": 1754424343664,
    "updated_at": 1754424343664,
    "transfer": [
      {
        "bank": "American Exp Membership Rewards",
        "bonus_percentage": 0,
        "url": "https://global.americanexpress.com/rewards/transfer",
        "code": "Amex"
      },
      {
        "bank": "Bilt",
        "bonus_percentage": 0,
        "url": "https://www.biltrewards.com/",
        "code": "Bilt"
      },
      {
        "bank": "Capital One",
        "bonus_percentage": 0,
        "url": "https://www.capitalone.com/",
        "code": "Capital One"
      },
      {
        "bank": "Chase Ultimate Rewards",
        "bonus_percentage": 0,
        "url": "https://secure04ea.chase.com/web/auth/?logoff&TYPE=33554433&REALMOID=06-000e6ca5-b42c-1bd0-b819-cce1a9625a5a&GUID=&SMAUTHREASON=0&METHOD=GET&SMAGENTNAME=-SM-oGaiSECBzNLCwnS387KA80b5qOTasvG9QJ2jaJFaB2Pe%2bKUGU%2b3DP7%2f%2b4Ugtd1hZ8E%2bgjFwxDdAYoKVA6XSHpJmKebQTOJmL&TARGET=-SM-https%3a%2f%2fultimaterewardspoints%2echase%2ecom%2ftransfer--points%2flist--programs#/logon/logon/chaseOnline",
        "code": "Chase"
      },
      {
        "bank": "Citi Thank You Points",
        "bonus_percentage": 0,
        "url": "https://www.thankyou.com/partnerProgramsListing.htm",
        "code": "Citi"
      },
      {
        "bank": "WF",
        "bonus_percentage": 0,
        "url": "https://www.wellsfargo.com/rewards/",
        "code": "WF"
      }
    ],
    "img": "https://d54op9z1b1dar.cloudfront.net/city/iStock-1456420710.jpg"
  }
  ]
}
```


# 期待

参考上面的 API 来实现 @src/lib/pointsyeah/flight-api.ts 以及新的 @src/lib/pointsyeah/flight-tool.ts.

请不要拘泥于旧的 SerpAPI 的实现，不要固守于原来的 type interface ，你应该将上面的所有参数都当做用户可以输入的查询参数.

如果你觉得需求不合理，请直接告诉我.
