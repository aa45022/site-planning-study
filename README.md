# 敷地計畫與都市設計 — 建築師考試申論題知識庫

## 🚀 Zeabur 部署步驟

### 第一步：準備 GitHub 倉庫

1. 去 [github.com](https://github.com) 建立一個新的 Repository
   - 名稱建議：`site-planning-study`
   - 設為 **Private**（你不想讓原始碼公開）

2. 把這個資料夾推到 GitHub：
```bash
cd site-planning
git init
git add .
git commit -m "初始化專案"
git branch -M main
git remote add origin https://github.com/你的帳號/site-planning-study.git
git push -u origin main
```

### 第二步：部署到 Zeabur

1. 前往 [zeabur.com](https://zeabur.com) 登入（可用 GitHub 帳號）
2. 點「New Project」建立新專案
3. 點「Deploy New Service」→「Git Repository」
4. 選擇你剛推上去的 `site-planning-study`
5. Zeabur 會自動偵測為 Node.js 專案

### 第三步：設定環境變數

在 Zeabur 的 Service 設定中，新增以下環境變數：

| 變數名稱 | 值 | 說明 |
|---------|---|------|
| `ADMIN_PASSWORD` | `你自訂的密碼` | 管理後台密碼 |
| `PORT` | `3001` | 伺服器埠號（Zeabur 通常會自動處理） |

### 第四步：綁定域名

1. 在 Service 裡點「Networking」
2. Zeabur 會給你一個 `.zeabur.app` 的免費域名
3. 如果有自己的域名，點「Custom Domain」設定

### 完成！🎉

- 訪客瀏覽：`你的域名.zeabur.app`
- 管理後台：`你的域名.zeabur.app/?admin`
- 或在任何頁面按 `Ctrl + Shift + L`

---

## 📁 專案結構

```
site-planning/
├── index.html          # 入口 HTML
├── package.json        # 依賴與腳本
├── vite.config.js      # Vite 設定
├── server/
│   └── index.js        # Express 後端（API + 靜態檔案）
├── data/
│   ├── seed.json       # 種子資料（初始範例）
│   ├── sp-topics.json  # 實際資料（自動產生，已 gitignore）
│   ├── sp-settings.json
│   └── sp-bookmarks.json
└── src/
    ├── main.jsx        # React 進入點
    └── App.jsx         # 主應用程式
```

## 🔧 本地開發

```bash
# 安裝依賴
npm install

# 啟動開發模式（前端 + 後端同時跑）
npm run dev

# 前端：http://localhost
# 後端：http://localhost
```

## 🏗 建置 Production

```bash
# 建置前端
npm run build

# 啟動 Production 伺服器
npm start
# → http://localhost:3001
```

## 🔐 管理方式

訪客完全看不到任何管理功能。你要管理時：

- 網址加 `?admin` → 跳出登入畫面
- 或按 `Ctrl + Shift + L`

登入後畫面底部出現管理工具列。

## 📦 資料更新方式

### 方法一：後台手動操作
登入管理 → 新增/編輯/刪除

### 方法二：跟 Claude 協作
1. 把整理好的資料跟 Claude 說
2. Claude 產出 JSON
3. 登入管理 → 📦 匯入匯出 → 貼上 JSON → 匯入

### 方法三：直接編輯 JSON
修改伺服器上的 `data/sp-topics.json`，重新整理頁面即可。

---

## 📋 之後想跟 Claude 討論修改？

當然可以！只要把這個對話繼續下去，或開新對話時跟我說「我有一個敷地計畫知識庫網站想要修改」，我就知道是哪個專案了。

可以討論的方向：
- 新增功能（例如：Markdown 支援、相關推薦、進度追蹤）
- 視覺調整
- 資料整理和匯入
- SEO 優化
- 手機版優化
