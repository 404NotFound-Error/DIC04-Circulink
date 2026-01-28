# 启动 CircuLink 应用指南

## 已完成的工作

✅ 数据库已初始化（SQLite）
✅ 7 个示例商品已插入数据库
✅ 6 个商品分类已创建
✅ 2 个卖家用户已创建
✅ 后端 API 已配置完成

## 启动步骤

### 1. 启动后端服务器

```bash
# 进入项目目录
cd d:\git_download\DIC04-Circulink

# 启动开发服务器（需要两个终端）
npm run dev:server
```

服务器将运行在 http://localhost:4000

### 2. 启动前端开发服务器

```bash
# 在另一个终端
npm run dev
```

前端将运行在 http://localhost:5173（或其他端口）

### 3. 查看数据

- 访问首页 http://localhost:5173/
- 点击"Start Shopping"进入商品列表
- 应该看到 7 个示例商品（不再是灰色的）
- 点击任何商品卡片进入详情页

## 示例商品列表

1. Arduino Uno R3 - $158.00
2. Raspberry Pi 4B 4GB - $299.00
3. Digital Multimeter - $79.00
4. Breadboard Starter Kit - $45.00
5. Assorted Resistor Pack - $26.00
6. 128x64 OLED Display - $36.00
7. Li-ion Battery Pack (2x 18650) - $52.00

## 常见问题

### Q: 商品仍然显示为灰色/占位符图片？
A: 这是正常的，因为使用的是 placeholder 图片 URL。它们会加载但可能速度较慢。

### Q: 无法连接到 API？
A: 确保：
1. 后端服务器正在运行（npm run dev:server）
2. .env 文件中有 VITE_API_URL=http://localhost:4000/api
3. 没有防火墙阻止端口 4000

### Q: 数据库操作失败？
A: 如果需要重新填充数据，运行：
```bash
python insert-sample-data.py
```

## 下一步

- 测试商品详情页面功能
- 测试筛选和搜索
- 测试分类页面
- 实现图片上传功能
