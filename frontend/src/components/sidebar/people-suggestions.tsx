"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users, Plus } from "lucide-react";
import Link from "next/link";

interface SuggestedUser {
  id: string;
  name: string;
  bio: string;
  mutualConnections: number;
  isFollowing?: boolean;
}

export function PeopleSuggestions() {
  // Mock suggested users data - in real app would come from API
  const suggestions: SuggestedUser[] = [
    {
      id: '101',
      name: 'Sarah Johnson',
      bio: 'Full Stack Developer at Tech Corp',
      mutualConnections: 12,
      isFollowing: false,
    },
    {
      id: '102',
      name: 'Michael Chen',
      bio: 'UI/UX Designer | React Enthusiast',
      mutualConnections: 8,
      isFollowing: false,
    },
    {
      id: '103',
      name: 'Emily Rodriguez',
      bio: 'DevOps Engineer | Cloud Architecture',
      mutualConnections: 15,
      isFollowing: false,
    },
    {
      id: '104',
      name: 'David Kim',
      bio: 'Product Manager | StartupLover',
      mutualConnections: 6,
      isFollowing: false,
    },
    {
      id: '105',
      name: 'Lisa Thompson',
      bio: 'Data Scientist | ML Engineer',
      mutualConnections: 9,
      isFollowing: false,
    },
  ];

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

  const handleConnect = (userId: string, userName: string) => {

    // In real app, would make API call to connect/follow user
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Users size={20} className="mr-2 text-blue-600" />
          People You May Know
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {suggestions.slice(0, 4).map((user) => (
            <div key={user.id} className="p-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-3">
                <Avatar className={`w-12 h-12 bg-gradient-to-br ${getGradientColor(user.name)} flex-shrink-0`}>
                  <AvatarFallback className="bg-transparent text-white font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <Link 
                    href={`/profile/${user.id}`}
                    className="font-semibold text-gray-900 hover:text-blue-600 text-sm block truncate"
                  >
                    {user.name}
                  </Link>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {user.bio}
                  </p>
                  {user.mutualConnections > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {user.mutualConnections} mutual connections
                    </p>
                  )}
                  <div className="flex space-x-2 mt-2">
                    <Button
                      size="sm"
                      className="h-7 px-3 text-xs"
                      onClick={() => handleConnect(user.id, user.name)}
                    >
                      <Plus size={12} className="mr-1" />
                      Connect
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-3 text-xs"
                    >
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 border-t">
          <Button variant="ghost" className="w-full text-blue-600 text-sm">
            View all suggestions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}