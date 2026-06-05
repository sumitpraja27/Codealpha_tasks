import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getDb } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Ensure uploads directory exists
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (jpg, jpeg, png, webp, gif) are allowed!'));
    }
  }
});

// GET /api/posts - Get global feed
router.get('/', authenticateToken, async (req, res) => {
  try {
    const db = getDb();
    const posts = await db.all(`
      SELECT 
        p.id, p.content, p.image_url, p.created_at,
        u.id AS author_id, u.username AS author_username, u.avatar_url AS author_avatar,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS likes_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comments_count,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND user_id = ?) AS is_liked
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `, [req.user.id]);

    res.json(posts);
  } catch (error) {
    console.error('Fetch feed error:', error);
    res.status(500).json({ error: 'Failed to fetch posts feed' });
  }
});

// POST /api/posts - Create new post
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  const { content } = req.body;
  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'Post content cannot be empty' });
  }

  let imageUrl = null;
  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  }

  try {
    const db = getDb();
    const result = await db.run(
      'INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)',
      [req.user.id, content.trim(), imageUrl]
    );

    const postId = result.lastID;
    
    // Fetch newly created post with details
    const newPost = await db.get(`
      SELECT 
        p.id, p.content, p.image_url, p.created_at,
        u.id AS author_id, u.username AS author_username, u.avatar_url AS author_avatar,
        0 AS likes_count,
        0 AS comments_count,
        0 AS is_liked
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [postId]);

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// DELETE /api/posts/:id - Delete post
router.delete('/:id', authenticateToken, async (req, res) => {
  const postId = req.params.id;

  try {
    const db = getDb();
    const post = await db.get('SELECT * FROM posts WHERE id = ?', [postId]);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to delete this post' });
    }

    // Delete post image file if it exists
    if (post.image_url) {
      const filename = path.basename(post.image_url);
      const filePath = path.join(uploadsDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await db.run('DELETE FROM posts WHERE id = ?', [postId]);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// POST /api/posts/:id/like - Like/Unlike toggle
router.post('/:id/like', authenticateToken, async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  try {
    const db = getDb();
    
    // Check if post exists
    const post = await db.get('SELECT id FROM posts WHERE id = ?', [postId]);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if already liked
    const like = await db.get('SELECT 1 FROM likes WHERE post_id = ? AND user_id = ?', [postId, userId]);

    if (like) {
      // Unlike
      await db.run('DELETE FROM likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
      res.json({ liked: false, message: 'Post unliked successfully' });
    } else {
      // Like
      await db.run('INSERT INTO likes (post_id, user_id) VALUES (?, ?)', [postId, userId]);
      res.json({ liked: true, message: 'Post liked successfully' });
    }
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

export default router;
