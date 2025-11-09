# Tarot Journal Vision (塔羅日記)

一個現代化的塔羅牌日記網頁應用程式，讓使用者可以記錄每日的抽牌、撰寫心得並透過視覺化的方式回顧。

TODO

- FIX: 文章篇數沒正確記錄
- 更多可以分析的內容：”最常出現牌“要修復。

Progress:

- 新增英文,中文語系
- 建立 supabase -> for 更多分析 query

DONE:

- 不同主題對不同主題的牌有相對應解釋(LLM)
- 完成每個牌的基本解釋：預計點擊每張卡片時會放大圖示顯示個別牌卡資訊。
- 完成 JournalEditor 頁面雙語
- 完成其他頁面雙語重構

## ✨ 功能特色

- **每日抽牌與記錄**: 輕鬆記錄你的每日塔羅牌，並寫下你的想法與感受。
- **日記編輯器**: 提供一個功能豐富的編輯器來撰寫和格式化你的日記內容。
- **日曆視圖**: 透過日曆快速瀏覽過去的抽牌記錄與日記。
- **塔羅牌庫**: 內建完整的偉特塔羅牌圖庫，方便查閱。
- **響應式設計**: 在桌面和行動裝置上都有良好的使用體驗。

## 技術棧

- **前端框架**: [React](https://react.dev/)
- **建構工具**: [Vite](https://vitejs.dev/)
- **程式語言**: [TypeScript](https://www.typescriptlang.org/)
- **CSS 框架**: [Tailwind CSS](https://tailwindcss.com/)
- **UI 元件庫**: [shadcn/ui](https://ui.shadcn.com/)
- **路由**: [React Router](https://reactrouter.com/)
- **表單處理**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **非同步狀態管理**: [TanStack Query](https://tanstack.com/query)

## 🚀 快速開始

1.  **安裝依賴**

    ```bash
    npm install
    ```

2.  **啟動本地開發伺服器**

    ```bash
    npm run dev
    ```

3.  在瀏覽器中打開 Vite 提供的本地網址 (通常是 `http://localhost:5173`)。

## 📜 可用腳本

- `npm run dev`: 在開發模式下啟動應用程式。
- `npm run build`: 將應用程式打包成生產環境的靜態檔案。
- `npm run lint`: 執行 ESLint 檢查程式碼風格。
- `npm run preview`: 在本地預覽生產環境的打包結果。
