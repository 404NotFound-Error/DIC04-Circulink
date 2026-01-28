#!/usr/bin/env python3
import sqlite3
import os
import sys
from pathlib import Path

def main():
    # 获取项目根目录
    script_dir = Path(__file__).parent.resolve()
    db_path = script_dir / 'prisma' / 'dev.db'
    sql_path = script_dir / 'insert-sample-data.sql'
    
    print("=" * 50)
    print("开始数据重置流程")
    print("=" * 50)
    
    try:
        conn = sqlite3.connect(str(db_path))
        cursor = conn.cursor()
        
        # 步骤 1: 删除旧数据
        print("\n[步骤 1] 删除旧的 Item 记录...")
        try:
            cursor.execute('DELETE FROM "Item"')
            conn.commit()
            deleted_rows = cursor.rowcount
            print(f"✅ 已删除 {deleted_rows} 条旧记录")
        except Exception as e:
            print(f"⚠️  删除数据时出错: {e}")
            print("   继续执行插入操作...")
        
        # 步骤 2: 读取并执行 SQL 脚本
        print("\n[步骤 2] 插入新数据...")
        try:
            with open(sql_path, 'r', encoding='utf-8') as f:
                sql_script = f.read()
            
            # 执行 SQL 脚本
            cursor.executescript(sql_script)
            conn.commit()
            print("✅ 新数据已插入")
        except Exception as e:
            print(f"❌ 插入数据时出错: {e}")
            return False
        
        # 步骤 3: 验证数据
        print("\n[步骤 3] 验证插入的数据...")
        try:
            # 查询使用 dummyimage.com 的商品数量
            cursor.execute(
                'SELECT COUNT(*) FROM "Item" WHERE images LIKE \'%dummyimage.com%\''
            )
            dummy_count = cursor.fetchone()[0]
            
            # 查询总商品数量
            cursor.execute('SELECT COUNT(*) FROM "Item"')
            total_count = cursor.fetchone()[0]
            
            # 查询所有商品详情
            cursor.execute('''
                SELECT id, title, price, images 
                FROM "Item" 
                ORDER BY createdAt
            ''')
            items = cursor.fetchall()
            
            print("\n" + "=" * 50)
            print("📊 数据验证结果:")
            print("=" * 50)
            print(f"✅ 使用 dummyimage.com 的商品数量: {dummy_count}")
            print(f"✅ 数据库中的总商品数量: {total_count}")
            
            print("\n📋 插入的商品列表:")
            print("-" * 50)
            for idx, (item_id, title, price, images) in enumerate(items, 1):
                print(f"{idx}. {title} - ¥{price:.2f}")
                print(f"   ID: {item_id}")
                print(f"   Images: {images[:80]}...")
                print()
            
            # 验证所有商品都使用了 dummyimage.com
            all_valid = all('dummyimage.com' in item[3] for item in items)
            if all_valid:
                print("✅ 所有商品都使用了 dummyimage.com 图片URL!")
            else:
                print("⚠️  有些商品的图片URL不是 dummyimage.com 格式")
            
            print("\n" + "=" * 50)
            print("✅ 数据重置流程完成！")
            print("=" * 50)
            
            return True
            
        except Exception as e:
            print(f"❌ 验证数据时出错: {e}")
            return False
        
    except Exception as e:
        print(f"❌ 错误: {e}")
        return False
    finally:
        if conn:
            conn.close()

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
