import sqlite3
import random

DB_FILE = 'mini_social.db'

conn = sqlite3.connect(DB_FILE)
c = conn.cursor()

# Get all user IDs
c.execute("SELECT id FROM users")
user_ids = [row[0] for row in c.fetchall()]

for user_id in user_ids:
    # Each user follows 2–5 random other users
    num_follows = random.randint(2, min(5, len(user_ids)-1))
    followees = random.sample([u for u in user_ids if u != user_id], num_follows)
    for followee_id in followees:
        try:
            c.execute("INSERT INTO follows (follower_id, followee_id) VALUES (?, ?)", (user_id, followee_id))
        except sqlite3.IntegrityError:
            pass  # Ignore duplicates

conn.commit()
conn.close()
print("Random user follows added!")
