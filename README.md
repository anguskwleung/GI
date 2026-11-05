# 保險報價工作台

靜態網頁，保留上載版本的 Zurich／MSIG 旅遊保功能，新增 Zurich 家居／家傭文件參考報價、截圖模式，以及每類五段可編輯、可複製的 WhatsApp 範本。

## 使用

在 `/workspace/GI` 執行 `python3 -m http.server 8000 --bind 127.0.0.1`。亦可直接開啟 `index.html`，須保留旁邊的 JS、CSS 及 documents 目錄。毋須安裝依賴、設定金鑰或後端服務。

產生單檔離線版本：`python3 build-standalone.py`。輸出為 `/workspace/Insurance_Quote_Tool.html`，包含所有產品 PDF，可直接開啟及分享。新增報價及範本沒有上傳或持久儲存客戶資料。

## 來源及計價範圍

- 旅遊：沿用用戶提供的 `Travel_Insurance_Quote_Tool.html` 計算與內嵌 PDF；未重新認證現行費率。
- 家居：`documents/zurich-home.pdf`，ZHM-001-08-2026C-02，第2–3頁。標準計劃按實用／建築面積分九級；可加樓宇、車位、電動車充電設施責任。來源未明示徵費是否已包含，因此只列保費表小計。全球個人物品、藝術品、自訂計劃須個別報價。
- 家傭：`documents/zurich-helper.pdf`，ZPP-003-04-2021，第3–4頁。綜合計劃一年946／兩年1798；心臟病及癌症標準附加150／300，特級300／600；本地鐘點僱員補償一年350。每位計算，文件列明含徵費。屬歷史文件價，須確認現行費率。
- 家傭申請資料：`documents/zurich-helper-form.pdf`，ZDH-AGT-EF-07-2021；範本分報價與投保階段，敏感證件與付款須循安全渠道。
- 未提供 MSIG 家居／家傭費率，沒有推算或虛構對應報價。「火險」按一般樓宇保險解釋。

## 驗證

`node tests/browser.cjs` 使用環境既有 Playwright 及 `/usr/bin/chromium`，須先在8000埠啟動靜態服務。檢查所有面積級距邊界、附加項目、家傭年期組合、輸入驗證、截圖模式、範本編輯／複製、原旅遊 Zurich／MSIG 流程及390px手機版溢出。測試不改正式程式資料。

每個雲端工作已有隔離環境，沿用現有 checkout，毋須另建 Git worktree。
