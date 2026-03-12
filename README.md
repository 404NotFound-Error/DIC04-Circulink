# DIC04-CircuLink

CircuLink 是一个面向校园二手交易与捐赠场景的全栈项目。

当前主线技术方案已经统一为：
- 后端与数据源：**Express + Prisma + PostgreSQL**
- 前端：**Vite + React + TypeScript**
- 包管理器：**npm**

不再使用 Supabase 作为主数据源。

## 1. 功能概览

当前已打通的核心链路：
- 认证：注册、登录、刷新、登出、邮箱验证、找回密码
- 商品：列表/搜索/筛选/分页、详情、发布、编辑、删除
- 分类：分类列表、按分类浏览
- 收藏：添加、移除、列表
- 消息：会话列表、发送消息、已读
- 订单：创建订单、状态流转、买卖双方视角
- 上传：图片上传（文件类型校验、大小校验、静态访问）
- 捐赠：捐赠入口、表单、感谢页（复用商品创建链路）
- 国际化：中英切换已覆盖主流程页面文案
- 质量保障：`lint`、`build`、API smoke test、GitHub Actions CI（lint + build）

## 2. 技术栈

### Frontend
- React 18
- TypeScript
- React Router
- Vite
- Tailwind CSS
- Lucide Icons

### Backend
- Express
- Zod（参数校验）
- JWT（访问令牌 + 刷新令牌）
- Multer（文件上传）
- Pino（结构化日志）

### Data
- PostgreSQL
- Prisma ORM

## 3. 仓库结构

```text
.
├── src/                      # 前端应用（Vite + React + TS）
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── hooks/
│   └── lib/
├── server/src/               # 后端 TypeScript 主实现（当前主线）
│   ├── modules/              # auth/items/orders/messages...
│   ├── middleware/
│   ├── routes/
│   └── config/
├── prisma/                   # Prisma schema、seed
├── scripts/                  # smoke test 与辅助脚本
├── docs/                     # API、TODO、项目文档
├── public/                   # 前端静态资源
├── uploads/                  # 本地上传目录（运行后生成/写入）
└── .github/workflows/ci.yml  # CI：lint + build
```

说明：`server/` 下仍保留部分历史 `.js` 文件用于兼容/参考，当前开发与运行主线是 `server/src/*.ts` 与根目录脚本 `npm run dev:server`。

## 4. 环境要求

- Node.js 20+（推荐 Node 22）
- npm 9+
- PostgreSQL（本地建议 Homebrew）

检查版本：

```bash
node -v
npm -v
psql --version
```

## 5. 快速开始（本地）

### 5.1 拉取代码并安装依赖

```bash
git clone git@github.com:404NotFound-Error/DIC04-Circulink.git
cd DIC04-Circulink
npm install
```

### 5.2 配置环境变量

```bash
cp .env.example .env
```

`.env` 至少需要以下配置：

```env
# Frontend
VITE_API_URL=http://localhost:4000/api
VITE_TEST_EMAIL=test@example.com
VITE_TEST_PASSWORD=password123
VITE_ENABLE_DEV_AUTO_LOGIN=false

# Backend
DATABASE_URL=postgresql://user:pass@localhost:5432/circulink
JWT_SECRET=your-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-change-in-production
PORT=4000
CORS_ORIGIN=http://localhost:5173
UPLOAD_DIR=uploads
```

可选后端变量（有默认值）：
- `JWT_ACCESS_TTL`（默认 `15m`）
- `JWT_REFRESH_TTL`（默认 `7d`）
- `BCRYPT_ROUNDS`（默认 `10`）

### 5.3 初始化数据库

确保 PostgreSQL 已启动（macOS Homebrew 示例）：

```bash
brew services start postgresql@18
```

创建数据库（已存在可忽略错误）：

```bash
createdb circulink
```

同步 Prisma Schema：

```bash
npx prisma db push
npm run prisma:generate
```

可选：导入种子数据

```bash
npm run prisma:seed
```

### 5.4 启动前后端

终端 A（后端）：

```bash
npm run dev:server
```

终端 B（前端）：

```bash
npm run dev
```

访问地址：
- 前端：<http://localhost:5173>
- 后端版本：<http://localhost:4000/api/version>
- 后端健康检查：<http://localhost:4000/healthz>

## 6. 常用命令

```bash
# Frontend
npm run dev
npm run build
npm run preview
npm run lint

# Backend
npm run dev:server
npm run build:server
npm run start:server

# Prisma
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
npm run prisma:seed
```

## 7. API 概览

Base URL（本地）：

```text
http://localhost:4000/api
```

主要模块：
- `GET /version`
- `GET /metrics`
- `POST /auth/*` / `GET /auth/me`
- `GET /categories`
- `GET/POST/PATCH/DELETE /items`
- `GET/POST/DELETE /favorites`
- `GET/POST/PATCH /messages`
- `GET/POST/PATCH /orders`
- `POST /uploads`（`multipart/form-data`，字段名 `file`）

完整文档见：
- `docs/api.md`
- `docs/foundation.md`

## 8. 上传与图片说明

- 上传接口：`POST /api/uploads`
- 认证：需要登录（Bearer Token）
- 支持类型：`image/jpeg` `image/png` `image/webp` `image/gif`
- 大小限制：**单张 10MB**
- 返回示例：

```json
{
  "data": {
    "path": "/uploads/2026/03/12/1741770000000-xxx.jpg"
  }
}
```

前端发布/捐赠流程会先上传图片，再提交商品数据。

## 9. 测试与联调

### 9.1 本地最小回归

```bash
npm run lint
npm run build
```

### 9.2 API 冒烟测试

后端运行时执行：

```bash
bash scripts/api-smoke-test.sh
```

脚本覆盖：
- Auth 全链路
- Categories/Items/Favorites
- Messages
- Orders

若数据库里没有分类，脚本会自动创建 smoke test 分类再继续。

### 9.3 CI

仓库已配置 GitHub Actions：
- 文件：`.github/workflows/ci.yml`
- 触发：`push` / `pull_request`
- 任务：`npm ci` + `npm run lint` + `npm run build`

## 10. 当前状态与未完成项

已完成项请见：
- `docs/todo.md`（持续更新）

当前仍需推进的主要项：
- AI 推荐页接入真实后端推荐 API（当前仍有样例占位）
- 可访问性与移动端细节持续优化
- 自动化测试（单元/集成）补齐
- 部署与运维文档

## 11. 常见问题（Troubleshooting）

### 11.1 `react-router-dom` 无法解析

```bash
npm install
```

若曾混用包管理器，建议清理后重装：

```bash
rm -rf node_modules package-lock.json
npm install
```

### 11.2 `npm install` 报 `ENOTDIR`

通常是 `node_modules` 异常文件导致：

```bash
rm -rf node_modules
npm install
```

### 11.3 `EADDRINUSE: address already in use :::4000`

说明 4000 端口已有进程占用，先结束旧进程或换端口（`PORT`）。

### 11.4 `prisma db push` 提示需要 reset

开发环境如果确认可清库，可选择 `yes` 重置；生产环境不要这样做。

### 11.5 上传报错 `PayloadTooLargeError` 或 413

- 确保不要把 base64 大图塞进 JSON 请求
- 走 `POST /api/uploads` 上传文件，再提交图片路径
- 单张图片需小于等于 10MB

## 12. 开发协作建议

- 提交信息使用简短祈使句
- 提交前建议执行：

```bash
npm run lint
npm run build
bash scripts/api-smoke-test.sh
```

- 大功能变更同步更新：
  - `docs/todo.md`
  - `docs/api.md`
  - 本 README

## 13. License

当前仓库未声明开源许可证。如需开源，请补充 `LICENSE` 文件并在 README 更新许可说明。
