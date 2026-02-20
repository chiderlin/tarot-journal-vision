# 塔羅日記架構總結 (Architecture Summary)
## 快速參考指南 (Quick Reference Guide)

---

## 🏗️ 系統架構圖 (System Architecture)

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React 18)                     │
├─────────────────────────────────────────────────────────────┤
│  Pages/            │  Components/      │  Services/         │
│  ├─ Index.tsx      │  ├─ JournalEditor │  ├─ ai.ts          │
│  ├─ Auth.tsx       │  ├─ JournalList   │  └─ journalService │
│  └─ NotFound.tsx   │  ├─ CalendarView  │                    │
│                    │  ├─ AnalysisView  │  Hooks/            │
│                    │  └─ 57+ more      │  ├─ useInfinite... │
│                    │                   │  └─ useLocalStorage│
└─────────────────────────────────────────────────────────────┘
                              ↕ HTTP/WebSocket
┌─────────────────────────────────────────────────────────────┐
│                   Supabase (Backend as a Service)            │
├─────────────────────────────────────────────────────────────┤
│  Auth                    │  Database (PostgreSQL)            │
│  ├─ Row Level Security   │  ├─ profiles                      │
│  └─ JWT Tokens           │  ├─ journal_entries               │
│                          │  └─ journal_entry_cards           │
├─────────────────────────────────────────────────────────────┤
│  Storage                 │  Real-time                        │
│  └─ (Future: images)     │  └─ Subscriptions (Future)        │
└─────────────────────────────────────────────────────────────┘
                              ↕ API Call
┌─────────────────────────────────────────────────────────────┐
│               External Services (Google AI)                  │
├─────────────────────────────────────────────────────────────┤
│  Gemini 2.5 Flash                                            │
│  ├─ getTarotInterpretation()                                 │
│  └─ generateDailyGuidance()                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 資料庫 ER 圖 (Database Entity-Relationship)

```
┌──────────────────────┐         ┌────────────────────────┐
│   auth.users         │         │   profiles             │
│  (Supabase Auth)     │◄────────│  (User Profiles)       │
├──────────────────────┤  1:1    ├────────────────────────┤
│ • id (PK)            │         │ • id (PK, FK)          │
│ • email              │         │ • email                │
│ • encrypted_password │         │ • created_at           │
└──────────────────────┘         └────────────────────────┘
         │ 1
         │
         │ N
┌──────────────────────────────────┐
│   journal_entries                │
│  (Main journal records)          │
├──────────────────────────────────┤
│ • id (PK)                        │
│ • user_id (FK) ───────┐          │
│ • title                │          │
│ • content              │          │
│ • category             │          │
│ • date                 │          │
│ • emotions             │ (array)  │
│ • primary_emotion      │          │
│ • emotion_intensities  │ (JSONB)  │
│ ⚠ cards                │ (text[] - LEGACY, 建議移除) │
│ • created_at           │          │
│ • updated_at           │          │
└──────────────────────────────────┘
         │ 1
         │
         │ N
┌──────────────────────────────────┐
│   journal_entry_cards            │
│  (Card associations)             │
├──────────────────────────────────┤
│ • id (PK)                        │
│ • journal_entry_id (FK)          │
│ • card_name (e.g., "fool")       │
│ • created_at                     │
└──────────────────────────────────┘

索引 (Indexes):
  - idx_journal_entry_cards_journal_entry_id
  - idx_journal_entry_cards_card_name
```

---

## 🔐 RLS 政策總覽 (RLS Policies Overview)

| 表格 | SELECT | INSERT | UPDATE | DELETE |
|------|--------|--------|--------|--------|
| `profiles` | ✅ 所有人可讀 | ✅ 僅自己 | ✅ 僅自己 | ❌ |
| `journal_entries` | ✅ `user_id = auth.uid()` | ✅ `user_id = auth.uid()` | ✅ `user_id = auth.uid()` | ✅ `user_id = auth.uid()` |
| `journal_entry_cards` | ✅ 透過父表檢查 | ✅ 透過父表檢查 | ✅ 透過父表檢查 | ✅ 透過父表檢查 |

**安全保證**：
- ✅ 所有使用者資料表皆啟用 RLS
- ✅ 無法跨使用者存取日記
- ✅ Cascade deletion 確保資料完整性

---

## 🎨 前端狀態管理流程 (Frontend State Flow)

```
User Action (Click/Type)
        ↓
React Component (Index.tsx)
        ↓
┌───────────────────────────────┐
│   React Query Mutation        │
│  (createEntry/updateEntry)    │
└───────────────────────────────┘
        ↓
┌───────────────────────────────┐
│   journalService.ts           │
│  - mapToJournalEntry()        │
│  - Supabase API Calls         │
└───────────────────────────────┘
        ↓
Supabase (Validate RLS + Execute SQL)
        ↓
┌───────────────────────────────┐
│   React Query Cache           │
│  - invalidateQueries()        │
│  - Auto Refetch               │
└───────────────────────────────┘
        ↓
UI Update (Component Re-render)
```

---

## 📦 型別系統層級 (Type System Layers)

```
Layer 1: Database Schema
  └─ src/integrations/supabase/types.ts
     ├─ Database['public']['Tables']['journal_entries']['Row']
     └─ Database['public']['Tables']['journal_entry_cards']['Row']

Layer 2: Application Types
  └─ src/types/tarot.ts
     ├─ interface JournalEntry
     ├─ interface TarotCard
     ├─ interface LenormandCard
     └─ interface Category

Layer 3: Component Props
  └─ src/components/*.tsx
     ├─ JournalEditorProps
     ├─ JournalListProps
     └─ ...

⚠️ 問題：過度使用 `any` 打破型別鏈
   - journalService.ts: mapToJournalEntry(entry: any)
   - Index.tsx: emotion_intensities as any
```

---

## 🔄 資料流週期 (Data Flow Lifecycle)

### 1️⃣ 建立日記 (Create Journal Entry)

```
User fills form
  → extractCards(content)        // 從 Markdown 提取 #t-fool
  → onSave({ title, content, category, date, cards, emotions, ... })
  → createEntryMutation.mutate()
  → supabase.from('journal_entries').insert({ user_id, ... })
  → supabase.from('journal_entry_cards').insert([{ journal_entry_id, card_name }])
  → queryClient.invalidateQueries()
  → UI 更新
```

### 2️⃣ 讀取日記列表 (List Journals - Infinite Scroll)

```
Component Mount
  → useInfiniteJournalEntries()
  → getPaginatedJournalEntries(page=0, pageSize=10)
  → supabase.from('journal_entries')
       .select('*, journal_entry_cards(card_name)')
       .range(0, 9)
  → mapToJournalEntry(dbEntry)
  → Display 10 entries

User scrolls to bottom
  → fetchNextPage()
  → getPaginatedJournalEntries(page=1, pageSize=10)
  → Append 10 more entries
```

### 3️⃣ AI 解讀 (AI Interpretation)

```
User clicks "AI 解讀"
  → getTarotInterpretation({ question, cards, context })
  → Detect language (i18next.language)
  → Build prompt (Markdown structure + language instruction)
  → Call Gemini API (gemini-2.5-flash)
  → Parse Markdown response
  → Display in UI
```

---

## 🚀 效能優化策略 (Performance Optimization)

| 策略 | 實作狀態 | 說明 |
|------|---------|------|
| **無限捲動** | ✅ 已實作 | `useInfiniteQuery` + pagination |
| **條件查詢** | ✅ 已實作 | `enabled: currentView === 'calendar'` |
| **快取策略** | ⚠️ 部分實作 | 建議增加 `staleTime` |
| **索引優化** | ✅ 已實作 | `idx_journal_entry_cards_*` |
| **批次操作** | ❌ 未實作 | 可考慮 bulk insert cards |
| **圖片延遲載入** | ❌ 未實作 | 塔羅牌圖片可用 lazy loading |

---

## 🎯 程式碼品質指標 (Code Quality Metrics)

| 項目 | 評分 | 說明 |
|------|------|------|
| **型別安全** | ⭐⭐⭐ | 使用 TypeScript，但有 `any` 濫用 |
| **關注點分離** | ⭐⭐⭐ | 部分業務邏輯混在組件中 |
| **可維護性** | ⭐⭐⭐⭐ | 組件化良好，但 Index.tsx 過大 |
| **可測試性** | ⭐⭐ | 缺乏單元測試，邏輯耦合 |
| **安全性** | ⭐⭐⭐⭐⭐ | RLS 完善，無 SQL injection 風險 |
| **效能** | ⭐⭐⭐⭐ | 無限捲動實作良好 |
| **國際化** | ⭐⭐⭐⭐⭐ | i18n 架構完整 |

**整體評分：★★★★☆ (4/5)**

---

## 🔧 快速修復檢查表 (Quick Fix Checklist)

### 🔴 高優先（本週內）
- [ ] 移除 `journalService.ts` 的 `any` 型別
- [ ] 移除 `Index.tsx` 的 `as any` 斷言
- [ ] 建立 `JournalEntryWithCards` 明確型別
- [ ] 新增 Migration 移除 `journal_entries.cards` 欄位

### 🟡 中優先（本月內）
- [ ] 提取 `JournalAnalytics` 服務類別
- [ ] 建立 `useJournalMutations` hook
- [ ] 改善 AI 服務錯誤處理（AIServiceError 類別）
- [ ] 增加 React Query 的 `staleTime` 設定

### 🟢 低優先（持續改進）
- [ ] 增加單元測試（Jest + React Testing Library）
- [ ] 實作 PWA 離線支援
- [ ] 圖片延遲載入優化
- [ ] 增加 Sentry 錯誤監控

---

## 📚 技術棧總覽 (Tech Stack)

```yaml
Frontend:
  Framework: React 18
  Language: TypeScript
  Build Tool: Vite
  State Management: React Query (@tanstack/react-query)
  UI Library: Radix UI + Tailwind CSS
  Internationalization: react-i18next
  Routing: React Router

Backend:
  BaaS: Supabase
  Database: PostgreSQL 13
  Auth: Supabase Auth (JWT)
  Storage: Supabase Storage (Future)

AI:
  Provider: Google Gemini
  Model: gemini-2.5-flash
  Use Cases:
    - Tarot interpretation
    - Daily guidance generation

DevOps:
  Hosting: GitHub Pages
  CI/CD: (未設定)
  Monitoring: (未設定)
```

---

## 💡 最佳實踐建議 (Best Practices)

### ✅ 已遵循
1. RLS 確保資料安全
2. 使用 TypeScript 型別系統
3. React Query 管理伺服器狀態
4. 組件化設計
5. 國際化支援

### ⚠️ 可改進
1. 減少 `any` 使用，強化型別安全
2. 將業務邏輯從 UI 組件中提取
3. 增加錯誤處理與使用者反饋
4. 建立自動化測試
5. 增加程式碼註解（特別是複雜邏輯）

---

## 🎓 學習資源 (Learning Resources)

- [Supabase 文件](https://supabase.com/docs)
- [React Query 最佳實踐](https://tanstack.com/query/latest/docs/react/guides/important-defaults)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

**建議下一步**：
1. 閱讀完整的 `ARCHITECTURE_ANALYSIS.md`
2. 確認改進方向
3. 按優先順序逐步重構

**預估改進時間**：10-15 小時（可分階段進行）
