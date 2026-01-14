import sqlite3

DB_FILE = 'mini_social.db'

conn = sqlite3.connect(DB_FILE)
c = conn.cursor()

# List all users and how many posts they have
c.execute('''
    SELECT u.username, COUNT(p.id) as post_count
    FROM users u
    LEFT JOIN posts p ON u.id = p.user_id
    GROUP BY u.id
''')

for row in c.fetchall():
    print(f"User: {row[0]} | Posts: {row[1]}")

conn.close()
