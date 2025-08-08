import { User } from "@/types/schema";

interface AuthResponse {
  token: string;
  user: Omit<User, "password" | "createdAt">;
}

class AuthService {
  private token: string | null = null;
  private user: Omit<User, "password" | "createdAt"> | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          this.user = JSON.parse(userStr);
        } catch {
          localStorage.removeItem("user");
        }
      }
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const authData: AuthResponse = await response.json();
    this.setAuth(authData);
    return authData;
  }

  async register(name: string, email: string, password: string, bio?: string): Promise<AuthResponse> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, bio }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    const authData: AuthResponse = await response.json();
    this.setAuth(authData);
    return authData;
  }

  logout() {
    this.token = null;
    this.user = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }

  private setAuth(authData: AuthResponse) {
    this.token = authData.token;
    this.user = authData.user;
    if (typeof window !== "undefined") {
      localStorage.setItem("token", authData.token);
      localStorage.setItem("user", JSON.stringify(authData.user));
    }
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): Omit<User, "password" | "createdAt"> | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  getAuthHeaders(): Record<string, string> {
    return this.token
      ? {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        }
      : {
          "Content-Type": "application/json",
        };
  }
}

export const authService = new AuthService();