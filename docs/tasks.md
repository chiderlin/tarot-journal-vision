### 設定環境變數 (.env)

請在專案根目錄建立 `.env` 檔案，並填入以下資訊：

```env
VITE_SUPABASE_URL="Supabase_URL"
VITE_SUPABASE_PUBLISHABLE_KEY="Supabase_Anon_Key"
VITE_GOOGLE_AI_KEY="Google_Gemini_API_Key"
```

## 🗓️ Roadmap

### 🔜 近期優先 (Priority High)

- [x] **AI 每日指引 (Daily Guidance)**：每日登入時提供一句靈性指引。
- [x] **首頁列表優化**：優化長篇日記在列表頁的顯示方式 (文字截斷或摘要)。
- [x] **Markdown 渲染增強**：支援更豐富的文字格式 (粗體、清單等)。
- [x] fix把分享卡片內容
- [x] 在日記中加入情緒標籤（如快樂、悲傷、焦慮），並分析這些情緒與抽到的牌卡之間的關聯
- [x] emoji改掉

### 📊 分析 (Deep Insights)

- [ ] **共時性分析**：偵測特定時間段內反覆出現的牌 (例如：「這週你抽到了 3 次『寶劍三』」)。
- [ ] **能量熱力圖**：以視覺化方式呈現每週/每月的元素分佈 (火/水/風/土)。
- [ ] **關鍵字雲**：分析日記中最常出現的心情關鍵字。

### 🎭 情緒數據分析 (Emotional Data Analysis)

1. 數據特徵提取：將感性文字「量化」
   進行情緒標註：
   情緒極性（Sentiment Polarity）：將日記內容評分為正向、中性或負向（-1.0 到 1.0）。
   情緒維度（Emotion Detection）：識別特定情緒，如焦慮、憂鬱、憤怒、平靜或喜悅。
   塔羅符號權重：例如抽到「高塔」或「死神」時，如果伴隨負向文字，可能加重「壓力指數」的權重。

2. 向量化（Vectorization）與向量資料庫
   將每一篇日記轉化為 Embedding（嵌入向量）。向量捕捉「語義相關性」。
   應用場景：當使用者今天寫下「我覺得透不過氣」，系統可以透過向量檢索（Vector Search）發現這跟三個月前他「面臨工作瓶頸」時的語義特徵非常相 似，從而識別出週期的壓力模式。
   儲存：建議使用 Pinecone、Milvus 或 pgvector (PostgreSQL 擴充)

3. 時間序列分析（Time-Series Analysis）
   心理健康不是看「單點」，而是看「趨勢」。
   移動平均線：計算過去 7 天的情緒平均值，若連續下降，系統可以發出提醒。
   異常偵測（Anomaly Detection）：如果使用者平時很穩定，突然出現極端的負面特徵向量，這就是數據上的「紅旗（Red Flag）」。

### 功能：

- [x] **分享卡片 (Shareable Cards)**：將日記或抽牌結果生成精美的圖片，方便分享到社群媒體。
- [ ] **年度報告**: 回顧成長
- [ ] **夢境解讀**

### ⚡️ 效能優化 (Performance)

- [x] **無限捲動 (Infinite Scroll)**：優化大量日記的載入效能。
- [ ] **PWA 支援**：支援離線瀏覽與安裝到手機桌面。
- [ ] **離線模式**
- [ ] **Notion**
