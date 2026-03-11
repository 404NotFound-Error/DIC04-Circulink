# DIC04-Circulink

CircuLink 本地开发说明（统一使用 `npm`）。

## 当前技术路线

- 前端：Vite + React + TypeScript
- 后端：Express + TypeScript + Prisma（`npm run dev:server`）
- 数据库：Prisma（`DATABASE_URL`）

说明：前端业务调用统一在 `src/lib/backend.ts` 与 `src/lib/api.ts`，默认连接本地 Express API。

## 环境要求

- Node.js 18+（建议 20+）
- npm 9+

## 启动步骤

```bash
npm install
npm run dev:server
```

新开一个终端：

```bash
npm run dev
```

## 常用命令

```bash
npm run build
npm run lint
npm run build:server
```
