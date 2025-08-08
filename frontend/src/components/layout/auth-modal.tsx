"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser, registerUser, clearError } from "@/store/slices/authSlice";
import { loginSchema, registerSchema, type LoginFormData, type RegisterFormData } from "@/lib/validation";
import { X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Registration form
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      bio: "",
    },
  });

  const handleLoginSubmit = async (data: LoginFormData) => {
    dispatch(clearError());
    try {
      await dispatch(loginUser(data)).unwrap();
      onClose();
      loginForm.reset();
      setRegistrationSuccess(false);
    } catch (error) {
      // Error is handled by Redux
    }
  };

  const handleRegisterSubmit = async (data: RegisterFormData) => {
    dispatch(clearError());
    try {
      await dispatch(registerUser(data)).unwrap();
      // After successful registration, switch to login form
      setIsSignUp(false);
      setRegistrationSuccess(true);
      // Pre-fill email in login form
      loginForm.setValue("email", data.email);
      registerForm.reset();
    } catch (error) {
      // Error is handled by Redux
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <CardTitle className="text-2xl font-bold text-gray-900">
            {isSignUp ? "Create Account" : "Sign In"}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}
          
          {registrationSuccess && !isSignUp && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
              Registration successful! Please log in with your credentials.
            </div>
          )}
          
          {isSignUp ? (
            // Registration Form
            <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="register-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </Label>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="Enter your full name"
                  className="focus:ring-blue-500 focus:border-blue-500"
                  {...registerForm.register("name")}
                />
                {registerForm.formState.errors.name && (
                  <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.name.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="Enter your email"
                  className="focus:ring-blue-500 focus:border-blue-500"
                  {...registerForm.register("email")}
                />
                {registerForm.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.email.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="Enter your password (min 6 characters)"
                  className="focus:ring-blue-500 focus:border-blue-500"
                  {...registerForm.register("password")}
                />
                {registerForm.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.password.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="register-bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio (Optional)
                </Label>
                <Textarea
                  id="register-bio"
                  placeholder="Tell us about yourself"
                  className="focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  {...registerForm.register("bio")}
                />
                {registerForm.formState.errors.bio && (
                  <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.bio.message}</p>
                )}
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 font-medium"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          ) : (
            // Login Form
            <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  className="focus:ring-blue-500 focus:border-blue-500"
                  {...loginForm.register("email")}
                />
                {loginForm.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-600">{loginForm.formState.errors.email.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  className="focus:ring-blue-500 focus:border-blue-500"
                  {...loginForm.register("password")}
                />
                {loginForm.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-600">{loginForm.formState.errors.password.message}</p>
                )}
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 font-medium"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Button
              variant="link"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setRegistrationSuccess(false);
                dispatch(clearError());
                // Reset both forms when switching
                loginForm.reset();
                registerForm.reset();
              }}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}