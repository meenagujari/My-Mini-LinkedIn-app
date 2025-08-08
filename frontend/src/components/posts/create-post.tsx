"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createPost } from "@/store/slices/postsSlice";

export function CreatePost() {
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { createLoading } = useAppSelector((state) => state.posts);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    try {
      await dispatch(createPost(content)).unwrap();
      setContent("");
      setIsExpanded(false);
    } catch (error) {
      // Post creation failed - handle silently
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

  if (!user) return null;

  return (
    <Card className="w-full">
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
          <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
            <AvatarFallback className="bg-gray-300 text-gray-600 text-sm sm:text-base">
              {getInitials(user?.name || "")}
            </AvatarFallback>
          </Avatar>
          <Button
            variant="outline"
            className="flex-1 text-left text-gray-500 bg-gray-50 hover:bg-gray-100 justify-start text-sm sm:text-base py-2 sm:py-3"
            onClick={() => setIsExpanded(true)}
          >
            What's on your mind?
          </Button>
        </div>

        {isExpanded && (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4 animate-fadeInUp">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your professional insights..."
              className="resize-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base min-h-[100px] sm:min-h-[120px] border-gray-200 rounded-lg shadow-soft"
              rows={4}
              maxLength={500}
              autoFocus
            />
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
              <div className="text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
                <span className={content.length > 450 ? 'text-orange-600 font-medium' : ''}>
                  {content.length}/500 characters
                </span>
              </div>
              <div className="flex space-x-3 order-1 sm:order-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsExpanded(false);
                    setContent("");
                  }}
                  className="flex-1 sm:flex-none text-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!content.trim() || createLoading}
                  className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none text-sm"
                >
                  {createLoading ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}