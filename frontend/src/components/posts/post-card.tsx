"use client";

import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { PostWithAuthor } from "@/types/schema";
import { Heart, MessageCircle, Share } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { likePost } from "@/store/slices/postsSlice";

interface PostCardProps {
  post: PostWithAuthor;
}

export function PostCard({ post }: PostCardProps) {
  const dispatch = useAppDispatch();

  const handleLike = async () => {
    try {
      await dispatch(likePost(post.id)).unwrap();
    } catch (error) {
      // Like action failed - handle silently
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getGradientColor = (name: string) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-green-500 to-green-600",
      "from-purple-500 to-purple-600",
      "from-red-500 to-red-600",
      "from-yellow-500 to-yellow-600",
      "from-indigo-500 to-indigo-600",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <Card className="w-full shadow-soft hover-lift border-0 bg-white/80 backdrop-blur-sm animate-fadeInUp">
      <CardContent className="p-4 sm:p-5 lg:p-6">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <Avatar className={`w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br ${getGradientColor(post.author.name)} flex-shrink-0 ring-2 ring-white shadow-medium`}>
              <AvatarFallback className="bg-transparent text-white font-semibold text-sm sm:text-lg">
                {getInitials(post.author.name)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 flex-wrap">
              <Link 
                href={`/profile/${post.author.id}`} 
                className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer text-sm sm:text-base truncate max-w-[150px] sm:max-w-none transition-colors duration-200"
              >
                {post.author.name}
              </Link>
              <span className="text-gray-400 text-xs sm:text-sm">•</span>
              <time className="text-xs sm:text-sm text-gray-500 flex-shrink-0">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </time>
            </div>
            
            {/* Author bio - hidden on mobile */}
            <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-1 hidden sm:block opacity-80">
              {post.author.bio}
            </p>
            
            {/* Post content */}
            <div className="mt-2 sm:mt-3">
              <p className="text-gray-800 leading-relaxed text-sm sm:text-base break-words">
                {post.content}
              </p>
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center space-x-4 sm:space-x-6 mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className="flex items-center space-x-1 sm:space-x-2 text-gray-500 hover:text-blue-600 transition-colors p-1 sm:p-2"
              >
                <Heart size={14} className="sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">{post.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1 sm:space-x-2 text-gray-500 hover:text-blue-600 transition-colors p-1 sm:p-2"
              >
                <MessageCircle size={14} className="sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm hidden sm:inline">Comment</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1 sm:space-x-2 text-gray-500 hover:text-blue-600 transition-colors p-1 sm:p-2"
              >
                <Share size={14} className="sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm hidden sm:inline">Share</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}