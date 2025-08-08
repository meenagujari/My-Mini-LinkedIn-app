"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Hash } from "lucide-react";

interface TrendingTopic {
  id: string;
  hashtag: string;
  posts: number;
  change: 'up' | 'down' | 'stable';
  changePercent: number;
}

export function TrendingTopics() {
  // Mock trending topics data - in real app would come from API
  const topics: TrendingTopic[] = [
    { id: '1', hashtag: 'webdevelopment', posts: 1247, change: 'up', changePercent: 23 },
    { id: '2', hashtag: 'react', posts: 892, change: 'up', changePercent: 15 },
    { id: '3', hashtag: 'javascript', posts: 756, change: 'stable', changePercent: 0 },
    { id: '4', hashtag: 'nextjs', posts: 634, change: 'up', changePercent: 42 },
    { id: '5', hashtag: 'typescript', posts: 523, change: 'down', changePercent: -8 },
    { id: '6', hashtag: 'tailwindcss', posts: 421, change: 'up', changePercent: 18 },
    { id: '7', hashtag: 'mongodb', posts: 387, change: 'stable', changePercent: 2 },
    { id: '8', hashtag: 'nodejs', posts: 298, change: 'up', changePercent: 12 },
  ];

  const getChangeIcon = (change: TrendingTopic['change']) => {
    switch (change) {
      case 'up':
        return <TrendingUp size={12} className="text-green-500" />;
      case 'down':
        return <TrendingUp size={12} className="text-red-500 rotate-180" />;
      default:
        return <div className="w-3 h-3 rounded-full bg-gray-400"></div>;
    }
  };

  const getChangeColor = (change: TrendingTopic['change']) => {
    switch (change) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Hash size={20} className="mr-2 text-blue-600" />
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {topics.map((topic, index) => (
            <Button
              key={topic.id}
              variant="ghost"
              className="w-full justify-between h-auto p-3 rounded-none hover:bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-500 font-medium min-w-[20px]">
                  {index + 1}
                </span>
                <div className="text-left">
                  <p className="font-medium text-gray-900 text-sm">
                    #{topic.hashtag}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatNumber(topic.posts)} posts
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {getChangeIcon(topic.change)}
                {topic.changePercent !== 0 && (
                  <span className={`text-xs font-medium ${getChangeColor(topic.change)}`}>
                    {topic.changePercent > 0 ? '+' : ''}{topic.changePercent}%
                  </span>
                )}
              </div>
            </Button>
          ))}
        </div>
        <div className="p-3 border-t">
          <Button variant="ghost" className="w-full text-blue-600 text-sm">
            Show more topics
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}