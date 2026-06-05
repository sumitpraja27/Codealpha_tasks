import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'social.db');

let db;

export async function initDb() {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Enable foreign key constraints
  await db.run('PRAGMA foreign_keys = ON;');

  // Create tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      bio TEXT DEFAULT '',
      avatar_url TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS likes (
      post_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      PRIMARY KEY (post_id, user_id),
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS follows (
      follower_id INTEGER NOT NULL,
      following_id INTEGER NOT NULL,
      PRIMARY KEY (follower_id, following_id),
      FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Seed dummy database if users table is empty
  const userCount = await db.get('SELECT COUNT(*) AS count FROM users');
  if (userCount.count === 0) {
    console.log('Seeding dummy database...');
    
    // Hash password 'password123'
    const passwordHash = await bcrypt.hash('password123', 10);
    
    // Insert Users
    const aliceAvatar = 'https://api.dicebear.com/7.x/adventurer/svg?seed=alice';
    const bobAvatar = 'https://api.dicebear.com/7.x/adventurer/svg?seed=bob';
    const charlieAvatar = 'https://api.dicebear.com/7.x/adventurer/svg?seed=charlie';

    const user1 = await db.run(
      'INSERT INTO users (username, email, password_hash, bio, avatar_url) VALUES (?, ?, ?, ?, ?)',
      ['alice', 'alice@example.com', passwordHash, 'Travel enthusiast & photographer. Sharing my views of the world. 🌍📸', aliceAvatar]
    );
    const user2 = await db.run(
      'INSERT INTO users (username, email, password_hash, bio, avatar_url) VALUES (?, ?, ?, ?, ?)',
      ['bob', 'bob@example.com', passwordHash, 'Software Engineer. I turn coffee into code ☕💻. Open source lover.', bobAvatar]
    );
    const user3 = await db.run(
      'INSERT INTO users (username, email, password_hash, bio, avatar_url) VALUES (?, ?, ?, ?, ?)',
      ['charlie', 'charlie@example.com', passwordHash, 'Food blogger & home chef. Cooking is love made visible. 🍜🍰', charlieAvatar]
    );

    const aliceId = user1.lastID;
    const bobId = user2.lastID;
    const charlieId = user3.lastID;

    // Insert Posts
    const post1 = await db.run(
      'INSERT INTO posts (user_id, content) VALUES (?, ?)',
      [aliceId, 'Just landed in Kyoto! The cherry blossoms are breathtaking. 🌸🇯🇵']
    );
    await db.run(
      'INSERT INTO posts (user_id, content) VALUES (?, ?)',
      [aliceId, 'Chasing sunsets is my favorite therapy. 🌅']
    );
    const post3 = await db.run(
      'INSERT INTO posts (user_id, content) VALUES (?, ?)',
      [bobId, "Spent all night debugging a single semicolon. We've all been there! 😭💻"]
    );
    await db.run(
      'INSERT INTO posts (user_id, content) VALUES (?, ?)',
      [bobId, 'React 19 looks extremely promising. What features are you most excited about?']
    );
    const post5 = await db.run(
      'INSERT INTO posts (user_id, content) VALUES (?, ?)',
      [charlieId, 'Homemade sourdough bread fresh out of the oven! The smell is amazing. 🍞😍']
    );

    const aliceKyotoPostId = post1.lastID;
    const charlieBreadPostId = post5.lastID;

    // Insert Comments
    await db.run(
      'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
      [aliceKyotoPostId, bobId, 'Wow! Kyoto is on my bucket list. Enjoy your trip! ✈️']
    );
    await db.run(
      'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
      [aliceKyotoPostId, charlieId, 'Hope you try some authentic ramen there! 🍜']
    );
    await db.run(
      'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
      [charlieBreadPostId, aliceId, 'That looks delicious, Charlie! Can you share the recipe?']
    );
    await db.run(
      'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
      [charlieBreadPostId, bobId, 'Perfect crust! Teach me your ways.']
    );

    // Insert Likes
    await db.run('INSERT INTO likes (post_id, user_id) VALUES (?, ?)', [aliceKyotoPostId, bobId]);
    await db.run('INSERT INTO likes (post_id, user_id) VALUES (?, ?)', [aliceKyotoPostId, charlieId]);
    await db.run('INSERT INTO likes (post_id, user_id) VALUES (?, ?)', [charlieBreadPostId, aliceId]);
    await db.run('INSERT INTO likes (post_id, user_id) VALUES (?, ?)', [charlieBreadPostId, bobId]);

    // Insert Follows
    await db.run('INSERT INTO follows (follower_id, following_id) VALUES (?, ?)', [aliceId, bobId]);
    await db.run('INSERT INTO follows (follower_id, following_id) VALUES (?, ?)', [bobId, aliceId]);
    await db.run('INSERT INTO follows (follower_id, following_id) VALUES (?, ?)', [bobId, charlieId]);
    await db.run('INSERT INTO follows (follower_id, following_id) VALUES (?, ?)', [charlieId, aliceId]);

    console.log('Dummy database seeded successfully.');
  }

  console.log('Database initialized successfully.');
  return db;
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.');
  }
  return db;
}
