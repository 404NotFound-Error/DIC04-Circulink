#!/usr/bin/env pwsh

# 定义路径
$projectRoot = "d:\git_download\DIC04-Circulink"
$dbPath = Join-Path $projectRoot "prisma" "dev.db"
$pythonScript = Join-Path $projectRoot "insert-sample-data.py"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "开始数据重置流程" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 步骤 1: 删除旧数据
Write-Host "`n[步骤 1] 删除旧的 Item 记录..." -ForegroundColor Yellow

try {
    $sqliteCommand = @"
    SQLite3.exe "$dbPath" "DELETE FROM `"Item`";"
"@
    
    # 尝试使用 sqlite3 命令行
    if (Get-Command sqlite3 -ErrorAction SilentlyContinue) {
        sqlite3 "$dbPath" "DELETE FROM `"Item`";"
        Write-Host "✅ 旧数据已删除" -ForegroundColor Green
    } else {
        Write-Host "⚠️  sqlite3 未找到，将跳过手动删除（Python 脚本可能会处理）" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  删除数据时出错: $_" -ForegroundColor Yellow
}

# 步骤 2: 运行 Python 脚本
Write-Host "`n[步骤 2] 运行 Python 数据插入脚本..." -ForegroundColor Yellow

try {
    cd $projectRoot
    python insert-sample-data.py
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Python 脚本执行成功" -ForegroundColor Green
    } else {
        Write-Host "❌ Python 脚本执行失败" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ 执行 Python 脚本时出错: $_" -ForegroundColor Red
    exit 1
}

# 步骤 3: 验证数据
Write-Host "`n[步骤 3] 验证插入的数据..." -ForegroundColor Yellow

try {
    if (Get-Command sqlite3 -ErrorAction SilentlyContinue) {
        $output = sqlite3 "$dbPath" "SELECT COUNT(*) FROM `"Item`" WHERE images LIKE '%dummyimage.com%';"
        $itemCount = $output
        
        Write-Host "`n========================================" -ForegroundColor Cyan
        Write-Host "📊 数据验证结果:" -ForegroundColor Cyan
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "✅ 使用 dummyimage.com 的商品数量: $itemCount" -ForegroundColor Green
        
        # 获取总数量
        $totalCount = sqlite3 "$dbPath" "SELECT COUNT(*) FROM `"Item`";"
        Write-Host "✅ 数据库中的总商品数量: $totalCount" -ForegroundColor Green
        
        # 显示所有商品
        Write-Host "`n📋 插入的商品列表:" -ForegroundColor Cyan
        $items = sqlite3 "$dbPath" "SELECT id, title, price FROM `"Item`" ORDER BY createdAt;"
        Write-Host $items -ForegroundColor White
        
    } else {
        Write-Host "⚠️  无法使用 sqlite3 验证数据" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ 验证数据时出错: $_" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✅ 数据重置流程完成！" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
