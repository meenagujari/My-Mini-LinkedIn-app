"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { Home, User, LogOut, Bell, Search } from "lucide-react";
import { SearchBar } from "@/components/search/search-bar";
import { NotificationCenter } from "@/components/notifications/notification-center";

interface HeaderProps {
  onAuthClick: () => void;
}

export function Header({ onAuthClick }: HeaderProps) {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-soft border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="bg-gradient-primary p-1.5 sm:p-2 rounded-xl shadow-medium hover-lift">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-lg text-blue-600 text-xs font-bold flex items-center justify-center">
                in
              </div>
            </div>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent hidden xs:block">
              MiniLinkedIn
            </h1>
            <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent xs:hidden">
              Mini
            </h1>
          </div>

          {/* Navigation Links - Hidden on small screens */}
          {isAuthenticated && (
            <nav className="hidden lg:flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200">
                <Home size={20} />
                <span className="text-sm font-medium">Home</span>
              </Link>
              <Link href={`/profile/${user?.id}`} className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200">
                <User size={20} />
                <span className="text-sm font-medium">Profile</span>
              </Link>
            </nav>
          )}

          {/* Search and Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {isAuthenticated ? (
              <>
                {/* Search - Desktop */}
                <div className="hidden md:block">
                  <SearchBar />
                </div>
                
                {/* Search Button - Mobile */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSearch(true)}
                  className="md:hidden text-gray-500 hover:text-gray-700 p-1.5"
                >
                  <Search size={18} />
                </Button>
                
                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications(true)}
                  className="text-gray-500 hover:text-gray-700 p-1.5 relative"
                >
                  <Bell size={18} />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    2
                  </span>
                </Button>

                {/* Desktop User Info */}
                <div className="hidden lg:flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gray-300 text-gray-600 text-sm">
                      {getInitials(user?.name || "")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                    {user?.name}
                  </span>
                </div>
                
                {/* Mobile/Tablet User Info */}
                <div className="lg:hidden flex items-center space-x-2">
                  <Avatar className="w-7 h-7 sm:w-8 sm:h-8">
                    <AvatarFallback className="bg-gray-300 text-gray-600 text-xs sm:text-sm">
                      {getInitials(user?.name || "")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 max-w-[80px] sm:max-w-[100px] truncate hidden sm:block">
                    {user?.name}
                  </span>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700 p-1.5 sm:p-2"
                >
                  <LogOut size={16} className="sm:w-5 sm:h-5" />
                </Button>
              </>
            ) : (
              <Button 
                onClick={onAuthClick} 
                className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Search Modal */}
      {showSearch && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-16">
          <div className="bg-white w-full max-w-md mx-4 rounded-lg p-4">
            <SearchBar onClose={() => setShowSearch(false)} />
          </div>
        </div>
      )}
      
      {/* Notification Center */}
      <NotificationCenter 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </header>
  );
}