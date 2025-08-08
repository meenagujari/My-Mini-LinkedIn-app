"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPosts } from "@/store/slices/postsSlice";
import { CreatePost } from "@/components/posts/create-post";
import { PostCard } from "@/components/posts/post-card";
import { TrendingTopics } from "@/components/posts/trending-topics";
import { PeopleSuggestions } from "@/components/sidebar/people-suggestions";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Home() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { posts, isLoading, error } = useAppSelector((state) => state.posts);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchPosts());
    }
  }, [dispatch, isAuthenticated]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Card className="w-full max-w-md shadow-strong hover-lift border-0 animate-fadeInUp">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-medium">
              <div className="w-10 h-10 bg-white rounded-xl text-blue-600 text-lg font-bold flex items-center justify-center shadow-soft">
                in
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Welcome to MiniLinkedIn</h2>
            <p className="text-gray-600 font-medium">Please sign in to view your professional feed</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2 text-red-600">Error</h2>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)]">
      {/* Mobile-First Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        
        {/* Left Sidebar - Profile Summary - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:block lg:col-span-1">
          <Card className="overflow-hidden sticky top-4">
            <div className="h-16 bg-gradient-to-r from-blue-500 to-blue-600"></div>
            <CardContent className="px-4 pb-4 -mt-8">
              <Avatar className="w-16 h-16 bg-white border-4 border-white shadow-sm">
                <AvatarFallback className="bg-gray-300 text-gray-600 text-2xl">
                  {getInitials(user?.name || "")}
                </AvatarFallback>
              </Avatar>
              <h3 className="mt-2 font-semibold text-gray-900 text-sm lg:text-base">
                {user?.name}
              </h3>
              <p className="text-xs lg:text-sm text-gray-600 mt-1 line-clamp-2">
                {user?.bio || "No bio available"}
              </p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">Profile views</p>
                <p className="text-sm font-semibold text-blue-600">0</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Feed Area - Full width on mobile, 2 columns on desktop */}
        <div className="col-span-1 lg:col-span-2 px-2 sm:px-0">
          
          {/* Mobile Profile Header - Only shown on mobile */}
          <div className="lg:hidden mb-4">
            <Card className="overflow-hidden">
              <div className="h-12 sm:h-16 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              <CardContent className="px-4 pb-4 -mt-6 sm:-mt-8">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12 sm:w-16 sm:h-16 bg-white border-4 border-white shadow-sm">
                    <AvatarFallback className="bg-gray-300 text-gray-600 text-lg sm:text-2xl">
                      {getInitials(user?.name || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                      {user?.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">
                      {user?.bio || "No bio available"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Create Post Component */}
          <div className="mb-4 lg:mb-6">
            <CreatePost />
          </div>

          {/* Posts Feed */}
          <div className="space-y-3 lg:space-y-4">
            {isLoading ? (
              <div className="space-y-3 lg:space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4 lg:p-6">
                      <div className="h-16 lg:h-20 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : posts && posts.length > 0 ? (
              posts.map((post: any) => <PostCard key={post.id} post={post} />)
            ) : (
              <Card>
                <CardContent className="p-4 lg:p-6 text-center text-gray-500">
                  <div className="py-8">
                    <h3 className="text-base lg:text-lg font-medium mb-2">No posts yet</h3>
                    <p className="text-sm lg:text-base">Be the first to share something!</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Right Sidebar - Hidden on mobile and tablet, shown on desktop */}
        <div className="hidden xl:block lg:col-span-1">
          <div className="sticky top-4 space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm lg:text-base">
                  Tech Stack
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-blue-600 font-medium text-sm">Next.js App Router</p>
                    <p className="text-xs text-gray-500">Modern React Framework</p>
                  </div>
                  <div>
                    <p className="text-purple-600 font-medium text-sm">Redux Toolkit</p>
                    <p className="text-xs text-gray-500">State Management</p>
                  </div>
                  <div>
                    <p className="text-blue-800 font-medium text-sm">TypeScript</p>
                    <p className="text-xs text-gray-500">Type Safety</p>
                  </div>
                  <div>
                    <p className="text-green-600 font-medium text-sm">Responsive Design</p>
                    <p className="text-xs text-gray-500">Mobile-First Approach</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm lg:text-base">
                  Connect with Others
                </h3>
                <p className="text-xs lg:text-sm text-gray-500">
                  Start connecting with people to see suggestions here.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}