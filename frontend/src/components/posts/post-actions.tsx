"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PostActionsProps {
  postId: string;
  likes: number;
  isLiked?: boolean;
  commentsCount: number;
  isBookmarked?: boolean;
  isAuthor?: boolean;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onBookmark?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PostActions({
  postId,
  likes,
  isLiked = false,
  commentsCount,
  isBookmarked = false,
  isAuthor = false,
  onLike,
  onComment,
  onShare,
  onBookmark,
  onEdit,
  onDelete,
}: PostActionsProps) {
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);
  const [localLikes, setLocalLikes] = useState(likes);
  const [localIsBookmarked, setLocalIsBookmarked] = useState(isBookmarked);

  const handleLike = () => {
    setLocalIsLiked(!localIsLiked);
    setLocalLikes(prev => localIsLiked ? prev - 1 : prev + 1);
    onLike();
  };

  const handleBookmark = () => {
    setLocalIsBookmarked(!localIsBookmarked);
    onBookmark?.();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mini LinkedIn Post',
          url: `${window.location.origin}/post/${postId}`,
        });
      } catch (error) {
        // Fallback to copy to clipboard
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
    onShare();
  };

  const copyToClipboard = () => {
    const url = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(url).then(() => {
      // Could show a toast notification here

    });
  };

  return (
    <div className="flex items-center justify-between pt-3 border-t">
      <div className="flex items-center space-x-4">
        {/* Like Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={`text-gray-600 hover:text-red-600 p-0 h-auto ${
            localIsLiked ? 'text-red-600' : ''
          }`}
        >
          <Heart
            size={18}
            className={`mr-2 ${localIsLiked ? 'fill-current' : ''}`}
          />
          <span className="text-sm">{localLikes}</span>
        </Button>

        {/* Comment Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onComment}
          className="text-gray-600 hover:text-blue-600 p-0 h-auto"
        >
          <MessageCircle size={18} className="mr-2" />
          <span className="text-sm">{commentsCount}</span>
        </Button>

        {/* Share Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="text-gray-600 hover:text-green-600 p-0 h-auto"
        >
          <Share size={18} className="mr-2" />
          <span className="text-sm">Share</span>
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        {/* Bookmark Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBookmark}
          className={`text-gray-600 hover:text-yellow-600 p-1 h-auto ${
            localIsBookmarked ? 'text-yellow-600' : ''
          }`}
        >
          <Bookmark
            size={18}
            className={localIsBookmarked ? 'fill-current' : ''}
          />
        </Button>

        {/* More Actions Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-800 p-1 h-auto"
            >
              <MoreHorizontal size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isAuthor && (
              <>
                <DropdownMenuItem onClick={onEdit}>
                  Edit Post
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-red-600">
                  Delete Post
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem onClick={() => copyToClipboard()}>
              Copy Link
            </DropdownMenuItem>
            {!isAuthor && (
              <DropdownMenuItem className="text-red-600">
                Report Post
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}