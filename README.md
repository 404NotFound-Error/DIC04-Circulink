# DIC04-CircuLink

CircuLink 是一个基于 **Vite + React + TypeScript** 的前端应用，后端为 **Express + Prisma + PostgreSQL**。

当前仓库已统一为：
- 数据源：Express API + PostgreSQL（不再使用 Supabase 作为主数据源）
- 包管理器：`npm`

## 1. 技术栈

- Frontend: React 18, TypeScript, Vite, Tailwind
- Backend: Express, Zod, JWT, Multer, Pino
- Database: PostgreSQL + Prisma ORM

## 2. 项目结构

```text
.
├── src/                    # 前端代码
├── server/src/             # 后端代码
├── prisma/                 # Prisma schema / migrations / seed
├── scripts/                # 冒烟测试与辅助脚本
├── docs/                   # 项目文档与计划
├── public/                 # 前端静态资源
└── dist/                   # 前端构建产物
```

## 3. 环境要求

- Node.js 18+（建议 20+）
- npm 9+
- PostgreSQL（本地推荐 Homebrew 安装）

检查版本：

```bash
node -v
npm -v
psql --version
```

## 4. 快速开始（本地）

### 4.1 克隆与安装依赖

```bash
git clone git@github.com:404NotFound-Error/DIC04-Circulink.git
cd DIC04-Circulink
npm install
```

### 4.2 配置环境变量

复制 `.env.example` 到 `.env` 并按本机调整：

```bash
cp .env.example .env
```

最少需要确认这些变量：

```env
VITE_API_URL=http://localhost:4000/api
DATABASE_URL=postgresql://user:pass@localhost:5432/circulink
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
PORT=4000
CORS_ORIGIN=http://localhost:5173
UPLOAD_DIR=uploads
```

### 4.3 初始化 PostgreSQL + Prisma

先确保 PostgreSQL 已启动（示例为 Homebrew）：

```bash
brew services start postgresql@18
```

初始化数据库（如已存在会提示已存在，可忽略）：

```bash
createdb circulink
```

同步 schema 并生成 Prisma Client：

```bash
npx prisma db push
npm run prisma:generate
```

可选：插入示例数据

```bash
npm run prisma:seed
```

## 5. 启动项目

前后端需分别启动（两个终端）：

终端 A（后端）：

```bash
npm run dev:server
```

终端 B（前端）：

```bash
npm run dev
```

访问地址：
- 前端: [http://localhost:5173](http://localhost:5173)
- 后端: [http://localhost:4000/api/version](http://localhost:4000/api/version)

## 6. 常用命令

```bash
npm run dev              # 前端开发服务
npm run dev:server       # 后端开发服务
npm run build            # 前端构建
npm run preview          # 预览前端构建
npm run lint             # 代码检查
npm run build:server     # 后端 TypeScript 构建
npm run prisma:generate  # 生成 Prisma Client
npm run prisma:migrate   # Prisma 迁移开发流程
npm run prisma:studio    # 打开 Prisma Studio
npm run prisma:seed      # 导入种子数据
```

## 7. API 与联调

后端主路由前缀：`/api`

当前已实现的模块：
- `/auth`
- `/categories`
- `/items`
- `/favorites`
- `/messages`
- `/orders`
- `/uploads`
- `/version`
- `/metrics`

接口文档参考：`docs/api.md`

## 8. 冒烟测试（推荐每次联调前后执行）

在后端运行状态下执行：

```bash
bash scripts/api-smoke-test.sh
```

该脚本会覆盖：
- 注册/登录/刷新/登出/验证/重置密码
- 分类、商品 CRUD
- 收藏、消息、订单流程

说明：若分类为空，脚本会自动创建测试分类后继续。

## 9. 当前开发状态（2026-03-11）

已完成：
- PostgreSQL + Prisma 主链路稳定
- 核心 API 主流程可跑通
- `item.images` API 输出统一为数组
- 基础 lint/build/smoke 可通过

进行中（收尾项）：
- 前端部分页面仍在做真实 API 全替换
- 后端补齐 `/healthz`、限流、request id
- 测试最终版回归清单与交付文档

参考：
- `docs/todo.md`
- `docs/team-split-2.5weeks.md`

## 10. 常见问题

### 10.1 `react-router-dom` 无法解析

```bash
npm install
```

如果曾混用包管理器，建议清理后重装：

```bash
rm -rf node_modules package-lock.json
npm install
```

### 10.2 `npm install` 报 `ENOTDIR`

通常是 `node_modules` 异常文件导致，执行：

```bash
rm -rf node_modules
npm install
```

### 10.3 `prisma db push` 提示需要 reset

开发环境中如提示不可安全变更且你确认可清库，可选择 `yes`。

### 10.4 端口冲突

确认 `5173`（前端）和 `4000`（后端）未被其他进程占用，或在 `.env` 中改 `PORT`。

## 11. 提交规范（建议）

- 提交信息使用简短祈使句
- 提交前至少执行：

```bash
npm run lint
npm run build
bash scripts/api-smoke-test.sh
```

## 12. License

当前仓库未声明开源许可证；如需开源请补充 `LICENSE` 文件。
