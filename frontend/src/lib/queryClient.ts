import { QueryClient } from "@tanstack/react-query";
import { authService } from "./auth";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey, signal }) => {
        const url = queryKey[0] as string;
        // Use the proxy URL directly since we're running through port 5000
        const fullUrl = url.startsWith('http') ? url : url;
        
        const response = await fetch(fullUrl, {
          signal,
          headers: authService.getAuthHeaders(),
        });

        if (!response.ok) {
          if (response.status === 401) {
            authService.logout();
            throw new Error("Authentication required");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
      },
    },
  },
});

export async function apiRequest(method: string, url: string, body?: any) {
  // Use relative URLs since we're running through the proxy on same origin
  const fullUrl = url.startsWith('http') ? url : url;
  
  const response = await fetch(fullUrl, {
    method,
    headers: authService.getAuthHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    if (response.status === 401) {
      authService.logout();
      throw new Error("Authentication required");
    }
    const error = await response.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response;
}