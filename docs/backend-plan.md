# 后端开发计划（Node/Express + PostgreSQL + Prisma）

范围决策
- 认证：JWT access token + refresh token。
- 存储：本地磁盘优先（后续迁移 S3/R2）。
- 交易：独立订单模型（不仅是商品状态）。

项目目标
- 搭建自建后端，完全掌控认证、权限与数据模型。
- 为现有 Vite/React 前端提供稳定 REST API。
- MVP 快速交付，同时保留扩展路径。

三人并行分工

A 线（数据与 Prisma）- 负责人 A
- 设计 Prisma schema（users、profiles、categories、items、favorites、messages、orders）。
- 索引/约束与迁移规划。
- 种子脚本（分类、测试用户、示例商品）。
- 编写数据库搭建与迁移说明。

B 线（平台与认证）- 负责人 B
- Express 项目结构（routes/controllers/services）。
- 环境变量校验、日志、错误处理、安全头、CORS。
- JWT 认证流程：注册、登录、刷新、登出。
- 认证中间件与角色/资源归属校验。

C 线（业务 API）- 负责人 C
- 分类 API（列表）。
- 商品 API（CRUD + 搜索/筛选 + 分页）。
- 收藏 API（添加/取消/列表）。
- 消息 API（会话列表/发送/已读）。
- 订单 API（创建、状态变更、买卖双方列表）。

里程碑与工期（2 周冲刺，10 个工作日）

第 1 周
- A：完成 schema + 首次迁移 + 种子数据。
- B：完成基础服务 + 认证路由 + JWT 中间件。
- C：完成路由骨架 + 分类 + 商品基础 CRUD。

第 2 周
- A：索引调优 + 约束完善 + 种子优化。
- B：权限校验完善 + refresh token 轮换 + 安全加固。
- C：收藏 + 消息 + 订单 + 筛选/搜索。

周前对齐事项
- API 契约（请求/响应结构）。
- 错误格式与分页规范。
- 资源归属规则（卖家/买家/拥有者）。

详细任务清单

1) 数据建模（A）
- Prisma 关系：
  - User/Profile：1:1
  - Item：属于 Category、Seller(Profile)
  - Favorite：User + Item 唯一
  - Message：Sender + Receiver + Item
  - Order：Buyer + Seller + Item + Price + Status
- 枚举：
  - ItemCondition：excellent/good/fair/poor
  - ItemStatus：available/sold/reserved
  - OrderStatus：pending/accepted/paid/canceled/completed
- 索引：
  - items(seller_id)、items(category_id)、items(status)、items(created_at)
  - favorites(user_id, item_id unique)
  - messages(sender_id, receiver_id)、messages(item_id)
  - orders(buyer_id)、orders(seller_id)、orders(status)
- 种子数据：分类 + 1-2 用户 + 5-10 商品。

2) 平台基础（B）
- Express 架构
  - src/app.ts、src/server.ts
  - middleware：request-id、error handler
  - 安全：helmet、rate limit、CORS
- 配置
  - env 校验（zod/envalid）
  - config 模块
- 认证（JWT）
  - /auth/register
  - /auth/login
  - /auth/refresh
  - /auth/logout
  - 密码哈希（bcrypt）
  - refresh token 存储（DB 或 Redis）
- 权限
  - requireAuth 中间件
  - items/messages/orders 资源归属校验

3) 业务 API（C）
- 分类
  - GET /categories
- 商品
  - GET /items（筛选：category、search、价格区间、condition、status）
  - GET /items/:id
  - POST /items
  - PATCH /items/:id
  - DELETE /items/:id
- 收藏
  - GET /favorites
  - POST /favorites
  - DELETE /favorites/:id
- 消息
  - GET /messages（按 item 或 thread）
  - POST /messages
  - PATCH /messages/:id/read
- 订单
  - POST /orders（买家创建）
  - GET /orders（买家/卖家列表）
  - PATCH /orders/:id/status

4) 文件存储（本地优先）
- 上传：POST /uploads
- 存储目录：/uploads，按日期分目录。
- items.images 保存文件路径。
- 校验文件大小/类型，清理文件名。
- 迁移路线：保持 API 不变，后续切到 S3/R2。

5) 质量与验证
- CI：lint + typecheck。
- 基础集成测试（supertest）覆盖：
  - 认证登录/刷新
  - 商品 CRUD
  - 订单流程
- 本地手动验证。

完成标准
- 所有路由带参数校验。
- 迁移与种子脚本可执行。
- JWT + refresh 逻辑稳定。
- 本地上传端到端可用。
- 至少 6 个关键接口测试通过。

待确认事项
- 订单状态流转规则与权限。
- refresh token 的存储策略（DB 表 vs Redis）。

Issue 拆解（负责人/工期/依赖）

ISSUE-1 Prisma schema 初版（A，1.5 天，依赖：无）
ISSUE-2 Prisma 迁移与种子脚本（A，1 天，依赖：ISSUE-1）
ISSUE-3 Express 项目骨架（B，1 天，依赖：无）
ISSUE-4 配置与错误处理模块（B，0.5 天，依赖：ISSUE-3）
ISSUE-5 JWT 认证流程（B，1.5 天，依赖：ISSUE-3）
ISSUE-6 鉴权中间件与资源校验（B，1 天，依赖：ISSUE-5 + ISSUE-1）
ISSUE-7 分类与商品基础 CRUD（C，2 天，依赖：ISSUE-1 + ISSUE-3）
ISSUE-8 商品筛选/搜索/分页（C，1 天，依赖：ISSUE-7）
ISSUE-9 收藏 API（C，1 天，依赖：ISSUE-1 + ISSUE-3）
ISSUE-10 消息 API（C，1.5 天，依赖：ISSUE-1 + ISSUE-3 + ISSUE-6）
ISSUE-11 订单模型与 API（A+C，2 天，依赖：ISSUE-1 + ISSUE-3 + ISSUE-6）
ISSUE-12 本地上传接口（B+C，1 天，依赖：ISSUE-3）
ISSUE-13 集成测试与冒烟验证（B+C，1.5 天，依赖：ISSUE-5 + ISSUE-7 + ISSUE-11）
