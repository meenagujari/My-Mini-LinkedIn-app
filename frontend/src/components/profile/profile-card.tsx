import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "@/types/schema";
import { Mail, Calendar } from "lucide-react";

interface ProfileCardProps {
  user: Omit<User, "password">;
  isCurrentUser?: boolean;
}

export function ProfileCard({ user, isCurrentUser = false }: ProfileCardProps) {
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
    <Card className="overflow-hidden mb-8 shadow-strong border-0 hover-lift">
      {/* Profile Header Background */}
      <div className="h-40 sm:h-48 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      
      <CardContent className="px-6 sm:px-8 pb-8 -mt-20 sm:-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
          {/* Profile Avatar */}
          <div className="relative">
            <Avatar className={`w-32 h-32 sm:w-36 sm:h-36 bg-gradient-to-br ${getGradientColor(user.name)} border-4 border-white shadow-strong ring-2 ring-white/50`}>
              <AvatarFallback className="bg-transparent text-white text-4xl sm:text-5xl font-bold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            {/* Online Status Indicator */}
            <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white shadow-medium"></div>
          </div>
          
          {/* Profile Info */}
          <div className="mt-6 sm:mt-0 sm:flex-1 sm:min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{user.name}</h1>
                <p className="text-gray-600 text-lg leading-relaxed mb-4 max-w-2xl">
                  {user.bio || "Professional networking enthusiast"}
                </p>
                
                {/* User Details */}
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Mail size={16} className="mr-2 text-blue-500" />
                    {user.email}
                  </span>
                  <span className="flex items-center">
                    <Calendar size={16} className="mr-2 text-green-500" />
                    Joined {new Date(user.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </span>
                </div>
              </div>
              
              {/* Action Buttons */}
              {!isCurrentUser && (
                <div className="mt-6 sm:mt-0 flex space-x-3">
                  <Button className="bg-gradient-primary hover:opacity-90 shadow-medium px-6 py-2 font-medium">
                    Connect
                  </Button>
                  <Button variant="outline" className="border-gray-300 hover:bg-gray-50 px-6 py-2 font-medium">
                    Message
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}