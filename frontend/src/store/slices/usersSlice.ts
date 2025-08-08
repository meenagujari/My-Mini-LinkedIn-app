import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, PostWithAuthor } from '@/types/schema';

interface UsersState {
  currentProfileUser: User | null;
  profilePosts: PostWithAuthor[];
  searchResults: User[];
  isLoadingProfile: boolean;
  isLoadingProfilePosts: boolean;
  isLoadingSearch: boolean;
  error: string | null;
}

const initialState: UsersState = {
  currentProfileUser: null,
  profilePosts: [],
  searchResults: [],
  isLoadingProfile: false,
  isLoadingProfilePosts: false,
  isLoadingSearch: false,
  error: null,
};

// Fetch user profile
export const fetchUserProfile = createAsyncThunk(
  'users/fetchProfile',
  async (userId: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return response.json();
  }
);

// Fetch user posts
export const fetchUserPosts = createAsyncThunk(
  'users/fetchUserPosts',
  async (userId: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/users/${userId}/posts`, {
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

// Search users
export const searchUsers = createAsyncThunk(
  'users/search',
  async (query: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/users?q=${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to search users');
    }

    return response.json();
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  'users/updateProfile',
  async ({ userId, name, bio }: { userId: string; name: string; bio?: string }) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name, bio }),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return response.json();
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearProfile: (state) => {
      state.currentProfileUser = null;
      state.profilePosts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoadingProfile = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoadingProfile = false;
        state.currentProfileUser = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoadingProfile = false;
        state.error = action.error.message || 'Failed to fetch user profile';
      })
      // Fetch user posts
      .addCase(fetchUserPosts.pending, (state) => {
        state.isLoadingProfilePosts = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action: PayloadAction<PostWithAuthor[]>) => {
        state.isLoadingProfilePosts = false;
        state.profilePosts = action.payload;
        state.error = null;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.isLoadingProfilePosts = false;
        state.error = action.error.message || 'Failed to fetch user posts';
      })
      // Search users
      .addCase(searchUsers.pending, (state) => {
        state.isLoadingSearch = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.isLoadingSearch = false;
        state.searchResults = action.payload;
        state.error = null;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.isLoadingSearch = false;
        state.error = action.error.message || 'Failed to search users';
      })
      // Update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.currentProfileUser = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update profile';
      });
  },
});

export const { clearError, clearSearchResults, clearProfile } = usersSlice.actions;
export default usersSlice.reducer;