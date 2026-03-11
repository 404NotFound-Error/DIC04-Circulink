# 🔧 快速故障排除

## 问题：商品图片显示为灰色

### 解决方案

#### 1️⃣ 确保后端服务器运行
后端必须在运行，前端才能加载数据。

```bash
# 在终端中运行
npm run dev:server
```

你会看到输出像这样：
```
Server listening on http://localhost:4000
Connected to database: prisma/dev.db
```

#### 2️⃣ 确保前端在运行
在另一个终端运行前端：

```bash
npm run dev
```

#### 3️⃣ 刷新浏览器
- 按 `Ctrl + F5` (强制刷新，清除缓存)
- 或在浏览器中打开 http://localhost:5173

#### 4️⃣ 检查浏览器控制台
- 按 `F12` 打开开发者工具
- 切换到 "Console" 标签
- 查看是否有红色错误信息

**如果看到 ✅ 标记，说明数据成功加载！**

### 常见错误信息

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| Failed to fetch | 后端未运行 | 运行 `npm run dev:server` |
| 404 not found | API 端点不存在 | 检查后端服务是否正确启动 |
| Network error | CORS 或网络问题 | 检查后端日志 |

### 检查工具

运行诊断工具检查系统状态：

```bash
python diagnose.py
```

应该看到：
```
✅ 数据库检查: 7 个商品
✅ 后端服务器运行正常，返回 7 个商品
```

### 如果仍然不工作

1. **检查数据库**
   ```bash
   # 验证数据库中有商品
   sqlite3 prisma/dev.db "SELECT COUNT(*) FROM Item;"
   ```

2. **检查 .env 配置**
   ```bash
   # 确保这些值存在
   cat .env | grep API
   cat .env | grep DATABASE
   ```

3. **清除缓存和重新启动**
   ```bash
   # 删除 node_modules 并重新安装
   rm -rf node_modules
   npm install
   npm run dev:server
   npm run dev (在另一个终端)
   ```

### 图片更新

所有商品现在使用 dummyimage.com 的图片，这应该可靠加载。

如果图片仍不显示，可能是网络问题。检查网络标签页：
- 按 F12 → Network 标签
- 刷新页面
- 查看图片请求是否返回 200 状态码

---

需要帮助？检查：
- 后端输出日志
- 浏览器控制台错误
- 网络请求状态
