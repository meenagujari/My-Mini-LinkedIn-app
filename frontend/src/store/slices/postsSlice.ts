import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PostWithAuthor } from '@/types/schema';

interface PostsState {
  posts: PostWithAuthor[];
  isLoading: boolean;
  error: string | null;
  createLoading: boolean;
}

const initialState: PostsState = {
  posts: [],
  isLoading: false,
  error: null,
  createLoading: false,
};

// Async thunks
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/posts', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error('Failed to fetch posts');
      }

      return response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (content: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          throw new Error('Authentication failed. Please log in again.');
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }

      return response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const likePost = createAsyncThunk(
  'posts/likePost',
  async (postId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid, remove it
          localStorage.removeItem('token');
          throw new Error('Authentication failed. Please log in again.');
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to like post');
      }

      return { postId, ...await response.json() };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
  'posts/fetchUserPosts',
  async (userId: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3001/api/posts/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user posts');
    }

    return response.json();
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<PostWithAuthor[]>) => {
        state.isLoading = false;
        state.posts = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch posts';
      })
      // Create post
      .addCase(createPost.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action: PayloadAction<PostWithAuthor>) => {
        state.createLoading = false;
        if (Array.isArray(state.posts)) {
          state.posts.unshift(action.payload);
        } else {
          state.posts = [action.payload];
        }
      })
      .addCase(createPost.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.error.message || 'Failed to create post';
      })
      // Like post
      .addCase(likePost.fulfilled, (state, action) => {
        if (Array.isArray(state.posts)) {
          const postIndex = state.posts.findIndex(post => post.id === action.payload.postId);
          if (postIndex !== -1) {
            state.posts[postIndex].likes = action.payload.likes;
          }
        }
      })
      // Fetch user posts
      .addCase(fetchUserPosts.fulfilled, (state, action: PayloadAction<PostWithAuthor[]>) => {
        state.posts = Array.isArray(action.payload) ? action.payload : [];
      });
  },
});

export const { clearError } = postsSlice.actions;
export default postsSlice.reducer;