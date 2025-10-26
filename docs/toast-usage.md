# Toast (通知) 功能使用說明

本專案整合了 `shadcn/ui` 的元件，其中包含了兩種不同的 Toast (彈出式通知) 實作系統。這份文件旨在說明這兩種系統的差異、邏輯與建議用法。

## 摘要

專案中存在兩種 Toast 系統的程式碼：

1.  **Sonner 系統 (推薦)**：基於 `sonner` 套件，更現代、功能更強大、使用更簡單。
2.  **預設 Toast 系統**：基於 `Radix UI`，是 `shadcn/ui` 的原始實作，需要多個檔案協同工作。

**建議：在開發新功能時，請優先使用 `Sonner` 系統以求統一和簡潔。**

---

## 系統一：Sonner 系統 (推薦)

這套系統是 `shadcn/ui` 推薦的 Toast 方案之一，它將 `sonner` 這個優秀的套件整合進來。

### 核心檔案

-   `src/components/ui/sonner.tsx`

### 邏輯

這個檔案是整個系統的核心。它做了幾件事：
1.  從 `sonner` 套件匯入原始的 `Toaster` 元件和 `toast` 函式。
2.  建立一個新的 `Toaster` 元件，並在其中設定好符合專案風格的主題（`theme`）和 CSS 樣式（`classNames`）。
3.  將設定好的 `<Toaster />` 元件和可直接使用的 `toast()` 函式匯出。

### 使用方法

#### 1. 安裝 Toaster 容器

在你的主佈局檔案（例如 `src/App.tsx` 或 `src/pages/Layout.tsx`）中，加入從 `sonner.tsx` 匯入的 `Toaster` 元件。**這個步驟只需要做一次**。

```tsx
// src/App.tsx
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <>
      {/* ... 你的其他內容 ... */}
      <Toaster richColors position="top-right" />
    </>
  );
}
```

#### 2. 觸發 Toast

在任何你需要顯示通知的元件中，從 `sonner.tsx` 匯入 `toast` 函式並呼叫它。

```tsx
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";

export function MyComponent() {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={() => toast("這是一個基本通知")}
      >
        顯示通知
      </Button>

      <Button
        variant="outline"
        onClick={() => toast.success("操作已成功！")}
      >
        顯示成功
      </Button>

      <Button
        variant="outline"
        onClick={() => toast.error("發生了一個錯誤。")}
      >
        顯示錯誤
      </Button>
    </div>
  );
}
```

---

## 系統二：預設 Toast 系統

這是 `shadcn/ui` 的原始 Toast 系統，功能較為基礎，且實作分散在多個檔案中。

### 核心檔案

-   `src/components/ui/toast.tsx`：定義單一 Toast 的**外觀**。
-   `src/hooks/use-toast.ts`：提供 `toast()` 函式來**觸發**一個 Toast。
-   `src/components/ui/toaster.tsx`：一個**容器**元件，負責將所有被觸發的 Toast 顯示出來。

### 邏輯

1.  當你呼叫從 `use-toast.ts` 來的 `toast()` 函式時，它會將一個 Toast 物件（包含 title, description 等）新增到一個全域的狀態列表中。
2.  `<Toaster />` 元件（來自 `toaster.tsx`）會監聽這個列表的變化。
3.  當列表更新時，`<Toaster />` 會為列表中的每一個 Toast 物件渲染一個 `<Toast />` 元件（來自 `toast.tsx`），從而將通知顯示在畫面上。

### 使用方法

#### 1. 安裝 Toaster 容器

與 Sonner 類似，在主佈局檔案中加入從 `toaster.tsx` 匯入的 `Toaster` 元件。**這個步驟也只需要做一次**。

```tsx
// src/App.tsx
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <>
      {/* ... 你的其他內容 ... */}
      <Toaster />
    </>
  );
}
```

#### 2. 觸發 Toast

在需要顯示通知的元件中，從 `use-toast.ts` 匯入 `toast` 函式並呼叫它。

```tsx
import { toast } from "@/hooks/use-toast"; // 注意匯入來源不同
import { Button } from "@/components/ui/button";

export function MyOtherComponent() {
  return (
    <Button
      variant="outline"
      onClick={() => {
        toast({
          title: "已排程事件",
          description: "星期五下午 2 點在會議室",
          variant: "destructive", // 可以指定變體
        });
      }}
    >
      顯示預設 Toast
    </Button>
  );
}
```

## 如何選擇？

-   **一致性**：檢查專案目前主要使用哪一套系統，並遵循它。你可以透過檢查主佈局檔案中 `<Toaster />` 的匯入來源來判斷。
-   **新功能**：對於所有新的開發，**強烈建議使用 `Sonner` 系統**。它的 API 更簡潔，功能更豐富（例如支援 Promise、自訂元件等），且效能更好。
