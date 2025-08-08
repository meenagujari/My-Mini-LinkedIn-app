import express from 'express';
import Post from '../models/Post';
import User from '../models/User';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all posts
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    // Get all posts sorted by creation date (newest first) with author information
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate('authorId', 'name email bio createdAt')
      .exec();

    const postsWithAuthors = posts.map(post => ({
      id: post._id.toString(),
      content: post.content,
      authorId: post.authorId._id?.toString(),
      likes: post.likes,
      createdAt: post.createdAt.toISOString(),
      author: {
        id: post.authorId._id?.toString(),
        name: post.authorId.name,
        email: post.authorId.email,
        bio: post.authorId.bio,
        createdAt: post.authorId.createdAt.toISOString()
      }
    }));

    res.json(postsWithAuthors);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Create a new post
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        error: 'Content is required'
      });
    }

    const author = await User.findById(req.userId);
    if (!author) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const newPost = new Post({
      content: content.trim(),
      authorId: req.userId,
      likes: 0,
    });

    const savedPost = await newPost.save();

    const postResponse = {
      id: savedPost._id.toString(),
      content: savedPost.content,
      authorId: savedPost.authorId.toString(),
      likes: savedPost.likes,
      createdAt: savedPost.createdAt.toISOString(),
      author: {
        id: author._id.toString(),
        name: author.name,
        email: author.email,
        bio: author.bio,
        createdAt: author.createdAt.toISOString()
      }
    };

    res.status(201).json(postResponse);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Like a post
router.post('/:id/like', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.likes += 1;
    await post.save();

    res.json({
      id: post._id.toString(),
      likes: post.likes
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: 'Failed to like post' });
  }
});

// Get posts by user
router.get('/user/:userId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { userId } = req.params;

    const posts = await Post.find({ authorId: userId })
      .sort({ createdAt: -1 })
      .populate('authorId', 'name email bio createdAt')
      .exec();

    const postsWithAuthors = posts.map(post => ({
      id: post._id.toString(),
      content: post.content,
      authorId: post.authorId._id?.toString(),
      likes: post.likes,
      createdAt: post.createdAt.toISOString(),
      author: {
        id: post.authorId._id?.toString(),
        name: post.authorId.name,
        email: post.authorId.email,
        bio: post.authorId.bio,
        createdAt: post.authorId.createdAt.toISOString()
      }
    }));

    res.json(postsWithAuthors);
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ error: 'Failed to fetch user posts' });
  }
});

export default router;