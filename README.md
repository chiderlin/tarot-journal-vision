
# Tarot Journal Vision (塔羅日記) 🔮

一個現代化的塔羅牌日記網頁應用程式，結合了 **Supabase 雲端資料庫** 與 **Google Gemini AI 智能解牌**，讓使用者可以記錄每日的抽牌、撰寫心得，並獲得深度的靈感洞察。

## ✨ 主要功能 (Features)

### 1. 🎴 雙系統牌卡支援
- **完整偉特塔羅 (Rider-Waite Tarot)**：78 張牌義詳解 (正位/逆位)。
- **雷諾曼卡 (Lenormand)**：36 張牌義詳解。
- **國際化支援 (i18n)**：完整的中英文介面切換。

### 2. 📝 雲端日記 (Cloud Journaling)
- **Supabase Integration**：資料庫雲端同步，不再怕換電腦資料不見。
- **所見即所得編輯器**：支援 `#t-fool` 等語法快速插入牌卡圖示。
- **CRUD 功能**：完整的日記新增、修改、刪除、查詢功能。

### 3. 🤖 AI Oracle (智能解牌)
- **AI 解析**：整合 **Google Gemini Pro** 模型。
- **即時洞察**：按下一鍵，AI 根據你的牌陣與問題提供「整體能量」、「牌陣解析」與「行動建議」。
- **使用限制**：每人每日限用 3 次，保持覺察與節制。

### 4. 🔐 用戶系統 (Authentication)
- **Email 註冊/登入**：支援 Supabase Auth。
- **Developer Quick Login**：開發測試專用的快速登入通道。
- **資料隱私 (RLS)**：透過 Row Level Security 確保每位用戶只能看見自己的日記。

### 5. 📊 數據視覺化
- **日曆視圖**：透過月曆回顧過去的能量流動。
- **統計分析**：查看最常出現的牌卡與元素分佈。

---

## 🛠 技術棧 (Tech Stack)

- **Frontend**: [React](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query)
- **Backend (BaaS)**: [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **AI**: [Google Gemini API](https://ai.google.dev/)
- **Deployment**: [GitHub Pages](https://pages.github.com/) + GitHub Actions

---

## 🚀 快速開始 (Quick Start)

### 1. 安裝依賴
```bash
npm install
```

### 2. 設定環境變數 (.env)
請在專案根目錄建立 `.env` 檔案，並填入以下資訊：

```env
VITE_SUPABASE_URL="你的_Supabase_URL"
VITE_SUPABASE_PUBLISHABLE_KEY="你的_Supabase_Anon_Key"
VITE_GOOGLE_AI_KEY="你的_Google_Gemini_API_Key"
```


## 🗓️ 未來規劃 (Roadmap)

### 🔜 近期優先 (Priority High)
- [ ] **AI 每日指引 (Daily Guidance)**：每日登入時提供一句靈性指引。
- [ ] **首頁列表優化**：優化長篇日記在列表頁的顯示方式 (文字截斷或摘要)。
- [ ] **Markdown 渲染增強**：支援更豐富的文字格式 (粗體、清單等)。

### 📊 深度分析 (Deep Insights)
- [ ] **共時性分析**：偵測特定時間段內反覆出現的牌 (例如：「這週你抽到了 3 次『寶劍三』」)。
- [ ] **能量熱力圖**：以視覺化方式呈現每週/每月的元素分佈 (火/水/風/土)。
- [ ] **關鍵字雲**：分析日記中最常出現的心情關鍵字。

### 👤 社群與分享 (Social)
- [ ] **分享卡片 (Shareable Cards)**：將日記或抽牌結果生成精美的圖片，方便分享到社群媒體。
- [ ] **個人檔案**：自訂頭像與暱稱。

### ⚡️ 效能優化 (Performance)
- [ ] **無限捲動 (Infinite Scroll)**：優化大量日記的載入效能。
- [ ] **PWA 支援**：支援離線瀏覽與安裝到手機桌面。
