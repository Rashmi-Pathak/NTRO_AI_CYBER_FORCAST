import sqlite3
import json
conn = sqlite3.connect('backend/data/ntro_cyber.db')
cursor = conn.cursor()
cursor.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name IN ('incidents', 'ml_models')")
for row in cursor.fetchall():
    print(row[0])
conn.close()
