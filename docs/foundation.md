# 项目基础定义（MVP 版）

本文件用于落地「项目基础」的关键约定，后续如有调整需同步更新。

## 1) 产品范围
### 角色
- 游客：可浏览商品与分类。
- 注册用户：既可作为买家也可作为卖家（同一账号）。
- 管理员：可管理分类、处理举报与审核（MVP 可暂不开放）。

### 交易规则
- 订单状态：`pending -> accepted -> paid -> completed`。
- 取消规则：`pending` 或 `accepted` 可进入 `canceled`。
- 商品状态：`available / reserved / sold`（与订单状态关联）。

### 支付范围
- MVP 不接入真实支付渠道。
- 订单记录保留价格与状态字段，为后续接入支付预留扩展点。

## 2) API 契约
### 成功响应
- 单资源：`{ "data": {...} }`
- 列表：`{ "data": [...], "meta": { "page": 1, "pageSize": 20, "total": 120 } }`

### 错误响应
- 统一结构：`{ "error": { "code": "SOME_ERROR", "message": "Human readable message", "requestId": "..." } }`

### 分页参数
- 请求：`page`、`pageSize`
- 响应：`meta.page`、`meta.pageSize`、`meta.total`

## 3) 分类与上架规则
### 默认分类
- electronics
- books
- furniture
- clothing
- sports
- entertainment
- music
- other

### 上架校验（MVP）
- 必填：`title`、`price`、`category`、`condition`
- 可选：`description`、`images`
- 默认：`status = available`

### 审核策略
- MVP 不设审核，默认直接上架。
- 后续可增加「待审核」状态与管理员审核流程。

## 4) 环境策略
### 本地
- 前端：`VITE_API_BASE_URL=http://localhost:4000`
- 后端：`DATABASE_URL` 指向本地 Postgres

### 测试
- 使用独立测试库
- 允许运行种子数据脚本

### 生产
- 使用托管数据库
- 只读种子，禁止覆盖生产数据
- 密钥与日志独立管理

