import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getDb } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

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
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit for avatars
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

// GET /api/users/:username - Get user profile
router.get('/:username', authenticateToken, async (req, res) => {
  const username = req.params.username.toLowerCase();

  try {
    const db = getDb();
    
    // Get user base info
    const user = await db.get(
      'SELECT id, username, bio, avatar_url, created_at FROM users WHERE username = ?',
      [username]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get statistics
    const stats = await db.get(`
      SELECT 
        (SELECT COUNT(*) FROM posts WHERE user_id = ?) AS posts_count,
        (SELECT COUNT(*) FROM follows WHERE following_id = ?) AS followers_count,
        (SELECT COUNT(*) FROM follows WHERE follower_id = ?) AS following_count,
        (SELECT COUNT(*) FROM follows WHERE follower_id = ? AND following_id = ?) AS is_following
    `, [user.id, user.id, user.id, req.user.id, user.id]);

    // Get user's posts
    const posts = await db.all(`
      SELECT 
        p.id, p.content, p.image_url, p.created_at,
        u.id AS author_id, u.username AS author_username, u.avatar_url AS author_avatar,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS likes_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comments_count,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND user_id = ?) AS is_liked
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
    `, [req.user.id, user.id]);

    res.json({
      user: {
        ...user,
        posts_count: stats.posts_count,
        followers_count: stats.followers_count,
        following_count: stats.following_count,
        is_following: stats.is_following > 0
      },
      posts
    });
  } catch (error) {
    console.error('Fetch profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PUT /api/users/profile - Update bio and avatar
router.put('/profile', authenticateToken, upload.single('avatar'), async (req, res) => {
  const { bio } = req.body;
  const userId = req.user.id;

  try {
    const db = getDb();
    
    // Fetch current user details
    const currentUser = await db.get('SELECT avatar_url, bio FROM users WHERE id = ?', [userId]);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    let avatarUrl = currentUser.avatar_url;
    if (req.file) {
      avatarUrl = `/uploads/${req.file.filename}`;
      
      // Try deleting old avatar if it's an uploaded file (starts with /uploads/)
      if (currentUser.avatar_url && currentUser.avatar_url.startsWith('/uploads/')) {
        const oldFilename = path.basename(currentUser.avatar_url);
        const oldFilePath = path.join(uploadsDir, oldFilename);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    const updatedBio = bio !== undefined ? bio.trim() : currentUser.bio;

    await db.run(
      'UPDATE users SET bio = ?, avatar_url = ? WHERE id = ?',
      [updatedBio, avatarUrl, userId]
    );

    const updatedUser = await db.get(
      'SELECT id, username, email, bio, avatar_url, created_at FROM users WHERE id = ?',
      [userId]
    );

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// POST /api/users/:id/follow - Follow/Unfollow toggle
router.post('/:id/follow', authenticateToken, async (req, res) => {
  const followingId = parseInt(req.params.id);
  const followerId = req.user.id;

  if (followingId === followerId) {
    return res.status(400).json({ error: 'You cannot follow yourself' });
  }

  try {
    const db = getDb();

    // Check if target user exists
    const targetUser = await db.get('SELECT id FROM users WHERE id = ?', [followingId]);
    if (!targetUser) {
      return res.status(404).json({ error: 'Target user not found' });
    }

    // Check if already following
    const follow = await db.get(
      'SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ?',
      [followerId, followingId]
    );

    if (follow) {
      // Unfollow
      await db.run(
        'DELETE FROM follows WHERE follower_id = ? AND following_id = ?',
        [followerId, followingId]
      );
      res.json({ following: false, message: 'Unfollowed successfully' });
    } else {
      // Follow
      await db.run(
        'INSERT INTO follows (follower_id, following_id) VALUES (?, ?)',
        [followerId, followingId]
      );
      res.json({ following: true, message: 'Followed successfully' });
    }
  } catch (error) {
    console.error('Follow error:', error);
    res.status(500).json({ error: 'Failed to toggle follow' });
  }
});

// GET /api/users/:username/followers - List followers
router.get('/:username/followers', authenticateToken, async (req, res) => {
  const username = req.params.username.toLowerCase();

  try {
    const db = getDb();
    const user = await db.get('SELECT id FROM users WHERE username = ?', [username]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const followers = await db.all(`
      SELECT u.id, u.username, u.avatar_url, u.bio,
             (SELECT COUNT(*) FROM follows WHERE follower_id = ? AND following_id = u.id) AS is_following
      FROM follows f
      JOIN users u ON f.follower_id = u.id
      WHERE f.following_id = ?
    `, [req.user.id, user.id]);

    res.json(followers);
  } catch (error) {
    console.error('Fetch followers error:', error);
    res.status(500).json({ error: 'Failed to fetch followers' });
  }
});

// GET /api/users/:username/following - List following
router.get('/:username/following', authenticateToken, async (req, res) => {
  const username = req.params.username.toLowerCase();

  try {
    const db = getDb();
    const user = await db.get('SELECT id FROM users WHERE username = ?', [username]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const following = await db.all(`
      SELECT u.id, u.username, u.avatar_url, u.bio,
             (SELECT COUNT(*) FROM follows WHERE follower_id = ? AND following_id = u.id) AS is_following
      FROM follows f
      JOIN users u ON f.following_id = u.id
      WHERE f.follower_id = ?
    `, [req.user.id, user.id]);

    res.json(following);
  } catch (error) {
    console.error('Fetch following error:', error);
    res.status(500).json({ error: 'Failed to fetch following' });
  }
});

export default router;
