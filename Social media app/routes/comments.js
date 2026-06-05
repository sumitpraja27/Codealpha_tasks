import { Router } from 'express';
import { getDb } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// GET /api/posts/:postId/comments - Get comments for a post
router.get('/posts/:postId/comments', authenticateToken, async (req, res) => {
  const postId = req.params.postId;

  try {
    const db = getDb();
    
    // Check if post exists
    const post = await db.get('SELECT id FROM posts WHERE id = ?', [postId]);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comments = await db.all(`
      SELECT 
        c.id, c.content, c.created_at, c.post_id,
        u.id AS author_id, u.username AS author_username, u.avatar_url AS author_avatar
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `, [postId]);

    res.json(comments);
  } catch (error) {
    console.error('Fetch comments error:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// POST /api/posts/:postId/comments - Create a comment
router.post('/posts/:postId/comments', authenticateToken, async (req, res) => {
  const postId = req.params.postId;
  const { content } = req.body;

  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'Comment content cannot be empty' });
  }

  try {
    const db = getDb();
    
    // Check if post exists
    const post = await db.get('SELECT id FROM posts WHERE id = ?', [postId]);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const result = await db.run(
      'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
      [postId, req.user.id, content.trim()]
    );

    const commentId = result.lastID;
    
    // Fetch newly created comment details
    const newComment = await db.get(`
      SELECT 
        c.id, c.content, c.created_at, c.post_id,
        u.id AS author_id, u.username AS author_username, u.avatar_url AS author_avatar
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `, [commentId]);

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// DELETE /api/comments/:id - Delete a comment
router.delete('/comments/:id', authenticateToken, async (req, res) => {
  const commentId = req.params.id;

  try {
    const db = getDb();
    const comment = await db.get('SELECT * FROM comments WHERE id = ?', [commentId]);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if user is author of the comment or author of the post
    const post = await db.get('SELECT user_id FROM posts WHERE id = ?', [comment.post_id]);
    
    const isCommentAuthor = comment.user_id === req.user.id;
    const isPostAuthor = post && post.user_id === req.user.id;

    if (!isCommentAuthor && !isPostAuthor) {
      return res.status(403).json({ error: 'Unauthorized to delete this comment' });
    }

    await db.run('DELETE FROM comments WHERE id = ?', [commentId]);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

export default router;
