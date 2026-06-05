import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb } from './database.js';

import authRouter from './routes/auth.js';
import postsRouter from './routes/posts.js';
import commentsRouter from './routes/comments.js';
import usersRouter from './routes/users.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and parsing middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend static assets
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);
app.use('/api', commentsRouter); // Serves /api/posts/:id/comments and /api/comments/:id
app.use('/api/users', usersRouter);

// Catch-all route to serve the SPA front-end for any client-side routes
app.get('*', (req, res) => {
  // If it's an API route that didn't match, return 404
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize database then start server
async function startServer() {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize database and start server:', error);
    process.exit(1);
  }
}

startServer();
