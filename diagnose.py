#!/usr/bin/env python3
import subprocess
import time
import requests
import sqlite3

def check_database():
    """检查数据库中是否有数据"""
    db_path = 'prisma/dev.db'
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM Item")
        count = cursor.fetchone()[0]
        print(f"✅ 数据库检查: {count} 个商品")
        return count > 0
    except Exception as e:
        print(f"❌ 数据库检查失败: {e}")
        return False
    finally:
        conn.close()

def check_backend():
    """检查后端服务器是否运行"""
    try:
        response = requests.get('http://localhost:4000/api/items', timeout=5)
        if response.status_code == 200:
            data = response.json()
            item_count = len(data.get('data', []))
            print(f"✅ 后端服务器运行正常，返回 {item_count} 个商品")
            return True
        else:
            print(f"⚠️  后端返回状态码: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print(f"❌ 无法连接到后端服务器 (http://localhost:4000)")
        print("   请运行: npm run dev:server")
        return False
    except Exception as e:
        print(f"❌ 后端检查失败: {e}")
        return False

def main():
    print("🔍 CircuLink 诊断工具")
    print("=" * 50)
    
    # 检查数据库
    print("\n1️⃣  检查数据库...")
    db_ok = check_database()
    
    # 检查后端
    print("\n2️⃣  检查后端服务器...")
    backend_ok = check_backend()
    
    print("\n" + "=" * 50)
    print("\n📋 诊断结果:")
    print(f"  数据库: {'✅' if db_ok else '❌'}")
    print(f"  后端: {'✅' if backend_ok else '❌'}")
    
    if not backend_ok:
        print("\n❗ 后端服务器未启动!")
        print("\n🚀 请在新终端运行:")
        print("   npm run dev:server")
        print("\n然后在另一个终端运行:")
        print("   npm run dev")

if __name__ == '__main__':
    main()
