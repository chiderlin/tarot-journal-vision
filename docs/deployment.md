# Vercel 部署指南

## 快速部署步驟

### 1. 安裝 Vercel CLI

```bash
npm i -g vercel
```

### 2. 登入

```bash
vercel login
```

### 3. 首次部署

```bash
vercel
```

### 4. 生產環境部署

```bash
vercel --prod
```

## 環境變數設定

在 Vercel Dashboard 中添加：

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

或使用 CLI：

```bash
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_PUBLISHABLE_KEY production
```

## 自動部署

連結 GitHub repo 後，每次 push 都會自動部署：

- `main` 分支 → 生產環境
- 其他分支 → 預覽環境

## 查看部署狀態

```bash
vercel ls
```

## 查看日誌

```bash
vercel logs
```

## 更多資訊

https://vercel.com/docs
