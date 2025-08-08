"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserProfile, fetchUserPosts, clearProfile } from "@/store/slices/usersSlice";
import { User, PostWithAuthor } from "@/types/schema";
import { ProfileCard } from "@/components/profile/profile-card";
import { ProfileStats } from "@/components/profile/profile-stats";
import { PostCard } from "@/components/posts/post-card";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const userId = params.userId as string;
  
  const { user: currentUser, isAuthenticated } = useAppSelector((state) => state.auth);
  const { 
    currentProfileUser, 
    profilePosts, 
    isLoadingProfile, 
    isLoadingProfilePosts, 
    error 
  } = useAppSelector((state) => state.users);

  useEffect(() => {
    if (userId && isAuthenticated) {
      dispatch(fetchUserProfile(userId));
      dispatch(fetchUserPosts(userId));
    }

    return () => {
      dispatch(clearProfile());
    };
  }, [dispatch, userId, isAuthenticated]);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="shadow-soft border-0">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded"></div>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-blue-600">Authentication Required</h2>
              <p className="text-gray-600 mb-4">Please log in to view user profiles.</p>
              <button 
                onClick={() => window.location.href = '/'}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Go to Login
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse-soft">
              <div className="w-8 h-8 bg-blue-200 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="shadow-soft border-0">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-red-500 rounded"></div>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-red-600">Error</h2>
              <p className="text-gray-600">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!currentProfileUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="shadow-soft border-0">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-gray-400 rounded"></div>
              </div>
              <h2 className="text-xl font-semibold mb-2">User Not Found</h2>
              <p className="text-gray-600">The user you're looking for doesn't exist.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isCurrentUser = currentUser?.id === userId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ProfileCard user={currentProfileUser} isCurrentUser={isCurrentUser} />
        
        <ProfileStats postsCount={profilePosts?.length || 0} />

        {/* User's Posts */}
        <Card className="shadow-soft border-0 overflow-hidden">
          <CardHeader className="bg-gradient-secondary border-b border-gray-100 px-6 py-4">
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
              <div className="w-2 h-6 bg-gradient-primary rounded-full mr-3"></div>
              {isCurrentUser ? "Your Posts" : `${currentProfileUser.name.split(' ')[0]}'s Posts`}
              <span className="ml-3 text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {profilePosts?.length || 0}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoadingProfilePosts ? (
              <div className="p-8 text-center">
                <div className="animate-pulse-soft">
                  <div className="w-8 h-8 bg-blue-200 rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading posts...</p>
                </div>
              </div>
            ) : profilePosts && profilePosts.length > 0 ? (
              <div className="space-y-0">
                {profilePosts.map((post, index) => (
                  <div key={post.id} className={`${index !== profilePosts.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <div className="p-6 hover:bg-gray-50/50 transition-colors duration-200">
                      <PostCard post={post} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-gray-300 rounded"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {isCurrentUser ? "Share your first post!" : "No posts yet"}
                </h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  {isCurrentUser 
                    ? "Start sharing your professional insights and connect with your network." 
                    : "This user hasn't shared any posts yet. Check back later!"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}