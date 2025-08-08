import express from 'express';
import User from '../models/User';
import Post from '../models/Post';
import { authenticateToken, optionalAuth, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Search users (must come before /:id routes)
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ]
    }).limit(10);

    const usersResponse = users.map(user => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      bio: user.bio,
      createdAt: user.createdAt.toISOString()
    }));

    res.json(usersResponse);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

// Get user by ID - require authentication
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      bio: user.bio,
      createdAt: user.createdAt.toISOString()
    };

    res.json(userResponse);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user profile
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { name, bio } = req.body;

    // Check if user is updating their own profile
    if (req.userId !== id) {
      return res.status(403).json({ error: 'Unauthorized to update this profile' });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      bio: user.bio,
      createdAt: user.createdAt.toISOString()
    };

    res.json(userResponse);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Get user's posts - require authentication  
router.get('/:id/posts', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const posts = await Post.find({ authorId: id })
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