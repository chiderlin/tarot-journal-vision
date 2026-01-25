# GitHub Pages 部署指南

## 🚀 快速部署步驟

### 方法一：使用 GitHub Actions（推薦）✨

這是最簡單的方式，每次推送到 `main` 分支都會自動部署。

#### 1. 確認 Repository 名稱

你的 repo 名稱是什麼？例如：`tarot-journal-vision`

#### 2. 更新 `vite.config.ts` 中的 base 路徑

```typescript
base: process.env.GITHUB_PAGES === 'true' ? '/你的repo名稱/' : '/',
```

#### 3. 推送程式碼到 GitHub

```bash
git add .
git commit -m "Add GitHub Pages deployment"
git push origin main
```

#### 4. 在 GitHub 設定 Pages

1. 前往你的 GitHub repository
2. 點擊 **Settings** > **Pages**
3. 在 **Source** 下選擇 **GitHub Actions**
4. 等待自動部署完成（約 2-3 分鐘）

#### 5. 訪問你的網站

```
https://你的GitHub用戶名.github.io/你的repo名稱/
```

---

### 方法二：手動部署

使用 gh-pages 套件手動部署：

```bash
# 確保在正確的 Node 版本
nvm use 20

# 部署
npm run deploy
```

這會：

1. 自動建構專案
2. 將 `dist` 資料夾推送到 `gh-pages` 分支
3. GitHub Pages 會自動從該分支部署

然後在 GitHub Settings > Pages 選擇：

- **Source**: Deploy from a branch
- **Branch**: gh-pages / (root)

---

## ⚙️ 環境變數設定

### 本地開發

創建 `.env` 文件：

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-key
```

### GitHub Pages

由於是靜態網站，環境變數會在建構時被打包進去。

**選項 1：使用 GitHub Secrets**

1. 前往 Settings > Secrets and variables > Actions
2. 添加：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`

3. 更新 `.github/workflows/deploy.yml`：

```yaml
- name: Build
  run: npm run build
  env:
    GITHUB_PAGES: true
    VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
    VITE_SUPABASE_PUBLISHABLE_KEY: ${{ secrets.VITE_SUPABASE_PUBLISHABLE_KEY }}
```

**選項 2：使用公開的 Supabase 金鑰**
Supabase 的 `anon` 金鑰本來就是公開的，可以安全地打包進前端。

---

## 🔧 故障排除

### 問題 1：頁面空白或 404

**原因**: `base` 路徑設定不正確

**解決方案**:

- 如果部署到 `username.github.io/repo-name/`，設定 `base: '/repo-name/'`
- 如果部署到 `username.github.io`（個人主頁），設定 `base: '/'`

### 問題 2：圖片或資源載入失敗

**原因**: 相對路徑問題

**解決方案**:

- 確保所有資源使用相對路徑
- 圖片使用 `import` 而非字串路徑（已修復）

### 問題 3：路由 404（重新整理頁面時）

**原因**: GitHub Pages 不支援 SPA 路由

**解決方案**: 創建 `public/404.html` 重定向到 `index.html`：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <script>
      sessionStorage.redirect = location.href;
    </script>
    <meta http-equiv="refresh" content="0;URL='/'" />
  </head>
</html>
```

在 `index.html` 添加：

```html
<script>
  (function () {
    var redirect = sessionStorage.redirect;
    delete sessionStorage.redirect;
    if (redirect && redirect != location.href) {
      history.replaceState(null, null, redirect);
    }
  })();
</script>
```

---

## 📝 部署檢查清單

- [ ] 確認 `vite.config.ts` 的 `base` 路徑正確
- [ ] 已安裝 `gh-pages`：`npm install --save-dev gh-pages`
- [ ] `package.json` 包含部署腳本
- [ ] `.github/workflows/deploy.yml` 已創建
- [ ] 推送到 GitHub
- [ ] 在 GitHub Settings > Pages 啟用 GitHub Actions
- [ ] 等待部署完成
- [ ] 訪問網站並測試所有功能

---

## 🌐 訪問網址

### 如果 repo 名稱是 `tarot-journal-vision`：

```
https://你的用戶名.github.io/tarot-journal-vision/
```

### 如果 repo 名稱是 `你的用戶名.github.io`：

```
https://你的用戶名.github.io/
```

---

## 📚 更多資源

- [GitHub Pages 官方文檔](https://docs.github.com/pages)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [gh-pages 套件](https://github.com/tschaub/gh-pages)
