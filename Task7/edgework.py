import sqlite3
import os
import getpass
import argparse
import curses
import tkinter as tk
from tkinter import messagebox, scrolledtext
import networkx as nx
import matplotlib
matplotlib.use("TkAgg")
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg

from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import re
from datetime import datetime, timedelta

# Database setup
DB_FILE = 'mini_social.db'

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()

    c.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT UNIQUE,
        password TEXT
    )
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY,
        user_id INTEGER,
        content TEXT,
        timestamp DATETIME
    )
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY,
        post_id INTEGER,
        user_id INTEGER,
        content TEXT,
        timestamp DATETIME
    )
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS likes (
        id INTEGER PRIMARY KEY,
        post_id INTEGER,
        user_id INTEGER,
        UNIQUE(post_id, user_id)
    )
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS follows (
        id INTEGER PRIMARY KEY,
        follower_id INTEGER,
        followee_id INTEGER,
        UNIQUE(follower_id, followee_id)
    )
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS activity_log (
        id INTEGER PRIMARY KEY,
        user_id INTEGER,
        action TEXT,
        timestamp DATETIME
    )
    """)

    conn.commit()
    conn.close()
    
init_db()
# Spam/Bot filtering basics
SPAM_KEYWORDS = ['spam', 'buy now', 'viagra', 'free money', 'click here']  # Simple keyword filter
RATE_LIMIT_ACTIONS = 10  # Max actions per minute
RATE_LIMIT_TIME = timedelta(minutes=1)

def is_spam(content):
    return any(word in content.lower() for word in SPAM_KEYWORDS)

def log_activity(user_id, action):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("INSERT INTO activity_log (user_id, action, timestamp) VALUES (?, ?, ?)",
              (user_id, action, datetime.now()))
    conn.commit()
    conn.close()

def check_rate_limit(user_id):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    one_min_ago = datetime.now() - RATE_LIMIT_TIME
    c.execute("SELECT COUNT(*) FROM activity_log WHERE user_id = ? AND timestamp > ?",
              (user_id, one_min_ago))
    count = c.fetchone()[0]
    conn.close()
    return count < RATE_LIMIT_ACTIONS

# Core functions
def register(username, password):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    try:
        c.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
        conn.commit()
        return True
    except sqlite3.IntegrityError:
        return False
    finally:
        conn.close()

def login(username, password):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("SELECT id FROM users WHERE username = ? AND password = ?", (username, password))
    user_id = c.fetchone()
    conn.close()
    return user_id[0] if user_id else None

def create_post(user_id, content):
    if is_spam(content) or not check_rate_limit(user_id):
        return False
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("INSERT INTO posts (user_id, content, timestamp) VALUES (?, ?, ?)",
              (user_id, content, datetime.now()))
    conn.commit()
    log_activity(user_id, 'post')
    conn.close()
    return True

def create_comment(user_id, post_id, content):
    if is_spam(content) or not check_rate_limit(user_id):
        return False
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("INSERT INTO comments (post_id, user_id, content, timestamp) VALUES (?, ?, ?, ?)",
              (post_id, user_id, content, datetime.now()))
    conn.commit()
    log_activity(user_id, 'comment')
    conn.close()
    return True

def like_post(user_id, post_id):
    if not check_rate_limit(user_id):
        return False
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    try:
        c.execute("INSERT INTO likes (post_id, user_id) VALUES (?, ?)", (post_id, user_id))
        conn.commit()
        log_activity(user_id, 'like')
        return True
    except sqlite3.IntegrityError:
        return False
    finally:
        conn.close()

def get_all_users():
    """Returns a list of all usernames in the database"""
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("SELECT username FROM users ORDER BY username ASC")
    users = [row[0] for row in c.fetchall()]
    conn.close()
    return users

def follow_user(follower_id, followee_id):
    if follower_id == followee_id or not check_rate_limit(follower_id):
        return False
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    try:
        c.execute("INSERT INTO follows (follower_id, followee_id) VALUES (?, ?)", (follower_id, followee_id))
        conn.commit()
        log_activity(follower_id, 'follow')
        return True
    except sqlite3.IntegrityError:
        return False
    finally:
        conn.close()

def get_user_id(username):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("SELECT id FROM users WHERE username = ?", (username,))
    user_id = c.fetchone()
    conn.close()
    return user_id[0] if user_id else None

def get_username(user_id):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("SELECT username FROM users WHERE id = ?", (user_id,))
    username = c.fetchone()
    conn.close()
    return username[0] if username else None

def get_feed(user_id):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''SELECT p.id, u.username, p.content, COUNT(l.id) as likes, COUNT(c.id) as comments
                 FROM posts p
                 JOIN users u ON p.user_id = u.id
                 LEFT JOIN likes l ON p.id = l.post_id
                 LEFT JOIN comments c ON p.id = c.post_id
                 WHERE p.user_id IN (SELECT followee_id FROM follows WHERE follower_id = ?)
                 OR p.user_id = ?
                 GROUP BY p.id
                 ORDER BY p.timestamp DESC''', (user_id, user_id))
    feed = c.fetchall()
    conn.close()
    return feed

def get_post_comments(post_id):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''SELECT u.username, com.content
                 FROM comments com
                 JOIN users u ON com.user_id = u.id
                 WHERE com.post_id = ?
                 ORDER BY com.timestamp DESC''', (post_id,))
    comments = c.fetchall()
    conn.close()
    return comments

def get_followers(user_id):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("SELECT follower_id FROM follows WHERE followee_id = ?", (user_id,))
    followers = [row[0] for row in c.fetchall()]
    conn.close()
    return followers

def get_following(user_id):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("SELECT followee_id FROM follows WHERE follower_id = ?", (user_id,))
    following = [row[0] for row in c.fetchall()]
    conn.close()
    return following

def build_network_graph(user_id):
    G = nx.DiGraph()
    username = get_username(user_id)
    if not username:
        return G  # user not found, return empty graph

    G.add_node(username, label=username)

    followers = get_followers(user_id)
    following = get_following(user_id)

    # Add followers
    for fol_id in followers:
        fol_name = get_username(fol_id)
        if fol_name:  # skip invalid/missing users
            G.add_node(fol_name, label=fol_name)
            G.add_edge(fol_name, username)  # follower -> user

    # Add following
    for fol_id in following:
        fol_name = get_username(fol_id)
        if fol_name:  # skip invalid/missing users
            G.add_node(fol_name, label=fol_name)
            G.add_edge(username, fol_name)  # user -> following

    return G


def ascii_graph(G):
    # Simple ASCII representation (list nodes and edges)
    output = "Network Graph:\n"
    for node in G.nodes:
        output += f"Node: {node}\n"
    for edge in G.edges:
        output += f"Edge: {edge[0]} -> {edge[1]}\n"
    return output

# TUI with curses (cyberpunk/console vibes, standard colors)
def tui_main(stdscr, user_id):
    curses.curs_set(0)
    stdscr.clear()
    height, width = stdscr.getmaxyx()
    
    def display_menu():
        stdscr.clear()
        stdscr.addstr(0, 0, "Mini Social - TUI Mode (Cyberpunk Console)", curses.A_BOLD)
        stdscr.addstr(2, 0, "1: View Feed")
        stdscr.addstr(3, 0, "2: Create Post")
        stdscr.addstr(4, 0, "3: View Profile")
        stdscr.addstr(5, 0, "4: Follow User")
        stdscr.addstr(6, 0, "5: View Network Graph")
        stdscr.addstr(7, 0, "6: Discover Users")
        stdscr.addstr(8, 0, "h: User Manual")
        stdscr.addstr(9, 0, "q: Quit")
        stdscr.refresh()
    def tui_help(stdscr):
        stdscr.clear()
        stdscr.addstr(0, 0, "Edgework TUI Commands:", curses.A_BOLD)
        commands = [
            "1 - View Feed: See posts from users you follow",
            "2 - Create Post: Make your own post",
            "3 - View Profile: See your followers/following",
            "4 - Follow User: Follow a user by username",
            "5 - View Network Graph: See your connections",
            "6 - Discover Users: List all registered users",
            "h - Help: Show this command list",
            "q - Quit: Exit the app"
        ]
        for i, cmd in enumerate(commands):
            stdscr.addstr(i+2, 0, cmd)
        stdscr.refresh()
        stdscr.getkey()

    def view_feed():
        feed = get_feed(user_id)
        stdscr.clear()
        stdscr.addstr(0, 0, "Your Feed:")
        row = 2
        for post in feed:
            post_id, username, content, likes, comments = post
            stdscr.addstr(row, 0, f"{username}: {content} [Likes: {likes}, Comments: {comments}]")
            stdscr.addstr(row + 1, 0, f"  - l to like, c to comment")
            row += 3
            if row > height - 2:
                break
        stdscr.refresh()
        key = stdscr.getkey()
        if key == 'l':
            post_id = int(stdscr.getstr(row, 0, "Enter post ID to like: "))
            like_post(user_id, post_id)
        elif key == 'c':
            post_id = int(stdscr.getstr(row, 0, "Enter post ID to comment: "))
            content = stdscr.getstr(row + 1, 0, "Comment: ")
            create_comment(user_id, post_id, content)

    def create_post_tui():
        stdscr.clear()
        stdscr.addstr(0, 0, "Create Post (text only, minimal):")
        content = stdscr.getstr(2, 0, "Content: ")
        create_post(user_id, content)

    def view_profile():
        followers = len(get_followers(user_id))
        following = len(get_following(user_id))
        stdscr.clear()
        stdscr.addstr(0, 0, f"Profile: {get_username(user_id)}")
        stdscr.addstr(2, 0, f"Followers: {followers}")
        stdscr.addstr(3, 0, f"Following: {following}")
        stdscr.refresh()
    
    def view_all_users_tui(stdscr):
        stdscr.clear()
        stdscr.addstr(0, 0, "Discover Users:", curses.A_BOLD)
        users = get_all_users()
        row = 2
        for username in users:
            stdscr.addstr(row, 0, username)
            row += 1
            if row > curses.LINES - 2:
                stdscr.addstr(row, 0, "--More--")
                stdscr.getkey()
                stdscr.clear()
                row = 0
        stdscr.refresh()
        stdscr.getkey()

    def follow_user_tui():
        stdscr.clear()
        stdscr.addstr(0, 0, "Follow User:")
        username = stdscr.getstr(2, 0, "Username: ")
        followee_id = get_user_id(username)
        if followee_id:
            follow_user(user_id, followee_id)

    def view_graph_tui():
        G = build_network_graph(user_id)
        ascii = ascii_graph(G)
        stdscr.clear()
        stdscr.addstr(0, 0, ascii)
        stdscr.refresh()
        stdscr.getkey()

    while True:
        display_menu()
        key = stdscr.getkey()
        if key == '1':
            view_feed()
        elif key == '2':
            create_post_tui()
        elif key == '3':
            view_profile()
        elif key == '4':
            follow_user_tui()
        elif key == '5':
            view_graph_tui()
        elif key == '6':
            view_all_users_tui(stdscr)
        elif key == 'h':
            tui_help(stdscr)
        elif key == 'q':
            break

# GUI with Tkinter (pastel green, cozy vibes)
class GuiApp(tk.Tk):
    COLORS = {
        "ash_grey": "#cad2c5",
        "muted_teal": "#84a98c",
        "deep_teal": "#52796f",
        "dark_slate": "#354f52",
        "charcoal_blue": "#2f3e46",
    }

    def __init__(self, user_id):
        super().__init__()
        self.user_id = user_id
        self.title("Edgework - Minimal Social")
        self.configure(bg=self.COLORS["ash_grey"])
        self.geometry("950x650")
        self.resizable(False, False)

        self.create_styles()
        self.create_layout()

    def create_styles(self):
        self.button_style = {
            "bg": self.COLORS["muted_teal"],
            "fg": "white",
            "activebackground": self.COLORS["deep_teal"],
            "activeforeground": "white",
            "bd": 0,
            "relief": "flat",
            "font": ("Helvetica", 12, "bold"),
            "padx": 15,
            "pady": 10,
        }
        self.entry_style = {
            "bg": "white",
            "fg": self.COLORS["charcoal_blue"],
            "bd": 1,
            "highlightthickness": 1,
            "highlightcolor": self.COLORS["deep_teal"],
            "font": ("Helvetica", 11),
            "insertbackground": self.COLORS["charcoal_blue"]
        }
        self.card_style = {
            "bg": "white",
            "bd": 0,
            "relief": "flat",
            "padx": 10,
            "pady": 10
        }

    def create_layout(self):
        # Left navigation menu
        self.menu_frame = tk.Frame(self, bg=self.COLORS["ash_grey"])
        self.menu_frame.pack(side=tk.LEFT, fill=tk.Y, padx=10, pady=10)

        menu_buttons = [
            ("Discover Users", self.view_all_users_gui),
            ("View Feed", self.view_feed),
            ("Create Post", self.create_post_gui),
            ("View Profile", self.view_profile),
            ("Follow User", self.follow_user_gui),
            ("Network Graph", self.view_graph_gui),
            ("Quit", self.quit)
        ]
        for text, command in menu_buttons:
            btn = tk.Button(self.menu_frame, text=text, command=command, **self.button_style)
            btn.pack(pady=8, fill=tk.X)

        # Main content area
        self.content_frame = tk.Frame(self, bg=self.COLORS["ash_grey"])
        self.content_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True, padx=10, pady=10)

        self.welcome_label = tk.Label(
            self.content_frame, 
            text=f"Welcome, {get_username(self.user_id)}!",
            bg=self.COLORS["ash_grey"], fg=self.COLORS["charcoal_blue"],
            font=("Helvetica", 16, "bold")
        )
        self.welcome_label.pack(pady=20)

    def clear_content(self):
        for widget in self.content_frame.winfo_children():
            if widget != self.welcome_label:
                widget.destroy()

    # Display posts as cards
    def view_feed(self):
        self.clear_content()
        feed = get_feed(self.user_id)
        feed_frame = tk.Frame(self.content_frame, bg=self.COLORS["ash_grey"])
        feed_frame.pack(fill=tk.BOTH, expand=True, pady=5)

        for post in feed:
            post_id, username, content, likes, comments = post
            card = tk.Frame(feed_frame, **self.card_style)
            card.pack(fill=tk.X, pady=5)

            tk.Label(card, text=username, font=("Helvetica", 12, "bold"), bg="white", fg=self.COLORS["deep_teal"]).pack(anchor='w')
            tk.Label(card, text=content, font=("Helvetica", 11), bg="white", wraplength=600, justify="left").pack(anchor='w', pady=5)
            tk.Label(card, text=f"Likes: {likes} | Comments: {comments}", font=("Helvetica", 10), bg="white", fg=self.COLORS["charcoal_blue"]).pack(anchor='w')


    def create_post_gui(self):
        self.clear_content()
        tk.Label(self.content_frame, text="Create a Post:", bg=self.COLORS["ash_grey"], fg=self.COLORS["charcoal_blue"], font=("Helvetica", 14, "bold")).pack(pady=10)
        content_entry = tk.Entry(self.content_frame, **self.entry_style, width=50)
        content_entry.pack(pady=10)
        tk.Button(self.content_frame, text="Post", command=lambda: [create_post(self.user_id, content_entry.get()), messagebox.showinfo("Success", "Posted!")], **self.button_style).pack(pady=5)

    def view_profile(self):
        self.clear_content()
        followers = len(get_followers(self.user_id))
        following = len(get_following(self.user_id))
        tk.Label(
            self.content_frame,
            text=f"Profile: {get_username(self.user_id)}\nFollowers: {followers}\nFollowing: {following}",
            bg=self.COLORS["ash_grey"], fg=self.COLORS["charcoal_blue"], font=("Helvetica", 14)
        ).pack(pady=20)
    
    def view_all_users_gui(self):
        self.clear_content()
        tk.Label(self.content_frame, text="Discover Users:", bg=self.COLORS["ash_grey"], fg=self.COLORS["charcoal_blue"], font=("Helvetica", 14, "bold")).pack(pady=10)
        users = get_all_users()
        users_frame = tk.Frame(self.content_frame, bg=self.COLORS["ash_grey"])
        users_frame.pack(pady=5, fill=tk.BOTH, expand=True)

        for username in users:
            tk.Label(users_frame, text=username, bg=self.COLORS["ash_grey"], fg=self.COLORS["charcoal_blue"], font=("Helvetica", 12)).pack(anchor='w', pady=2)

    def follow_user_gui(self):
        self.clear_content()
        tk.Label(self.content_frame, text="Follow a User:", bg=self.COLORS["ash_grey"], fg=self.COLORS["charcoal_blue"], font=("Helvetica", 14)).pack(pady=10)
        username_entry = tk.Entry(self.content_frame, **self.entry_style)
        username_entry.pack(pady=5)
        tk.Button(self.content_frame, text="Follow", command=lambda: [follow_user(self.user_id, get_user_id(username_entry.get())), messagebox.showinfo("Success", "Followed!")], **self.button_style).pack(pady=5)

    def view_graph_gui(self):
        self.clear_content()

        G = build_network_graph(self.user_id)

        if G.number_of_nodes() <= 1:
            tk.Label(
                self.content_frame,
                text="Your network is empty 🌱\nFollow users to grow your graph",
                bg=self.COLORS["ash_grey"],
                fg=self.COLORS["charcoal_blue"],
                font=("Helvetica", 14)
            ).pack(pady=40)
            return

        # Create matplotlib figure
        fig = plt.Figure(figsize=(6, 6), dpi=100)
        ax = fig.add_subplot(111)
        pos = nx.spring_layout(G, seed=42)

        nx.draw(
            G,
            pos,
            ax=ax,
            with_labels=True,
            node_size=900,
            node_color=self.COLORS["muted_teal"],  # Fixed color
            edge_color=self.COLORS["deep_teal"],
            font_color="#344e41"
        )

        # Embed in Tkinter
        canvas = FigureCanvasTkAgg(fig, master=self.content_frame)
        canvas.get_tk_widget().pack(fill=tk.BOTH, expand=True)

        # Draw and refresh
        canvas.draw()
        self.update_idletasks()


# Main entry
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--mode', choices=['tui', 'gui'], default='tui', help="UI mode: tui or gui")
    args = parser.parse_args()

    print("Welcome to Mini Social (Inspired by Tumblr/Pinterest, minimal cozy vibes)")

    user_id = None

    if args.mode == 'tui':
        choice = input("1: Register, 2: Login: ")
        if choice == '1':
            username = input("Username: ")
            password = getpass.getpass("Password: ")
            if register(username, password):
                print("Registered!")
            else:
                print("Username taken.")
                return
        username = input("Username: ")
        password = getpass.getpass("Password: ")
        user_id = login(username, password)
        if not user_id:
            print("Invalid login.")
            return
        curses.wrapper(tui_main, user_id)

    elif args.mode == 'gui':
        # For now, auto-login a test user; GUI should have its own login screen
        user_id = get_user_id("testuser")
        if not user_id:
            register("testuser", "password")
            user_id = get_user_id("testuser")
        app = GuiApp(user_id)
        app.mainloop()


if __name__ == "__main__":
    main()