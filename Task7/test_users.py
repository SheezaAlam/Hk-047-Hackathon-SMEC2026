import sqlite3
from faker import Faker
import random
from datetime import datetime, timedelta

DB_FILE = 'mini_social.db'

fake = Faker('en_PK')  # Pakistan-specific locale

# Sample post types
POST_TYPES = [
    "quote",
    "life_update",
    "coding_question"
]

QUOTE_EXAMPLES = [
    "Life is what happens when you're busy coding.",
    "Hustle in silence, let success make the noise.",
    "Keep calm and code on.",
    "Strive for progress, not perfection.",
    "Debugging is like being the detective in a crime movie."
]

LIFE_UPDATES = [
    "Had a great chai with friends today!",
    "Just completed my Python project, feeling accomplished.",
    "Busy day at work but learned a lot.",
    "Relaxing weekend, catching up on reading.",
    "Went for a long walk, cleared my head."
]

CODING_QUESTIONS = [
    "How do I optimize this SQL query?",
    "What's the best way to learn Tkinter?",
    "Any tips for handling exceptions in Python?",
    "How can I visualize a network graph efficiently?",
    "What's the difference between list and tuple in Python?"
]

# Connect to DB
conn = sqlite3.connect(DB_FILE)
c = conn.cursor()

NUM_USERS = 10  # Change as needed
POSTS_PER_USER = 5  # Change as needed

user_ids = []

# Create users
for _ in range(NUM_USERS):
    username = fake.first_name() + str(random.randint(1,99))
    password = "password123"
    try:
        c.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
        conn.commit()
        user_id = c.lastrowid
        user_ids.append(user_id)
    except sqlite3.IntegrityError:
        continue

# Create posts
for user_id in user_ids:
    for _ in range(POSTS_PER_USER):
        post_type = random.choice(POST_TYPES)
        if post_type == "quote":
            content = random.choice(QUOTE_EXAMPLES)
        elif post_type == "life_update":
            content = random.choice(LIFE_UPDATES)
        else:  # coding_question
            content = random.choice(CODING_QUESTIONS)
        timestamp = datetime.now() - timedelta(days=random.randint(0, 30))
        c.execute("INSERT INTO posts (user_id, content, timestamp) VALUES (?, ?, ?)",
                  (user_id, content, timestamp))
        conn.commit()

conn.close()
print(f"Generated {len(user_ids)} users with {POSTS_PER_USER} posts each.")

