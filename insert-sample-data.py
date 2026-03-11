#!/usr/bin/env python3
import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'prisma', 'dev.db')
sql_path = os.path.join(os.path.dirname(__file__), 'insert-sample-data.sql')

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    with open(sql_path, 'r') as f:
        sql_script = f.read()
    
    # Execute the SQL script
    cursor.executescript(sql_script)
    conn.commit()
    
    # Verify data was inserted
    cursor.execute("SELECT COUNT(*) FROM Item")
    item_count = cursor.fetchone()[0]
    
    print(f"✅ Sample data inserted successfully!")
    print(f"   Total items in database: {item_count}")
    
except Exception as e:
    print(f"❌ Error: {e}")
    exit(1)
finally:
    if conn:
        conn.close()
